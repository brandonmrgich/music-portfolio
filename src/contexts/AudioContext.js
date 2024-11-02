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
        console.log('AudioProvider::initializeAudio(): ');

        console.log(audioRefs.current[id]);
        console.log(audioRefs.current[id]?.src || 'undefined');

        audioRefs.current[id] = new Audio(src);
        audioRefs.current[id].volume = volumes[id] || 0.5;

        audioRefs.current[id].addEventListener('loadedmetadata', () => {
            setDurations((prev) => ({ ...prev, [id]: audioRefs.current[id].duration }));
        });

        audioRefs.current[id].addEventListener('timeupdate', () => {
            setCurrentTimes((prev) => ({ ...prev, [id]: audioRefs.current[id].currentTime }));
        });

        audioRefs.current[id].addEventListener('ended', () => {
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
        });
    };

    //const play = (id, src) => {
    //    console.log('Playing');
    //    if (audioRefs.current[id]?.src !== src) {
    //        audioRefs.current[id] = new Audio(src);
    //        audioRefs.current[id].volume = volumes[id] || 0.5;

    //        initializeAudio(id, src);
    //    }
    //    stopAllExcept(id);
    //    audioRefs.current[id].play();
    //    setPlayingStates((prev) => ({ ...prev, [id]: true }));
    //    setCurrentSrcs((prev) => ({ ...prev, [id]: src }));
    //};

    const play = (id, src) => {
        console.log('Playing');
        stopAllExcept(id);

        if (audioRefs.current[id] == undefined) {
            console.log(err);
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

    const toggleSource = (id, beforeSrc, afterSrc) => {
        const newSrc = currentSrcs[id] === beforeSrc ? afterSrc : beforeSrc;
        audioRefs.current[id].play();
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
        setCurrentSrcs((prev) => ({ ...prev, [id]: newSrc }));
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
