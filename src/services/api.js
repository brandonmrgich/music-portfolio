import axios from 'axios';

// Set the base URL depending on the environment (development or production)
const API_BASE_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://api.brandonmrgich.com'
        : 'http://localhost:5000';

// Axios instance for API requests
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function for GET requests
export const fetchData = async (url) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Helper function for POST requests
export const postData = async (url, data) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

// Helper function for PUT requests
export const putData = async (url, data) => {
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

// Helper function for DELETE requests
export const deleteData = async (url) => {
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};
