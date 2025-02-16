const express = require('express');
const AWS = require('aws-sdk');
const { s3, AUDIO_DIRECTORY, isDev } = require('../server_config');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Helper function to get metadata from the local JSON file
const getAudioMetadata = () => {
    try {
        const metadata = require('./metadata.json');
        return metadata;
    } catch (error) {
        return {}; // Return empty if metadata is not available
    }
};

// Helper function to serve the audio stream from S3
const streamAudioFromS3 = async (audioPath, res) => {
    try {
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: audioPath,
        };

        const audioStream = s3.getObject(s3Params).createReadStream();
        audioStream.pipe(res);
    } catch (error) {
        console.error('Error streaming audio from S3:', error);
        res.status(500).send('Error streaming audio');
    }
};

// Route for getting metadata of all audio files
router.get('/metadata', (req, res) => {
    const metadata = getAudioMetadata();
    res.json(metadata);
});

// Route for fetching specific audio metadata and the file for playback
router.get('/play/:id', async (req, res) => {
    const { id } = req.params;
    const metadata = getAudioMetadata();

    // Get audio file metadata
    const audioFile = metadata[id];

    if (!audioFile) {
        return res.status(404).send('Audio not found');
    }

    // Stream the audio from either S3 or local file system
    const audioPath = audioFile.path
        .replace(`s3://${process.env.AWS_BUCKET_NAME}/`, '')
        .replace('file://', '');
    if (isDev) {
        const localPath = path.join(AUDIO_DIRECTORY, audioPath);
        if (fs.existsSync(localPath)) {
            res.sendFile(localPath);
        } else {
            res.status(404).send('Audio file not found');
        }
    } else {
        streamAudioFromS3(audioPath, res);
    }
});

module.exports = router;
