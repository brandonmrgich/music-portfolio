import React, { useState, useEffect } from "react";
import AudioUpload from "../admin/AudioUpload";
import AudioGrid from "./AudioPlayer/AudioGrid";
import ContactForm from "./ContactForm";

let defaultTracks = [
    {
        id: 1,
        title: "Placeholder Song 1",
        beforeSrc: "/path/to/before1.mp3",
        afterSrc: "/path/to/after1.mp3",
    },
    {
        id: 2,
        title: "Placeholder Song 2",
        beforeSrc: "/path/to/before2.mp3",
        afterSrc: "/path/to/after2.mp3",
    },
];

/**
 * Services page component.
 * @returns {React.Component} The Services page component
 */
const Services = ({ isAdmin }) => {
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/audio")
            .then((response) => {
                if (!response.ok) {
                    console.error(response.status, ":", response.statusText);
                    setError(
                        "Unable to load audio tracks. Please try again later.",
                    );
                    throw new Error("Failed to fetch audio files");
                }
                return response.json();
            })
            .then((data) => setTracks(data), setError(""))
            .catch(
                (err) => console.error(err),
                setError(
                    "Unable to fetch audio tracks. Please try again later.",
                ),
                setTracks(defaultTracks),
            );
    }, []);

    return (
        <div className="services p-6">
            <h1 className="text-3xl font-bold mb-6">Services</h1>

            <section className="mixing-mastering mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Mixing and Mastering
                </h2>
                <p className="description mb-1">
                    I have a passion for taking a song, and bringing it to a
                    whole other level. My goal is to make the track easy to
                    listen to, maintaining balanced dynamics while also adding
                    color and full tone. I've always liked songs like surround
                    the listener, and take advantage of the stereo field, so I
                    do my best to achieve this.
                </p>
                <p className="description mb-4">
                    When you submit a song to me, I will work with you one on
                    one to meet your expectations, and deliver a polished final
                    track for your catalog.
                </p>
                <p className="description mb-2 italic">
                    Requests are currently FREE, as I am currently adding to a
                    'sample reel' of Mixed and Mastered tracks.
                </p>
                <p className="description mb-4 italic">
                    ( I may request to feature them here on my site! )
                </p>
            </section>
            <section className="sample-reel mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Heres a few tracks I'm particularly proud of:
                </h2>
                {error && <p className="error-message text-red-500">{error}</p>}
                <AudioGrid tracks={tracks} isComparison={true} />
            </section>

            <section className="contact mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <ContactForm />
            </section>

            {isAdmin && (
                <section className="admin">
                    <h2>Admin</h2>
                    <AudioUpload />
                </section>
            )}
        </div>
    );
};

export default Services;
