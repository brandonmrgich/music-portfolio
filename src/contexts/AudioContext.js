import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { fetchTracksByType } from '../services/tracks';

/**
 * AudioContext provides global audio playback state and controls for the app.
 * Handles audio element management, playback, seeking, volume, and track metadata.
 * Also fetches and stores all available tracks by type.
 */
const AudioContext = createContext();

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
    const audioRefs = useRef({});
    const DEFAULT_VOLUME = 0.5;

    // --- Track data state ---
    const [tracks, setTracks] = useState({ wip: [], scoring: [], reel: [] });
    const [tracksLoading, setTracksLoading] = useState(false);
    const [tracksError, setTracksError] = useState(null);

    /**
     * Initialize an audio element for a given track id and src, if not already present.
     * @param {string|number} id
     * @param {string} src
     */
    const initializeAudio = (id, src) => {
        if (audioRefs.current[id]) return;
        setNewAudioSrc(id, src);
        addAudioEventListeners(id);
        audioRefs.current[id].initialized = true;
    };

    /**
     * Create a new Audio element and set its volume.
     * @param {string|number} id
     * @param {string} src
     * @param {number} [defaultVolume]
     */
    const setNewAudioSrc = (id, src, defaultVolume = DEFAULT_VOLUME) => {
        audioRefs.current[id] = new Audio(src);
        audioRefs.current[id].volume = volumes[id] !== undefined ? volumes[id] : defaultVolume;
    };

    /**
     * Add event listeners to an audio element for metadata, time, and end events.
     * @param {string|number} id
     */
    const addAudioEventListeners = (id) => {
        const audio = audioRefs.current[id];
        audio.addEventListener('loadedmetadata', () => handleLoadedMetadata(id));
        audio.addEventListener('timeupdate', () => handleTimeUpdate(id));
        audio.addEventListener('ended', () => handleEnded(id));
    };

    /**
     * Handle loadedmetadata event for an audio element.
     * @param {string|number} id
     */
    const handleLoadedMetadata = (id) => {
        setDurations((prev) => ({ ...prev, [id]: audioRefs.current[id].duration }));
    };

    /**
     * Handle timeupdate event for an audio element.
     * @param {string|number} id
     */
    const handleTimeUpdate = (id) => {
        setCurrentTimes((prev) => ({ ...prev, [id]: audioRefs.current[id].currentTime }));
    };

    /**
     * Handle ended event for an audio element.
     * @param {string|number} id
     */
    const handleEnded = (id) => {
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
        setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
    };

    /**
     * Clean up an audio element and its event listeners.
     * @param {string|number} id
     */
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

    /**
     * Play an audio element by id and src, updating global state and current track metadata.
     * @param {string|number} id
     * @param {string} src
     * @param {object} [meta] - Track metadata (title, artist, links)
     */
    const play = (id, src, meta) => {
        stopAllExcept(id);
        if (audioRefs.current[id] == undefined) {
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentSrcs(null);
            setCurrentTrack(null);
            return;
        }
        audioRefs.current[id]
            .play()
            .then(() => {
                setPlayingStates((prev) => ({ ...prev, [id]: true }));
                setCurrentSrcs((prev) => ({ ...prev, [id]: src }));
                if (meta) setCurrentTrack({ id, src, ...meta });
            })
            .catch((err) => console.error(`Error playing ${id}:`, err));
    };

    /**
     * Pause all audio except the given id.
     * @param {string|number} id
     */
    const stopAllExcept = (id) => {
        Object.keys(audioRefs.current).forEach((key) => {
            if (key != id && audioRefs.current[key]) {
                stop(key);
            }
        });
    };

    /**
     * Stop and reset an audio element by id.
     * @param {string|number} id
     */
    const stop = (id) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].pause();
            audioRefs.current[id].currentTime = 0;
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
        }
    };

    /**
     * Pause an audio element by id.
     * @param {string|number} id
     */
    const pause = (id) => {
        audioRefs.current[id]?.pause();
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
    };

    /**
     * Seek to a specific time in an audio element by id.
     * @param {string|number} id
     * @param {number} time
     */
    const seek = (id, time) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].currentTime = time;
            setCurrentTimes((prev) => ({ ...prev, [id]: time }));
        }
    };

    /**
     * Set the volume for an audio element by id.
     * @param {string|number} id
     * @param {number} volume
     */
    const setVolume = (id, volume) => {
        if (audioRefs.current[id]) {
            audioRefs.current[id].volume = volume;
            setVolumes((prev) => ({ ...prev, [id]: volume }));
        }
    };

    /**
     * Toggle between two audio sources for a given id, preserving volume and time.
     * @param {string|number} id
     * @param {string} beforeSrc
     * @param {string} afterSrc
     * @param {boolean} isBeforeAudio
     */
    const toggleSource = (id, beforeSrc, afterSrc, isBeforeAudio) => {
        const newSrc = isBeforeAudio ? afterSrc : beforeSrc;
        const oldAudio = audioRefs.current[id];
        const oldVolume = oldAudio ? oldAudio.volume : DEFAULT_VOLUME;
        const oldCurrentTime = oldAudio ? oldAudio.currentTime : 0;
        cleanupAudio(id);
        initializeAudio(id, newSrc);
        setVolume(id, oldVolume);
        seek(id, oldCurrentTime);
        play(id, newSrc);
    };

    /**
     * Fetch all track types and store in context.
     */
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

    /**
     * Get a track by id from any type.
     * @param {string|number} id
     * @returns {object|null}
     */
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
            Object.values(audioRefs.current).forEach((audio) => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };
    }, []);

    /**
     * Allow a component to re-bind to an existing audio instance (optional, for future use).
     * @param {string|number} id
     * @returns {HTMLAudioElement|null}
     */
    const bindAudioRef = (id) => {
        return audioRefs.current[id] || null;
    };

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
                bindAudioRef,
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
