import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [globalIsPlaying, setGlobalIsPlaying] = useState(false);
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const audioRef = useRef(null); // Initially null

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(); // Initialize audio element when the provider mounts
        }

        const handleEnded = () => {
            setGlobalIsPlaying(false);
            setCurrentPlayingId(null);
        };

        audioRef.current.addEventListener("ended", handleEnded);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("ended", handleEnded);
            }
        };
    }, []);

    const play = (id, src) => {
        if (currentPlayingId !== id) {
            if (audioRef.current) {
                audioRef.current.src = src;
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
            setCurrentPlayingId(id);
            setGlobalIsPlaying(true);
        } else {
            audioRef.current.play(); // Resume the current audio
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setGlobalIsPlaying(false);
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    return (
        <AudioContext.Provider
            value={{ globalIsPlaying, currentPlayingId, play, pause, seek, audioRef }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
