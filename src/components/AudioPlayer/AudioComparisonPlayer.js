import React, { useState, useCallback, useEffect } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const AudioComparisonPlayer = ({ id, before, after, title, url }) => {
    const [isBeforeAudio, setIsBeforeAudio] = useState(true);
    const [currentSrc, setCurrentSrc] = useState(before);

    const toggleAudioSource = useCallback(() => {
        setIsBeforeAudio((prev) => !prev);
    }, []);

    const displayHint = useCallback(() => {}, []);

    useEffect(() => {
        setCurrentSrc(isBeforeAudio ? before : after);
        console.log('Set src to: ', { currentSrc });
    }, [isBeforeAudio, before, after]);

    const renderAdditionalControls = () => (
        <button
            onClick={toggleAudioSource}
            className="text-sm relative bg-none bg-opacity-90 text-comfy-dark px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-95 disabled:opacity-50 hover:cursor-pointer"
            onMouseOver={displayHint}
        >
            {/* TODO: toggle side by side*/}
            {isBeforeAudio ? (
                <div className="flex flex-grow row-auto">
                    <FaToggleOff className="text-red-500" />
                    <span>A</span>
                </div>
            ) : (
                <div>
                    <FaToggleOn className="text-green-500" />
                    <span>B</span>
                </div>
            )}
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
