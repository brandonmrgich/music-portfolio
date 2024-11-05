import React, { useState, useEffect } from 'react';
import AudioGrid from './AudioPlayer/AudioGrid';
import { useTracks } from '../Hooks';

/**
 * Scoring page component.
 * @returns {React.Component} The Scoring page component
 */
const Scoring = ({ isAdmin }) => {
    const { tracks, isLoading, error, isComparison } = useTracks('scoring');

    if (isLoading) {
        return <div>Loading tracks...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="in-work p-6 max-w-4xl mx-auto space-y-12">
            <section className="text-center text-balance p-6 max-w-4xl mx-auto space-y-6 block">
                <h2 className="text-3xl font-semibold mb-4 text-primary-dark">
                    Film & Videogame Scoring
                </h2>
                <p className="text-lg text-secondary-dark ">
                    Here are some tracks that made it into various projects, just as Gamejams, Film
                    Festivals, etc
                </p>
            </section>
            <AudioGrid tracks={tracks} isComparison={isComparison} />
        </div>
    );
};

export default Scoring;
