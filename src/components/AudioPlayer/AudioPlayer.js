import React, { useState, useEffect } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';

const AudioPlayer = (props) => {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
        setHasLiked(likedTracks[props.title] || false);
        setLikes(likedTracks[props.title] ? 1 : 0);
    }, [props.title]);

    const handleLike = () => {
        if (!hasLiked) {
            const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '{}');
            likedTracks[props.title] = true;
            localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
            setHasLiked(true);
            setLikes(1);
        }
    };

    const renderAdditionalControls = () => (
        <button
            onClick={handleLike}
            disabled={hasLiked}
            className="bg-comfy-accent2 bg-opacity-50 px-2 py-1 rounded text-comfy-dark hover:cursor-pointer"
        >
            Like ({likes})
        </button>
    );

    return <ABCAudioPlayer {...props} renderAdditionalControls={renderAdditionalControls} />;
};

export default AudioPlayer;
