import React from 'react';
import { useAudio } from '../../contexts/AudioContext';

const withAudioContext = (WrappedComponent) => {
    return (props) => {
        const audioContext = useAudio();
        return <WrappedComponent {...props} {...audioContext} />;
    };
};

export default withAudioContext;
