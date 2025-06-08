const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const AUDIO_DIRECTORY = path.resolve(__dirname, '../public/audio');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

module.exports = { isDev, AUDIO_DIRECTORY, ADMIN_USERNAME, ADMIN_PASSWORD_HASH };
