const { v4: uuidv4 } = require('uuid');
const { sanitizeTrackType, sanitizeQuotes } = require('../utils/santizeTrackType');
const {
  syncManifest,
  getCachedManifest,
  fetchManifestFromS3AndUpdateCache,
  loadManifest,
  saveManifest,
  backupManifestToS3,
} = require('./manifestController.js');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Return manifest keys that are "track buckets" (i.e., values are arrays).
 * This allows new buckets (like ARTIST_*) without hard-coded enumerations.
 */
const getBucketKeys = (manifest) => {
    if (!manifest || typeof manifest !== 'object') return [];
    return Object.keys(manifest).filter((k) => Array.isArray(manifest[k]));
};

/**
 * Track Controller
 * Handles CRUD operations for audio tracks (WIP, REEL, SCORING).
 *
 * Manifest operations (load, save, backup, cache refresh) are delegated to manifestController for single-responsibility and maintainability.
 *
 * Manifest-related functions imported from manifestController:
 *   - loadManifest: Loads the manifest from disk (local source of truth)
 *   - saveManifest: Saves the manifest to disk
 *   - backupManifestToS3: Uploads the manifest to S3 (canonical source for production)
 *   - fetchManifestFromS3AndUpdateCache: Refreshes the in-memory manifest cache from S3
 *
 * Usage pattern for any track change (add, update, delete):
 *   1. loadManifest() to get the latest manifest
 *   2. Modify manifest in-memory
 *   3. saveManifest() to persist to disk
 *   4. backupManifestToS3() to sync to S3
 *   5. fetchManifestFromS3AndUpdateCache() to update in-memory cache
 */

/**
 * Generate a signed S3 URL for a given key.
 * @param {string} key
 * @param {object} s3 - AWS S3 instance
 * @returns {string} Signed URL
 */
const getSignedUrl = (key, s3) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: 3600, // URL expires in 1 hour
    };
    return s3.getSignedUrl('getObject', params);
};

/**
 * GET /tracks - Retrieve all tracks (all types)
 * @route GET /tracks
 * @returns {Array} List of all tracks with signed URLs
 */
