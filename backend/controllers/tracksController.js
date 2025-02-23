const path = require('path');
const manifestPath = path.resolve(__dirname, '../data/manifest.json');
const { v4: uuidv4 } = require('uuid');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Load manifest.json (helper function)
const loadManifest = () => {
    if (fs.existsSync(manifestPath)) {
        return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }
    return { WIP: [], REEL: [] };
};

// Save manifest.json (helper function)
const saveManifest = (data) => {
    fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2));
};

// **GET /tracks** - Retrieve all tracks
const getTracks = async (req, res) => {
    const manifest = loadManifest();
    res.json(manifest);
};

// **GET /tracks/:type** - Retrieve tracks by type (WIP or REEL)
const getTracksByType = async (req, res) => {
    const { type } = req.params;
    const manifest = loadManifest();

    if (!manifest[type]) {
        return res.status(400).json({ error: 'Invalid track type' });
    }

    res.json(manifest[type]);
};

// **POST /tracks** - Upload a new track
const uploadTrack = async (req, res) => {
    const { type, title, artist, links } = req.body;
    const file = req.file;

    // Check for missing required fields
    if (!file || !type || !title || !artist) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Load manifest and generate unique ID
    const manifest = loadManifest();
    const id = uuidv4();
    const s3Key = `tracks/${type.toLowerCase()}/${id}_${file.originalname}`;

    try {
        // Upload file to S3
        await s3
            .upload({
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
            .promise();

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
        if (type === 'REEL') {
            track.before = s3Key;
            track.after = `tracks/${type.toLowerCase()}/${id}_version2_${file.originalname}`;

            manifest.REEL.push(track);
        } else {
            track.src = s3Key;
            manifest[type].push(track);
        }

        // Save the updated manifest
        saveManifest(manifest);

        // Respond with success
        res.json({ message: 'Track uploaded successfully', track });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to upload track' });
    }
};
// **DELETE /tracks/:id** - Delete a track
const deleteTrackById = async (req, res) => {
    const { id } = req.params;
    const manifest = loadManifest();

    let trackType = null;
    let trackIndex = -1;
    let track = null;

    // Find the track in the manifest, regardless of it's type
    ['WIP', 'REEL'].forEach((type) => {
        manifest[type].forEach((t, index) => {
            console.log(`audio.js::delete(/tracks/:id): ${track}`);
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
        await s3
            .deleteObject({
                Bucket: BUCKET_NAME,
                Key: track.src,
            })
            .promise();

        // Remove just the single entry
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
