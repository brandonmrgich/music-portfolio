import React, { useState, useEffect } from "react";
import AudioGrid from "./AudioPlayer/AudioGrid";
import AudioLoader from "./AudioPlayer/AudioLoader";

/**
 * In Work page component.
 * @returns {React.Component} The In Work page component
 */
const InWork = ({ isAdmin }) => {
    const [tracks, setTracks] = useState([]);
    let loader = new AudioLoader();

    useEffect(() => {
        let newTracks = loader.getTracks();
        setTracks([...tracks, newTracks]);
    }, []);

    return (
        <div className="in-work p-6 max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl font-bold text-center mb-8">Work in Progress</h1>
            <p className="text-lg text-gray-700 mb-4 text-center">
                Here are some songs and demos I'm currently working on:
            </p>
            <AudioGrid tracks={tracks} isComparison={false} />
        </div>
    );
};

export default InWork;
