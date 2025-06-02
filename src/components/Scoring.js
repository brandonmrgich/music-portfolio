import React, { useEffect } from 'react';
import AudioGrid, { renderAudioGrid } from './AudioPlayer/AudioGrid';
import { useAudio } from '../contexts/AudioContext';

/**
 * Scoring - Page for displaying scoring tracks (film, videogame, etc).
 * Uses AudioContext for track data and error/loading state.
 * @param {object} props
 * @param {boolean} props.isAdmin - If true, show admin features (unused here)
 * @returns {JSX.Element}
 */
const Scoring = ({ isAdmin }) => {
    const { tracks, tracksLoading, tracksError } = useAudio();
    const isComparison = false;
    const error = tracksError;
    const isLoading = tracksLoading;

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    return (
        <div className="scoring p-4 sm:p-6 max-w-4xl mx-auto space-y-12">
            <section className="text-center text-balance p-6 max-w-4xl mx-auto space-y-6 block">
                <h2 className="text-3xl font-semibold mb-4 text-primary-dark">
                    Film & Videogame Scoring
                </h2>
                <p className="text-lg text-secondary-dark ">
                    Here are some tracks that made it into various projects, just as Gamejams, Film
                    Festivals, etc
                </p>
            </section>
            {renderAudioGrid(tracks.scoring, isComparison, isLoading)}
        </div>
    );
};

export default Scoring;
