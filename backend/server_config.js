// Logic for setting up environment for Dev or Prod with AWS S3

const path = require('path');
const AWS = require('aws-sdk');
require('dotenv').config();

// Get the environment (either 'development' or 'production')
const isDev = process.env.NODE_ENV === 'development';

// S3 Configuration for Production
const s3 = isDev
    ? null
    : new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
      });

// Local file system configuration for development
const AUDIO_DIRECTORY = path.resolve(__dirname, 'public/audio');

module.exports = { isDev, s3, AUDIO_DIRECTORY };
