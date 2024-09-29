import React from "react";
import { useAudio } from "../../contexts/AudioContext";

const withAudioContext = (WrappedComponent) => (props) => {
    const { playingStates, play, pause, seek, stop, audioRefs } = useAudio();
    return (
        <WrappedComponent
            {...props}
            playingStates={playingStates}
            play={play}
            pause={pause}
            seek={seek}
            stop={stop}
            audioRefs={audioRefs}
        />
    );
};

export default withAudioContext;
