import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [playingStates, setPlayingStates] = useState({});
    const audioRefs = useRef({});

    const play = (id, src) => {
        console.log("in play");

        console.log("AudioProvider::play(): Attempting to play the following audio", {
            children,
            id,
            src,
            audioRefs,
        });

        // Stop all other audio
        Object.keys(audioRefs.current).forEach((key) => {
            if (key !== id && audioRefs.current[key]) {
                console.log("There was active audio, paused");
                stop(key);
            }
        });

        // Play the selected audio
        if (!audioRefs.current[id]) {
            audioRefs.current[id] = new Audio(src);
            console.log("AudioProvider::play(): Creating entry", audioRefs.current[id]);
        }

        console.log("AudioProvider::play(): Playing");
        audioRefs.current[id].play();
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
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
