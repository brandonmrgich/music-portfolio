import React from "react";
import ABCAudioPlayer from "./ABCAudioPlayer";
import withAudioContext from "./withAudioContext";

class AudioComparisonPlayer extends ABCAudioPlayer {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            isBeforeAudio: true,
        };
    }

    toggleAudioSource = () => {
        const { isBeforeAudio } = this.state;
        const { beforeSrc, afterSrc, play, id, currentAudio } = this.props;
        const newSource = isBeforeAudio ? afterSrc : beforeSrc;

        this.setState({ isBeforeAudio: !isBeforeAudio }, () => {
            if (this.props.globalIsPlaying && this.props.currentPlayingId === id) {
                const currentTime = currentAudio ? currentAudio.currentTime : 0;
                play(id, newSource);
                this.props.seek(currentTime);
            }
        });
    };

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

export default withAudioContext(AudioComparisonPlayer);
