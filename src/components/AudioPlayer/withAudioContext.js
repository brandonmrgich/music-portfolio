import React from "react";
import { useAudio } from "../../contexts/AudioContext";

const withAudioContext = (WrappedComponent) => (props) => {
    const { playingStates, play, pause, seek, stop, audioRefs } = useAudio();
    console.log("withAudioContext::construction: Wrapped this prop: ", { props });
    console.log("withAudioContext::construction: ", { play, pause, seek, stop, audioRefs });
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
