const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const AUDIO_DIRECTORY = path.resolve(__dirname, '../public/audio');

module.exports = { isDev, AUDIO_DIRECTORY };
