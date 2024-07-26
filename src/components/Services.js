import React, { useState, useRef } from "react";

/**
 * Contact form component.
 * @returns {React.Component} Contact form component
 */
const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send email)
    console.log("Form submitted:", { name, email, message });
    // Reset form fields
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Message"
        required
      ></textarea>
      <button type="submit">Send</button>
    </form>
  );
};

/**
 * Audio comparison player component.
 * @param {Object} props - Component props
 * @param {string} props.beforeSrc - Before audio source URL
 * @param {string} props.afterSrc - After audio source URL
 * @param {string} props.title - Track title
 * @returns {React.Component} Audio comparison player component
 */
const AudioComparisonPlayer = ({ beforeSrc, afterSrc, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAfter, setIsAfter] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleVersion = () => {
    const currentTime = audioRef.current.currentTime;
    setIsAfter(!isAfter);
    audioRef.current.src = isAfter ? beforeSrc : afterSrc;
    audioRef.current.currentTime = currentTime;
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  return (
    <div className="audio-comparison-player">
      <h3>{title}</h3>
      <audio
        ref={audioRef}
        src={isAfter ? afterSrc : beforeSrc}
        onEnded={() => setIsPlaying(false)}
      ></audio>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={toggleVersion}>{isAfter ? "Before" : "After"}</button>
    </div>
  );
};

/**
 * Services page component.
 * @returns {React.Component} The Services page component
 */
const Services = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // Fetch tracks from an API or load from a local source
    setTracks([
      {
        id: 1,
        title: "Track 1",
        beforeSrc: "/path/to/before1.mp3",
        afterSrc: "/path/to/after1.mp3",
      },
      {
        id: 2,
        title: "Track 2",
        beforeSrc: "/path/to/before2.mp3",
        afterSrc: "/path/to/after2.mp3",
      },
      // Add more tracks as needed
    ]);
  }, []);

  return (
    <div className="services">
      <h1>Services</h1>
      <section className="mixing-mastering">
        <h2>Mixing and Mastering</h2>
        <p>Description of your mixing and mastering services...</p>
        {tracks.map((track) => (
          <AudioComparisonPlayer
            key={track.id}
            beforeSrc={track.beforeSrc}
            afterSrc={track.afterSrc}
            title={track.title}
          />
        ))}
      </section>
      <section className="contact">
        <h2>Contact</h2>
        <ContactForm />
      </section>
    </div>
  );
};

export default Services;
