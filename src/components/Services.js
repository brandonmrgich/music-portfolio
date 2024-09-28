import React, { useRef, useState, useEffect } from "react";
import AudioUpload from "../admin/AudioUpload";
import { useTracks } from "../Hooks";
import AudioGrid from "./AudioPlayer/AudioGrid";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import ContactButton from "./Contact/ContactButton";

const Services = ({ isAdmin }) => {
    const { tracks, isLoading, error, isComparison } = useTracks("reel");
    const contactFormRef = useRef(null); // Ref to control the contact form

    console.log({ tracks });

    if (isLoading) {
        return <div>Loading tracks...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                <AudioGrid tracks={tracks} isComparison={isComparison} />
            </section>

            <section className="contact space-y-4">
                <ContactButton />
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
