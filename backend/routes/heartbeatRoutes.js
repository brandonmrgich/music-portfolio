const express = require('express');
const router = express.Router();
const { getHeartbeat, getS3Heartbeat } = require('../controllers/heartbeatController');

/**
 * Heartbeat API Routes
 * Provides health checks for the server and AWS S3.
 * @module routes/heartbeatRoutes
 */

// GET /heartbeat - Check server status
router.get('/', getHeartbeat);

// GET /heartbeat/aws - Check AWS S3 connectivity
router.get('/aws', getS3Heartbeat);

module.exports = router;
