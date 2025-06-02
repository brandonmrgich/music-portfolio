const { getS3Instance } = require('../utils/S3Helper.js');

/**
 * s3Middleware - Attach a singleton S3 instance to the request object.
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
const s3Middleware = (req, res, next) => {
    req.s3 = getS3Instance(); // Attach the singleton S3 instance to the request
    next();
};

module.exports = s3Middleware;
