import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { fetchTracksByType } from '../services/tracks';

/**
 * AudioContext provides global audio playback state and controls for the app.
 * Handles audio element management, playback, seeking, volume, and track metadata.
 * Also fetches and stores all available tracks by type.
 */
const AudioContext = createContext();

const TARGET_PEAK = 0.9;
const DEFAULT_VOLUME = 0.5;

/**
 * AudioProvider wraps the app and provides audio state and controls via context.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export const AudioProvider = ({ children }) => {
    // --- Audio playback state ---
    const [playingStates, setPlayingStates] = useState({});
    const [currentTimes, setCurrentTimes] = useState({});
    const [durations, setDurations] = useState({});
    const [volumes, setVolumes] = useState({});
    const [currentSrcs, setCurrentSrcs] = useState({});
    const [currentTrack, setCurrentTrack] = useState(null); // Metadata for global bar
    // --- Track data state ---
    const [tracks, setTracks] = useState({ wip: [], scoring: [], reel: [] });
    const [tracksLoading, setTracksLoading] = useState(false);
    const [tracksError, setTracksError] = useState(null);

    // --- Audio refs ---
    const audioRefs = useRef({}); // { id: { audio, normalization } }

    // --- Web Audio API for normalization only ---
    const getNormalizationFactor = async (src, targetPeak = TARGET_PEAK) => {
        try {
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            const audioCtx = new window.AudioContext();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            let peak = 0;
            for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
                const channelData = audioBuffer.getChannelData(i);
                for (let j = 0; j < channelData.length; j++) {
                    peak = Math.max(peak, Math.abs(channelData[j]));
                }
            }
            audioCtx.close();
            return peak === 0 ? 1 : targetPeak / peak;
        } catch (err) {
            console.error('Error normalizing audio:', err);
            return 1;
        }
    };

    // --- Audio element management ---
    const initializeAudio = async (id, src) => {
        if (audioRefs.current[id]) return;
        const normalization = await getNormalizationFactor(src);
        const audio = new window.Audio(src);
        audio.preload = 'auto';
        audio.volume = (volumes[id] !== undefined ? volumes[id] : DEFAULT_VOLUME) * normalization;
        audio.addEventListener('loadedmetadata', () => {
            setDurations((prev) => ({ ...prev, [id]: audio.duration }));
        });
        audio.addEventListener('timeupdate', () => {
            setCurrentTimes((prev) => ({ ...prev, [id]: audio.currentTime }));
        });
        audio.addEventListener('ended', () => {
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
        });
        audioRefs.current[id] = { audio, normalization };
    };

    // Pause and reset all audio except the one with the given id
    const stopAllExcept = (id) => {
        Object.keys(audioRefs.current).forEach((key) => {
            if (key !== String(id) && audioRefs.current[key]) {
                audioRefs.current[key].audio.pause();
                audioRefs.current[key].audio.currentTime = 0;
                setPlayingStates((prev) => ({ ...prev, [key]: false }));
                setCurrentTimes((prev) => ({ ...prev, [key]: 0 }));
            }
        });
    };

    const play = async (id, src, meta) => {
        stopAllExcept(id);
        await initializeAudio(id, src);
        const ref = audioRefs.current[id];
        if (!ref) {
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentSrcs((prev) => ({ ...prev, [id]: null }));
            setCurrentTrack(null);
            return;
        }
        ref.audio.currentTime = currentTimes[id] || 0;
        ref.audio.play();
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
        setCurrentSrcs((prev) => ({ ...prev, [id]: src }));
        if (meta) setCurrentTrack({ id, src, ...meta });
    };

    const pause = (id) => {
        const ref = audioRefs.current[id];
        if (ref) {
            ref.audio.pause();
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
        }
    };

    const stop = (id) => {
        const ref = audioRefs.current[id];
        if (ref) {
            ref.audio.pause();
            ref.audio.currentTime = 0;
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
        }
    };

    const seek = (id, time) => {
        const ref = audioRefs.current[id];
        if (ref) {
            ref.audio.currentTime = time;
            setCurrentTimes((prev) => ({ ...prev, [id]: time }));
        }
    };

    const setVolume = (id, volume) => {
        setVolumes((prev) => ({ ...prev, [id]: volume }));
        const ref = audioRefs.current[id];
        if (ref) {
            ref.audio.volume = volume * ref.normalization;
        }
    };

    // Toggle between two sources (A/B)
    const toggleSource = async (id, beforeSrc, afterSrc, isBeforeAudio) => {
        const newSrc = isBeforeAudio ? afterSrc : beforeSrc;
        const oldVolume = volumes[id] !== undefined ? volumes[id] : DEFAULT_VOLUME;
        const oldCurrentTime = currentTimes[id] || 0;
        // Remove old audio element
        if (audioRefs.current[id]) {
            audioRefs.current[id].audio.pause();
            audioRefs.current[id].audio.src = '';
            delete audioRefs.current[id];
        }
        await initializeAudio(id, newSrc);
        setVolume(id, oldVolume);
        seek(id, oldCurrentTime);
        play(id, newSrc);
    };

    // --- Track fetching ---
    const refreshTracks = async () => {
        setTracksLoading(true);
        setTracksError(null);
        try {
            const [wip, scoring, reel] = await Promise.all([
                fetchTracksByType('wip'),
                fetchTracksByType('scoring'),
                fetchTracksByType('reel'),
            ]);
            setTracks({ wip, scoring, reel });
        } catch (err) {
            setTracksError(err);
        } finally {
            setTracksLoading(false);
        }
    };

    useEffect(() => {
        refreshTracks();
    }, []);

    // --- Get track by id ---
    const getTrackById = (id) => {
        for (const type of Object.keys(tracks)) {
            const found = tracks[type]?.find((t) => String(t.id) === String(id));
            if (found) return found;
        }
        return null;
    };

    // On unmount, pause and reset all audio
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach((ref) => {
                if (ref && ref.audio) {
                    ref.audio.pause();
                    ref.audio.src = '';
                }
            });
        };
    }, []);

    /**
     * Context value: exposes all audio state, controls, and track data.
     */
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
                currentTrack,
                tracks,
                tracksLoading,
                tracksError,
                refreshTracks,
                getTrackById,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

/**
 * useAudio - React hook to access audio context.
 * @returns {object} Audio context value
 */
export const useAudio = () => useContext(AudioContext);
