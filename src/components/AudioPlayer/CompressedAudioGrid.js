import React from 'react';
import CompressedAudioPlayer from './CompressedAudioPlayer';

const CompressedAudioGrid = ({ tracks }) => {
  if (!tracks || tracks.length === 0) {
    return <p className="text-center text-playercardText-dark">No tracks available.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-5xl mx-auto mt-4 px-2 sm:px-0">
      {tracks.map((track) => (
        <CompressedAudioPlayer
          key={track.id}
          id={track.id}
          src={track.src}
          before={track.before}
          after={track.after}
          title={track.title}
          artist={track.artist}
          links={track.links || {}}
        />
      ))}
    </div>
  );
};

export default CompressedAudioGrid; 