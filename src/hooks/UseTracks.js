import { useState, useEffect, useCallback, useRef } from 'react';
import AudioLoader from '../components/AudioPlayer/AudioLoader';

// TODO: Clean hook vs audio context methods. Currently hook method being used
// which doesnt preserve context.

export const useTracks = (trackType = 'wip', trackSrc = 'local') => {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Only sample reel tracks are comparison tracks
    const isComparison = trackType.toLowerCase() === 'reel';

    useEffect(() => {
        const loadTracks = async () => {
            try {
                let loadedTracks = null;
                setIsLoading(true);

                trackSrc.toLowerCase() === 'local'
                    ? (loadedTracks = await AudioLoader.getLocalTracks(trackType))
                    : (loadedTracks = await AudioLoader.getApiTracks(trackType));

                setTracks(...tracks, loadedTracks);
                setError(null);
            } catch (err) {
                console.error('Error loading tracks:', err);
                setError('Failed to load audio tracks. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadTracks();
    }, [trackType]);

    return { tracks, isLoading, error, isComparison };
};
