import React, { useState, useEffect } from "react";
import AudioGrid from "./AudioPlayer/AudioGrid";

let defaultTracks = [
    {
        id: 1,
        title: "Placeholder Song 1",
        src: "/path/to/src",
    },
    {
        id: 2,
        title: "Placeholder Song 2",
        src: "/path/to/src",
    },
    {
        id: 3,
        title: "Placeholder Song 4",
        src: "/path/to/src",
    },
    {
        id: 4,
        title: "Placeholder Song 4",
        src: "/path/to/src",
    },
];

/**
 * In Work page component.
 * @returns {React.Component} The In Work page component
 */
const InWork = ({ isAdmin }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        // Fetch tracks from an API or load from a local source
        setTracks(defaultTracks);
    }, []);

    return (
        <div className="in-work p-6 max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl font-bold text-center mb-8">
                Work in Progress
            </h1>
            <p className="text-lg text-gray-700 mb-4 text-center">
                Here are some of the tracks I'm currently working on. Stay tuned
                for more updates!
            </p>
            <AudioGrid tracks={tracks} isComparison={false} />
        </div>
    );
};

export default InWork;
