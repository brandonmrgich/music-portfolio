import { useState, useEffect, useCallback, useRef } from 'react';
import AudioLoader from './components/AudioPlayer/AudioLoader';

export const useTracks = (trackType = 'wip', trackSrc = 'local') => {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Only sample reel tracks are comparison tracks
    const isComparison = trackType.toLowerCase() === 'reel';

    useEffect(() => {
        const loadTracks = async () => {
            try {
                setIsLoading(true);
                let loadedTracks = null;

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

export const useAudio = (id, src) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        console.log('Source is updating...');
        audioRef.current = new Audio(src);
        const audio = audioRef.current;

        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [src]);

    const togglePlayPause = useCallback(() => {
        console.log('Hooks::togglePlayPause(): Toggling');
        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
        } else {
            setIsLoading(true);
            setError('');
            audio
                .play()
                .catch((e) => {
                    setError('Error playing audio: ' + e.message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleSeek = useCallback((e) => {
        const audio = audioRef.current;
        audio.currentTime = parseFloat(e.target.value);
        setCurrentTime(audio.currentTime);
    }, []);

    return {
        audioRef,
        isPlaying,
        currentTime,
        duration,
        error,
        isLoading,
        togglePlayPause,
        handleSeek,
    };
};
