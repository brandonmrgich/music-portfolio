import React, { useState, useEffect } from 'react';
import AudioGrid, { renderAudioGrid } from './AudioPlayer/AudioGrid';
import { useTracks } from '../hooks/UseTracks';

/**
 * Scoring page component.
 * @returns {React.Component} The Scoring page component
 */
const Scoring = ({ isAdmin }) => {
    const { tracks, isLoading, error, isComparison } = useTracks('scoring');

    useEffect(() => {
        if (error) console.error(error);
    }, [tracks]);

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
            {renderAudioGrid(tracks, isComparison, isLoading)}
        </div>
    );
};

export default Scoring;
