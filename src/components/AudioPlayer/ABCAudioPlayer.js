import React, { Component } from "react";
import { Play, Pause } from "lucide-react";

class BaseAudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            error: "",
            isLoading: false,
        };
        this.audioRef = React.createRef();
    }

    componentDidMount() {
        this.audioRef.current.addEventListener("timeupdate", this.handleTimeUpdate);
        this.audioRef.current.addEventListener("loadedmetadata", this.handleLoadedMetadata);
    }

    componentWillUnmount() {
        this.audioRef.current.removeEventListener("timeupdate", this.handleTimeUpdate);
        this.audioRef.current.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
    }

    handleTimeUpdate = () => {
        this.setState({ currentTime: this.audioRef.current.currentTime });
    };

    handleLoadedMetadata = () => {
        this.setState({ duration: this.audioRef.current.duration });
    };

    togglePlayPause = () => {
        if (this.state.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    };

    play = () => {
        this.setState({ isLoading: true, error: "" });

        const playPromise = this.audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.setState({ isPlaying: true, isLoading: false });
                })
                .catch((error) => {
                    console.error("Playback failed:", error);
                    this.setState({
                        isPlaying: false,
                        isLoading: false,
                        error: "Failed to play track, please try again later.",
                    });
                });
        }
    };

    pause = () => {
        this.audioRef.current.pause();
        this.setState({ isPlaying: false });
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
        const { isPlaying, currentTime, duration, error, isLoading } = this.state;
        const { title, audioSrc } = this.props;

        return (
            <div className="audio-player p-4 rounded-lg mb-4 flex-shrink border border-comfy-dark bg-comfy-accent2 bg-opacity-5 shadow-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">
                    <a
                        href="https://google.com/"
                        className="text-comfy-accent1 hover:text-comfy-accent2 transition-colors"
                    >
                        {title}
                    </a>
                </h3>
                <audio
                    ref={this.audioRef}
                    src={audioSrc}
                    className="w-full mb-3 rounded-lg border border-gray-700 bg-gray-900"
                />
                <div className="flex items-center text-gray-400">
                    <button
                        onClick={this.togglePlayPause}
                        disabled={isLoading}
                        className="bg-comfy-accent2 bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Loading..." : isPlaying ? <Pause /> : <Play />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={this.handleSeek}
                        className="flex-grow mx-3 accent-comfy-accent2 opacity-60"
                    />
                    <span className="text-sm">
                        {this.formatTime(currentTime)} / {this.formatTime(duration)}
                    </span>
                </div>
                {error && <span className="text-red-500 mt-2">{error}</span>}
                <div className="mt-3">{this.renderAdditionalControls()}</div>
            </div>
        );
    }
}

export default BaseAudioPlayer;
