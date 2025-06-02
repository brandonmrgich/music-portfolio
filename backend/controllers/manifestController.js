const fs = require('fs');
const path = require('path');
const _ = require('lodash');

// Path to where the manifest is stored locally
const localManifestPath = path.join(__dirname, '..', 'data', 'manifest.json');
const SERVER_MANIFEST_PATH = 'data/manifest.json';
const DEFAULT_MANIFEST = { WIP: [], REEL: [], SCORING: [] };

/**
 * Load the local manifest from disk.
 * @returns {object} Manifest data
 */
function loadLocalManifest() {
    try {
        if (fs.existsSync(localManifestPath)) {
            return JSON.parse(fs.readFileSync(localManifestPath, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading local manifest:', error);
    }
    return DEFAULT_MANIFEST;
}

/**
 * Save the manifest locally to disk.
 * @param {object} manifest - Manifest data
 */
function saveLocalManifest(manifest) {
    try {
        const dir = path.dirname(localManifestPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving local manifest:', error);
    }
}

/**
 * Fetch the manifest from the server (S3).
 * @param {object} req - Express request (with s3 instance)
 * @returns {Promise<object|null>} Manifest data or null on error
 */
async function fetchManifestFromServer(req) {
    const s3 = req.s3;
    if (!s3) {
        console.error('S3 client not available in request.');
        return null;
    }
    try {
        const data = await s3
            .getObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: SERVER_MANIFEST_PATH,
            })
            .promise();
        return JSON.parse(data.Body.toString('utf-8'));
    } catch (error) {
        console.error('Error fetching manifest from S3:', error);
        return null;
    }
}

/**
 * GET /manifest - Get the manifest from the server (S3).
 * @route GET /manifest
 * @returns {object} Manifest data
 */
async function getManifest(req, res) {
    const serverManifest = await fetchManifestFromServer(req);
    if (serverManifest) {
        res.status(200).json(serverManifest);
    } else {
        res.status(500).json({ error: 'Failed to fetch manifest from server' });
    }
}

/**
 * POST /manifest/sync - Sync the local manifest with the server (S3).
 * @route POST /manifest/sync
 * @returns {object} Sync result
 */
async function syncManifest(req, res) {
    const localManifest = loadLocalManifest();
    const serverManifest = await fetchManifestFromServer(req);
    if (!serverManifest) {
        console.error('Failed to fetch manifest from server');
        return res.status(500).json({ error: 'Unable to fetch manifest from server' });
    }
    if (!_.isEqual(serverManifest, localManifest)) {
        console.log('Manifests differ. Syncing local with server.');
        saveLocalManifest(serverManifest);
        return res.status(200).json({ message: 'Manifest synced successfully' });
    }
    console.log('Manifests are already up-to-date.');
    return res.status(200).json({ message: 'No changes needed' });
}

/**
 * POST /manifest/upload - Sync the manifest from an uploaded file.
 * @route POST /manifest/upload
 * @returns {object} Sync result
 */
async function uploadAndSyncManifest(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    let uploadedManifest;
    try {
        uploadedManifest = JSON.parse(req.file.buffer.toString('utf8'));
    } catch (error) {
        return res.status(400).json({ error: 'Invalid JSON in uploaded file' });
    }
    const localManifest = loadLocalManifest();
    // Compare uploaded manifest with local
    if (!_.isEqual(uploadedManifest, localManifest)) {
        console.log('Uploaded manifest is different. Syncing local with uploaded manifest.');
        saveLocalManifest(uploadedManifest);
        return res.status(200).json({ message: 'Manifest synced successfully from upload' });
    }
    console.log('Uploaded manifest is up-to-date.');
    return res.status(200).json({ message: 'No changes to sync from upload' });
}

module.exports = {
    loadLocalManifest,
    getManifest,
    syncManifest,
    uploadAndSyncManifest,
};
