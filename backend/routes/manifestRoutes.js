const express = require('express');
const router = express.Router();
const { getManifest, syncManifest } = require('../controllers/manifestController');

// Route to get the manifest from the server
router.get('/', getManifest);

// Route to sync the manifest (could be invoked on app startup)
router.post('/', upload.one('file'), syncManifest);

module.exports = router;
