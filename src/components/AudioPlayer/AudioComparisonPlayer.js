import React, { useState, useCallback, useEffect } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useAudio } from '../../contexts/AudioContext';

const AudioComparisonPlayer = ({ id, before, after, title, artist, links }) => {
    //const [currentSrc, setCurrentSrc] = useState(before);

    const { toggleSource } = useAudio();
    const [isBeforeAudio, setIsBeforeAudio] = useState(true);

    const handleToggle = () => {
        toggleSource(id, before, after, isBeforeAudio);
        setIsBeforeAudio(!isBeforeAudio);
    };

    const renderAdditionalControls = () => (
        <button
            onClick={handleToggle}
            className="text-sm relative bg-none bg-opacity-90 text-comfy-dark px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-95 disabled:opacity-50 hover:cursor-pointer"
        >
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
            src={isBeforeAudio ? before : after}
            title={title}
            artist={artist}
            links={links}
            renderAdditionalControls={renderAdditionalControls}
        />
    );
};

export default AudioComparisonPlayer;
