const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './sendgrid.env' });
const SENDER = process.env.SENDGRID_SENDER; // Environment variable for sender email

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Validate email input for required fields and format.
 * @param {object} param0 - Input object with name, email, message
 * @returns {object} { valid: boolean, error?: string }
 */
const validateEmailInput = ({ name, email, message }) => {
    if (!name || !email || !message) {
        return { valid: false, error: 'Missing required fields: name, email, or message.' };
    }
    // Basic email validation (you can improve this regex)
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format.' };
    }
    return { valid: true };
};

/**
 * POST /email - Send an email using SendGrid.
 * @route POST /email
 * @body {string} name - Sender's name
 * @body {string} email - Sender's email
 * @body {string} message - Message content
 * @returns {object} Success or error message
 */
const sendEmail = async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input data
    const validation = validateEmailInput({ name, email, message });
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const msg = {
        to: email,
        from: SENDER,
        subject: `Music Portfolio Contact from: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
    console.log('emailController::sendEmail(): ', { msg }, name);

    // TODO: Fix SG account
    try {
        // Send email using SendGrid
        await sgMail.send(msg);
        res.status(200).json({ message: 'TODO: Fix SG account: Message sent successfully' });
    } catch (error) {
        console.error('Email sending failed:', error);
        // If SendGrid API fails, send a 500 error with details
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
};

module.exports = {
    sendEmail,
};
