import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [playingStates, setPlayingStates] = useState({});
    const audioRefs = useRef({});

    const play = (id, src) => {
        console.log("AudioProvider::play(): Playing ", { id });

        // Stop all other audio except for the target
        Object.keys(audioRefs.current).forEach((key) => {
            if (parseInt(key) !== id && audioRefs.current[key]) {
                console.log("There was active audio, paused");
                stop(key);
            }
        });

        try {
            // Play the selected audio
            console.log("AudioProvider::play(): Playing");
            audioRefs.current[id].play();
            setPlayingStates((prev) => ({ ...prev, [id]: true }));
        } catch (e) {
            console.error("AudioContext::play(): Attempted play on unloaded audio");
        }
    };

    const pause = (id) => {
        console.log("AudioProvider::pause(): Pausing");
        if (audioRefs.current[id]) {
            audioRefs.current[id].pause();

            setPlayingStates((prev) => ({ ...prev, [id]: false }));
        }
    };

    const seek = (id, time) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].currentTime = time;
        }
    };

    const stop = (id) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].pause();
            audioRefs.current[id].currentTime = 0;
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
        }
    };

    useEffect(() => {
        // Cleanup function to stop all audio when unmounting
        return () => {
            Object.values(audioRefs.current).forEach((audio) => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };
    }, []);

    return (
        <AudioContext.Provider value={{ playingStates, play, pause, seek, stop, audioRefs }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
