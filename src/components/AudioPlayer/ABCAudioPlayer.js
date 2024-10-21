import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, LoaderCircle } from 'lucide-react';
import { useAudio } from '../../Hooks'; // New custom hook

const ABCAudioPlayer = ({ id, src, title, url, renderAdditionalControls }) => {
    const {
        audioRef,
        isPlaying,
        currentTime,
        duration,
        error,
        isLoading,
        togglePlayPause,
        handleSeek,
    } = useAudio(id, src);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    error && console.log(error);

    return (
        <div className="p-4 rounded-lg mb-4 border border-comfy-dark bg-comfy-accent2 bg-opacity-5 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 audio-player max-w-sm sm:max-w-sm md:max-w-xs lg:max-w-lg flex flex-col justify-between">
            <div className="flex justify-between items-start snap-start mb-2">
                <h3 className="truncate text-lg font-semibold text-white hover:text-pretty transition-all duration-700">
                    <a
                        href={url || '#'}
                        className="text-comfy-accent1 hover:text-comfy-accent2 transition-all duration-300"
                    >
                        {title}
                    </a>
                </h3>
            </div>

            <div className="flex items-center mb-2 py-1 text-sm italic">
                <span className="text-comfy-accent2">{formatTime(currentTime)}</span>
                <div className="flex-grow mx-4 flex items-center justify-center">
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full accent-comfy-accent2 opacity-60 hover:cursor-pointer"
                    />
                </div>
                <span className="text-comfy-accent2">{formatTime(duration)}</span>
            </div>

            <section className="playerControls flex items-center col-auto">
                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="w-full bg-comfy-accent2 bg-opacity-50 text-comfy-dark py-2 rounded-md hover:bg-opacity-70 transition-all duration-300 ease-in-out transform hover:scale-95 disabled:opacity-50"
                >
                    {isLoading ? (
                        <LoaderCircle className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
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
                    )}
                </button>

                <div className="mt-1">{renderAdditionalControls && renderAdditionalControls()}</div>
            </section>

            {error && <span className="sm text-red-500 mt-2">{error}</span>}
        </div>
    );
};

export default ABCAudioPlayer;
