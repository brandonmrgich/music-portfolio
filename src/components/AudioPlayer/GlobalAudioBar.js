import React, { useRef, useState, useEffect } from 'react';
import {
    ChevronUp,
    ChevronDown,
    Pause,
    Play,
    Volume,
    Volume1,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';
import BaseAudioPlayer from './BaseAudioPlayer';

/**
 * GlobalAudioBar - Modern, glassy, pastel look with dark mode and mobile support.
 * - Responsive: smaller on mobile, touch-friendly
 * - Minimize/expand button, never hides on outside click
 * - Minimized bar shows play/pause, track title/artist, and expand button
 * - On mobile, bar hides on scroll down and shows on scroll up (industry standard)
 */
const GlobalAudioBar = () => {
    const {
        currentTrack,
        play,
        pause,
        playingStates,
        seek,
        setVolume,
        currentTimes,
        durations,
        volumes,
    } = useAudio();
    const [minimized, setMinimized] = useState(false);
    const [mobileHidden, setMobileHidden] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const barRef = useRef(null);
    // --- Expanded bar hooks (must always be called) ---
    const [muted, setMuted] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(0.5);
    const volumeRef = useRef(null);
    // When expanded, minimize the bar if clicking outside the bar
    useEffect(() => {
        if (minimized) return;
        const handleClickOutside = (event) => {
            if (barRef.current && !barRef.current.contains(event.target)) {
                setMinimized(true);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [minimized]);
    // --- End expanded bar hooks ---
    // Scroll-aware show/hide for mobile
    useEffect(() => {
        const SCROLL_THRESHOLD = 40; // px before toggling
        const handleScroll = () => {
            if (window.innerWidth >= 640) return; // Only mobile
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentY = window.scrollY;
                    if (currentY > lastScrollY.current + SCROLL_THRESHOLD) {
                        setMobileHidden(true); // Hide on scroll down
                        lastScrollY.current = currentY;
                    } else if (currentY < lastScrollY.current - SCROLL_THRESHOLD) {
                        setMobileHidden(false); // Show on scroll up
                        lastScrollY.current = currentY;
                    }
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    // Keyboard volume control for mobile
    useEffect(() => {
        if (!isMobile) return;
        const handleKeyDown = (e) => {
            if (!currentTrack) return;
            if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                setMuted(false);
                setVolume(currentTrack.id, Math.min(1, (volumes[currentTrack.id] !== undefined ? volumes[currentTrack.id] : 0.5) + 0.05));
                e.preventDefault();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                setMuted(false);
                setVolume(currentTrack.id, Math.max(0, (volumes[currentTrack.id] !== undefined ? volumes[currentTrack.id] : 0.5) - 0.05));
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMobile, currentTrack, setVolume, setMuted, volumes]);
    // If no track, don't show bar or tab
    if (!currentTrack) return null;
    const { id, title, artist, links, src } = currentTrack;
    const isPlaying = playingStates[id];
    const currentTime = currentTimes[id] || 0;
    const duration = durations[id] || 0;
    const volume = volumes[id] !== undefined ? volumes[id] : 0.5;
    const handlePlayPause = () => {
        if (isPlaying) {
            pause(id);
        } else {
            play(id, src, { title, artist, links });
        }
    };
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    const renderVolumeIcon = () => {
        if (volume <= 0 || muted) {
            return <VolumeX />;
        } else if (volume > 0 && volume <= 0.33) {
            return <Volume />;
        } else if (volume > 0.33 && volume <= 0.66) {
            return <Volume1 />;
        } else {
            return <Volume2 />;
        }
    };
    const handleMuteClick = () => {
        if (!muted && volume > 0) {
            setPreviousVolume(volume);
            setVolume(id, 0);
            setMuted(true);
        } else {
            setVolume(id, previousVolume > 0 ? previousVolume : 0.5);
            setMuted(false);
        }
    };
    if (minimized) {
        // Redesigned minimized bar: [play/pause] Song artist [chevron] (no seek bar, compact layout, centered background)
        return (
            <div
                className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-50 rounded-xl shadow-lg border border-border-dark bg-card-dark/80 backdrop-blur-lg inline-flex items-center px-3 py-1 gap-2 sm:gap-3 max-w-full transition-transform duration-200 ${mobileHidden ? 'translate-y-20 pointer-events-none' : ''}`}
                style={{
                    boxShadow: '0 2px 16px 0 rgba(31, 38, 135, 0.18)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                }}
            >
                {/* Play/Pause */}
                <button
                    onClick={handlePlayPause}
                    className="p-1.5 rounded-full bg-button-dark text-buttonText-dark hover:bg-accent-dark transition-colors flex-shrink-0"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                {/* Song Title */}
                <span className="break-words whitespace-normal font-semibold text-playercardText-dark text-sm sm:text-base max-w-[40vw] sm:max-w-[20vw] ml-1">
                    {links?.song ? (
                        <a
                            href={links.song}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent-dark"
                        >
                            {title}
                        </a>
                    ) : (
                        title
                    )}
                </span>
                {/* Artist */}
                <span className="break-words whitespace-normal text-playercardText-dark text-xs sm:text-sm opacity-80 max-w-[28vw] sm:max-w-[12vw] ml-1">
                    {links?.artist ? (
                        <a
                            href={links.artist}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent-dark"
                        >
                            {artist}
                        </a>
                    ) : (
                        artist
                    )}
                </span>
                {/* Chevron (expand) */}
                <button
                    onClick={() => setMinimized(false)}
                    className="ml-2 p-1 rounded-full bg-transparent hover:bg-accent-dark/20 transition-colors h-8 w-8 flex items-center justify-center flex-shrink-0 drop-shadow hover:scale-110"
                    aria-label="Expand audio player"
                    style={{ minWidth: 0, minHeight: 0 }}
                >
                    <ChevronUp size={24} className="text-accent-dark drop-shadow" />
                </button>
            </div>
        );
    }
    // Expanded glassy bar with custom controls (no BaseAudioPlayer)
    return (
        <div
            ref={barRef}
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[98vw] max-w-xl z-50 rounded-2xl shadow-2xl border border-primary-light1/40 dark:border-comfydark-dark/40 backdrop-blur-lg flex flex-col px-3 py-2 bg-white/30 dark:bg-comfydark-dark/30 transition-colors duration-300 sm:px-6 sm:py-3 ${mobileHidden ? 'translate-y-28 pointer-events-none' : ''}`}
            style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            {/* Top row: Song + Artist, Volume or Play/Pause (right) */}
            <div className="flex flex-row items-center w-full gap-2 mb-1">
                {/* Song Title + Artist (left, or shifted right on mobile) */}
                <div className={`flex-1 min-w-0 flex items-center gap-2 overflow-hidden ${isMobile ? 'justify-end' : ''}`}> 
                    <span className="text-lg font-bold text-playercardText-dark break-words whitespace-normal">
                        {links?.song ? (
                            <a
                                href={links.song}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-accent-dark"
                            >
                                {title}
                            </a>
                        ) : (
                            title
                        )}
                    </span>
                    <span className="text-playercardText-dark opacity-60 mx-1">&middot;</span>
                    <span className="text-sm font-semibold text-playercardText-dark opacity-80 break-words whitespace-normal">
                        {links?.artist ? (
                            <a
                                href={links.artist}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-accent-dark"
                            >
                                {artist}
                            </a>
                        ) : (
                            artist
                        )}
                    </span>
                </div>
                {/* Volume controls (right) - hide on mobile, show play/pause on mobile */}
                {!isMobile && (
                    <div className="flex items-center flex-shrink-0 ml-2">
                        <button
                            onClick={handleMuteClick}
                            className="text-accent-dark drop-shadow hover:scale-110 transition-transform"
                            aria-label="Mute/unmute"
                        >
                            {React.cloneElement(renderVolumeIcon(), {
                                size: 24,
                                className: 'text-accent-dark drop-shadow',
                            })}
                        </button>
                        <input
                            ref={volumeRef}
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => {
                                setVolume(id, parseFloat(e.target.value));
                                if (parseFloat(e.target.value) === 0) {
                                    setMuted(true);
                                } else {
                                    setMuted(false);
                                    setPreviousVolume(parseFloat(e.target.value));
                                }
                            }}
                            className="w-24 h-2 accent-accent-dark bg-primary-dark2/30 rounded-lg cursor-pointer ml-2"
                            aria-label="Volume"
                        />
                    </div>
                )}
                {isMobile && (
                    <button
                        onClick={handlePlayPause}
                        className="ml-2 p-1.5 rounded-full bg-button-dark text-buttonText-dark hover:bg-accent-dark transition-colors flex-shrink-0 shadow-sm"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        style={{ minWidth: 0, minHeight: 0 }}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                )}
                <button
                    onClick={() => setMinimized(true)}
                    className="p-2 rounded-full bg-transparent hover:bg-white/30 dark:hover:bg-comfydark-dark/30 transition-colors h-10 w-10 flex items-center justify-center drop-shadow hover:scale-110 ml-2"
                    aria-label="Minimize audio player"
                >
                    <ChevronDown size={24} className="text-accent-dark drop-shadow" />
                </button>
            </div>
            {/* Bottom row: Seek Bar */}
            <div className="flex items-center w-full px-2">
                <span className="text-xs text-accent-dark min-w-[32px] text-right">
                    {formatTime(currentTime)}
                </span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => seek(id, Number(e.target.value))}
                    className="w-full min-w-[90px] sm:min-w-[140px] max-w-[400px] accent-accent-dark h-1 rounded bg-primary-dark2/30 mx-2"
                    aria-label="Seek audio"
                />
                <span className="text-xs text-accent-dark min-w-[32px] text-left">
                    {formatTime(duration)}
                </span>
            </div>
        </div>
    );
};

export default GlobalAudioBar;

