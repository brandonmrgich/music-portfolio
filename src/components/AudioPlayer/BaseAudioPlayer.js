import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume, Volume1, Volume2, VolumeX, X, Loader2, Share } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';
import { useAdmin } from '../../contexts/AdminContext';
import { deleteTrack } from '../../services/tracks';

/**
 * BaseAudioPlayer - A flexible audio player card for a single track.
 * Handles play/pause, seek, and volume, and syncs with global audio context.
 * @param {object} props
 * @param {string|number} props.id - Track ID
 * @param {string} props.src - Audio source URL
 * @param {string} props.title - Track title
 * @param {string} props.artist - Track artist
 * @param {object} props.links - Track links (artist, song)
 * @param {function} [props.renderAdditionalControls] - Optional render prop for extra controls
 * @param {boolean} [props.compact] - If true, render a minimal UI
 * @param {string} [props.className] - Additional className for styling
 */
const BaseAudioPlayer = ({ id, src, title, artist, links = {}, renderAdditionalControls, onToggleSource, compact = false, className = '' }) => {
    const {
        error,
        play,
        pause,
        seek,
        setVolume,
        playingStates,
        currentTimes,
        durations,
        volumes,
        refreshTracks,
    } = useAudio();
    const { isAdmin } = useAdmin();
    const [deleting, setDeleting] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState('idle'); // idle | deleting | success | error
    const [deleteMsg, setDeleteMsg] = useState('');
    const containerRef = useRef(null);

    const isPlaying = playingStates[id];
    const currentTime = currentTimes[id] || 0;
    const duration = durations[id] || 0;
    const volume = volumes[id] !== undefined ? volumes[id] : 0.5;
    const [volumeOpen, setVolumeOpen] = useState(false);

    const openVolume = () => setVolumeOpen(true);
    const closeVolume = () => setVolumeOpen(false);
    const volumeRef = useRef(null);
    const titleLongPressTimerRef = useRef(null);
    const LONG_PRESS_MS = 600;
    const [copyToastVisible, setCopyToastVisible] = useState(false);
    const copyToastTimeoutRef = useRef(null);

    const copyDeepLink = (includeTime = true) => {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('track', id);
            if (includeTime) {
                url.searchParams.set('t', Math.floor(currentTime || 0));
            }
            navigator.clipboard.writeText(url.toString());
            // Show ephemeral toast
            setCopyToastVisible(true);
            if (copyToastTimeoutRef.current) clearTimeout(copyToastTimeoutRef.current);
            copyToastTimeoutRef.current = setTimeout(() => setCopyToastVisible(false), 1200);
        } catch (_) {}
    };

    const handleTitleTouchStart = () => {
        try {
            if (titleLongPressTimerRef.current) clearTimeout(titleLongPressTimerRef.current);
            titleLongPressTimerRef.current = setTimeout(() => {
                copyDeepLink(true);
            }, LONG_PRESS_MS);
        } catch (_) {}
    };
    const handleTitleTouchEnd = () => {
        if (titleLongPressTimerRef.current) {
            clearTimeout(titleLongPressTimerRef.current);
            titleLongPressTimerRef.current = null;
        }
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (titleLongPressTimerRef.current) clearTimeout(titleLongPressTimerRef.current);
            if (copyToastTimeoutRef.current) clearTimeout(copyToastTimeoutRef.current);
        };
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Animated, interactive volume icon
    const iconRef = useRef(null);
    const getVolumeColor = () => {
        // Light gray at 0, accent at 1
        const accent = '247,178,173'; // rgb for accent-dark
        const gray = '203,191,175'; // rgb for border-light
        const t = volume; // 0 to 1
        // Interpolate between gray and accent
        const r = Math.round((1 - t) * 203 + t * 247);
        const g = Math.round((1 - t) * 191 + t * 178);
        const b = Math.round((1 - t) * 175 + t * 173);
        return `rgb(${r},${g},${b})`;
    };
    const getIcon = () => {
        const iconProps = {
            size: 28,
            style: {
                color: getVolumeColor(),
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))',
                transform: `scale(${0.95 + 0.15 * volume})`,
                transition: 'color 0.2s, transform 0.2s',
            },
        };
        if (volume <= 0 || muted) {
            return <VolumeX {...iconProps} />;
        } else if (volume > 0 && volume <= 0.33) {
            return <Volume {...iconProps} />;
        } else if (volume > 0.33 && volume <= 0.66) {
            return <Volume1 {...iconProps} />;
        } else {
            return <Volume2 {...iconProps} />;
        }
    };

    // Drag/scroll logic
    const [dragging, setDragging] = useState(false);
    const [muted, setMuted] = useState(false);
    const dragStartY = useRef(null);
    const dragStartVolume = useRef(null);
    const dragStartX = useRef(null);

    const handleIconClick = (e) => {
        setMuted((m) => {
            if (m) {
                setVolume(id, volume > 0 ? volume : 0.5);
                return false;
            } else {
                setVolume(id, 0);
                return true;
            }
        });
    };
    const handleMouseDown = (e) => {
        setDragging(true);
        dragStartY.current = e.clientY;
        dragStartVolume.current = volume;
        dragStartX.current = e.clientX;
        document.body.style.userSelect = 'none';
    };
    useEffect(() => {
        if (!dragging) return;
        const handleMouseMove = (e) => {
            const dy = dragStartY.current - e.clientY;
            const dx = e.clientX - dragStartX.current;
            // Up or right increases, down or left decreases
            let newVolume = dragStartVolume.current + (dy + dx) / 100;
            newVolume = Math.min(1, Math.max(0, newVolume));
            setMuted(false);
            setVolume(id, newVolume);
        };
        const handleMouseUp = () => {
            setDragging(false);
            document.body.style.userSelect = '';
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, id, setVolume]);

    // Touch drag for mobile
    const handleTouchStart = (e) => {
        setDragging(true);
        dragStartY.current = e.touches[0].clientY;
        dragStartX.current = e.touches[0].clientX;
        dragStartVolume.current = volume;
    };
    useEffect(() => {
        if (!dragging) return;
        const handleTouchMove = (e) => {
            const dy = dragStartY.current - e.touches[0].clientY;
            const dx = e.touches[0].clientX - dragStartX.current;
            let newVolume = dragStartVolume.current + (dy + dx) / 100;
            newVolume = Math.min(1, Math.max(0, newVolume));
            setMuted(false);
            setVolume(id, newVolume);
        };
        const handleTouchEnd = () => setDragging(false);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [dragging, id, setVolume]);

    // Removed hover-dependent text masking; prefer readable wrapping for mobile

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (volumeRef.current && !volumeRef.current.contains(event.target)) {
                closeVolume();
            }
        };
        if (volumeOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [volumeOpen]);

    // Removed scroll-based pre-initialization to avoid background downloads.

    if (error) console.log(error);

    const handlePlayPause = () => {
        if (isPlaying) {
            pause(id);
        } else {
            // Lazy init ensure
            play(id, src, { title, artist, links });
        }
    };

    // Keyboard left/right support
    const handleKeyDown = (e) => {
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            handlePlayPause();
            return;
        }
        if ((e.key === 't' || e.key === 'T') && typeof onToggleSource === 'function') {
            e.preventDefault();
            onToggleSource();
            return;
        }
        if (e.key === 'ArrowLeft') {
            const SEEK_STEP = 5;
            const newTime = Math.max(0, (currentTime || 0) - SEEK_STEP);
            seek(id, newTime);
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowRight') {
            const SEEK_STEP = 5;
            const newTime = Math.min(duration || 0, (currentTime || 0) + SEEK_STEP);
            seek(id, newTime);
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowDown') {
            setMuted(false);
            setVolume(id, Math.max(0, volume - 0.05));
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowUp') {
            setMuted(false);
            setVolume(id, Math.min(1, volume + 0.05));
            e.preventDefault();
            return;
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this track?')) return;
        setDeleteStatus('deleting');
        setDeleteMsg('');
        try {
            await deleteTrack(id);
            await refreshTracks();
            setDeleteStatus('success');
            setDeleteMsg('Track deleted successfully.');
            setTimeout(() => setDeleteStatus('idle'), 1500);
        } catch (err) {
            setDeleteStatus('error');
            setDeleteMsg('Failed to delete track.');
            setTimeout(() => setDeleteStatus('idle'), 2000);
        }
    };

    if (compact) {
        // Minimal UI for compressed grid
        return (
            <div ref={containerRef} onKeyDown={handleKeyDown} tabIndex={0} className={`relative flex flex-col bg-card-dark border border-border-dark rounded-lg shadow-md p-3 min-w-0 w-full max-w-xs mx-auto outline-none focus:ring-1 focus:ring-accent-dark/60 ${className}`}>
                {isAdmin && (
                    <button
                        className="absolute top-2 right-2 z-10 text-red-400 hover:text-red-600 bg-black/40 rounded-full p-1.5 transition-colors flex items-center justify-center"
                        onClick={handleDelete}
                        disabled={deleteStatus === 'deleting'}
                        title="Delete track"
                        aria-label="Delete track"
                    >
                        {deleteStatus === 'deleting' ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <X size={16} />
                        )}
                    </button>
                )}
                {isAdmin && deleteStatus !== 'idle' && (
                    <div className={`absolute top-10 right-2 text-xs px-2 py-1 rounded ${deleteStatus === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}
                        style={{ zIndex: 20 }}>
                        {deleteMsg}
                    </div>
                )}
                <div className="flex items-center justify-between mb-1">
                    <button
                        onClick={handlePlayPause}
                        className="p-2 rounded-full bg-button-dark text-buttonText-dark hover:bg-accent-dark transition-colors"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <div className="flex items-center flex-1 min-w-0 ml-2">
                        <div className="flex flex-col flex-1 min-w-0">
                            <span
                                className="text-base font-semibold text-playercardText-dark overflow-hidden min-h-[40px]"
                                title={title}
                                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                                onTouchStart={handleTitleTouchStart}
                                onTouchEnd={handleTitleTouchEnd}
                                onTouchCancel={handleTitleTouchEnd}
                            >
                                {title}
                            </span>
                            <span className="text-sm text-playercardText-dark opacity-80 truncate" title={artist}>{artist}</span>
                        </div>
                        <button
                            onClick={() => copyDeepLink(true)}
                            className="ml-2 p-1 rounded hover:bg-card-dark/50 focus:outline-none focus:ring-1 focus:ring-accent-dark/60"
                            title="Share"
                            aria-label="Share link to current time"
                        >
                            <Share size={16} className="text-playercardText-dark" />
                        </button>
                    </div>
                    <span className="text-sm text-accent-dark ml-2 min-w-[40px] text-right">{formatTime((!isPlaying && currentTime === 0 && duration > 0) ? duration : currentTime)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => seek(id, Number(e.target.value))}
                    className="w-full accent-accent-dark h-1 rounded bg-border-dark/30 mt-1"
                    aria-label="Seek audio"
                />
                {/* Bottom controls row for compact player: full-width A/B toggle */}
                {renderAdditionalControls && (
                    <div className="mt-2 w-full">
                        {renderAdditionalControls()}
                    </div>
                )}
                {copyToastVisible && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
                        <div
                            className="relative px-4 py-2 rounded-full text-sm font-semibold text-white bg-white/20 border border-white/30 shadow-xl"
                            role="status"
                            aria-live="polite"
                        >
                            Link copied
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Full-featured player
    return (
        <div id={`track-${id}`} ref={containerRef} onKeyDown={handleKeyDown} tabIndex={0} className={`relative audio-player-card ${compact ? 'p-2' : 'p-4'} ${className} outline-none focus:ring-1 focus:ring-accent-dark/60`}>
            {isAdmin && (
                <button
                    className="absolute top-2 right-2 z-10 text-red-400 hover:text-red-600 bg-black/40 rounded-full p-1.5 transition-colors flex items-center justify-center"
                    onClick={handleDelete}
                    disabled={deleteStatus === 'deleting'}
                    title="Delete track"
                    aria-label="Delete track"
                >
                    {deleteStatus === 'deleting' ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <X size={18} />
                    )}
                </button>
            )}
            {isAdmin && deleteStatus !== 'idle' && (
                <div className={`absolute top-10 right-2 text-xs px-2 py-1 rounded ${deleteStatus === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}
                     style={{ zIndex: 20 }}>
                    {deleteMsg}
                </div>
            )}
            <div className={`sm:p-4 md:p-4 p-1 max-h-30 sm:max-h-100 md:max-h-100 rounded-xl border border-border-dark shadow-xl transition-all duration-300 ease-in-out transform md:hover:scale-105 lg:hover:scale-105 disabled:opacity-50 audio-player max-w-sm sm:max-w-sm md:max-w-xs lg:max-w-lg flex flex-col w-full`}
                style={{
                    background: 'rgba(44,44,54,0.55)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3
                            className="flex-grow text-xl font-semibold text-playercardText-dark hover:text-accent-dark overflow-hidden min-h-[48px]"
                            title={title}
                            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                        >
                            <a
                                href={links.song || '#'}
                                className="block text-playercardText-dark hover:text-accent-dark transition-all duration-400"
                                onTouchStart={handleTitleTouchStart}
                                onTouchEnd={handleTitleTouchEnd}
                                onTouchCancel={handleTitleTouchEnd}
                            >
                                {title}
                            </a>
                        </h3>
                    </div>
                    <h4 className="truncate text-lg font-light text-playercardText-dark hover:text-accent-dark" title={artist}>
                        <a
                            href={links.artist || '#'}
                            className="max-w-xs opacity-80 text-playercardText-dark hover:text-accent-dark transition-all duration-300"
                        >
                            {artist}
                        </a>
                    </h4>
                </div>

                <div className="mb-2 mt-2 flex items-center text-base italic">
                    <span className="text-accent-dark">{formatTime(currentTime)}</span>
                    <div className="flex-grow mx-4 flex items-center justify-center">
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={(e) => seek(id, Number(e.target.value))}
                            className="w-full accent-accent-dark opacity-100 hover:cursor-pointer"
                        />
                    </div>
                    <span className="text-accent-dark">{formatTime(duration)}</span>
                </div>

                <section className="playerControls flex items-center col-auto">
                    <button
                        onClick={handlePlayPause}
                        className="py-1.5 w-full bg-button-dark text-buttonText-dark rounded-md hover:bg-accent-dark transition-all duration-300 ease-in-out transform hover:scale-95 disabled:opacity-50"
                    >
                        <div className="relative w-5 h-5 mx-auto">
                            <Play
                                className={`absolute top-0 left-0 w-5 h-5 transform transition-all duration-300 ease-in-out text-playicon-dark ${
                                    isPlaying ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                                }`}
                            />
                            <Pause
                                className={`absolute top-0 left-0 w-5 h-5 transform transition-all duration-300 ease-in-out text-playicon-dark ${
                                    isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                }`}
                            />
                        </div>
                    </button>
                    <div className="mt-1 ml-2 flex items-center gap-2">
                        {renderAdditionalControls && (
                            <span className="inline-flex items-center">{renderAdditionalControls()}</span>
                        )}
                        <button
                            onClick={() => copyDeepLink(true)}
                            className="p-1 rounded hover:bg-card-dark/50 focus:outline-none focus:ring-1 focus:ring-accent-dark/60"
                            title="Share"
                            aria-label="Share link to current time"
                        >
                            <Share size={16} className="text-playercardText-dark" />
                        </button>
                    </div>
                </section>

                {copyToastVisible && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
                        <div
                            className="relative px-4 py-2 rounded-full text-sm font-semibold text-white bg-white/20 border border-white/30 shadow-xl"
                            role="status"
                            aria-live="polite"
                        >
                            Link copied
                        </div>
                    </div>
                )}

                {error && <span className="sm text-red-500 mt-2">{error}</span>}
            </div>
        </div>
    );
};

export default BaseAudioPlayer; 