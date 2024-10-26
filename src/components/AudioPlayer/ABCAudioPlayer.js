import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, LoaderCircle, Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';

// TODO: Add optional image, default is current theme, else if image, set as player card background
// with opacity lowered
const ABCAudioPlayer = ({ id, src, title, artist, links, renderAdditionalControls }) => {
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
        initializeAudio,
    } = useAudio();

    const isPlaying = playingStates[id];
    const currentTime = currentTimes[id] || 0;
    const duration = durations[id] || 0;
    const volume = volumes[id] || 0.5;
    const [volumeOpen, setVolumeOpen] = useState(false);

    const openVolume = () => setVolumeOpen(true);
    const closeVolume = () => setVolumeOpen(false);
    const volumeRef = useRef(null);

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

    useEffect(() => {
        initializeAudio(id, src);
    }, [src]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    error && console.log(error);

    return (
        <div className="sm:p-4 md:p-4 p-1 max-h-30 sm:max-h-100 md:max-h-100 rounded-lg border border-comfy-dark bg-comfy-accent2 bg-opacity-5 shadow-lg transition-all duration-300 ease-in-out transform md:hover:scale-110 lg:hover:scale-110 disabled:opacity-50 audio-player max-w-sm sm:max-w-sm md:max-w-xs lg:max-w-lg flex flex-col justify-between">
            <div className="flex justify-between items-start snap-start">
                <h3 className="truncate md:max-w-30 lg:max-w-m text-lg font-semibold text-white hover:text-pretty transition-all duration-700">
                    <a
                        href={links.song || '#'}
                        className="max-w-xs text-comfy-accent1 hover:text-comfy-accent2 transition-all duration-300"
                    >
                        {title}
                    </a>
                </h3>

                <div className="flex justify-between items-start">
                    {volumeOpen && (
                        <input
                            ref={volumeRef}
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(id, parseFloat(e.target.value))}
                            className="max-w-s md:max-w-30 lg:max-w-20 accent-comfy-accent2 opacity-60 hover:cursor-pointer col-end-1 "
                        />
                    )}

                    <button onClick={openVolume}>
                        {volume <= 0 ? (
                            <VolumeX />
                        ) : volume > 0 && volume <= 33 ? (
                            <Volume />
                        ) : volume > 33 && volume <= 66 ? (
                            <Volume1 />
                        ) : (
                            <Volume2 />
                        )}
                    </button>
                </div>
            </div>

            <h4 className="mb-2 truncate md:max-w-30 lg:max-w-sm text-md font-light text-white hover:text-pretty transition-all duration-700">
                <a
                    href={links.artist || '#'}
                    className="max-w-xs opacity-80 text-comfy-accent1 hover:text-comfy-accent2 transition-all duration-300"
                >
                    {artist}
                </a>
            </h4>

            <div className="mb-2 mt-2 flex items-center text-sm italic">
                <span className="text-comfy-accent2">{formatTime(currentTime)}</span>
                <div className="flex-grow mx-4 flex items-center justify-center">
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => seek(id, e.target.value)}
                        className="w-full accent-comfy-accent2 opacity-60 hover:cursor-pointer"
                    />
                </div>
                <span className="text-comfy-accent2">{formatTime(duration)}</span>
            </div>

            <section className="playerControls flex items-center col-auto">
                <button
                    onClick={() => (isPlaying ? pause(id) : play(id, src))}
                    className="py-1.5 w-full bg-comfy-accent2 bg-opacity-50 text-comfy-dark
                    rounded-md hover:bg-opacity-70 transition-all duration-300 ease-in-out transform
                    hover:scale-95 disabled:opacity-50"
                >
                    <div className="relative w-5 h-5 mx-auto">
                        <Play
                            className={`absolute top-0 left-0 w-5 h-5 transform transition-all duration-300 ease-in-out ${
                                isPlaying ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                            }`}
                        />
                        <Pause
                            className={`absolute top-0 left-0 w-5 h-5 transform transition-all duration-300 ease-in-out ${
                                isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                            }`}
                        />
                    </div>
                </button>

                <div className="mt-1">{renderAdditionalControls && renderAdditionalControls()}</div>
            </section>

            {error && <span className="sm text-red-500 mt-2">{error}</span>}
        </div>
    );
};

export default ABCAudioPlayer;
