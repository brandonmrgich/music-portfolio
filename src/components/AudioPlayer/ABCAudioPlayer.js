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
    }

    componentDidMount() {
        const { id, audioRefs, src } = this.props; // AudioRef is coming from context
        audioRefs.current[id] = new Audio(src); // On mount create the audio ref

        if (audioRefs.current[id]) {
            audioRefs.current[id].addEventListener("loadedmetadata", this.handleLoadedMetadata);
            audioRefs.current[id].addEventListener("timeupdate", this.handleTimeUpdate);
        }
    }

    componentDidUpdate() {
        const { id, audioRefs } = this.props;

        console.log("ComponentDidUpdate", { id, audioRefs });

        if (audioRefs.current[id]) {
            audioRefs.current[id].addEventListener("loadedmetadata", this.handleLoadedMetadata);
            audioRefs.current[id].addEventListener("timeupdate", this.handleTimeUpdate);
        }
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
        let currentTime = audioRefs.current[id].currentTIme;

        if (audioRefs.current[id]) {
            this.setState({ currentTime: audioRefs.current[id].currentTime });
        }
    };

    handleLoadedMetadata = () => {
        const { id, audioRefs } = this.props;
        let duration = audioRefs.current[id].duration;

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

        stop(id);
    };

    handleSeek = (e) => {
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

    // TODO: Rerender component on page change
    // Get last location and current location with react router
    render() {
        const { currentTime, duration, error, isLoading } = this.state;
        const { title, url, id, playingStates } = this.props;
        const isPlaying = playingStates[id] || false;

        let props = this.props;
        let state = this.state;

        //console.log("ABCAudioPlayer:render(): ", { props, state });

        return (
            <div className="p-4 rounded-lg mb-4 flex-shrink border border-comfy-dark bg-comfy-accent2 bg-opacity-5 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50 audio-player">
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
                        className="relative bg-comfy-accent2 bg-opacity-50 text-comfy-dark px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-110 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                        ) : (
                            <div className="relative w-5 h-5">
                                <Play
                                    className={`absolute top-0 left-0 w-5 h-5 transform transition-all duration-300 ease-in-out ${
                                        isPlaying ? "opacity-0 scale-75" : "opacity-100 scale-100"
                                    }`}
                                />
                                <Pause
                                    className={`absolute top-0 left-0 w-5 h-5 transform transition-all duration-300 ease-in-out ${
                                        isPlaying ? "opacity-100 scale-100" : "opacity-0 scale-75"
                                    }`}
                                />
                            </div>
                        )}
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
