import { fetchData } from './api';

// Function to get the general heartbeat (server status)
export const getHeartbeat = async () => {
    try {
        return await fetchData('/heartbeat');
    } catch (error) {
        console.error('Error fetching heartbeat:', error);
        throw error;
    }
};

// Function to get the S3 heartbeat (gets available S3 Buckets)
export const getS3Heartbeat = async () => {
    try {
        return await fetchData('/heartbeat/aws');
    } catch (error) {
        console.error('Error fetching S3 heartbeat:', error);
        throw error;
    }
};
