const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');

/**
 * Email API Routes
 * Handles sending emails via SendGrid.
 * @module routes/emailRoutes
 */

// POST /email - Send an email
router.post('/', sendEmail);

module.exports = router;
