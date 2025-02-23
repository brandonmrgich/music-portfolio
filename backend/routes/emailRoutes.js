const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');

// Send email route
router.post('/', sendEmail);

module.exports = router;
