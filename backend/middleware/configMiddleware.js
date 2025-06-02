const { isDev, AUDIO_DIRECTORY } = require('../config/server_config');

/**
 * configMiddleware - Attach environment config values to the request object.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
const configMiddleware = (req, res, next) => {
    req.isDev = isDev;
    req.AUDIO_DIRECTORY = AUDIO_DIRECTORY;
    next();
};

module.exports = configMiddleware;
