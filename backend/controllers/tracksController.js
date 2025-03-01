const path = require('path');
const manifestPath = path.resolve(__dirname, '../data/manifest.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { sanitizeTrackType, sanitizeQuotes } = require('../utils/santizeTrackType');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const loadManifest = () => {
    if (fs.existsSync(manifestPath)) {
        return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }
    return { WIP: [], REEL: [], SCORING: [] };
};

const saveManifest = (data) => {
    fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2));
};

const backupManifestToS3 = async (s3, manifest) => {
    const manifestBackupKey = 'state/manifest.json';
    const tempBackupKey = `state/manifest_temp_${uuidv4()}.json`;

    const MSGPRE = '[S3 Manifest Backup]';

    try {
        console.log(`${MSGPRE} Uploading temp manifest: ${tempBackupKey}...`);
        // Step 1: Upload the temp file
        await s3
            .upload({
                Bucket: BUCKET_NAME,
                Key: tempBackupKey,
                Body: JSON.stringify(manifest, null, 2),
                ContentType: 'application/json',
            })
            .promise();
        console.log(`${MSGPRE} Temp upload complete.`);

        const data = await s3
            .listObjectsV2({
                Bucket: BUCKET_NAME,
                Prefix: tempBackupKey,
                MaxKeys: 1,
            })
            .promise();

        const fileExists = data.Contents.length > 0;
        //console.log('data: ', { data });

        // If the temp file exists, proceed with renaming
        if (fileExists) {
            console.log(`${MSGPRE} Temp file confirmed, proceeding with overwrite...`);

            // Step 3: Use `putObject` to overwrite the main manifest with the temp file's content
            await s3
                .putObject({
                    Bucket: BUCKET_NAME,
                    Key: manifestBackupKey,
                    Body: JSON.stringify(manifest, null, 2), // Put the content of the new manifest here
                    ContentType: 'application/json',
                })
                .promise();
            console.log(`${MSGPRE} Manifest overwrite complete.`);

            // Step 4: Delete the temp file
            await s3
                .deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: tempBackupKey,
                })
                .promise();
            console.log(`${MSGPRE} Temp file deleted.`);
        }
    } catch (error) {
        console.error('Error during manifest backup:', error);
        throw new Error('Manifest backup process failed');
    }
};

const getSignedUrl = (key, s3) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: 300, // URL expires in 5 minutes
    };
    return s3.getSignedUrl('getObject', params);
};

// **GET /tracks** - Retrieve all tracks
const getTracks = async (req, res) => {
    const manifest = loadManifest();
    const s3 = req.s3;

    // Iterate through all tracks and generate signed URLs
    const signedTracks = await Promise.all(
        Object.keys(manifest).map(async (type) => {
            return {
                type,
                tracks: await Promise.all(
                    manifest[type].map(async (track) => {
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
};

// **GET /tracks/:type** - Retrieve tracks by type (WIP or REEL)
const getTracksByType = async (req, res) => {
    const { type } = req.params;
    let trackType = sanitizeTrackType(type);
    const manifest = loadManifest();
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
};

const uploadTrack = async (req, res) => {
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

    const manifest = loadManifest();
    const id = uuidv4();
    const beforeFile = files[0];
    let afterFile = files.length > 1 ? files[1] : null;

    const s3BeforeKey = `tracks/${sanitizedType.toLowerCase()}/${id}_${beforeFile.originalname}`;
    let s3AfterKey = null;

    try {
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
        saveManifest(manifest);
        await backupManifestToS3(s3, manifest);

        res.json({ message: 'Track uploaded successfully', track });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload track' });
    }
};

// **DELETE /tracks/:id** - Delete a track
const deleteTrackById = async (req, res) => {
    const { id } = req.params;
    const s3 = req.s3;
    const manifest = loadManifest();

    let trackType = null;
    let trackIndex = -1;
    let track = null;

    ['WIP', 'REEL', 'SCORING'].forEach((type) => {
        manifest[type].forEach((t, index) => {
            if (t.id == id) {
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
        saveManifest(manifest);
        await backupManifestToS3(s3, manifest);

        res.json({ message: 'Track deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete track' });
    }
};

// **PUT /tracks/:id** - Update track metadata (title, artist, links)
const updateTrackById = async (req, res) => {
    const { id } = req.params;
    const { title, artist, links } = req.body;
    const s3 = req.s3;
    const manifest = loadManifest();

    const sanitizedTitle = sanitizeQuotes(title);
    const sanitizedArtist = sanitizeQuotes(artist);
    const sanitizedLinks = links
        ? typeof links === 'string'
            ? JSON.parse(sanitizeQuotes(links))
            : links
        : {};

    let trackFound = false;

    ['WIP', 'REEL', 'SCORING'].forEach((type) => {
        manifest[type] = manifest[type].map((track) => {
            console.log(`audio.js::put(/tracks/:id): ${track}`);

            if (track.id == id) {
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

    saveManifest(manifest);
    await backupManifestToS3(s3, manifest);
    res.json({ message: 'Track updated successfully' });
};

module.exports = { updateTrackById, deleteTrackById, getTracks, getTracksByType, uploadTrack };
