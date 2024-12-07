const express = require('express');
const router = express.Router();

// Heartbeat endpoint to check server status
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is alive and running',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
