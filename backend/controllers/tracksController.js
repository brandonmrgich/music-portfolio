const path = require('path');
const manifestPath = path.resolve(__dirname, '../data/manifest.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const sanitizeTrackType = require('../utils/santizeTrackType');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
console.log(BUCKET_NAME);

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

    // Upload the manifest as a temporary object first
    try {
        await s3
            .upload({
                Bucket: BUCKET_NAME,
                Key: tempBackupKey,
                Body: JSON.stringify(manifest, null, 2),
                ContentType: 'application/json',
            })
            .promise();

        // If successful, rename to the main backup key
        await s3
            .copyObject({
                Bucket: BUCKET_NAME,
                CopySource: `${BUCKET_NAME}/${tempBackupKey}`,
                Key: manifestBackupKey,
            })
            .promise();

        // Delete the temporary object
        await s3
            .deleteObject({
                Bucket: BUCKET_NAME,
                Key: tempBackupKey,
            })
            .promise();
    } catch (error) {
        console.error('Error backing up manifest to S3:', error);
        throw new Error('Failed to backup manifest to S3');
    }
};
// **GET /tracks** - Retrieve all tracks
const getTracks = async (req, res) => {
    const manifest = loadManifest();
    res.json(manifest);
};

// **GET /tracks/:type** - Retrieve tracks by type (WIP or REEL)
const getTracksByType = async (req, res) => {
    const { type } = req.params;
    let trackType = sanitizeTrackType(type);
    const manifest = loadManifest();

    if (!manifest[trackType]) {
        return res.status(400).json({ error: 'Invalid track type' });
    }

    res.json(manifest[trackType]);
};

const uploadTrack = async (req, res) => {
    const { type, title, artist, links } = req.body;
    let trackType = sanitizeTrackType(type);
    const files = req.files || []; // Safely handle missing files
    const s3 = req.s3;

    // Check for missing required fields
    if (!files.length || !type || !title || !artist || (trackType === 'REEL' && files.length < 2)) {
        return res.status(400).json({ error: 'Missing required fields or files' });
    }

    // Load manifest and generate unique ID
    const manifest = loadManifest();
    const id = uuidv4();

    // Define file variables for before and after
    const beforeFile = files[0]; // Safely get the first file
    let afterFile;
    let s3BeforeKey;
    let s3AfterKey;

    // If trackType is 'REEL', expect a second file for 'after'
    if (trackType === 'REEL' && files.length > 1) {
        afterFile = files[1]; // Safely get the second file for the 'after' track
    }

    // Upload the first (before) file
    s3BeforeKey = `tracks/${trackType.toLowerCase()}/${id}_${beforeFile.originalname}`;

    try {
        // Upload the 'before' file to S3
        await s3
            .upload({
                Bucket: BUCKET_NAME,
                Key: s3BeforeKey,
                Body: beforeFile.buffer,
                ContentType: beforeFile.mimetype,
            })
            .promise();

        // If it's a REEL, upload the 'after' file as well, if it exists
        if (trackType === 'REEL' && afterFile) {
            s3AfterKey = `tracks/${trackType.toLowerCase()}/${id}_version2_${afterFile.originalname}`;

            // Upload the 'after' file to S3
            await s3
                .upload({
                    Bucket: BUCKET_NAME,
                    Key: s3AfterKey,
                    Body: afterFile.buffer,
                    ContentType: afterFile.mimetype,
                })
                .promise();
        }

        // Parse links (default to empty object if undefined or invalid)
        const parsedLinks = links ? JSON.parse(links) : {};

        // Define the track object to be added
        const track = {
            id,
            title,
            artist,
            links: parsedLinks,
        };

        // Handle specific type cases
        if (trackType === 'REEL') {
            track.before = s3BeforeKey;
            track.after = s3AfterKey;
            manifest.REEL.push(track);
        } else {
            track.src = s3BeforeKey;
            manifest[trackType].push(track);
        }

        // Save the updated manifest
        saveManifest(manifest);

        // Respond with success
        res.json({ message: 'Track uploaded successfully', track });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to upload track: ' + error });
    }
};

