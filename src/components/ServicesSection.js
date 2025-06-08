import React, { useState, useEffect } from 'react';
import AudioComparisonPlayer from './AudioPlayer/AudioComparisonPlayer';
import CompressedAudioGrid from './AudioPlayer/CompressedAudioGrid';
import backgroundImg from '../assets/images/background1.jpg';
import { useAudio } from '../contexts/AudioContext';
import { useAdmin } from '../contexts/AdminContext';
import TrackUploadForm from './TrackUploadForm';

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
                <div className="flex items-center mb-8">
                  <h2 className="text-3xl font-bold text-accent-dark text-center mr-2">Services</h2>
                  {isAdmin && (
                    <button onClick={() => setShowForm(true)} title="Add REEL track" className="text-2xl text-accent-dark hover:text-accent-light ml-2">+</button>
                  )}
                </div>
                <p className="text-lg text-text-dark max-w-3xl text-center mb-4">
                    I love transforming songs into immersive experiences - boosting clarity, punch,
                    and width while building a sound that feels just right. Here are a few tracks
                    I've had the opportunity to work on:
                </p>
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
                {rest.length > 0 && (
                    <CompressedAudioGrid
                        tracks={rest.map((t) => ({
                            ...t,
                            src: t.before || t.after,
                        }))}
                    />
                )}
                {showForm && isAdmin && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="relative">
                      <button onClick={() => setShowForm(false)} className="absolute -top-4 -right-4 text-gray-300 bg-black/60 rounded-full p-2 hover:text-white hover:bg-black/80 z-10">&times;</button>
                      <TrackUploadForm type="REEL" onSuccess={() => setShowForm(false)} defaults={{ artist: 'Brandon Mrgich' }} />
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
};

export default ServicesSection;

