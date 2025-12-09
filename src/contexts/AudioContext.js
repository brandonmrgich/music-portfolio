import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { fetchTracksByType } from '../services/tracks';

/**
 * AudioContext provides global audio playback state and controls for the app.
 * Handles audio element management, playback, seeking, volume, and track metadata.
 * Also fetches and stores all available tracks by type.
 */
const AudioContext = createContext();

// Peak-only target at -1 dBFS (~0.8913 linear). We rely on a compressor for overs.
const TARGET_PEAK = 0.8912509381337456;
const TARGET_RMS = 0.2; // kept for potential future LUFS use (server-side)
// Global normalization toggle:
// - Can be overridden at runtime via window.__APP__.audioNormalizationEnabled = true/false
// - Or via build-time env: REACT_APP_ENABLE_NORMALIZATION=('true'|'false'), defaults to true
const ENABLE_NORMALIZATION_DEFAULT = true;
const isNormalizationEnabled = () => {
    try {
        if (typeof window !== 'undefined' && window.__APP__ && typeof window.__APP__.audioNormalizationEnabled === 'boolean') {
            return !!window.__APP__.audioNormalizationEnabled;
        }
        if (typeof process !== 'undefined' && process.env && typeof process.env.REACT_APP_ENABLE_NORMALIZATION !== 'undefined') {
            return String(process.env.REACT_APP_ENABLE_NORMALIZATION).toLowerCase() !== 'false';
        }
    } catch (_) {}
    return ENABLE_NORMALIZATION_DEFAULT;
};
const ENABLE_NORMALIZATION = true; // Analyze audio and normalize perceived loudness
// Strategy for resolving conflicting peak vs RMS targets:
// - 'conservative': respect peaks first (uses min)
// - 'rms_with_limiter': prioritize RMS and rely on a light limiter to catch peaks (uses max)
const NORMALIZATION_STRATEGY = 'rms_with_limiter';
const NORMALIZATION_MAX_GAIN = 4.0; // avoid excessive boosts
const NORMALIZATION_MIN_GAIN = 0.05; // avoid near-silence
const VOLUME_RAMP_MS = 140; // smooth ramp to avoid jumps
const DEFAULT_VOLUME = 0.5;
// Delay normalization after playback starts to avoid competing with initial buffering
const NORMALIZATION_DELAY_MS = 2000;

