import React, { useState, useEffect } from 'react';
import backgroundImg from '../assets/images/background1.jpg';
import BaseAudioPlayer from './AudioPlayer/BaseAudioPlayer';
import CompressedAudioGrid from './AudioPlayer/CompressedAudioGrid';
import { useAudio } from '../contexts/AudioContext';
import { useAdmin } from '../contexts/AdminContext';
import TrackUploadForm from './TrackUploadForm';

const scoringData = {
    pitch: "I've always dreamed of scoring stories — ones that move people. From Hans Zimmers theme in Interstellar, born from a letter about a father and child, to C418's minimalist Minecraft score that lives with an entire generation — I'm inspired by how music can shape worlds, whether vast or intimate. I chase that feeling in every song I write.",
    disclaimer:
        "All tracks in this section are available for sync licensing -- in film, animation, YouTube, games, and more!\nI own 100% of both the master and publishing rights for every piece, meaning if youre interested in using this music, its super easy to do.\nJust include the song name and my full name 'Brandon Mrgich'!",
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
                <div className="flex items-center mb-8">
                  <h2 className="text-3xl font-bold text-accent-dark text-center mr-2">Scoring</h2>
                  {isAdmin && (
                    <button onClick={() => setShowForm(true)} title="Add SCORING track" className="text-2xl text-accent-dark hover:text-accent-light ml-2">+</button>
                  )}
                </div>
                <p className="text-lg text-text-dark max-w-3xl text-center mb-4">
                    {scoringData.pitch}
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
                      <button onClick={() => setShowForm(false)} className="absolute -top-4 -right-4 text-gray-300 bg-black/60 rounded-full p-2 hover:text-white hover:bg-black/80 z-10">&times;</button>
                      <TrackUploadForm type="SCORING" onSuccess={() => setShowForm(false)} defaults={{ artist: 'Brandon Mrgich' }} />
                    </div>
                  </div>
                )}
                <p className="text-lg text-text-dark max-w-3xl text-center mb-4">
                    {scoringData.disclaimer}
                </p>
            </div>
        </div>
    );
};

export default ScoringSection;

