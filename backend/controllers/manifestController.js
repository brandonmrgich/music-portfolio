// Path to where the manifest is stored locally
const localManifestPath = path.join(__dirname, '..', 'data', 'manifest.json');
const DEFAULT_MANIFEST = { WIP: [], REEL: [], SCORING: [] };

// Helper function to read the local manifest
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

// Helper function to save the manifest locally
function saveLocalManifest(manifest) {
    try {
        fs.writeFileSync(localManifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving local manifest:', error);
    }
}

// Function to fetch the manifest from the server (simulate with a static file or an API call)
async function fetchManifestFromServer() {
    try {
        // Simulating a fetch from the server (e.g., API or static file)
        // Replace with actual code to fetch from your server or API
        const serverManifest = require('../data/serverManifest.json'); // Example path, adjust as necessary
        return serverManifest;
    } catch (error) {
        console.error('Error fetching manifest from server:', error);
        return null;
    }
}

// Controller action for getting the manifest from the server
async function getManifest(req, res) {
    const serverManifest = await fetchManifestFromServer();
    if (serverManifest) {
        res.status(200).json(serverManifest);
    } else {
        res.status(500).json({ error: 'Failed to fetch manifest from server' });
    }
}

// Controller action for syncing the manifest
async function syncManifest(req, res) {
    // TODO: check gpt and fix default load

    const localManifest = loadLocalManifest();

    const serverManifest = await fetchManifestFromServer();
    if (!serverManifest) {
        return res.status(500).json({ error: 'Failed to fetch manifest from server' });
    }

    // If no local manifest exists, just save the server version
    if (!localManifest) {
        console.log('No local manifest found. Saving server manifest locally.');
        saveLocalManifest(serverManifest);
        return res.status(200).json({ message: 'Manifest synced successfully' });
    }

    // Compare server manifest with local
    if (JSON.stringify(serverManifest) !== JSON.stringify(localManifest)) {
        console.log('Manifests are different. Syncing local with server.');
        saveLocalManifest(serverManifest); // Save server manifest locally
        return res.status(200).json({ message: 'Manifest synced successfully' });
    }

    console.log('Manifests are up-to-date.');
    return res.status(200).json({ message: 'No changes to sync' });
}

// Controller action for syncing the manifest from an uploaded file
async function uploadAndSyncManifest(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedManifest = JSON.parse(req.file.buffer.toString('utf8'));

    const localManifest = loadLocalManifest();

    // Compare uploaded manifest with local
    if (JSON.stringify(uploadedManifest) !== JSON.stringify(localManifest)) {
        console.log('Uploaded manifest is different. Syncing local with uploaded manifest.');
        saveLocalManifest(uploadedManifest); // Save the uploaded manifest locally
        return res.status(200).json({ message: 'Manifest synced successfully from upload' });
    }

    console.log('Uploaded manifest is up-to-date.');
    return res.status(200).json({ message: 'No changes to sync from upload' });
}
