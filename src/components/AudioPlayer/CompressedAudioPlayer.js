import React from 'react';
import AudioComparisonPlayer from './AudioComparisonPlayer';
import BaseAudioPlayer from './BaseAudioPlayer';

// Supports either single-source or comparison (before/after)
const CompressedAudioPlayer = ({ id, src, title, artist, before, after, links = {} }) => {
  const isComparison = Boolean(before || after);
  if (isComparison) {
    return (
      <AudioComparisonPlayer
        id={id}
        before={before}
        after={after}
        title={title}
        artist={artist}
        links={links}
        compact
        className="compressed-audio-player"
      />
    );
  }
  return (
    <BaseAudioPlayer
      id={id}
      src={src}
      title={title}
      artist={artist}
      links={links}
      compact
      className="compressed-audio-player"
    />
  );
};

export default CompressedAudioPlayer; 