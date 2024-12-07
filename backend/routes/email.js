const express = require('express');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const router = express.Router();
const SENDER = process.env.SENDGRID_SENDER;

dotenv.config({ path: './sendgrid.env' });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send email route
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    const msg = {
        to: email, // Replace with the correct recipient email
        from: SENDER,
        subject: `Portfolio Contact from: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Message sent successfully');
    } catch (error) {
        res.status(500).send('Failed to send message');
    }
});

module.exports = router;
