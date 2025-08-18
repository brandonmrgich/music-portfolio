import React from 'react';
import AudioPlayer from './AudioPlayer';
import AudioComparisonPlayer from './AudioComparisonPlayer';
import AnimatedLoadingText from '../../utils/AnimatedLoadingText';

/**
 * AudioGrid - Displays a grid of audio player cards (standard or comparison).
 * @param {object} props
 * @param {Array} props.tracks - List of track objects
 * @param {boolean} props.isComparison - If true, use AudioComparisonPlayer
 * @param {boolean} props.isLoading - If true, show loading animation
 * @returns {JSX.Element}
 */
const AudioGrid = ({ tracks, isComparison, isLoading }) => {
    if (isLoading) {
        return (
            <div className="justify-self-center">
                <AnimatedLoadingText />
            </div>
        );
    }

    if (tracks === undefined && tracks.length == 0) {
        tracks = [];
        return <p className="text-center text-gray-500">No tracks available.</p>;
    }

    return (
        <div className="audio-grid w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
            {tracks &&
                tracks.length > 0 &&
                tracks.map((track) =>
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
                )}
        </div>
    );
};

/**
 * renderAudioGrid - Helper to render AudioGrid or loading/empty state.
 * @param {Array} tracks
 * @param {boolean} isComparison
 * @param {boolean} isLoading
 * @returns {JSX.Element}
 */
const renderAudioGrid = (tracks, isComparison, isLoading) => {
    if (isLoading) {
        return (
            <div className="justify-self-center">
                <AnimatedLoadingText />
            </div>
        );
    }

    if (tracks && tracks.length > 0) {
        return <AudioGrid tracks={tracks} isComparison={isComparison} isLoading={isLoading} />;
    }

    return <p className="justify-self-center">No tracks available</p>;
};

export { AudioGrid, renderAudioGrid };
