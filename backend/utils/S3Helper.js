const AWS = require('aws-sdk');

let s3Instance = null;

const getS3Instance = () => {
    // If the instance already exists, return it
    if (s3Instance) {
        return s3Instance;
    }

    // If not, create the instance based on the environment
    if (process.env.NODE_ENV === 'development') {
        // TODO: populate these
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    s3Instance = new AWS.S3();

    return s3Instance;
};

module.exports = {
    getS3Instance,
};
