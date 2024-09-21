import React, { useState, useEffect } from "react";
import AudioUpload from "../admin/AudioUpload";
import AudioGrid from "./AudioPlayer/AudioGrid";
import AudioLoader from "./AudioPlayer/AudioLoader";
import ContactForm from "./ContactForm";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Services = ({ isAdmin }) => {
    const [tracks, setTracks] = useState(AudioLoader.getTracks("comparison"));
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/audio")
            .then((response) => {
                if (!response.ok) {
                    console.error(response.status, ":", response.statusText);
                    setError("Unable to load audio tracks. Please try again later.");
                    throw new Error("Failed to fetch audio files");
                }
                return response.json();
            })
            .then((data) => setTracks(data), setError(""))
            .catch((err) => {
                console.error(err);
                setError("Unable to fetch audio tracks. Please try again later.");
            });
    }, []);

    return (
        <div className="services p-6 max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary-dark">Services</h1>

            <section className="mixing-mastering space-y-4">
                <h2 className="text-3xl font-semibold text-primary-dark">Mixing and Mastering</h2>
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
                    Requests are currently FREE, as I am adding to a 'sample reel' of Mixed and
                    Mastered tracks.
                </p>
                <p className="text-lg text-secondary-dark italic">
                    (I may request to feature them here on my site!)
                </p>
            </section>

            <section className="sample-reel space-y-4">
                <h2 className="text-2xl font-semibold text-primary-dark">
                    Here's a few tracks I'm particularly proud of:
                </h2>
                {error && (
                    <p className="error-message text-red-500 flex items-center space-x-2">
                        <FaExclamationCircle />
                        <span>{error}</span>
                    </p>
                )}
                <AudioGrid tracks={tracks} isComparison={true} />
            </section>

            <section className="contact space-y-4">
                <h2 className="text-3xl font-semibold text-gray-800">Contact</h2>
                <ContactForm />
            </section>

            {isAdmin && (
                <section className="admin space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Admin</h2>
                    <AudioUpload />
                </section>
            )}
        </div>
    );
};
export default Services;
