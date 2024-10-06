import React, { useState, useEffect } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';
import { Heart } from 'lucide-react';

const AudioPlayer = ({ id, src, title, url }) => {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
        setHasLiked(likedTracks[title] || false);
        setLikes(likedTracks[title] ? 1 : 0);
    }, [title]);

    const handleLike = () => {
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
        const newLikedState = !hasLiked;
        likedTracks[title] = newLikedState;
        localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
        setHasLiked(newLikedState);
        setLikes(newLikedState ? likes + 1 : likes - 1);
    };

    const renderAdditionalControls = () => (
        <button
            onClick={handleLike}
            className="relative bg-none bg-opacity-80 text-comfy-dark px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 hover:cursor-pointer"
        >
            <div className="relative">
                <Heart
                    className={`w-5 h-5 text-red-500 ${hasLiked ? 'fill-current' : 'fill-none'}`}
                />
                <span className="text-sm text-comfy-dark">{likes}</span>
            </div>
        </button>
    );

    return (
        <ABCAudioPlayer
            id={id}
            src={src}
            title={title}
            url={url}
            renderAdditionalControls={renderAdditionalControls}
        />
    );
};

export default AudioPlayer;
