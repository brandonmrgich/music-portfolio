import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [playingStates, setPlayingStates] = useState({});
    const [currentTimes, setCurrentTimes] = useState({});
    const [durations, setDurations] = useState({});
    const [volumes, setVolumes] = useState({});
    const [currentSrcs, setCurrentSrcs] = useState({});
    const audioRefs = useRef({});

    const initializeAudio = (id, src) => {
        setNewAudioSrc(id, src);
        addAudioEventListeners(id);
    };

    const setNewAudioSrc = (id, src) => {
        //audioRefs.current[id] = null
        audioRefs.current[id] = new Audio(src);
        console.log('AudioContext::setNewAudioSrc(): newly set ref: ', { audioRefs });
    };

    // Updated addAudioEventListeners with named functions
    const addAudioEventListeners = (id) => {
        const audio = audioRefs.current[id];
        audio.volume = volumes[id] || 0.5;

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
        console.log('Playing', { id, src });
        stopAllExcept(id);

        if (audioRefs.current[id] == undefined) {
            //console.log(err);
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentSrcs(null);
        }

        audioRefs.current[id].play();
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
        setCurrentSrcs((prev) => ({ ...prev, [id]: src }));
    };

    const stopAllExcept = (id) => {
        // TODO: Dont call stop if its not even playing
        Object.keys(audioRefs.current).forEach((key) => {
            if (key != id && audioRefs.current[key]) {
                stop(key);
            }
        });
    };

    const pause = (id) => {
        console.log('Pausing');
        audioRefs.current[id]?.pause();
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
    };

    const stop = (id) => {
        console.log('Stopping: ', id);
        if (audioRefs.current[id]) {
            audioRefs.current[id].pause();
            audioRefs.current[id].currentTime = 0;

            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
            setVolumes((prev) => ({ ...prev, [id]: 0 }));
        }
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
        const oldVolume = oldAudio ? oldAudio.volume : 0.5;
        const oldCurrentTime = oldAudio ? oldAudio.currentTime : 0;

        cleanupAudio(id); // Clean up the old audio instance and listeners

        initializeAudio(id, newSrc); // Initialize a new audio instance with new source
        setVolume(id, oldVolume);
        seek(id, oldCurrentTime); // Restore previous volume and current time

        play(id, newSrc); // Start playing the new audio
    };

    //const toggleSource = (id, beforeSrc, afterSrc, isBeforeAudio) => {
    //    let newSrc = isBeforeAudio ? afterSrc : beforeSrc;

    //    let oldAudio = audioRefs.current[id];
    //    let oldVolume = oldAudio.volume;
    //    let oldCurrentTime = oldAudio.currentTime || 0;

    //    let ref = audioRefs.current[id];

    //    console.log('AudioProvider::toggleSource(): ', { ref });

    //    console.log('AudioProvider::toggleSource(): Pausing old audio', { oldAudio });
    //    oldAudio.pause();
    //    setPlayingStates((prev) => ({ ...prev, [id]: false }));

    //    // Set the new audio references and sources
    //    // TODO: Initialize doesnt persist for the new reference
    //    audioRefs.current[id] = null;
    //    initializeAudio(id, newSrc);

    //    //cleanupListeners(id);
    //    //setNewAudioSrc(id, newSrc);
    //    //addAudioEventListeners(id);

    //    //setPlayingStates((prev) => ({ ...prev, [id]: true }));
    //    //setCurrentSrcs((prev) => ({ ...prev, [id]: newSrc }));

    //    // Preserve the current volume and playback position.
    //    setVolume(id, oldVolume);
    //    seek(id, oldCurrentTime);

    //    play(id, newSrc);
    //    //newAudio.play();

    //    //newAudio.addEventListener('timeupdate', () => {
    //    //    setCurrentTimes((prev) => ({ ...prev, [id]: newAudio.currentTime }));
    //    //});
    //};

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
