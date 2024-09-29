import React, { Component } from "react";
import { Play, Pause, LoaderCircle, SquareIcon as Stop } from "lucide-react";

class ABCAudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            duration: 0,
            error: "",
            isLoading: false,
        };
        //this.intervalId = null;
        console.log("ABCAudioPlayer::constructor(): ", { props });
    }

    componentDidMount() {
        const { id, audioRefs } = this.props; // AudioRef is coming from context
        if (audioRefs.current[id]) {
            audioRefs.current[id].addEventListener("loadedmetadata", this.handleLoadedMetadata);
            audioRefs.current[id].addEventListener("timeupdate", this.handleTimeUpdate);
        }
    }

    componentDidUpdate() {
        const { id, audioRefs } = this.props; // AudioRef is coming from context
        let props = this.props;
        let state = this.state;
        console.log("ABCAudioPlayer::componentDidUpdate(): State, props: ", { state, props });

        //if (audioRefs.current[id]) {
        //}
    }

    componentWillUnmount() {
        const { id, audioRefs } = this.props;
        if (audioRefs.current[id]) {
            audioRefs.current[id].removeEventListener("loadedmetadata", this.handleLoadedMetadata);
            audioRefs.current[id].removeEventListener("timeupdate", this.handleTimeUpdate);
        }
    }

    handleTimeUpdate = () => {
        const { id, audioRefs } = this.props;
        if (audioRefs.current[id]) {
            this.setState({ currentTime: audioRefs.current[id].currentTime });
        }
    };

    handleLoadedMetadata = () => {
        const { id, audioRefs } = this.props;
        if (audioRefs.current[id]) {
            this.setState({ duration: audioRefs.current[id].duration });
        }
    };

    togglePlayPause = () => {
        const { playingStates, id, play, pause, src } = this.props;
        if (playingStates[id]) {
            pause(id);
        } else {
            this.setState({ isLoading: true, error: "" });
            play(id, src);
            this.setState({ isLoading: false });
        }
    };

    handleStop = () => {
        const { stop, id } = this.props;

        console.log("ABCAudioPlayer::handleStop(): ", { stop });
        stop(id);
    };

    handleSeek = (e) => {
        console.log("Seeking");
        const { seek, id } = this.props;
        seek(id, parseFloat(e.target.value));
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
        const { title, url, id, playingStates } = this.props;

        const isPlaying = playingStates[id] || false;

        console.log("ABCAudioPlayer::render(): Data: ", {
            currentTime,
            duration,
            error,
            isLoading,
        });

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
                        {isLoading ? (
                            <LoaderCircle />
                        ) : isPlaying ? (
                            <Pause className="size-5" />
                        ) : (
                            <Play className="size-5" />
                        )}
                    </button>
                    <button
                        onClick={this.handleStop}
                        className="bg-comfy-accent2 bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors ml-2"
                    >
                        <Stop className="size-5" />
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
