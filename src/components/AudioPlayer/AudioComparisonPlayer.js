import React from "react";
import ABCAudioPlayer from "./ABCAudioPlayer";

class AudioComparisonPlayer extends ABCAudioPlayer {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            isBeforeAudio: true,
        };
    }

    toggleAudioSource = () => {
        const { isBeforeAudio, currentTime } = this.state;
        const newSource = isBeforeAudio ? this.props.afterSrc : this.props.beforeSrc;

        //this.audioRef.current.pause(); // Pause the current audio
        this.pause();
        this.setState({ src: newSource, isBeforeAudio: !isBeforeAudio, currentTime });
        this.play();
    };

    // TODO: Phase out
    //getCurrentAudioSource = () => {
    //    const { isBeforeAudio } = this.state;
    //    const { beforeSrc, afterSrc } = this.props;
    //    console.log({ beforeSrc }, { afterSrc });
    //    return isBeforeAudio ? beforeSrc : afterSrc;
    //};

    renderAdditionalControls() {
        const { isBeforeAudio } = this.state;
        return (
            <div className="flex items-center">
                <button
                    onClick={this.toggleAudioSource}
                    className="bg-gray-300 px-3 py-1 rounded mr-2"
                >
                    {isBeforeAudio ? "Before" : "After"}
                </button>
            </div>
        );
    }
}

export default AudioComparisonPlayer;
