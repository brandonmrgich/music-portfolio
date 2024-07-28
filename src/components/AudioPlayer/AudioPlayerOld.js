import React, { useState, useRef } from "react";

const AudioPlayer = ({ src, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current.src) {
            setIsLoading(true);
            fetch(src)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to load audio");
                    }
                    return response.blob();
                })
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    audioRef.current.src = url;
                    audioRef.current.play();
                    setIsPlaying(true);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError("Unable to load audio. Please try again later.");
                    console.error(err);
                    setIsLoading(false);
                });
        } else if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="audio-player">
            <h3>{title}</h3>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)}></audio>
            <button onClick={togglePlay} disabled={isLoading}>
                {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

/**
  Audio comparison player component.
 * @param {Object} props - Component props
 * @param {string} props.beforeSrc - Before audio source URL
 * @param {string} props.afterSrc - After audio source URL
 * @param {string} props.title - Track title
 * @returns {React.Component} Audio comparison player component
 */
const AudioComparisonPlayer = ({ beforeSrc, afterSrc, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAfter, setIsAfter] = useState(false);
    const audioRef = React.useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            // audioRef.current.pause();
            console.debug("Paused");
        } else {
            // audioRef.current.play();
            console.debug("Started");
        }
        setIsPlaying(!isPlaying);
    };

    const toggleVersion = () => {
        const currentTime = audioRef.current.currentTime;
        setIsAfter(!isAfter);
        audioRef.current.src = isAfter ? beforeSrc : afterSrc;
        audioRef.current.currentTime = currentTime;
        if (isPlaying) {
            // audioRef.current.play();
            console.debug("Toggled");
        }
    };

    return (
        <div className="audio-comparison-player bg-gray-100 p-4 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <audio
                ref={audioRef}
                src={isAfter ? afterSrc : beforeSrc}
                onEnded={() => setIsPlaying(false)}
            ></audio>
            <button
                onClick={togglePlay}
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
            <button
                onClick={toggleVersion}
                className="bg-gray-300 px-3 py-1 rounded"
            >
                {isAfter ? "Before" : "After"}
            </button>
        </div>
    );
};

export { AudioPlayer, AudioComparisonPlayer };

// Old classses
// import React, { Component, useState, useRef, useEffect } from "react";
// import { Play, Pause, ToggleRight, ToggleLeft } from "lucide-react";
//
// class AudioPlayer extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isPlaying: false,
//             currentTime: 0,
//             duration: 0,
//         };
//         this.audioRef = React.createRef();
//     }
//
//     componentDidMount() {
//         this.audioRef.current.addEventListener(
//             "timeupdate",
//             this.handleTimeUpdate,
//         );
//         this.audioRef.current.addEventListener(
//             "loadedmetadata",
//             this.handleLoadedMetadata,
//         );
//     }
//
//     componentWillUnmount() {
//         this.audioRef.current.removeEventListener(
//             "timeupdate",
//             this.handleTimeUpdate,
//         );
//         this.audioRef.current.removeEventListener(
//             "loadedmetadata",
//             this.handleLoadedMetadata,
//         );
//     }
//
//     handleTimeUpdate = () => {
//         this.setState({ currentTime: this.audioRef.current.currentTime });
//     };
//
//     handleLoadedMetadata = () => {
//         this.setState({ duration: this.audioRef.current.duration });
//     };
//
//     togglePlayPause = () => {
//         if (this.state.isPlaying) {
//             this.audioRef.current.pause();
//         } else {
//             this.audioRef.current.play();
//         }
//         this.setState((prevState) => ({ isPlaying: !prevState.isPlaying }));
//     };
//
//     handleSeek = (e) => {
//         const seekTime = e.target.value;
//         this.audioRef.current.currentTime = seekTime;
//         this.setState({ currentTime: seekTime });
//     };
//
//     formatTime = (time) => {
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.floor(time % 60);
//         return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//     };
//
//     render() {
//         const { isPlaying, currentTime, duration } = this.state;
//         const { title, audioSrc } = this.props;
//
//         return (
//             <div className="audio-player">
//                 <h3>{title}</h3>
//                 <audio ref={this.audioRef} src={audioSrc} />
//                 <button onClick={this.togglePlayPause}>
//                     {isPlaying ? <Pause /> : <Play />}
//                 </button>
//                 <input
//                     type="range"
//                     min="0"
//                     max={duration}
//                     value={currentTime}
//                     onChange={this.handleSeek}
//                 />
//                 <span>
//                     {this.formatTime(currentTime)} / {this.formatTime(duration)}
//                 </span>
//             </div>
//         );
//     }
// }
//
// class AudioComparisonPlayer extends AudioPlayer {
//     constructor(props) {
//         super(props);
//         this.state = {
//             ...this.state,
//             isBeforeAudio: true,
//         };
//     }
//
//     toggleAudioSource = () => {
//         this.setState((prevState) => ({
//             isBeforeAudio: !prevState.isBeforeAudio,
//         }));
//     };
//
//     render() {
//         const { isPlaying, currentTime, duration, isBeforeAudio } = this.state;
//         const { title, beforeAudioSrc, afterAudioSrc } = this.props;
//
//         return (
//             <div className="audio-comparison-player bg-gray-100 p-4 rounded mb-4">
//                 <h3 className="text-lg font-semibold mb-2">{title}</h3>
//                 <audio
//                     ref={this.audioRef}
//                     src={isBeforeAudio ? beforeAudioSrc : afterAudioSrc}
//                 />
//                 <div className="flex-row">
//                     <button
//                         onClick={this.togglePlayPause}
//                         className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
//                     >
//                         {isPlaying ? <Pause /> : <Play />}
//                     </button>
//                     <button
//                         onClick={this.toggleAudioSource}
//                         className="bg-gray-300 px-3 py-1 rounded mr-2 text-lg"
//                     >
//                         {isBeforeAudio ? "Before" : "After"}
//                     </button>
//                     <input
//                         type="range"
//                         min="0"
//                         max={duration}
//                         value={currentTime}
//                         onChange={this.handleSeek}
//                         className="bg-gray-300 px-3 py-1"
//                     />
//                     <span className="font-semibold px-3 py-1 mr-2">
//                         {this.formatTime(currentTime).toString()} /{" "}
//                         {this.formatTime(duration).toString()}
//                     </span>
//                 </div>
//             </div>
//         );
//     }
// }
//
// class AudioPlayerLike extends AudioPlayer {
//     constructor(props) {
//         super(props);
//         this.state = {
//             ...this.state,
//             // set tracks
//         };
//     }
//
//     // TODO: has liked
//
//     // TODO: track loader
//
//     render() {
//         const {
//             isPlaying,
//             currentTime,
//             duration,
//             isBeforeAudio,
//             hasLiked,
//             likes,
//         } = this.state;
//         const { title, beforeAudioSrc, afterAudioSrc } = this.props;
//     }
// }
//
// export { AudioPlayer, AudioComparisonPlayer };
