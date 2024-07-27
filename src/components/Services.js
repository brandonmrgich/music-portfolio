import React, { useState, useEffect } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Message"
        required
        className="w-full p-2 border rounded h-32"
      ></textarea>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
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
  const audioRef = React.useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      // audioRef.current.pause();
      console.debug("Paused");
    } else {
      // audioRef.current.play();
      console.debug("Started");
    }
    setIsPlaying(!isPlaying);
  };

  const toggleVersion = () => {
    const currentTime = audioRef.current.currentTime;
    setIsAfter(!isAfter);
    audioRef.current.src = isAfter ? beforeSrc : afterSrc;
    audioRef.current.currentTime = currentTime;
    if (isPlaying) {
      // audioRef.current.play();
      console.debug("Toggled");
    }
  };

  return (
    <div className="audio-comparison-player bg-gray-100 p-4 rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <audio
        ref={audioRef}
        src={isAfter ? afterSrc : beforeSrc}
        onEnded={() => setIsPlaying(false)}
      ></audio>
      <button
        onClick={togglePlay}
        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button onClick={toggleVersion} className="bg-gray-300 px-3 py-1 rounded">
        {isAfter ? "Before" : "After"}
      </button>
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
        title: "A cool song",
        beforeSrc: "/path/to/before1.mp3",
        afterSrc: "/path/to/after1.mp3",
      },
      {
        id: 2,
        title: "An even better song",
        beforeSrc: "/path/to/before2.mp3",
        afterSrc: "/path/to/after2.mp3",
      },
      // Add more tracks as needed
    ]);
  }, []);

  return (
    <div className="services p-6">
      <h1 className="text-3xl font-bold mb-6">Services</h1>

      <section className="mixing-mastering mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mixing and Mastering</h2>
        <p className="description mb-1">
          I have a passion for taking a song, and bringing it to a whole other
          level. My goal is to make the track easy to listen to, maintaining
          balanced dynamics while also adding color and full tone. I've always
          liked songs like surround the listener, and take advantage of the
          stereo field, so I do my best to achieve this.
        </p>
        <p className="description mb-4">
          When you submit a song to me, I will work with you one on one to meet
          your expectations, and deliver a polished final track for your
          catalog.
        </p>
        <p className="description mb-2 italic">
          Requests are currently FREE, as I am currently adding to a 'sample
          reel' of Mixed and Mastered tracks.
        </p>
        <p className="description mb-4 italic">
          ( I may request to feature them here on my site! )
        </p>
      </section>

      <section className="sample-reel mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Heres a few tracks I'm particularly proud of:
        </h2>
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
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <ContactForm />
      </section>
    </div>
  );
};

export default Services;
