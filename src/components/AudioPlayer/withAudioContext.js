import React from "react";
import { useAudio } from "../../contexts/AudioContext";

const withAudioContext = (WrappedComponent) => (props) => {
    const audioContext = useAudio();
    return <WrappedComponent {...props} {...audioContext} />;
};

export default withAudioContext;
