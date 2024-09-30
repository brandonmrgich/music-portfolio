import React, { useState, useCallback } from 'react';
import ABCAudioPlayer from './ABCAudioPlayer';

const AudioComparisonPlayer = (props) => {
    const [isBeforeAudio, setIsBeforeAudio] = useState(true);

    const toggleAudioSource = useCallback(() => {
        const { beforeSrc, afterSrc, play, id, seek, audioRefs } = props;
        const newSource = isBeforeAudio ? afterSrc : beforeSrc;

        console.log('AudioComparisonPlayer::toggelAudioSource(): ', { props });
        console.log('State: ');
        // TODO: There is no playingStates on the proprs. Pass from the ABC

        setIsBeforeAudio((prev) => !prev);

        if (props.playingStates[id]) {
            const currentTime = audioRefs.current[id] ? audioRefs.current[id].currentTime : 0;
            play(id, newSource);
            seek(id, currentTime);
        }
    }, [isBeforeAudio, props]);

    const renderAdditionalControls = () => (
        <div className="flex items-center">
            <button onClick={toggleAudioSource} className="bg-gray-300 px-3 py-1 rounded mr-2">
                {isBeforeAudio ? 'Before' : 'After'}
            </button>
        </div>
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
