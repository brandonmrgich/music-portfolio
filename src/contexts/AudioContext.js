import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [playingStates, setPlayingStates] = useState({});
    const [currentTimes, setCurrentTimes] = useState({});
    const [durations, setDurations] = useState({});
    const [volumes, setVolumes] = useState({});
    const [currentSrcs, setCurrentSrcs] = useState({});
    const audioRefs = useRef({});
    const DEFAULT_VOLUME = 0.5;

    const initializeAudio = (id, src) => {
        const existingAudio = audioRefs.current[id];

        // TODO: This is hacky
        // Only initialize if this specific audio has not been initialized yet
        if (!existingAudio?.initialized) {
            console.info('AudioProvider::initializeAudio(): Initialized audio: ', { id, src });
            setNewAudioSrc(id, src);
            addAudioEventListeners(id);
            audioRefs.current[id].initialized = true; // Set the initialized flag to prevent multiple inits of the audio component
        }
    };

    const setNewAudioSrc = (id, src, defaultVolume = DEFAULT_VOLUME) => {
        audioRefs.current[id] = new Audio(src);
        audioRefs.current[id].volume = volumes[id] !== undefined ? volumes[id] : defaultVolume;
    };

    const addAudioEventListeners = (id) => {
        const audio = audioRefs.current[id];

        audio.addEventListener('loadedmetadata', () => handleLoadedMetadata(id));
        audio.addEventListener('timeupdate', () => handleTimeUpdate(id));
        audio.addEventListener('ended', () => handleEnded(id));
    };

    const handleLoadedMetadata = (id) => {
        setDurations((prev) => ({ ...prev, [id]: audioRefs.current[id].duration }));
    };

    const handleTimeUpdate = (id) => {
        setCurrentTimes((prev) => ({ ...prev, [id]: audioRefs.current[id].currentTime }));
    };

    const handleEnded = (id) => {
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
        setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
    };

    const cleanupAudio = (id) => {
        const oldAudio = audioRefs.current[id];
        if (oldAudio) {
            oldAudio.pause();
            oldAudio.currentTime = 0;

            oldAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            oldAudio.removeEventListener('timeupdate', handleTimeUpdate);
            oldAudio.removeEventListener('ended', handleEnded);

            audioRefs.current[id] = null;
        }
    };

    const play = (id, src) => {
        stopAllExcept(id);

        if (audioRefs.current[id] == undefined) {
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentSrcs(null);
            return;
        }

        audioRefs.current[id].play();
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
        setCurrentSrcs((prev) => ({ ...prev, [id]: src }));
    };

    const stopAllExcept = (id) => {
        Object.keys(audioRefs.current).forEach((key) => {
            if (key != id && audioRefs.current[key]) {
                stop(key);
            }
        });
    };

    const stop = (id) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].pause();
            audioRefs.current[id].currentTime = 0;

            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
        }
    };

    const pause = (id) => {
        audioRefs.current[id]?.pause();
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
    };

    const seek = (id, time) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].currentTime = time;
            setCurrentTimes((prev) => ({ ...prev, [id]: time }));
        }
    };

    const setVolume = (id, volume) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].volume = volume;
            setVolumes((prev) => ({ ...prev, [id]: volume }));
        }
    };

    const toggleSource = (id, beforeSrc, afterSrc, isBeforeAudio) => {
        const newSrc = isBeforeAudio ? afterSrc : beforeSrc;
        const oldAudio = audioRefs.current[id];
        const oldVolume = oldAudio ? oldAudio.volume : DEFAULT_VOLUME;
        const oldCurrentTime = oldAudio ? oldAudio.currentTime : 0;

        cleanupAudio(id); // Clean up the old audio instance and listeners

        initializeAudio(id, newSrc); // Initialize a new audio instance with new source
        setVolume(id, oldVolume);
        seek(id, oldCurrentTime); // Restore previous volume and current time

        play(id, newSrc); // Start playing the new audio
    };

    useEffect(() => {
        return () => {
            // TODO: Verify
            Object.values(audioRefs.current).forEach((audio) => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };
    }, []);

    return (
        <AudioContext.Provider
            value={{
                playingStates,
                currentTimes,
                durations,
                volumes,
                currentSrcs,
                play,
                pause,
                seek,
                stop,
                setVolume,
                toggleSource,
                initializeAudio,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
