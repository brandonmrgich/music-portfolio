import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { fetchTracksByType } from '../services/tracks';

/**
 * AudioContext provides global audio playback state and controls for the app.
 * Handles audio element management, playback, seeking, volume, and track metadata.
 * Also fetches and stores all available tracks by type.
 */
const AudioContext = createContext();

const TARGET_PEAK = 0.9;
const TARGET_RMS = 0.2; // perceived loudness target (rough)
const ENABLE_NORMALIZATION = true; // Analyze audio and normalize perceived loudness
const NORMALIZATION_MAX_GAIN = 4.0; // avoid excessive boosts
const NORMALIZATION_MIN_GAIN = 0.05; // avoid near-silence
const VOLUME_RAMP_MS = 140; // smooth ramp to avoid jumps
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
    // Generation/version for async initialization to avoid races
    const initGenerationRef = useRef({}); // { id: number }
    // The most recently intended src per id (absolute URL)
    const intendedSrcRef = useRef({}); // { id: string }
    // Cache normalization by absolute src
    const normalizationCacheRef = useRef({}); // { absoluteSrc: factor }
    // Track any in-flight volume ramps so we can cancel/replace
    const volumeRampHandlesRef = useRef({}); // { id: { cancel: () => void } }

    // --- Web Audio API for normalization only ---
    const getNormalizationFactor = async (src, targetPeak = TARGET_PEAK, targetRms = TARGET_RMS) => {
        if (!ENABLE_NORMALIZATION) return 1;
        try {
            if (normalizationCacheRef.current[src] !== undefined) {
                return normalizationCacheRef.current[src];
            }
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            const audioCtx = new window.AudioContext();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            let peak = 0;
            let sumSquares = 0;
            let totalSamples = 0;
            for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
                const channelData = audioBuffer.getChannelData(i);
                for (let j = 0; j < channelData.length; j++) {
                    peak = Math.max(peak, Math.abs(channelData[j]));
                    const s = channelData[j];
                    sumSquares += s * s;
                }
                totalSamples += channelData.length;
            }
            audioCtx.close();
            const rms = totalSamples > 0 ? Math.sqrt(sumSquares / totalSamples) : 0;
            const peakFactor = peak === 0 ? 1 : targetPeak / peak;
            const rmsFactor = rms === 0 ? 1 : targetRms / rms;
            let factor = Math.min(peakFactor, rmsFactor);
            factor = Math.max(NORMALIZATION_MIN_GAIN, Math.min(NORMALIZATION_MAX_GAIN, factor));
            normalizationCacheRef.current[src] = factor;
            return factor;
        } catch (err) {
            console.error('Error normalizing audio:', err);
            return 1;
        }
    };

    // Smooth volume ramp to target over duration
    const rampVolumeTo = (id, targetVolume, durationMs = VOLUME_RAMP_MS) => {
        const ref = audioRefs.current[id];
        if (!ref || !ref.audio) return;
        const audio = ref.audio;
        const startVolume = audio.volume;
        const delta = targetVolume - startVolume;
        if (Math.abs(delta) < 0.001) {
            audio.volume = targetVolume;
            return;
        }
        // Cancel any existing ramp
        if (volumeRampHandlesRef.current[id] && volumeRampHandlesRef.current[id].cancel) {
            volumeRampHandlesRef.current[id].cancel();
        }
        let rafId = null;
        const startTime = performance.now();
        const cancel = () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
        volumeRampHandlesRef.current[id] = { cancel };
        const step = () => {
            const now = performance.now();
            const t = Math.min(1, (now - startTime) / Math.max(1, durationMs));
            audio.volume = startVolume + delta * t;
            if (t < 1) {
                rafId = requestAnimationFrame(step);
            }
        };
        rafId = requestAnimationFrame(step);
    };

    // --- Audio element management ---
    const initializeAudio = async (id, src) => {
        // Normalize to absolute URL for consistent comparisons
        const absoluteSrc = new URL(src, window.location.href).href;
        intendedSrcRef.current[id] = absoluteSrc;
        // If we already have an audio element with the same src, do nothing
        const existing = audioRefs.current[id];
        if (existing && existing.audio && new URL(existing.audio.src, window.location.href).href === absoluteSrc) {
            return;
        }

        // If an element exists but for a different src, clean it up first
        if (existing && existing.audio) {
            cleanupAudio(id);
        }

        // Bump generation to invalidate any older in-flight initializations for this id
        const myGeneration = (initGenerationRef.current[id] || 0) + 1;
        initGenerationRef.current[id] = myGeneration;

        try {
            // Create the audio element immediately so playback is responsive
            const audio = new window.Audio();
            audio.crossOrigin = 'anonymous';
            audio.preload = 'metadata';
            audio.src = absoluteSrc;
            const initialVolume = volumes[id] !== undefined ? volumes[id] : DEFAULT_VOLUME;
            audio.volume = initialVolume; // temporary; normalization applied asynchronously below

            // Add event listeners
            audio.addEventListener('loadedmetadata', () => {
                setDurations((prev) => ({ ...prev, [id]: audio.duration }));
                // If user requested play before metadata arrived and state says playing, ensure playback starts
                if (playingStates[id]) {
                    audio.play().catch(() => {});
                }
            });
            audio.addEventListener('timeupdate', () => {
                setCurrentTimes((prev) => ({ ...prev, [id]: audio.currentTime }));
            });
            audio.addEventListener('ended', () => {
                setPlayingStates((prev) => ({ ...prev, [id]: false }));
                setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
            });

            // Commit the element immediately
            audioRefs.current[id] = { audio, normalization: 1 };

            // Compute normalization in the background and apply if still current
            getNormalizationFactor(absoluteSrc)
                .then((normalization) => {
                    if (
                        initGenerationRef.current[id] === myGeneration &&
                        intendedSrcRef.current[id] === absoluteSrc &&
                        audioRefs.current[id] &&
                        audioRefs.current[id].audio === audio
                    ) {
                        audioRefs.current[id].normalization = normalization;
                        rampVolumeTo(id, initialVolume * normalization);
                    }
                })
                .catch((err) => {
                    console.error('Error normalizing audio:', err);
                });
        } catch (error) {
            console.error(`Failed to initialize audio for ${id}:`, error);
            throw error;
        }
    };

    // Pause and reset all audio except the one with the given id
    const stopAllExcept = (id) => {
        Object.keys(audioRefs.current).forEach((key) => {
            if (key !== String(id) && audioRefs.current[key]) {
                const audio = audioRefs.current[key].audio;
                audio.pause();
                audio.currentTime = 0;
                setPlayingStates((prev) => ({ ...prev, [key]: false }));
                setCurrentTimes((prev) => ({ ...prev, [key]: 0 }));
            }
        });
    };
    
    // Clean up audio element completely
    const cleanupAudio = (id) => {
        if (audioRefs.current[id]) {
            const audio = audioRefs.current[id].audio;
            audio.pause();
            audio.src = '';
            audio.load();
            delete audioRefs.current[id];
            
            // Reset related state
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
            setCurrentSrcs((prev) => ({ ...prev, [id]: null }));
        }
    };

    // Overloaded play method - can play from current time or specified time
    const play = async (id, src, meta, startTime = null) => {
        stopAllExcept(id);
        await initializeAudio(id, src);
        const ref = audioRefs.current[id];
        if (!ref) {
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentSrcs((prev) => ({ ...prev, [id]: null }));
            setCurrentTrack(null);
            return;
        }
        
        // Set start time - either specified time or current saved time
        const timeToStart = startTime !== null ? startTime : (currentTimes[id] || 0);
        ref.audio.currentTime = timeToStart;
        setCurrentTimes((prev) => ({ ...prev, [id]: timeToStart }));
        
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
        const previousVolume = volumes[id] !== undefined ? volumes[id] : DEFAULT_VOLUME;
        const previousCurrentTime = currentTimes[id] || 0;
        const wasPlaying = !!playingStates[id];

        // Prefer reusing the existing audio element to avoid overlapping instances
        const ref = audioRefs.current[id];
        if (ref && ref.audio) {
            try {
                // Pause current, swap source, and preserve time/volume
                ref.audio.pause();
                // Swap to the new source immediately
                const absoluteNewSrc = new URL(newSrc, window.location.href).href;
                // Invalidate any in-flight initializations and set the intended src
                const bumped = (initGenerationRef.current[id] || 0) + 1;
                initGenerationRef.current[id] = bumped;
                intendedSrcRef.current[id] = absoluteNewSrc;

                ref.audio.src = absoluteNewSrc;
                ref.audio.load();
                // Temporarily use previous volume; normalization will be applied asynchronously
                ref.audio.volume = previousVolume;

                // If it was playing, resume from the same timestamp
                if (wasPlaying) {
                    // Ensure other tracks are stopped when resuming
                    stopAllExcept(id);
                    ref.audio.currentTime = previousCurrentTime;
                    setCurrentTimes((prev) => ({ ...prev, [id]: previousCurrentTime }));
                    await ref.audio.play();
                    setPlayingStates((prev) => ({ ...prev, [id]: true }));
                } else {
                    setPlayingStates((prev) => ({ ...prev, [id]: false }));
                }

                setCurrentSrcs((prev) => ({ ...prev, [id]: absoluteNewSrc }));
                setCurrentTrack((prev) => (prev && String(prev.id) === String(id) ? { ...prev, src: absoluteNewSrc } : prev));

                // Compute normalization in the background and apply if still current
                getNormalizationFactor(absoluteNewSrc)
                    .then((normalization) => {
                        if (
                            initGenerationRef.current[id] === bumped &&
                            intendedSrcRef.current[id] === absoluteNewSrc &&
                            audioRefs.current[id] &&
                            audioRefs.current[id].audio === ref.audio
                        ) {
                            ref.normalization = normalization;
                            rampVolumeTo(id, previousVolume * normalization);
                        }
                    })
                    .catch((err) => console.error('Error normalizing audio:', err));
            } catch (e) {
                // If anything fails, fall back to a clean re-init path
                cleanupAudio(id);
                await initializeAudio(id, newSrc);
                setVolume(id, previousVolume);
                if (wasPlaying) {
                    play(id, newSrc, null, previousCurrentTime);
                }
                setCurrentTrack((prev) => (prev && String(prev.id) === String(id) ? { ...prev, src: newSrc } : prev));
            }
            return;
        }

        // No existing element: initialize fresh
        await initializeAudio(id, newSrc);
        setVolume(id, previousVolume);
        if (wasPlaying) {
            play(id, newSrc, null, previousCurrentTime);
        }
        setCurrentTrack((prev) => (prev && String(prev.id) === String(id) ? { ...prev, src: newSrc } : prev));
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
                cleanupAudio,
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
