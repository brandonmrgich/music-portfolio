import React, { Component } from "react";
import { Play, Pause } from "lucide-react";

class BaseAudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
        };
        this.audioRef = React.createRef();
    }

    componentDidMount() {
        this.audioRef.current.addEventListener(
            "timeupdate",
            this.handleTimeUpdate,
        );
        this.audioRef.current.addEventListener(
            "loadedmetadata",
            this.handleLoadedMetadata,
        );
    }

    componentWillUnmount() {
        this.audioRef.current.removeEventListener(
            "timeupdate",
            this.handleTimeUpdate,
        );
        this.audioRef.current.removeEventListener(
            "loadedmetadata",
            this.handleLoadedMetadata,
        );
    }

    handleTimeUpdate = () => {
        this.setState({ currentTime: this.audioRef.current.currentTime });
    };

    handleLoadedMetadata = () => {
        this.setState({ duration: this.audioRef.current.duration });
    };

    togglePlayPause = () => {
        if (this.state.isPlaying) {
            this.audioRef.current.pause();
        } else {
            this.audioRef.current.play();
        }
        this.setState((prevState) => ({ isPlaying: !prevState.isPlaying }));
    };

    handleSeek = (e) => {
        const seekTime = e.target.value;
        this.audioRef.current.currentTime = seekTime;
        this.setState({ currentTime: seekTime });
    };

    formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    renderAdditionalControls() {
        return null;
    }

    render() {
        const { isPlaying, currentTime, duration } = this.state;
        const { title, audioSrc } = this.props;

        return (
            <div className="audio-player bg-gray-100 p-4 rounded mb-4">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <audio
                    ref={this.audioRef}
                    src={audioSrc}
                    className="w-full mb-2"
                />
                <div className="flex items-center">
                    <button
                        onClick={this.togglePlayPause}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                        {isPlaying ? <Pause /> : <Play />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={this.handleSeek}
                        className="flex-grow mr-2"
                    />
                    <span className="text-sm">
                        {this.formatTime(currentTime)} /{" "}
                        {this.formatTime(duration)}
                    </span>
                </div>
                <div className="mt-2">{this.renderAdditionalControls()}</div>
            </div>
        );
    }
}

export default BaseAudioPlayer;
