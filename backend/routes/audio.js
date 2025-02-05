const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Get all tracks
router.get('/', (req, res) => {
    const trackListPath = path.join(__dirname, '../tracks.json'); // Assuming your tracks.json file is stored at the root
    const trackList = JSON.parse(fs.readFileSync(trackListPath, 'utf8'));
    res.json(trackList);
});

module.exports = router;
