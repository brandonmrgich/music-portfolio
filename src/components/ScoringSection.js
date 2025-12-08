import React, { useState, useEffect } from 'react';
import BaseAudioPlayer from './AudioPlayer/BaseAudioPlayer';
import CompressedAudioGrid from './AudioPlayer/CompressedAudioGrid';
import { useAudio } from '../contexts/AudioContext';
import { useAdmin } from '../contexts/AdminContext';
import TrackUploadForm from './TrackUploadForm';

const scoringData = {
    pitch: "I've always dreamed of scoring stories — ones that move people. From large scale film tracks by Hans Zimmer, to tracks from games like Minecraft & What Remains of Edith Finch — I'm inspired by how music can shape worlds, whether vast or intimate. I chase that feeling in every song I write.",
    disclaimer:
        "Heres are a few tracks I've done that would work well for stories like this. I own 100% of the master and publishing rights to them, so if you’re interested in using anything here, or you want me to make something new just for your project, reach out directly!",
};

const ScoringSection = () => {
    const { tracks } = useAudio();
    const scoringTracks = tracks.scoring || [];
    const highlight = scoringTracks[0];
    const rest = scoringTracks.slice(1);
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
                <div className="flex items-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-accent-dark text-center mr-2">
                        Film & Game Scoring
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => setShowForm(true)}
                            title="Add SCORING track"
                            className="text-2xl text-accent-dark hover:text-accent-light ml-2"
                        >
                            +
                        </button>
                    )}
                </div>
                <p className="text-xl md:text-2xl text-text-dark max-w-3xl text-center mb-5">
                    {scoringData.pitch}
                </p>
                <p className="text-xl text-text-dark max-w-3xl text-center mb-6">
                    {scoringData.disclaimer}
                </p>
                {highlight && highlight.src && (
                    <div className="mb-8 max-w-lg mx-auto">
                        <BaseAudioPlayer
                            id={highlight.id}
                            src={highlight.src}
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
                                type="SCORING"
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

export default ScoringSection;
