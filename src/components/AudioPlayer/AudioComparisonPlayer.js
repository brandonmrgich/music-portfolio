import React, { useState, useCallback, useEffect } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';

const AudioComparisonPlayer = ({ id, before, after, title, url }) => {
    const [isBeforeAudio, setIsBeforeAudio] = useState(true);
    const [currentSrc, setCurrentSrc] = useState(before);

    const toggleAudioSource = useCallback(() => {
        setIsBeforeAudio((prev) => !prev);
    }, []);

    useEffect(() => {
        setCurrentSrc(isBeforeAudio ? before : after);
        console.log('Set src to: ', { currentSrc });
    }, [isBeforeAudio, before, after]);

    const renderAdditionalControls = () => (
        <button
            onClick={toggleAudioSource}
            className="relative bg-none bg-opacity-80 text-comfy-dark px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 hover:cursor-pointer"
        >
            {isBeforeAudio ? 'Before' : 'After'}
        </button>
    );

    return (
        <ABCAudioPlayer
            id={id}
            src={currentSrc}
            title={title}
            url={url}
            renderAdditionalControls={renderAdditionalControls}
        />
    );
};

export default AudioComparisonPlayer;
