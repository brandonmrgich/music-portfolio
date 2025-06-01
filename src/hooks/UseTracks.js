import { useState, useEffect } from 'react';
import { fetchTracksByType } from '../services/tracks';
import AudioLoader from '../components/AudioPlayer/AudioLoader';

export const useTracks = (trackType = 'wip') => {
    const [tracks, setTracks] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isComparison = trackType.toLowerCase() === 'reel';

    useEffect(() => {
        const loadTracks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const apiTracks = await fetchTracksByType(trackType);

                // Check if tracks are empty, throw an error if so
                if (!apiTracks || apiTracks.length === 0) {
                    throw new Error(`No tracks available for ${trackType} track type`);
                }

                setTracks(apiTracks);
            } catch (err) {
                console.error('There was an error when fetching tracks.', err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadTracks();
    }, [trackType]);

    return { tracks, isLoading, error, isComparison };
};
