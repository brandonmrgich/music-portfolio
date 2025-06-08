const express = require('express');
const multer = require('multer');
const { syncManifest, getManifest } = require('../controllers/manifestController');
const {
    updateTrackById,
    deleteTrackById,
    getTracks,
    getTracksByType,
    uploadTrack,
} = require('../controllers/tracksController');
const adminSession = require('../middleware/adminSession');

require('dotenv').config();

/**
 * Tracks API Routes
 * Handles CRUD operations for audio tracks (WIP, REEL, SCORING).
 * @module routes/tracksRoutes
 */
const router = express.Router();

// Multer setup for handling file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /tracks - Get all tracks
router.get('/', getTracks);
// GET /tracks/:type - Get tracks by type
router.get('/:type', getTracksByType);
// POST /tracks - Upload a track (max 2 files for REEL)
router.post('/', adminSession, upload.array('file', 2), uploadTrack);
// DELETE /tracks/:id - Delete track by ID
router.delete('/:id', deleteTrackById);
// PUT /tracks/:id - Update track by ID
router.put('/:id', updateTrackById);

// Routes for manifest-related operations
//router.post('/manifest', upload.single('file'), syncManifest);
//router.get('/manifest', getManifest);

module.exports = router;
