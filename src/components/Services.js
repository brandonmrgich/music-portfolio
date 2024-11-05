import React, { useRef, useState, useEffect } from 'react';
import AudioUpload from '../admin/AudioUpload';
import { useTracks } from '../Hooks';
import AudioGrid from './AudioPlayer/AudioGrid';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import ContactButton from './Contact/ContactButton';

const Services = ({ isAdmin }) => {
    const { tracks, isLoading, error, isComparison } = useTracks('reel');
    const contactFormRef = useRef(null); // Ref to control the contact form

    console.log({ tracks });

    if (isLoading) {
        return <div>Loading tracks...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-12">
            <section className="text-center block text-balance services p-6 max-w-4xl mx-auto ">
                <h2 className="text-3xl font-semibold mb-4 text-primary-dark">
                    Mixing & Mastering
                </h2>
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
                    (I may request to feature them here on my site!)
                </p>

                <h2 className="text-xl font-semibold text-primary-dark">
                    Here's a few tracks I'm particularly proud of:
                </h2>
            </section>

            <AudioGrid tracks={tracks} isComparison={isComparison} />

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
