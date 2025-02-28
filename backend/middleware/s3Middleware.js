const { getS3Instance } = require('../utils/S3Helper.js');

const s3Middleware = (req, res, next) => {
    if (req.isDev) req.s3 = getS3Instance(); // Attach the singleton S3 instance to the request
    next();
};

module.exports = s3Middleware;
