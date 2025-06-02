import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume, Volume1, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';

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
        playingStates,
        currentTimes,
        durations,
        volumes,
        play,
        pause,
        seek,
        setVolume,
    } = useAudio();
    const [minimized, setMinimized] = useState(false);
    const [mobileHidden, setMobileHidden] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const barRef = useRef(null);

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

    // If no track, don't show bar or tab
    if (!currentTrack) return null;

    const { id, title, artist, links, src } = currentTrack;
    const isPlaying = playingStates[id];
    const currentTime = currentTimes[id] || 0;
    const duration = durations[id] || 0;
    const volume = volumes[id] !== undefined ? volumes[id] : 0.5;

    /**
     * Format seconds as mm:ss
     * @param {number} time
     * @returns {string}
     */
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    /**
     * Render the correct volume icon for the current volume.
     * @returns {JSX.Element}
     */
    const renderVolumeIcon = () => {
        if (volume <= 0) {
            return <VolumeX />;
        } else if (volume > 0 && volume <= 0.33) {
            return <Volume />;
        } else if (volume > 0.33 && volume <= 0.66) {
            return <Volume1 />;
        } else {
            return <Volume2 />;
        }
    };

    // Minimized bar (responsive)
    if (minimized) {
        return (
            <div
                className={`fixed bottom-2 left-1/2 -translate-x-1/2 w-[90vw] max-w-lg z-50 rounded-xl shadow-md border border-primary-light1/40 dark:border-comfydark-dark/40 bg-white/40 dark:bg-comfydark-dark/40 backdrop-blur-md flex items-center px-2 py-0 gap-1 min-h-[24px] h-[28px] sm:px-3 sm:py-1 sm:gap-2 sm:min-h-[32px] sm:h-[32px] transition-transform duration-200 ${mobileHidden ? 'translate-y-20 pointer-events-none' : ''}`}
                style={{
                    boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
            >
                <button
                    onClick={() => (isPlaying ? pause(id) : play(id, src, { title, artist, links }))}
                    className="p-0.5 rounded-full bg-comfy-accent2 hover:bg-comfy-accent2/80 dark:bg-comfydark-accent2 dark:hover:bg-comfydark-accent2/80 text-white shadow transition-colors duration-150 focus:outline-none h-7 w-7 flex items-center justify-center sm:h-6 sm:w-6"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    style={{ minWidth: 0, minHeight: 0 }}
                >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <span className="truncate font-semibold text-comfy-accent1 dark:text-comfydark-accent1 text-xs max-w-[7rem] leading-tight" title={title}>
                    {title}
                </span>
                <span className="truncate text-comfy-accent1 dark:text-comfydark-tertiary text-xs max-w-[6rem] leading-tight opacity-80" title={artist}>
                    {artist}
                </span>
                <button
                    onClick={() => setMinimized(false)}
                    className="ml-auto p-0.5 rounded-full bg-transparent hover:bg-white/30 dark:hover:bg-comfydark-dark/30 transition-colors h-7 w-7 flex items-center justify-center sm:h-6 sm:w-6"
                    aria-label="Expand audio player"
                    style={{ minWidth: 0, minHeight: 0 }}
                >
                    <ChevronUp size={14} />
                </button>
            </div>
        );
    }

    // Full bar (responsive)
    return (
        <div
            ref={barRef}
            className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[98vw] max-w-3xl z-50 rounded-2xl shadow-2xl border border-primary-light1/40 dark:border-comfydark-dark/40 backdrop-blur-lg flex items-center px-3 py-2 gap-2 bg-white/30 dark:bg-comfydark-dark/30 transition-colors duration-300 sm:px-6 sm:py-3 sm:gap-4 ${mobileHidden ? 'translate-y-28 pointer-events-none' : ''}`}
            style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            {/* Track Info */}
            <div className="flex flex-col flex-grow min-w-0 relative z-10">
                <div className="flex items-center gap-1 min-w-0 sm:gap-2">
                    <span className="truncate font-semibold text-comfy-accent1 dark:text-comfydark-accent1 text-sm max-w-[8rem] sm:text-base sm:max-w-xs">
                        <a href={links?.song || '#'} target="_blank" rel="noopener noreferrer">
                            {title}
                        </a>
                    </span>
                    <span className="truncate text-comfy-accent1 dark:text-comfydark-tertiary text-xs opacity-80 max-w-[7rem] sm:text-sm sm:max-w-xs">
                        <a href={links?.artist || '#'} target="_blank" rel="noopener noreferrer">
                            {artist}
                        </a>
                    </span>
                </div>
                <div className="flex items-center gap-1 w-full sm:gap-2">
                    <span className="text-comfy-accent1 dark:text-comfydark-accent2 text-xs font-mono">
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => seek(id, Number(e.target.value))}
                        className="flex-grow accent-comfy-accent2 dark:accent-comfydark-accent2 opacity-70 hover:opacity-100 transition-opacity duration-150 mx-1 h-2 rounded-lg bg-primary-light2/40 dark:bg-comfydark-medium/40 sm:mx-2"
                        aria-label="Seek audio"
                    />
                    <span className="text-comfy-accent1 dark:text-comfydark-accent2 text-xs font-mono">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
            {/* Play/Pause Button */}
            <button
                onClick={() => (isPlaying ? pause(id) : play(id, src, { title, artist, links }))}
                className="mx-1 p-2 rounded-full bg-comfy-accent2 hover:bg-comfy-accent2/80 dark:bg-comfydark-accent2 dark:hover:bg-comfydark-accent2/80 text-white shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-light1/60 dark:focus:ring-comfydark-accent2/60 relative z-10 h-9 w-9 flex items-center justify-center sm:mx-2 sm:p-3 sm:h-auto sm:w-auto"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
            {/* Volume Control (hide on xs, show on sm+) */}
            <div className="hidden sm:flex items-center gap-2 min-w-[100px] relative z-10">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(id, parseFloat(e.target.value))}
                    className="w-20 accent-comfy-accent2 dark:accent-comfydark-accent2 opacity-70 hover:opacity-100 transition-opacity duration-150 h-2 rounded-lg bg-primary-light2/40 dark:bg-comfydark-medium/40"
                    aria-label="Set volume"
                />
                <span className="text-comfy-accent1 dark:text-comfydark-accent2">
                    {renderVolumeIcon()}
                </span>
            </div>
            {/* Minimize Button */}
            <button
                onClick={() => setMinimized(true)}
                className="ml-1 p-2 rounded-full bg-transparent hover:bg-white/30 dark:hover:bg-comfydark-dark/30 transition-colors h-9 w-9 flex items-center justify-center sm:ml-2 sm:h-auto sm:w-auto"
                aria-label="Minimize audio player"
            >
                <ChevronDown size={20} />
            </button>
        </div>
    );
};

export default GlobalAudioBar; 