// **POST /tracks** - Upload a new track
//const uploadTrack = async (req, res) => {
//    const { type, title, artist, links } = req.body;
//    let trackType = sanitizeTrackType(type);
//    const file = req.file;
//    const s3 = req.s3;
//
//    // Check for missing required fields
//    if (!file || !type || !title || !artist) {
//        return res.status(400).json({ error: 'Missing required fields' });
//    }
//
//    // Load manifest and generate unique ID
//    const manifest = loadManifest();
//    const id = uuidv4();
//    const s3Key = `tracks/${trackType.toLowerCase()}/${id}_${file.originalname}`;
//
//    try {
//        // Upload file to S3
//        await s3
//            .upload({
//                Bucket: BUCKET_NAME,
//                Key: s3Key,
//                Body: file.buffer,
//                ContentType: file.mimetype,
//            })
//            .promise();
//
//        // Parse links (default to empty object if undefined or invalid)
//        const parsedLinks = links ? JSON.parse(links) : {};
//
//        // Define the track object to be added
//        const track = {
//            id,
//            title,
//            artist,
//            links: parsedLinks,
//        };
//
//        // Handle specific type cases
//        if (trackType === 'REEL') {
//            track.before = s3Key;
//            track.after = `tracks/${type.toLowerCase()}/${id}_version2_${file.originalname}`;
//
//            manifest.REEL.push(track);
//        } else {
//            track.src = s3Key;
//            manifest[trackType].push(track);
//        }
//
//        // Save the updated manifest
//        saveManifest(manifest);
//
//        // Respond with success
//        res.json({ message: 'Track uploaded successfully', track });
//    } catch (error) {
//        console.error(error); // Log the error for debugging
//        res.status(500).json({ error: 'Failed to upload track: ' + error });
//    }
//};
// **DELETE /tracks/:id** - Delete a track
const deleteTrackById = async (req, res) => {
    const { id } = req.params;
    const s3 = req.s3;
    const manifest = loadManifest();

    let trackType = null;
    let trackIndex = -1;
    let track = null;

    // Find the track in the manifest, regardless of its type
    ['WIP', 'REEL', 'SCORING'].forEach((type) => {
        manifest[type].forEach((t, index) => {
            console.log(`audio.js::delete(/tracks/:id): ${t}`);
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
        // Check if it's a REEL type and delete both before and after files
        if (trackType === 'REEL') {
            if (track.before) {
                await s3
                    .deleteObject({
                        Bucket: BUCKET_NAME,
                        Key: track.before,
                    })
                    .promise();
            }

            if (track.after) {
                await s3
                    .deleteObject({
                        Bucket: BUCKET_NAME,
                        Key: track.after,
                    })
                    .promise();
            }
        } else {
            // Otherwise, delete the single src file
            if (track.src) {
                await s3
                    .deleteObject({
                        Bucket: BUCKET_NAME,
                        Key: track.src,
                    })
                    .promise();
            }
        }

        // Remove the track from the manifest
        manifest[trackType].splice(trackIndex, 1);
        saveManifest(manifest);

        res.json({ message: 'Track deleted successfully' });
    } catch (error) {
        console.error('S3 Deletion Error:', error);
        res.status(500).json({ error: 'Failed to delete track' });
    }
};

// **PUT /tracks/:id** - Update track metadata (title, artist, links)
const updateTrackById = async (req, res) => {
    const { id } = req.params;
    const { title, artist, links } = req.body;
    const s3 = req.s3;
    const manifest = loadManifest();

    let trackFound = false;

    ['WIP', 'REEL'].forEach((type) => {
        manifest[type] = manifest[type].map((track) => {
            console.log(`audio.js::put(/tracks/:id): ${track}`);
            if (track.id == id) {
                trackFound = true;
                return { ...track, title, artist, links: JSON.parse(links || '{}') };
            }
            return track;
        });
    });

    if (!trackFound) {
        return res.status(404).json({ error: 'Track not found' });
    }

    saveManifest(manifest);
    res.json({ message: 'Track updated successfully' });
};

module.exports = { updateTrackById, deleteTrackById, getTracks, getTracksByType, uploadTrack };
