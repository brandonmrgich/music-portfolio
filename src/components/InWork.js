import React, { useState, useEffect } from "react";

/**
 * Audio player component with like functionality.
 * @param {Object} props - Component props
 * @param {string} props.src - Audio source URL
 * @param {string} props.title - Track title
 * @returns {React.Component} Audio player component
 */
const AudioPlayer = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const likedTracks = JSON.parse(localStorage.getItem("likedTracks") || "{}");
    setHasLiked(likedTracks[title] || false);
    setLikes(likedTracks[title] ? 1 : 0);
  }, [title]);

  const handleLike = () => {
    if (!hasLiked) {
      const likedTracks = JSON.parse(
        localStorage.getItem("likedTracks") || "{}",
      );
      likedTracks[title] = true;
      localStorage.setItem("likedTracks", JSON.stringify(likedTracks));
      setHasLiked(true);
      setLikes(1);
    }
  };

  const togglePlay = () => {
    const audioElement = document.getElementById(`audio-${title}`);
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-player">
      <h3>{title}</h3>
      <audio id={`audio-${title}`} src={src}></audio>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={handleLike} disabled={hasLiked}>
        Like ({likes})
      </button>
    </div>
  );
};

/**
 * In Work page component.
 * @returns {React.Component} The In Work page component
 */
const InWork = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // Fetch tracks from an API or load from a local source
    setTracks([
      { id: 1, title: "Track 1", src: "/path/to/track1.mp3" },
      { id: 2, title: "Track 2", src: "/path/to/track2.mp3" },
      // Add more tracks as needed
    ]);
  }, []);

  return (
    <div className="in-work">
      <h1>Work in Progress</h1>
      {tracks.map((track) => (
        <AudioPlayer key={track.id} src={track.src} title={track.title} />
      ))}
    </div>
  );
};

export default InWork;
