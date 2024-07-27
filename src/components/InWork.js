import React, { useState, useEffect } from "react";
import AudioGrid from "./AudioPlayer/AudioGrid";

/**
 * In Work page component.
 * @returns {React.Component} The In Work page component
 */
const InWork = ({ isAdmin }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        // Fetch tracks from an API or load from a local source
        setTracks([
            { id: 1, title: "another-one-wip", src: "/path/to/track1.mp3" },
            {
                id: 2,
                title: "just-another-unnamed-wip",
                src: "/path/to/track2.mp3",
            },
            // Add more tracks as needed
        ]);
    }, []);
    return (
        <div className="in-work p-6 space-y-8">
            <h1 className="text-3xl font-bold mb-6">Work in Progress</h1>
            <AudioGrid tracks={tracks} isComparison={false} />
        </div>
    );
    // return (
    //     <div className="in-work p-6">
    //         <h1 className="text-3xl font-bold mb-6">Work in Progress</h1>
    //         {tracks.map((track) => (
    //             <AudioPlayer
    //                 key={track.id}
    //                 src={track.src}
    //                 title={track.title}
    //             />
    //         ))}
    //     </div>
    // );
};

export default InWork;
