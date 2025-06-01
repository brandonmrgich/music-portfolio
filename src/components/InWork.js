import AudioGrid from './AudioPlayer/AudioGrid';
import { useEffect, useState } from 'react';
import { useTracks } from '../hooks/UseTracks';
import { fetchTracksByType } from '../services/tracks';
import AudioLoader from './AudioPlayer/AudioLoader';
import AnimatedLoadingText from '../utils/AnimatedLoadingText';

/**
 * In Work page component.
 * @returns {React.Component} The In Work page component
 *
 */
const InWork = ({ isAdmin }) => {
    //const [tracks, setTracks] = useState(null);
    //const [isLoading, setIsLoading] = useState(true);

    // TODO: Tracks cannot be fetched here, needs to be added to the context
    const { tracks, isLoading, error, isComparison } = useTracks('wip');

    //useEffect(() => {
    //    console.log('InWork::Tracks updated, mount');

    //    const fetch = async () => {
    //        try {
    //            // TODO: REMOVE: forcing local tracks for debug

    //            setTracks(localTracks);
    //            setIsLoading(false);
    //        } catch (e) {
    //            console.error(e);
    //        }
    //    };

    //    fetch();

    //    return () => {
    //        console.log('InWork::Tracks updated, unmount');
    //    };
    //}, []);

    const renderAudioGrid = () => {
        if (isLoading) {
            return (
                <div className="justify-self-center">
                    <AnimatedLoadingText />
                </div>
            );
        }

        if (tracks && tracks.length > 0) {
            return <AudioGrid tracks={tracks} isComparison={false} isLoading={false} />;
        }

        return <p>No tracks available</p>;
    };

    return (
        <div className="in-work p-4 sm:p-6 max-w-4xl mx-auto space-y-12">
            <p className="text-lg text-gray-700 mb-4 text-center">
                Here are some songs and demos I'm currently working on:
            </p>
            {renderAudioGrid()}
        </div>
    );
};

export default InWork;
