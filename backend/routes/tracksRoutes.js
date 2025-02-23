const express = require('express');
const multer = require('multer');
const {
    updateTrackById,
    deleteTrackById,
    getTracks,
    getTracksByType,
    uploadTrack,
} = require('../controllers/tracksController');
require('dotenv').config();

const router = express.Router();

// Multer setup for handling file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the routes and link them to controller functions
router.get('/', getTracks); // Get all tracks
router.get('/:type', getTracksByType); // Get tracks by type
router.post('/', upload.single('file'), uploadTrack); // Upload a track
router.delete('/:id', deleteTrackById); // Delete track by ID
router.put('/:id', updateTrackById); // Update track by ID

module.exports = router;
