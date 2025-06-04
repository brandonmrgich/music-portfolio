import React from 'react';
import CompressedAudioPlayer from './CompressedAudioPlayer';

const CompressedAudioGrid = ({ tracks }) => {
  if (!tracks || tracks.length === 0) {
    return <p className="text-center text-playercardText-dark">No tracks available.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mt-4">
      {tracks.map((track) => (
        <CompressedAudioPlayer
          key={track.id}
          id={track.id}
          src={track.src}
          title={track.title}
          artist={track.artist}
        />
      ))}
    </div>
  );
};

export default CompressedAudioGrid; 