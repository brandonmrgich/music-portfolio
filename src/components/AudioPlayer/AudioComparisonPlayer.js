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
        this.setState((prevState) => ({
            isBeforeAudio: !prevState.isBeforeAudio,
        }));
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

export default AudioComparisonPlayer;
