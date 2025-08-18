import React, { useState } from 'react';
import BaseAudioPlayer from './BaseAudioPlayer';
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
const AudioComparisonPlayer = ({ id, before, after, title, artist, links, compact = false, className = '' }) => {
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
        <div className="inline-flex items-center bg-primary-dark2/40 rounded-md border border-border-dark overflow-hidden">
            <button
                onClick={() => { if (!isBeforeAudio) handleToggle(); }}
                className={`px-2 py-1 text-xs transition-colors ${isBeforeAudio ? 'bg-accent-dark text-black' : 'text-playercardText-dark hover:bg-primary-dark2/60'}`}
                aria-pressed={isBeforeAudio}
                title="Original"
            >
                A
            </button>
            <button
                onClick={() => { if (isBeforeAudio) handleToggle(); }}
                className={`px-2 py-1 text-xs transition-colors ${!isBeforeAudio ? 'bg-accent-dark text-black' : 'text-playercardText-dark hover:bg-primary-dark2/60'}`}
                aria-pressed={!isBeforeAudio}
                title="Mastered"
            >
                B
            </button>
        </div>
    );

    return (
        <BaseAudioPlayer
            id={id}
            src={isBeforeAudio ? before : after}
            title={title}
            artist={artist}
            links={links}
            renderAdditionalControls={renderAdditionalControls}
            compact={compact}
            className={className}
        />
    );
};

export default AudioComparisonPlayer;
