import React from 'react';
import AudioPlayer from './AudioPlayer';
import AudioComparisonPlayer from './AudioComparisonPlayer';
import AnimatedLoadingText from '../../utils/AnimatedLoadingText';

const AudioGrid = ({ tracks, isComparison, isLoading }) => {
    if (isLoading) {
        return (
            <div className="justify-self-center">
                <AnimatedLoadingText />
            </div>
        );
    }

    if (!tracks || !tracks.length) {
        return <p className="text-center text-gray-500">No tracks available.</p>;
    }

    return (
        <div className="audio-grid place-items-center justify-center w-full flex flex-col sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) =>
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

export default AudioGrid;
