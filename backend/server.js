//const express = require('express');
//const nodemailer = require('@sendgrid/mail');
//require('dotenv').config();
//
//const app = express();
//const port = 5000;
//
//// Set SendGrid API Key
//nodemailer.setApiKey(process.env.SENDGRID_API_KEY);
//
//app.use(express.json());
//
//app.post('/send-email', async (req, res) => {
//    const { name, email, message } = req.body;
//
//    const msg = {
//        to: 'musicwithmrgich@gmail.com', // Your email
//        from: email,
//        subject: `Portfolio Contact from: ${name}`,
//        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//    };
//
//    try {
//        await nodemailer.send(msg);
//        res.status(200).send('Message sent successfully');
//    } catch (error) {
//        res.status(500).send('Failed to send message');
//    }
//});
//
//app.listen(port, () => {
//    console.log(`Server running at http://localhost:${port}`);
//});

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

require('dotenv').config({ path: './sendgrid.env' });

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Assuming these values are coming from your form
const formName = 'Test'; // Example name from form
const formEmail = 'bmrgich@gmail.com'; // Example user email from form
const formMessage = ';asdfj;alksdjfl;askjdfl;kasjdf;lkasdj'; // Example message from form

const msg = {
    to: 'musicwithmrgich@gmail.com',
    from: 'contact@brandonmrgich.com',
    replyTo: formEmail, // This ensures replies go to the user's email
    subject: `Message from ${formName}`,
    text: formMessage,
    html: `<strong>${formMessage}</strong>`,
};

sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent');
    })
    .catch((error) => {
        console.error(error);
    });
