const { isDev, AUDIO_DIRECTORY } = require('../config/server_config');

const configMiddleware = (req, res, next) => {
    req.isDev = isDev;
    req.AUDIO_DIRECTORY = AUDIO_DIRECTORY;
    next();
};

module.exports = configMiddleware;
