import React, { useEffect } from 'react';
import AudioUpload from '../admin/AudioUpload';
import AudioGrid, { renderAudioGrid } from './AudioPlayer/AudioGrid';
import { useAudio } from '../contexts/AudioContext';

/**
 * Services - Page for displaying 'reel' (comparison) tracks and service info.
 * Uses AudioContext for track data and error/loading state.
 * @param {object} props
 * @param {boolean} props.isAdmin - If true, show admin features (commented out)
 * @returns {JSX.Element}
 */
const Services = ({ isAdmin }) => {
    const { tracks, tracksLoading, tracksError } = useAudio();
    const isComparison = true;
    const error = tracksError;
    const isLoading = tracksLoading;

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    return (
        <div className="services p-4 sm:p-6 max-w-4xl mx-auto space-y-12">
            <section className="text-center block text-balance services p-6 max-w-4xl mx-auto ">
                <h2 className="text-3xl font-semibold mb-4 text-primary-dark">
                    Mixing & Mastering
                </h2>
                <p className="text-lg text-secondary-dark">
                    I have a passion for taking a song and bringing it to a whole other level. My
                    goal is to make the track easy to listen to, maintaining balanced dynamics while
                    also adding color and full tone. I love songs that surround the listener and
                    take advantage of the stereo field, so I do my best to achieve this.
                </p>
                <p className="text-lg text-secondary-dark">
                    When you submit a song to me, I will work with you one on one to meet your
                    expectations and deliver a polished final track for your catalog.
                </p>
                <p className="text-lg text-secondary-dark italic">
                    (I may request to feature them here on my site!)
                </p>

                <h2 className="text-xl font-semibold text-primary-dark">
                    Here's a few tracks I'm particularly proud of:
                </h2>
            </section>

            {renderAudioGrid(tracks.reel, isComparison, isLoading)}

            {/*
            {isAdmin && (
                <section className="admin space-y-4 justify-self-center">
                    <AudioUpload />
                </section>
            )}
            */}
        </div>
    );
};
export default Services;
