import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, LoaderCircle } from 'lucide-react';
import withAudioContext from './withAudioContext';

const ABCAudioPlayer = ({
    id,
    src,
    title,
    url,
    audioRefs,
    playingStates,
    play,
    pause,
    seek,
    stop,
    renderAdditionalControls,
}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadedMetadata = useCallback(() => {
        if (audioRefs.current[id]) {
            setDuration(audioRefs.current[id].duration);
        }
    }, [audioRefs, id]);

    const handleTimeUpdate = useCallback(() => {
        if (audioRefs.current[id]) {
            setCurrentTime(audioRefs.current[id].currentTime);
        }
    }, [audioRefs, id]);

    useEffect(() => {
        audioRefs.current[id] = new Audio(src);

        if (audioRefs.current[id]) {
            audioRefs.current[id].addEventListener('loadedmetadata', handleLoadedMetadata);
            audioRefs.current[id].addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (audioRefs.current[id]) {
                audioRefs.current[id].removeEventListener('loadedmetadata', handleLoadedMetadata);
                audioRefs.current[id].removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [audioRefs, id, src, handleLoadedMetadata, handleTimeUpdate]);

    const togglePlayPause = useCallback(() => {
        if (playingStates[id]) {
            pause(id);
        } else {
            setIsLoading(true);
            setError('');
            play(id, src);
            setIsLoading(false);
        }
    }, [id, playingStates, pause, play, src]);

    const handleSeek = useCallback(
        (e) => {
            seek(id, parseFloat(e.target.value));
        },
        [id, seek]
    );

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isPlaying = playingStates[id] || false;

    return (
        <div className="p-4 rounded-lg mb-4 flex-shrink border border-comfy-dark bg-comfy-accent2 bg-opacity-5 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 audio-player">
            <h3 className="text-lg font-semibold mb-2 text-white">
                <a
                    href={url || '#'}
                    className="text-comfy-accent1 hover:text-comfy-accent2 transition-colors"
                >
                    {title}
                </a>
            </h3>
            <div className="flex flex-shrink items-center text-gray-400">
                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="relative bg-comfy-accent2 bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50"
                >
                    {isLoading ? (
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                    ) : (
                        <div className="relative w-5 h-5">
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
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-grow mx-3 accent-comfy-accent2 opacity-60"
                />
                {renderAdditionalControls()}
                <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
            {error && <span className="text-red-500 mt-2">{error}</span>}
        </div>
    );
};

export default withAudioContext(ABCAudioPlayer);
