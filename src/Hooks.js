import { useState, useEffect, useCallback, useRef } from 'react';
import AudioLoader from './components/AudioPlayer/AudioLoader';

// TODO: Clean hook vs audio context methods. Currently hook method being used
// which doesnt preservce context.

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

// TODO: Phase this old way of handling audio out, in favor of the context
export const useAudio = (id, src) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
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

    // TODO: Hook slider to actual volume of current audio ref
    const handleVolume = useCallback((e) => {
        const audio = audioRef.current;
        audio.currentVolume = parseFloat(e.target.value);
        setCurrentVolume(audio.currentVolume);
    }, []);

    return {
        audioRef,
        isPlaying,
        currentTime,
        currentVolume,
        duration,
        error,
        isLoading,
        togglePlayPause,
        handleSeek,
        handleVolume,
    };
};