// Clamp a numeric value to [0, 1]
const clamp01 = (v) => Math.min(1, Math.max(0, v || 0));

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
    // Track any in-flight normalization fetches and scheduled timeouts, per id per src
    const normalizationControllersRef = useRef({}); // { id: { absoluteSrc: AbortController } }
    const normalizationTimeoutRef = useRef({}); // { id: { absoluteSrc: number } }
    // Ensure deep-link handling runs once
    const didApplyDeepLinkRef = useRef(false);

    // --- Web Audio API for normalization only ---
    // Compute normalization factor; accepts AbortSignal so we can cancel background work.
    const getNormalizationFactor = async (src, targetPeak = TARGET_PEAK, targetRms = TARGET_RMS, options = {}) => {
        if (!isNormalizationEnabled()) return 1;
        try {
            if (normalizationCacheRef.current[src] !== undefined) {
                return normalizationCacheRef.current[src];
            }
            const response = await fetch(src, { signal: options.signal });
            const arrayBuffer = await response.arrayBuffer();
            const audioCtx = new window.AudioContext();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            // Peak-only approach (fastest reasonable client path): scan for sample peak only.
            // True peak (oversampled) should be computed server-side; here we cap to -1 dB target
            // and rely on the built-in compressor to handle residual overs.
            let peak = 0;
            for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
                const channelData = audioBuffer.getChannelData(i);
                for (let j = 0; j < channelData.length; j++) {
                    peak = Math.max(peak, Math.abs(channelData[j]));
                }
            }
            audioCtx.close();
            // Compute gain solely from peak to bring it near -1 dBFS
            const peakFactor = peak === 0 ? 1 : targetPeak / peak;
            let factor = peakFactor;
            factor = Math.max(NORMALIZATION_MIN_GAIN, Math.min(NORMALIZATION_MAX_GAIN, factor));
            normalizationCacheRef.current[src] = factor;
            return factor;
        } catch (err) {
            // Swallow aborts; log others and fallback to 1
            if (!(err && err.name === 'AbortError')) {
                console.error('Error normalizing audio:', err);
            }
            return 1;
        }
    };

    // Smooth volume ramp to target over duration
    const rampVolumeTo = (id, targetVolume, durationMs = VOLUME_RAMP_MS) => {
        const ref = audioRefs.current[id];
        if (!ref || !ref.audio) return;
        const audio = ref.audio;
        const startVolume = clamp01(audio.volume);
        const clampedTarget = clamp01(targetVolume);
        const delta = clampedTarget - startVolume;
        if (Math.abs(delta) < 0.001) {
            audio.volume = clampedTarget;
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
            audio.volume = clamp01(startVolume + delta * t);
            if (t < 1) {
                rafId = requestAnimationFrame(step);
            }
        };
        rafId = requestAnimationFrame(step);
    };

    // Ensure maps exist
    const ensureWorkMaps = (id) => {
        if (!normalizationControllersRef.current[id]) normalizationControllersRef.current[id] = {};
        if (!normalizationTimeoutRef.current[id]) normalizationTimeoutRef.current[id] = {};
        return {
            controllers: normalizationControllersRef.current[id],
            timeouts: normalizationTimeoutRef.current[id],
        };
    };

    // Cancel any scheduled or in-flight normalization for a track id.
    // If absoluteSrc is provided, cancels only that source; otherwise cancels all for the id.
    const cancelNormalizationForId = (id, absoluteSrc) => {
        try {
            const { controllers, timeouts } = ensureWorkMaps(id);
            if (absoluteSrc) {
                if (timeouts[absoluteSrc]) {
                    clearTimeout(timeouts[absoluteSrc]);
                    delete timeouts[absoluteSrc];
                }
                if (controllers[absoluteSrc]) {
                    controllers[absoluteSrc].abort();
                    delete controllers[absoluteSrc];
                }
                return;
            }
            Object.keys(timeouts).forEach((src) => {
                clearTimeout(timeouts[src]);
                delete timeouts[src];
            });
            Object.keys(controllers).forEach((src) => {
                controllers[src].abort();
                delete controllers[src];
            });
        } catch (_) {}
    };

    // Schedule normalization after a short delay so it doesn't compete with initial audio buffering.
    const scheduleNormalization = (id, absoluteSrc, baseVolume, generationSnapshot, audioEl) => {
        if (!isNormalizationEnabled()) return;
        const { controllers, timeouts } = ensureWorkMaps(id);
        // Cancel any existing schedule for this specific src
        if (timeouts[absoluteSrc]) {
            clearTimeout(timeouts[absoluteSrc]);
            delete timeouts[absoluteSrc];
        }
        if (controllers[absoluteSrc]) {
            controllers[absoluteSrc].abort();
            delete controllers[absoluteSrc];
        }
        const controller = new AbortController();
        controllers[absoluteSrc] = controller;
        const timeoutId = window.setTimeout(() => {
            getNormalizationFactor(absoluteSrc, TARGET_PEAK, TARGET_RMS, { signal: controller.signal })
                .then((normalization) => {
                    const refNow = audioRefs.current[id];
                    if (
                        initGenerationRef.current[id] === generationSnapshot &&
                        intendedSrcRef.current[id] === absoluteSrc &&
                        refNow &&
                        refNow.audio === audioEl
                    ) {
                        audioRefs.current[id].normalization = normalization;
                        rampVolumeTo(id, clamp01((baseVolume !== undefined ? baseVolume : DEFAULT_VOLUME) * normalization));
                    }
                })
                .catch((err) => {
                    if (!(err && err.name === 'AbortError')) {
                        console.error('Error normalizing audio:', err);
                    }
                })
                .finally(() => {
                    try {
                        delete timeouts[absoluteSrc];
                        delete controllers[absoluteSrc];
                    } catch (_) {}
                });
        }, NORMALIZATION_DELAY_MS);
        timeouts[absoluteSrc] = timeoutId;
    };

    // Special-case: prime normalization for both sources of a comparison (REEL) track after first play.
    const primeComparisonPairNormalization = (id, beforeSrc, afterSrc, currentSrc) => {
        if (!isNormalizationEnabled()) return;
        try {
            const absoluteBefore = new URL(beforeSrc, window.location.href).href;
            const absoluteAfter = new URL(afterSrc, window.location.href).href;
            const generation = initGenerationRef.current[id] || 0;
            const ref = audioRefs.current[id];
            if (!ref || !ref.audio) return;
            const baseVolume = volumes[id] !== undefined ? volumes[id] : DEFAULT_VOLUME;
            // Current source first, other source slightly later
            scheduleNormalization(id, new URL(currentSrc, window.location.href).href, baseVolume, generation, ref.audio);
            const otherSrc = (new URL(currentSrc, window.location.href).href === absoluteBefore) ? absoluteAfter : absoluteBefore;
            // Stagger the second schedule to reduce burst bandwidth
            const { timeouts } = ensureWorkMaps(id);
            const staggerDelay = NORMALIZATION_DELAY_MS + 1200;
            // Implement stagger by setting a one-off timeout that calls scheduleNormalization
            const staggerTimeoutKey = `${otherSrc}::stagger`;
            // Clear any existing manual stagger
            if (timeouts[staggerTimeoutKey]) {
                clearTimeout(timeouts[staggerTimeoutKey]);
                delete timeouts[staggerTimeoutKey];
            }
            timeouts[staggerTimeoutKey] = window.setTimeout(() => {
                scheduleNormalization(id, otherSrc, baseVolume, generation, ref.audio);
                delete timeouts[staggerTimeoutKey];
            }, staggerDelay);
        } catch (_) {}
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
            audio.volume = clamp01(initialVolume); // temporary; normalization applied asynchronously below

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
                // Update global mirror for deep-link copy
                try {
                    if (!window.__APP__) window.__APP__ = {};
                    if (!window.__APP__.audioCurrentTimes) window.__APP__.audioCurrentTimes = {};
                    window.__APP__.audioCurrentTimes[id] = audio.currentTime;
                } catch (_) {}
            });
            audio.addEventListener('ended', () => {
                setPlayingStates((prev) => ({ ...prev, [id]: false }));
                setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
            });

            // Commit the element immediately
            audioRefs.current[id] = { audio, normalization: 1 };

            // Build a lightweight Web Audio graph for optional peak protection
            // Only when using RMS-priority strategy
            if (NORMALIZATION_STRATEGY === 'rms_with_limiter') {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const source = ctx.createMediaElementSource(audio);
                    const compressor = ctx.createDynamicsCompressor();
                    // Gentle limiting to catch overs while keeping transparency
                    compressor.threshold.setValueAtTime(-6, ctx.currentTime); // dB
                    compressor.knee.setValueAtTime(6, ctx.currentTime);
                    compressor.ratio.setValueAtTime(8, ctx.currentTime);
                    compressor.attack.setValueAtTime(0.003, ctx.currentTime);
                    compressor.release.setValueAtTime(0.25, ctx.currentTime);
                    source.connect(compressor);
                    compressor.connect(ctx.destination);
                    // Store graph refs for cleanup
                    audioRefs.current[id].waCtx = ctx;
                    audioRefs.current[id].waSource = source;
                    audioRefs.current[id].waCompressor = compressor;
                } catch (e) {
                    // Fallback gracefully if Web Audio is unavailable
                    // eslint-disable-next-line no-console
                    console.warn('Web Audio graph unavailable; falling back to HTMLAudio only', e);
                }
            }

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
            // Close and disconnect Web Audio graph if present
            try {
                if (audioRefs.current[id].waSource) {
                    audioRefs.current[id].waSource.disconnect();
                }
                if (audioRefs.current[id].waCompressor) {
                    audioRefs.current[id].waCompressor.disconnect();
                }
                if (audioRefs.current[id].waCtx && typeof audioRefs.current[id].waCtx.close === 'function') {
                    audioRefs.current[id].waCtx.close();
                }
            } catch (_) {}
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
        // Cancel any pending/in-flight normalization for this track to free bandwidth
        cancelNormalizationForId(id);
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
        
        // Hint the browser to buffer more aggressively on user intent
        try { ref.audio.preload = 'auto'; } catch (_) {}

        ref.audio.play();
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
        setCurrentSrcs((prev) => ({ ...prev, [id]: src }));
        if (meta) setCurrentTrack({ id, src, ...meta });

        // Defer normalization to avoid competing with initial buffering.
        const absoluteSrc = new URL(src, window.location.href).href;
        const myGeneration = initGenerationRef.current[id];
        const previousVolume = volumes[id] !== undefined ? volumes[id] : DEFAULT_VOLUME;
        scheduleNormalization(id, absoluteSrc, previousVolume, myGeneration, ref.audio);
    };

    const pause = (id) => {
        const ref = audioRefs.current[id];
        if (ref) {
            ref.audio.pause();
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            // Cancel any in-flight normalization for this track on pause
            cancelNormalizationForId(id);
        }
    };

    const stop = (id) => {
        const ref = audioRefs.current[id];
        if (ref) {
            ref.audio.pause();
            ref.audio.currentTime = 0;
            setPlayingStates((prev) => ({ ...prev, [id]: false }));
            setCurrentTimes((prev) => ({ ...prev, [id]: 0 }));
            cancelNormalizationForId(id);
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
            const scaled = (volume || 0) * (ref.normalization || 1);
            ref.audio.volume = clamp01(scaled);
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
                const absoluteOldSrc = new URL(ref.audio.src, window.location.href).href;
                const absoluteNewSrc = new URL(newSrc, window.location.href).href;
                // Invalidate any in-flight initializations and set the intended src
                const bumped = (initGenerationRef.current[id] || 0) + 1;
                initGenerationRef.current[id] = bumped;
                intendedSrcRef.current[id] = absoluteNewSrc;

                // Cancel normalization only for the old source; keep any work for the paired source
                cancelNormalizationForId(id, absoluteOldSrc);

                ref.audio.src = absoluteNewSrc;
                ref.audio.load();
                // Temporarily use previous volume; normalization will be applied asynchronously
                ref.audio.volume = clamp01(previousVolume);

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

                // Defer normalization to avoid competing with initial buffering on toggle
                scheduleNormalization(id, absoluteNewSrc, previousVolume, bumped, ref.audio);
                // Also ensure the opposite source gets normalized soon for seamless next toggle
                try {
                    const absoluteBefore = new URL(beforeSrc, window.location.href).href;
                    const absoluteAfter = new URL(afterSrc, window.location.href).href;
                    const other = (absoluteNewSrc === absoluteBefore) ? absoluteAfter : absoluteBefore;
                    const baseVol = volumes[id] !== undefined ? volumes[id] : DEFAULT_VOLUME;
                    // Stagger the other source slightly more
                    const generation = initGenerationRef.current[id];
                    const later = NORMALIZATION_DELAY_MS + 1200;
                    const { timeouts } = (function ensure() {
                        if (!normalizationTimeoutRef.current[id]) normalizationTimeoutRef.current[id] = {};
                        return { timeouts: normalizationTimeoutRef.current[id] };
                    })();
                    const key = `${other}::stagger`;
                    if (timeouts[key]) {
                        clearTimeout(timeouts[key]);
                        delete timeouts[key];
                    }
                    timeouts[key] = window.setTimeout(() => {
                        scheduleNormalization(id, other, baseVol, generation, ref.audio);
                        delete timeouts[key];
                    }, later);
                } catch (_) {}
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
        try {
            const absoluteNewSrc = new URL(newSrc, window.location.href).href;
            const myGeneration = initGenerationRef.current[id];
            scheduleNormalization(id, absoluteNewSrc, previousVolume, myGeneration, audioRefs.current[id]?.audio);
        } catch (_) {}
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

    // Deep-link handling: ?track=<id>&t=<seconds>
    useEffect(() => {
        if (didApplyDeepLinkRef.current) return;
        // Wait until tracks are loaded at least once
        if (tracksLoading) return;
        const params = new URLSearchParams(window.location.search);
        const trackId = params.get('track');
        if (!trackId) return;
        const timeParam = parseInt(params.get('t') || '0', 10);
        const startSeconds = Number.isFinite(timeParam) && timeParam >= 0 ? timeParam : 0;
        const track = getTrackById(trackId);
        if (!track) return;
        // Determine a source
        const chosenSrc = track.src || track.before || track.after;
        if (!chosenSrc) return;
        didApplyDeepLinkRef.current = true;
        // Initialize and seek (no autoplay)
        (async () => {
            try {
                await initializeAudio(trackId, chosenSrc);
                seek(trackId, startSeconds);
                setCurrentSrcs((prev) => ({ ...prev, [trackId]: chosenSrc }));
                setCurrentTrack({ id: trackId, src: chosenSrc, title: track.title, artist: track.artist, links: track.links });
                // Attempt to scroll the card into view
                setTimeout(() => {
                    const el = document.getElementById(`track-${trackId}`);
                    if (el && typeof el.scrollIntoView === 'function') {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 0);
            } catch (e) {
                // ignore
            }
        })();
    }, [tracks, tracksLoading]);

    // On unmount, pause and reset all audio
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach((ref) => {
                if (ref && ref.audio) {
                    ref.audio.pause();
                    ref.audio.src = '';
                }
            });
            // Cancel all normalization work on unmount
            try {
                Object.keys(normalizationTimeoutRef.current).forEach((id) => {
                    clearTimeout(normalizationTimeoutRef.current[id]);
                });
                Object.values(normalizationControllersRef.current).forEach((c) => c.abort());
            } catch (_) {}
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
                // Expose REEL A/B helper so comparison player can pre-warm both sources
                primeComparisonPairNormalization,
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
