import React, { Component } from "react";
import { Play, Pause, LoaderCircle } from "lucide-react";
import { useAudio } from "../../contexts/AudioContext"; // Import the context
import withAudioContext from "./withAudioContext";

class ABCAudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            duration: 0,
            error: "",
            isLoading: false,
        };
        this.intervalId = null;
    }

    componentDidMount() {
        const { audioRef } = this.props; // AudioRef is coming from context
        if (audioRef && audioRef.current) {
            audioRef.current.addEventListener("loadedmetadata", this.handleLoadedMetadata);
            this.startTimeUpdate();
        }
    }

    componentWillUnmount() {
        const { audioRef } = this.props;
        if (audioRef && audioRef.current) {
            audioRef.current.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
            this.stopTimeUpdate();
        }
    }

    startTimeUpdate = () => {
        const { audioRef, currentPlayingId, id } = this.props;
        this.intervalId = setInterval(() => {
            if (audioRef && audioRef.current && currentPlayingId === id) {
                this.setState({ currentTime: audioRef.current.currentTime });
            }
        }, 1000);
    };

    stopTimeUpdate = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };

    handleLoadedMetadata = () => {
        const { audioRef, currentPlayingId, id } = this.props;
        if (audioRef && audioRef.current && currentPlayingId === id) {
            this.setState({ duration: audioRef.current.duration });
        }
    };

    togglePlayPause = () => {
        const { globalIsPlaying, currentPlayingId, id, play, pause, src } = this.props;
        if (globalIsPlaying && currentPlayingId === id) {
            pause();
        } else {
            this.setState({ isLoading: true, error: "" });
            play(id, src);
            this.setState({ isLoading: false });
        }
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
        const { currentTime, duration, error, isLoading } = this.state;
        const { title, url, id, globalIsPlaying, currentPlayingId } = this.props;

        const isThisPlaying = globalIsPlaying && currentPlayingId === id;

        return (
            <div className="audio-player p-4 rounded-lg mb-4 flex-shrink border border-comfy-dark bg-comfy-accent2 bg-opacity-5 shadow-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">
                    <a
                        href={url || "#"}
                        className="text-comfy-accent1 hover:text-comfy-accent2 transition-colors"
                    >
                        {title}
                    </a>
                </h3>
                <div className="flex flex-shrink items-center text-gray-400">
                    <button
                        onClick={this.togglePlayPause}
                        disabled={isLoading}
                        className="bg-comfy-accent2 bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <LoaderCircle /> : isThisPlaying ? <Pause /> : <Play />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={this.handleSeek}
                        className="flex-grow mx-3 accent-comfy-accent2 opacity-60"
                    />
                    <span className="text-sm ">
                        {this.formatTime(currentTime)} / {this.formatTime(duration)}
                    </span>
                </div>
                {error && <span className="text-red-500 mt-2">{error}</span>}
                <div className="mt-3">{this.renderAdditionalControls()}</div>
            </div>
        );
    }
}

export default ABCAudioPlayer;
