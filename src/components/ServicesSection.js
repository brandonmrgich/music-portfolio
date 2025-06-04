import React from 'react';
import AudioComparisonPlayer from './AudioPlayer/AudioComparisonPlayer';
import CompressedAudioGrid from './AudioPlayer/CompressedAudioGrid';
import backgroundImg from '../assets/images/background1.jpg';
import { useAudio } from '../contexts/AudioContext';

const ServicesSection = () => {
  const { tracks } = useAudio();
  const reelTracks = tracks.reel || [];
  const highlight = reelTracks[0];
  const rest = reelTracks.slice(1);

  return (
    <div className="relative py-16 px-4 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-accent-dark text-center">Services</h2>
        <p className="text-lg text-text-dark max-w-2xl text-center mb-4">
          Placeholder text for the Services section. Add your content here.
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
            tracks={rest.map(t => ({
              ...t,
              src: t.before || t.after,
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesSection; 