import React, { useState, useEffect } from "react";
import AudioGrid from "./AudioPlayer/AudioGrid";

// TODO: Track with links

let defaultTracks = [
    { id: 1, title: "Placeholder Song 1", src: "/path/to/src" },
    { id: 2, title: "Placeholder Song 2", src: "/path/to/src" },
    { id: 3, title: "Placeholder Song 4", src: "/path/to/src" },
    { id: 4, title: "Placeholder Song 4", src: "/path/to/src" },
];

/**
 * Scoring page component.
 * @returns {React.Component} The Scoring page component
 */
const Scoring = ({ isAdmin }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        // Fetch tracks from an API or load from a local source
        setTracks(defaultTracks);
    }, []);

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
            <AudioGrid tracks={tracks} isComparison={false} />
        </div>
    );
};

export default Scoring;
