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
const AudioComparisonPlayer = ({
    id,
    before,
    after,
    title,
    artist,
    links,
    compact = false,
    className = '',
}) => {
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
    const renderAdditionalControls = () => {
        if (compact) {
            // Full-width slim segmented toggle for compact cards (bottom row)
            return (
                <div className="w-full">
                    <div className="relative w-full h-8 rounded-md overflow-hidden border border-border-dark bg-card-dark/30">
                        <div className="absolute inset-0 grid grid-cols-2 text-sm">
                            <button
                                onClick={() => {
                                    if (!isBeforeAudio) handleToggle();
                                }}
                                className={`px-2 py-1 transition-colors focus:outline-none ${isBeforeAudio ? 'bg-accent-dark text-black' : 'text-playercardText-dark hover:bg-card-dark/50'}`}
                                aria-pressed={isBeforeAudio}
                                aria-label="Original"
                                title="Original"
                            >
                                Original
                            </button>
                            <button
                                onClick={() => {
                                    if (isBeforeAudio) handleToggle();
                                }}
                                className={`px-2 py-1 transition-colors focus:outline-none ${!isBeforeAudio ? 'bg-accent-dark text-black' : 'text-playercardText-dark hover:bg-card-dark/50'}`}
                                aria-pressed={!isBeforeAudio}
                                aria-label="Mastered"
                                title="Mastered"
                            >
                                Mastered
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        // Inline compact pill for full-size cards (placed next to Play)
        return (
            <div className="inline-flex items-center rounded-md border border-border-dark overflow-hidden text-sm">
                <button
                    onClick={() => {
                        if (!isBeforeAudio) handleToggle();
                    }}
                    className={`px-2 py-1 transition-colors focus:outline-none ${isBeforeAudio ? 'bg-accent-dark text-black' : 'text-playercardText-dark hover:bg-card-dark/50'}`}
                    aria-pressed={isBeforeAudio}
                    aria-label="Original"
                    title="Original"
                >
                    Original
                </button>
                <button
                    onClick={() => {
                        if (isBeforeAudio) handleToggle();
                    }}
                    className={`px-2 py-1 transition-colors focus:outline-none ${!isBeforeAudio ? 'bg-accent-dark text-black' : 'text-playercardText-dark hover:bg-card-dark/50'}`}
                    aria-pressed={!isBeforeAudio}
                    aria-label="Mastered"
                    title="Mastered"
                >
                    Mastered
                </button>
            </div>
        );
    };

    return (
        <BaseAudioPlayer
            id={id}
            src={isBeforeAudio ? before : after}
            title={title}
            artist={artist}
            links={links}
            renderAdditionalControls={renderAdditionalControls}
            onToggleSource={handleToggle}
            compact={compact}
            className={className}
        />
    );
};

export default AudioComparisonPlayer;
