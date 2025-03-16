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
            console.log('1 -- Loading tracks via api');
            setIsLoading(true);
            setError(null);

            try {
                const apiTracks = await fetchTracksByType(trackType);

                // Check if tracks are empty, throw an error if so
                if (!apiTracks || apiTracks.length === 0) {
                    throw new Error('No tracks fetched, defaulting');
                }

                setTracks(apiTracks);
            } catch (apiError) {
                console.error('API request failed, falling back to local tracks:', apiError);

                try {
                    const localTracks = await AudioLoader.getLocalTracks(trackType);
                    setTracks(localTracks);
                } catch (localError) {
                    console.error('Failed to load local tracks as fallback:', localError);
                    setError('Failed to load tracks from both API and local sources.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadTracks();
    }, [trackType]);

    return { tracks, isLoading, error, isComparison };
};
