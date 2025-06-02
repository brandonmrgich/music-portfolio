import React from 'react';
import { Play, Pause, Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';

/**
 * GlobalAudioBar - Persistent audio bar at the bottom of the app.
 * Shows and controls the currently playing track using global audio context.
 * @returns {JSX.Element|null}
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

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-comfy-accent2 bg-opacity-95 shadow-lg flex items-center px-4 py-2 border-t border-comfy-dark">
            <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate font-semibold text-comfy-accent1 text-base max-w-xs">
                        <a href={links?.song || '#'} target="_blank" rel="noopener noreferrer">
                            {title}
                        </a>
                    </span>
                    <span className="truncate text-comfy-dark text-sm opacity-80 max-w-xs">
                        <a href={links?.artist || '#'} target="_blank" rel="noopener noreferrer">
                            {artist}
                        </a>
                    </span>
                </div>
                <div className="flex items-center gap-2 w-full">
                    <span className="text-comfy-accent2 text-xs">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => seek(id, Number(e.target.value))}
                        className="flex-grow accent-comfy-accent2 opacity-60 hover:cursor-pointer mx-2"
                    />
                    <span className="text-comfy-accent2 text-xs">{formatTime(duration)}</span>
                </div>
            </div>
            <button
                onClick={() => (isPlaying ? pause(id) : play(id, src, { title, artist, links }))}
                className="mx-2 p-2 rounded-full bg-comfy-accent1 text-comfy-dark hover:bg-comfy-accent2 transition"
            >
                {isPlaying ? <Pause /> : <Play />}
            </button>
            <div className="flex items-center gap-2">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(id, parseFloat(e.target.value))}
                    className="w-20 accent-comfy-accent2 opacity-60 hover:cursor-pointer"
                />
                {renderVolumeIcon()}
            </div>
        </div>
    );
};

export default GlobalAudioBar; 