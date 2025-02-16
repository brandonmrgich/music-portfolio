const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { s3, AUDIO_DIRECTORY, isDev } = require('../config');
const router = express.Router();

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to generate a unique ID for each audio file
const generateAudioId = () => {
    return Math.floor(Math.random() * 1000000); // Just an example, could be UUID
};

// Helper function to get current metadata (from local file or S3)
const getAudioMetadata = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'metadata.json'));
        return JSON.parse(data);
    } catch (error) {
        return {}; // Return empty if no metadata found
    }
};

// Helper function to update metadata
const updateAudioMetadata = (metadata) => {
    fs.writeFileSync(path.join(__dirname, 'metadata.json'), JSON.stringify(metadata, null, 2));
};

// Upload audio route
router.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        // Get metadata from the current file
        const { title, artist } = req.body;
        const audioId = generateAudioId();
        const fileName = `${audioId}-${req.file.originalname}`;
        const filePath = `audio/${fileName}`;

        if (isDev) {
            // In development, store file locally
            const localPath = path.join(AUDIO_DIRECTORY, filePath);
            fs.writeFileSync(localPath, req.file.buffer);
        } else {
            // In production, upload to S3
            const s3Params = {
                Bucket: process.env.AWS_BUCKET_NAME, // Set your S3 bucket name here
                Key: filePath, // The name of the file in the S3 bucket
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read', // Adjust permissions as needed
            };
            await s3.upload(s3Params).promise();
        }

        // Update metadata.json
        const metadata = getAudioMetadata();
        metadata[audioId] = {
            title,
            artist,
            path: isDev
                ? `file://${AUDIO_DIRECTORY}/${filePath}`
                : `s3://${process.env.AWS_BUCKET_NAME}/${filePath}`,
        };

        updateAudioMetadata(metadata);

        res.status(200).json({
            message: 'Audio uploaded successfully',
            audioId,
            metadata: metadata[audioId],
        });
    } catch (error) {
        console.error('Error uploading audio:', error);
        res.status(500).send('Error uploading audio');
    }
});

module.exports = router;
