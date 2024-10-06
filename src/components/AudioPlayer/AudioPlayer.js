import React, { useState, useEffect } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';

import { Heart } from 'lucide-react';

const AudioPlayer = (props) => {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
        setHasLiked(likedTracks[props.title] || false);
        setLikes(likedTracks[props.title] ? 1 : 0);
    }, []);

    const handleLike = () => {
        console.log('Handling like');
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
        if (!hasLiked) {
            likedTracks[props.title] = true;
            setHasLiked(true);
            setLikes(likes + 1);
        } else {
            likedTracks[props.title] = false;
            setHasLiked(false);
            setLikes(likes - 1);
        }
        localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
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

    return <ABCAudioPlayer {...props} renderAdditionalControls={renderAdditionalControls} />;
};

export default AudioPlayer;
