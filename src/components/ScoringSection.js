import React from 'react';
import backgroundImg from '../assets/images/background1.jpg';
import BaseAudioPlayer from './AudioPlayer/BaseAudioPlayer';
import CompressedAudioGrid from './AudioPlayer/CompressedAudioGrid';
import { useAudio } from '../contexts/AudioContext';

const ScoringSection = () => {
  const { tracks } = useAudio();
  const scoringTracks = tracks.scoring || [];
  const highlight = scoringTracks[0];
  const rest = scoringTracks.slice(1);

  return (
    <div className="relative py-16 px-4 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-accent-dark text-center">Scoring</h2>
        <p className="text-lg text-text-dark max-w-2xl text-center mb-4">
          Placeholder text for the Scoring section. Add your content here.
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
      </div>
    </div>
  );
};

export default ScoringSection; 