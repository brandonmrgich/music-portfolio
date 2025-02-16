const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const app = express();

// Load environment variables
require('dotenv').config();

// Set up S3 for production
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Directory where audio files are stored (for local dev)
const AUDIO_DIRECTORY = path.resolve(__dirname, 'public/audio');

// Get the environment (either 'development' or 'production')
const isDev = process.env.NODE_ENV === 'development';

// Route to handle fetching audio files
app.get('/audio/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const filePath = path.join(AUDIO_DIRECTORY, fileId);

    // If in development, serve from the local file system
    if (isDev) {
        // Ensure the file exists locally
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        } else {
            return res.status(404).send('Audio file not found');
        }
    }

    // If in production, fetch from S3
    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Set your S3 bucket name here
        Key: fileId, // The name of the file in the S3 bucket
    };

    // Attempt to fetch the file from S3
    s3.getObject(s3Params, (err, data) => {
        if (err) {
            console.error('Error fetching from S3:', err);
            return res.status(404).send('Audio file not found');
        }

        // Set the proper content type based on file extension
        res.setHeader('Content-Type', 'audio/mpeg'); // Adjust MIME type as needed for different formats

        // Send the file from S3
        res.send(data.Body);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
