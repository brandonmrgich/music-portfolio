const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const dotenv = require('dotenv');
dotenv.config();

// Path to where the manifest is stored locally
const localManifestPath = path.join(__dirname, '..', 'data', 'manifest.json');
const SERVER_MANIFEST_PATH = 'state/manifest.json';
const DEFAULT_MANIFEST = { WIP: [], REEL: [], SCORING: [] };

let manifestCache = DEFAULT_MANIFEST;
let lastManifestFetch = 0;
const REFRESH_INTERVAL = parseInt(process.env.MANIFEST_REFRESH_INTERVAL_MS, 10) || 30000;

/**
 * PRIVATE: Only for admin/debug or legacy migration. Not exported.
 * Reads the manifest from disk (legacy, not used in new design).
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
 * PRIVATE: Only for admin/debug or legacy migration. Not exported.
 * Writes the manifest to disk (legacy, not used in new design).
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
 * PRIVATE: Used internally for fetching manifest from S3. Not exported.
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
 * ADMIN/DEBUG ONLY: Not exported. Use only for direct S3 inspection.
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
 * LEGACY/ADMIN ONLY: Not exported. Use only for legacy migration or admin sync.
 */
async function syncManifest(req, res) {
    console.log('syncing');
    const localManifest = loadLocalManifest();
    const serverManifest = await fetchManifestFromServer(req);
    if (!serverManifest) {
        console.error('Failed to fetch manifest from server');
        if (res) {
            return res.status(500).json({ error: 'Unable to fetch manifest from server' });
        } else {
            return { success: false, error: 'Unable to fetch manifest from server' };
        }
    }
    if (!_.isEqual(serverManifest, localManifest)) {
        console.log('Manifests differ. Syncing local with server.');
        saveLocalManifest(serverManifest);
        if (res) {
            return res.status(200).json({ message: 'Manifest synced successfully' });
        } else {
            return { success: true, message: 'Manifest synced successfully' };
        }
    }
    console.log('Manifests are already up-to-date.');
    if (res) {
        return res.status(200).json({ message: 'No changes needed' });
    } else {
        return { success: true, message: 'No changes needed' };
    }
}

/**
 * DANGEROUS: Not exported. Use only for admin upload/migration.
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

/**
 * PRIVATE: Used internally for cache refresh. Not exported.
 */
async function fetchManifestFromS3AndUpdateCache(req) {
    const serverManifest = await fetchManifestFromServer(req);
    console.log('fetching manifest from s3', { serverManifest });
    if (serverManifest) {
        manifestCache = serverManifest;
        lastManifestFetch = Date.now();
        console.log('[ManifestCache] Manifest updated from S3.');
    } else {
        console.warn('[ManifestCache] Failed to update manifest from S3.');
    }
}

function getCachedManifest() {
    return manifestCache;
}

function startManifestCacheAutoRefresh(req) {
    fetchManifestFromS3AndUpdateCache(req); // Initial fetch
    setInterval(() => fetchManifestFromS3AndUpdateCache(req), REFRESH_INTERVAL);
}

module.exports = {
    getCachedManifest,
    startManifestCacheAutoRefresh,
};
