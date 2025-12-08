import React, { useState, useEffect } from 'react';
import AudioComparisonPlayer from './AudioPlayer/AudioComparisonPlayer';
import CompressedAudioGrid from './AudioPlayer/CompressedAudioGrid';
import { useAudio } from '../contexts/AudioContext';
import { useAdmin } from '../contexts/AdminContext';
import TrackUploadForm from './TrackUploadForm';

const servicesData = {
    header: "I love transforming songs into immersive experiences - boosting clarity, punch, and width. I've produced music for myself, friends, and various other artists over the years. Here are a few of my favorites that I've worked on.",
    instructions: '(note: You can swap between the Original and Mastered version of each song!)',
};

const ServicesSection = () => {
    const { tracks } = useAudio();
    const reelTracks = tracks.reel || [];
    const highlight = reelTracks[0];
    const rest = reelTracks.slice(1);
    const { isAdmin } = useAdmin();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!showForm) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowForm(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showForm]);

    return (
        <div className="relative min-h-screen py-16 px-4 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
                <div className="w-full max-w-3xl mx-auto mb-6 bg-card-dark/60 backdrop-blur-md border border-border-dark rounded-xl shadow-xl px-5 py-5">
                    <div className="flex items-center justify-center mb-4">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-accent-dark text-center mr-2">
                            Mixing & Mastering
                        </h2>
                        {isAdmin && (
                            <button
                                onClick={() => setShowForm(true)}
                                title="Add REEL track"
                                className="text-2xl text-accent-dark hover:text-accent-light ml-2"
                            >
                                +
                            </button>
                        )}
                    </div>
                    <p className="text-xl md:text-2xl text-text-dark text-center mb-3">
                        {servicesData.header}
                    </p>
                    <p className="text-l md:text-xl text-text-dark text-center">
                        {servicesData.instructions}
                    </p>
                </div>
                {highlight && (
                    <div className="mb-8 max-w-lg mx-auto">
                        <AudioComparisonPlayer
                            id={highlight.id}
                            before={highlight.before}
                            after={highlight.after}
                            title={highlight.title}
                            artist={highlight.artist}
                            links={highlight.links}
                        />
                    </div>
                )}
                {rest.length > 0 && <CompressedAudioGrid tracks={rest} />}
                {showForm && isAdmin && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="relative">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute -top-4 -right-4 text-gray-300 bg-black/60 rounded-full p-2 hover:text-white hover:bg-black/80 z-10"
                            >
                                &times;
                            </button>
                            <TrackUploadForm
                                type="REEL"
                                onSuccess={() => setShowForm(false)}
                                defaults={{ artist: 'Brandon Mrgich' }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesSection;
