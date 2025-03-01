const { getS3Instance } = require('../utils/S3Helper');

const getS3Heartbeat = (req, res) => {
    const s3 = req.s3; // getS3Instance();

    s3.listBuckets((err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error checking S3 buckets',
                error: err.message,
            });
        }

        res.status(200).json({
            message: 'S3 heartbeat check successful',
            buckets: data.Buckets,
        });
    });
};

const getHeartbeat = async (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is alive and running',
        timestamp: new Date().toISOString(),
    });
};

module.exports = {
    getHeartbeat,
    getS3Heartbeat,
};
