import React, { useState, useCallback } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';

const AudioComparisonPlayer = (props) => {
    const [isBeforeAudio, setIsBeforeAudio] = useState(true);

    const toggleAudioSource = useCallback(() => {
        const { beforeSrc, afterSrc, play, id, seek, audioRefs } = props;
        const newSource = isBeforeAudio ? afterSrc : beforeSrc;

        console.log('AudioComparisonPlayer::toggelAudioSource(): ', { props });
        // TODO: There is no playingStates on the props. Pass from the ABC
        // This is if we want to check the current playing state prior to doing the switch,
        // however this will work for now...

        setIsBeforeAudio((prev) => !prev);

        const currentTime = audioRefs.current[id] ? audioRefs.current[id].currentTime : 0;
        console.log('Attemping play on toggle');
        play(id, newSource);
        seek(id, currentTime);
    }, [isBeforeAudio, props]);

    const renderAdditionalControls = () => (
        <button
            onClick={toggleAudioSource}
            className="relative bg-none bg-opacity-80 text-comfy-dark px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 hover:cursor-pointer"
        >
            {isBeforeAudio ? 'Before' : 'After'}

            {/*<div className="relative">
                <Heart
                    className={`w-5 h-5 text-red-500 ${hasLiked ? 'fill-current' : 'fill-none'}`}
                />
                <span className="text-sm text-comfy-dark">{likes}</span>
            </div>*/}
        </button>
    );

    return (
        <ABCAudioPlayer
            {...props}
            src={isBeforeAudio ? props.beforeSrc : props.afterSrc}
            renderAdditionalControls={renderAdditionalControls}
        />
    );
};

export default AudioComparisonPlayer;
