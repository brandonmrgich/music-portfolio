import React from 'react';
import BaseAudioPlayer from './BaseAudioPlayer';

const CompressedAudioPlayer = ({ id, src, title, artist }) => {
  return (
    <BaseAudioPlayer
      id={id}
      src={src}
      title={title}
      artist={artist}
      links={{}}
      compact
      className="compressed-audio-player"
    />
  );
};

export default CompressedAudioPlayer; 