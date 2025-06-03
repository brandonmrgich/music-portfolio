import React, { useState, useEffect } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';
import { Heart } from 'lucide-react';

/**
 * AudioPlayer - Wrapper for ABCAudioPlayer that adds like functionality.
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
        <button
            onClick={handleLike}
            className="relative bg-none bg-opacity-80 text-text-light dark:text-text-dark transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 hover:cursor-pointer px-2 py-0"
        >
            <div className="relative justify-between items-start">
                <Heart
                    className={`w-5 h-5 text-accent-light dark:text-accent-dark hover:text-red-500 transition-color duration-500 ${hasLiked ? 'fill-current text-red-500' : 'fill-none'}`}
                />
                <span className="text-sm text-text-light dark:text-text-dark">{likes}</span>
            </div>
        </button>
    );

    return (
        <ABCAudioPlayer
            id={id}
            src={src}
            title={title}
            artist={artist}
            links={links}
            meta={{ title, artist, links }}
            // renderAdditionalControls={renderAdditionalControls}
        />
    );
};

export default AudioPlayer;
