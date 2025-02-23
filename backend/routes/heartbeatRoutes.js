const express = require('express');
const router = express.Router();
const { getHeartbeat, getS3Heartbeat } = require('../controllers/heartbeatController');

// Heartbeat endpoint to check server status
router.get('/', getHeartbeat);

// Heartbeat to get available S3 buckets
router.get('/aws', getS3Heartbeat);

module.exports = router;
