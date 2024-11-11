import React from 'react';
import AudioPlayer from './AudioPlayer';
import AudioComparisonPlayer from './AudioComparisonPlayer';

/**
 * AudioGrid component to display a grid of audio players.
 * @param {Object} props - Component props
 * @param {Array} props.tracks - Array of track objects
 * @param {boolean} props.isComparison - Flag to determine if comparison players should be used
 * @returns {React.Component} AudioGrid component
 */

const mapTracks = (tracks, isComparison) => {
    let gridTracks = [];

    try {
        gridTracks = tracks.map((track) =>
            isComparison ? (
                <AudioComparisonPlayer
                    key={track.id}
                    id={track.id}
                    links={track.links}
                    before={track.before}
                    after={track.after}
                    title={track.title}
                    artist={track.artist}
                />
            ) : (
                <AudioPlayer
                    key={track.id}
                    id={track.id}
                    links={track.links}
                    src={track.src}
                    title={track.title}
                    artist={track.artist}
                />
            )
        );
    } catch (e) {
        console.error(
            'AudioGrid::mapTracks(): Attempted to populate grid with null or undefined tracks.'
        );
    }

    return gridTracks;
};

// TODO: Separate grid sections by genre/style

const AudioGrid = ({ tracks, isComparison }) => {
    return (
        <div className="audio-grid grid justify-self-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mapTracks(tracks, isComparison)}
        </div>
    );
};

export default AudioGrid;
