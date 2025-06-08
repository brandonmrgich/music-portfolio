import { fetchData, postData, putData, deleteData } from './api';
import axios from 'axios';

// Fetch all tracks
export const fetchTracks = async () => {
    const url = '/tracks';
    try {
        const tracks = await fetchData(url); // Calls API via axios
        return tracks;
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
    }
};

// Fetch a track by ID
export const fetchTrackById = async (id) => {
    try {
        const track = await fetchData(`/tracks/${id}`);
        return track;
    } catch (error) {
        console.error('Error fetching track by ID:', error);
        throw error;
    }
};

// Fetch tracks by type
export const fetchTracksByType = async (type) => {
    try {
        const track = await fetchData(`/tracks/${type}`);
        return track;
    } catch (error) {
        console.error('Error fetching track by ID:', error);
        throw error;
    }
};

// Add a new track
export const addTrack = async (trackData) => {
    // If FormData, use axios directly for multipart upload
    if (trackData instanceof FormData) {
        try {
            const response = await axios.post('/tracks', trackData, {
                baseURL: process.env.NODE_ENV === 'production'
                    ? 'https://api.brandonmrgich.com'
                    : 'http://localhost:5000',
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error adding track:', error);
            throw error;
        }
    }
    // Otherwise, use JSON
    try {
        const response = await postData('/tracks', trackData);
        return response;
    } catch (error) {
        console.error('Error adding track:', error);
        throw error;
    }
};

// Update a track's metadata
export const updateTrack = async (id, trackData) => {
    try {
        const response = await putData(`/tracks/${id}`, trackData);
        return response;
    } catch (error) {
        console.error('Error updating track:', error);
        throw error;
    }
};

// Delete a track
export const deleteTrack = async (id) => {
    try {
        const response = await deleteData(`/tracks/${id}`);
        return response;
    } catch (error) {
        console.error('Error deleting track:', error);
        throw error;
    }
};
