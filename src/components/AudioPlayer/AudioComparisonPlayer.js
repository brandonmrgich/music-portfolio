import React, { useState } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useAudio } from '../../contexts/AudioContext';

/**
 * AudioComparisonPlayer - Audio player for A/B comparison of two tracks (before/after).
 * Allows toggling between two sources for the same track card.
 * @param {object} props
 * @param {string|number} props.id - Track ID
 * @param {string} props.before - Source URL for 'before' audio
 * @param {string} props.after - Source URL for 'after' audio
 * @param {string} props.title - Track title
 * @param {string} props.artist - Track artist
 * @param {object} props.links - Track links (artist, song)
 */
const AudioComparisonPlayer = ({ id, before, after, title, artist, links }) => {
    const { toggleSource } = useAudio();
    const [isBeforeAudio, setIsBeforeAudio] = useState(true);

    /**
     * Toggle between before and after audio sources for this track.
     */
    const handleToggle = () => {
        toggleSource(id, before, after, isBeforeAudio);
        setIsBeforeAudio(!isBeforeAudio);
    };

    /**
     * Render the A/B toggle button.
     * @returns {JSX.Element}
     */
    const renderAdditionalControls = () => (
        <button
            onClick={handleToggle}
            className="text-sm relative bg-none bg-opacity-90 text-text-light dark:text-text-dark px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-95 disabled:opacity-50 hover:cursor-pointer"
        >
            {isBeforeAudio ? (
                <div className="flex flex-grow row-auto">
                    <FaToggleOff className="text-accent-light dark:text-accent-dark" />
                    <span>A</span>
                </div>
            ) : (
                <div>
                    <FaToggleOn className="text-accent-light dark:text-accent-dark" />
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
            meta={{ title, artist, links }}
            renderAdditionalControls={renderAdditionalControls}
        />
    );
};

export default AudioComparisonPlayer;
