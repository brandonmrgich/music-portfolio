import React from "react";
import AudioPlayer from "./AudioPlayer";
import AudioComparisonPlayer from "./AudioComparisonPlayer";

/**
 * AudioGrid component to display a grid of audio players.
 * @param {Object} props - Component props
 * @param {Array} props.tracks - Array of track objects
 * @param {boolean} props.isComparison - Flag to determine if comparison players should be used
 * @returns {React.Component} AudioGrid component
 */
const AudioGrid = ({ tracks, isComparison }) => {
    return (
        <div className="audio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) =>
                isComparison ? (
                    <AudioComparisonPlayer
                        key={track.id}
                        id={track.id}
                        url={track.url}
                        beforeSrc={track.beforeSrc}
                        afterSrc={track.afterSrc}
                        title={track.title}
                    />
                ) : (
                    <AudioPlayer
                        url={track.url}
                        key={track.id}
                        id={track.id}
                        src={track.src}
                        title={track.title}
                    />
                ),
            )}
        </div>
    );
};

export default AudioGrid;