const getTracks = async (req, res) => {
    console.log('[API] GET /tracks');
    try {
        // Manifest is now served from in-memory cache
        const manifest = getCachedManifest();
        const s3 = req.s3;
        // Iterate through all tracks and generate signed URLs
        const signedTracks = await Promise.all(
            getBucketKeys(manifest).map(async (type) => {
                return {
                    type,
                    tracks: await Promise.all(
                        manifest[type].map(async (track) => {
                            // TODO [perf/audio]: When manifest includes durationSec / gain metadata
                            // (truePeakDbfs, integratedLufs, recommendedGainDb), pass it through here:
                            // e.g., return { ...track, src: signedUrl, durationSec, recommendedGainDb }
                            // For REEL type, we need to generate signed URLs for both 'before' and 'after'
                            if (track.before && track.after) {
                                return {
                                    ...track,
                                    before: getSignedUrl(track.before, s3),
                                    after: getSignedUrl(track.after, s3),
                                };
                            }
                            // For WIP and SCORING types, just the 'src' field
                            if (track.src) {
                                return {
                                    ...track,
                                    src: getSignedUrl(track.src, s3),
                                };
                            }
                            return track; // In case the track doesn't have URLs
                        })
                    ),
                };
            })
        );
        res.json(signedTracks);
    } catch (err) {
        console.error('[API] Error in GET /tracks:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /tracks/:type - Retrieve tracks by type (WIP, REEL, SCORING)
 * @route GET /tracks/:type
 * @param {string} type - Track type
 * @returns {Array} List of tracks for the given type with signed URLs
 */
const getTracksByType = async (req, res) => {
    console.log(`[API] GET /tracks/${req.params.type}`);
    try {
        // Manifest is now served from in-memory cache
        const manifest = getCachedManifest();
        const { type } = req.params;
        let trackType = sanitizeTrackType(type);
        const s3 = req.s3;
        if (!manifest[trackType]) {
            return res.status(400).json({ error: 'Invalid track type' });
        }
        // Generate signed URLs for tracks
        const signedTracks = manifest[trackType].map((track) => {
            if (trackType === 'REEL') {
                return {
                    ...track,
                    before: track.before ? getSignedUrl(track.before, s3) : null,
                    after: track.after ? getSignedUrl(track.after, s3) : null,
                };
            }
            return {
                ...track,
                src: track.src ? getSignedUrl(track.src, s3) : null,
            };
        });
        res.json(signedTracks);
    } catch (err) {
        console.error(`[API] Error in GET /tracks/${req.params.type}:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /tracks - Upload a new track (WIP, REEL, or SCORING)
 *
 * Steps:
 *   1. Validate input and files
 *   2. Upload audio files to S3
 *   3. loadManifest() - get the latest manifest from disk
 *   4. Add new track entry to manifest in-memory
 *   5. saveManifest() - persist manifest to disk
 *   6. backupManifestToS3() - upload manifest to S3
 *   7. fetchManifestFromS3AndUpdateCache() - refresh in-memory cache
 *
 * @route POST /tracks
 * @body {string} type - Track type
 * @body {string} title - Track title
 * @body {string} artist - Track artist
 * @body {object} links - Track links
 * @body {File[]} files - Uploaded audio files
 * @returns {object} Uploaded track info
 */
const uploadTrack = async (req, res) => {
    console.log('[API] POST /tracks', req.body);
    try {
        const { type, title, artist, links } = req.body;
        const sanitizedType = sanitizeTrackType(type);
        const sanitizedTitle = sanitizeQuotes(title);
        const sanitizedArtist = sanitizeQuotes(artist);
        const sanitizedLinks = links ? JSON.parse(sanitizeQuotes(links)) : {};
        const s3 = req.s3;
        const files = req.files || [];
        if (!sanitizedType || !sanitizedTitle || !sanitizedArtist || !sanitizedLinks) {
            return res.status(400).json({ error: 'Missing required metadata' });
        }
        if (sanitizedType === 'REEL' && files.length !== 2) {
            return res.status(400).json({ error: 'REEL requires exactly two files' });
        }
        if (sanitizedType !== 'REEL' && files.length !== 1) {
            return res.status(400).json({ error: 'WIP and SCORING require exactly one file' });
        }
        // Step 3: Load manifest from disk
        const manifest = loadManifest();
        // Allow new buckets (e.g., ARTIST_*). If bucket doesn't exist, create it.
        if (!manifest[sanitizedType]) manifest[sanitizedType] = [];
        const id = uuidv4();
        const beforeFile = files[0];
        let afterFile = files.length > 1 ? files[1] : null;
        const s3BeforeKey = `tracks/${sanitizedType.toLowerCase()}/${id}_${beforeFile.originalname}`;
        let s3AfterKey = null;
        await s3
            .upload({
                Bucket: BUCKET_NAME,
                Key: s3BeforeKey,
                Body: beforeFile.buffer,
                ContentType: beforeFile.mimetype,
            })
            .promise();
        if (sanitizedType === 'REEL' && afterFile) {
            s3AfterKey = `tracks/${sanitizedType.toLowerCase()}/${id}_version2_${afterFile.originalname}`;
            await s3
                .upload({
                    Bucket: BUCKET_NAME,
                    Key: s3AfterKey,
                    Body: afterFile.buffer,
                    ContentType: afterFile.mimetype,
                })
                .promise();
        }
        // TODO [perf/audio]: Capture and persist technical metadata server-side during upload:
        // - durationSec (via ffprobe)
        // - truePeakDbfs (via ffmpeg + aeval/aresample oversampling or ebur128 true-peak)
        // - integratedLufs (via ebur128)
        // - recommendedGainDb (to bring true peak to -1 dBFS, or LUFS to target)
        // Rationale: avoids client-side full-file fetch/decoding and enables instant, consistent loudness.
        // Implementation sketch:
        //   const meta = await probeAudio(buffer) // wrapper around ffprobe/ffmpeg
        //   track.durationSec = meta.durationSec
        //   track.truePeakDbfs = meta.truePeakDbfs
        //   track.integratedLufs = meta.integratedLufs
        //   track.recommendedGainDb = Math.min(0, -1 - meta.truePeakDbfs) // to cap at -1 dBTP
        const track = {
            id,
            title: sanitizedTitle,
            artist: sanitizedArtist,
            links: sanitizedLinks,
            ...(sanitizedType === 'REEL'
                ? { before: s3BeforeKey, after: s3AfterKey }
                : { src: s3BeforeKey }),
        };
        manifest[sanitizedType].push(track);
        // Step 5: Save manifest to disk
        saveManifest(manifest);
        // Step 6: Backup manifest to S3
        await backupManifestToS3(s3, manifest);
        // Step 7: Refresh in-memory cache
        await fetchManifestFromS3AndUpdateCache(req);
        res.json({ message: 'Track uploaded successfully', track });
    } catch (err) {
        console.error('[API] Error in POST /tracks:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * DELETE /tracks/:id - Delete a track by ID
 *
 * Steps:
 *   1. loadManifest() - get the latest manifest from disk
 *   2. Find and remove the track entry
 *   3. saveManifest() - persist manifest to disk
 *   4. backupManifestToS3() - upload manifest to S3
 *   5. fetchManifestFromS3AndUpdateCache() - refresh in-memory cache
 *
 * @route DELETE /tracks/:id
 * @param {string} id - Track ID
 * @returns {object} Deletion result
 */
const deleteTrackById = async (req, res) => {
    console.log(`[API] DELETE /tracks/${req.params.id}`);
    const { id } = req.params;
    const s3 = req.s3;
    // Step 1: Load manifest from disk
    const manifest = loadManifest();

    let trackType = null;
    let trackIndex = -1;
    let track = null;

    getBucketKeys(manifest).forEach((type) => {
        manifest[type].forEach((t, index) => {
            if (t && String(t.id) === String(id)) {
                trackType = type;
                trackIndex = index;
                track = t;
            }
        });
    });

    if (!track) {
        return res.status(404).json({ error: 'Track not found' });
    }

    try {
        if (trackType === 'REEL') {
            if (track.before) {
                await s3.deleteObject({ Bucket: BUCKET_NAME, Key: track.before }).promise();
            }
            if (track.after) {
                await s3.deleteObject({ Bucket: BUCKET_NAME, Key: track.after }).promise();
            }
        } else {
            await s3.deleteObject({ Bucket: BUCKET_NAME, Key: track.src }).promise();
        }

        manifest[trackType].splice(trackIndex, 1);
        // Step 3: Save manifest to disk
        saveManifest(manifest);
        // Step 4: Backup manifest to S3
        await backupManifestToS3(s3, manifest);
        // Step 5: Refresh in-memory cache
        await fetchManifestFromS3AndUpdateCache(req);

        res.json({ message: 'Track deleted successfully' });
    } catch (err) {
        console.error(`[API] Error in DELETE /tracks/${req.params.id}:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /tracks/:id - Update a track's metadata by ID
 *
 * Steps:
 *   1. loadManifest() - get the latest manifest from disk
 *   2. Find and update the track entry
 *   3. saveManifest() - persist manifest to disk
 *   4. backupManifestToS3() - upload manifest to S3
 *   5. fetchManifestFromS3AndUpdateCache() - refresh in-memory cache
 *
 * @route PUT /tracks/:id
 * @param {string} id - Track ID
 * @body {object} updates - Updated metadata
 * @returns {object} Updated track info
 */
const updateTrackById = async (req, res) => {
    console.log(`[API] PUT /tracks/${req.params.id}`);
    const { id } = req.params;
    const { title, artist, links } = req.body;
    const s3 = req.s3;
    // Step 1: Load manifest from disk
    const manifest = loadManifest();

    const sanitizedTitle = sanitizeQuotes(title);
    const sanitizedArtist = sanitizeQuotes(artist);
    const sanitizedLinks = links
        ? typeof links === 'string'
            ? JSON.parse(sanitizeQuotes(links))
            : links
        : {};

    let trackFound = false;

    getBucketKeys(manifest).forEach((type) => {
        manifest[type] = manifest[type].map((track) => {
            console.log(`audio.js::put(/tracks/:id): ${track}`);

            if (track && String(track.id) === String(id)) {
                trackFound = true;
                return {
                    ...track,
                    title: sanitizedTitle,
                    artist: sanitizedArtist,
                    links: sanitizedLinks,
                };
            }

            return track;
        });
    });

    if (!trackFound) {
        return res.status(404).json({ error: 'Track not found' });
    }

    // Step 3: Save manifest to disk
    saveManifest(manifest);
    // Step 4: Backup manifest to S3
    await backupManifestToS3(s3, manifest);
    // Step 5: Refresh in-memory cache
    await fetchManifestFromS3AndUpdateCache(req);
    res.json({ message: 'Track updated successfully' });
};

module.exports = { updateTrackById, deleteTrackById, getTracks, getTracksByType, uploadTrack };
