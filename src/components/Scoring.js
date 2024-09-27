import React, { useState, useEffect } from "react";
import AudioGrid from "./AudioPlayer/AudioGrid";
import { useTracks } from "../Hooks";

/**
 * Scoring page component.
 * @returns {React.Component} The Scoring page component
 */
const Scoring = ({ isAdmin }) => {
    const { tracks, isLoading, error, isComparison } = useTracks("scoring");
    console.log({ tracks });

    if (isLoading) {
        return <div>Loading tracks...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="in-work p-6 max-w-4xl mx-auto space-y-12">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary-dark">
                Film & Videogame Scoring
            </h1>
            <section>
                <p className="text-lg text-secondary-dark mb-4 text-center">...</p>
                <p className="text-lg text-secondary-dark mb-4 text-center">
                    Here are some tracks that made it into various projects, just as Gamejams, Film
                    Festivals, etc
                </p>
            </section>
            <AudioGrid tracks={tracks} isComparison={isComparison} />
        </div>
    );
};

export default Scoring;
