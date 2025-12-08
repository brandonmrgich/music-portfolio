import React, { useState, useEffect } from 'react';
import BaseAudioPlayer from './BaseAudioPlayer';
import { Heart } from 'lucide-react';

/**
 * AudioPlayer - Wrapper for BaseAudioPlayer that adds like functionality.
 * Likes are stored in localStorage and are not synced with global audio state.
 * @param {object} props
 * @param {string|number} props.id - Track ID
 * @param {string} props.src - Audio source URL
 * @param {string} props.title - Track title
 * @param {string} props.artist - Track artist
 * @param {object} props.links - Track links (artist, song)
 */
const AudioPlayer = ({ id, src, title, artist, links }) => {
    // Local like state, unrelated to audio playback
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
        setHasLiked(likedTracks[title] || false);
        setLikes(likedTracks[title] ? 1 : 0);
    }, [title]);

    /**
     * Toggle like state for this track and persist to localStorage.
     */
    const handleLike = () => {
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
        const newLikedState = !hasLiked;
        likedTracks[title] = newLikedState;
        localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
        setHasLiked(newLikedState);
        setLikes(newLikedState ? likes + 1 : likes - 1);
    };

    /**
     * Render the like button and count.
     * @returns {JSX.Element}
     */
    const renderAdditionalControls = () => (
        <div className="inline-flex items-center gap-1">
            <button
                onClick={() => {
                    try {
                        const url = new URL(window.location.href);
                        url.searchParams.set('track', id);
                        url.searchParams.set('t', Math.floor(window?.__APP__?.audioCurrentTimes?.[id] || 0));
                        navigator.clipboard.writeText(url.toString());
                    } catch (_) {}
                }}
                className="px-2 py-0.5 text-xs text-playercardText-dark hover:bg-card-dark/50 rounded focus:outline-none focus:ring-1 focus:ring-accent-dark/60"
                title="Share"
                aria-label="Share link to current time"
            >
                Link
            </button>
            <button
                onClick={handleLike}
                className="relative bg-none text-playercardText-dark hover:scale-110 transition-transform px-1 py-0"
                aria-label="Like"
                title="Like"
            >
                <div className="flex items-center gap-1">
                    <Heart
                        className={`w-4 h-4 text-accent-dark hover:text-red-500 ${hasLiked ? 'fill-current text-red-500' : 'fill-none'}`}
                    />
                    <span className="text-xs text-playercardText-dark">{likes}</span>
                </div>
            </button>
        </div>
    );

    return (
        <BaseAudioPlayer
            id={id}
            src={src}
            title={title}
            artist={artist}
            links={links}
            renderAdditionalControls={renderAdditionalControls}
        />
    );
};

export default AudioPlayer;
