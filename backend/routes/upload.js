const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    },
});

const upload = multer({ storage: storage });

// Handle file upload
router.post('/', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const trackMetadata = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname,
    };

    // Save metadata (you can replace this with a database call if needed)
    const trackListPath = './tracks.json'; // Path to store track metadata
    const trackList = JSON.parse(fs.readFileSync(trackListPath, 'utf8'));
    trackList.push(trackMetadata);
    fs.writeFileSync(trackListPath, JSON.stringify(trackList, null, 2));

    res.status(200).send('File uploaded successfully');
});

module.exports = router;
