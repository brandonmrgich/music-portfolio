import React from "react";
import pfp from "../pictures/profile-pic-square.png";

/**
 * About page component.
 * @returns {React.Component} The About page component
 */
const About = () => {
  return (
    <div className="about">
      <h1>About Me</h1>
      <div className="profile-picture">
        {/* Add an img tag here when you have a profile picture */}
        <img src={pfp} height="256" width="256" alt="Brandon Mrgich" />
      </div>
      <div className="bio-section">
        <h2>Bio</h2>
        <p>
          Multi-instrumentalist based in Florida simply exploring the massive
          world of sound. Attracted to music and sound since the age of 7, the
          sense of curiosity and desire to create fuels a never-ending journey
          of music composition.
        </p>
      </div>
      <div className="skills-section">
        <h2>Platform links</h2>
        <ul>
          <li>
            <a href="https://open.spotify.com/artist/7h7WBTx9dIcxxPXLbPUu0e?si=FsICdE5uQIWib3cXcjxr5w&dl_branch=1">
              Spotify
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/channel/UCa9sV72a1B3jijmSKN9cX4A?sub_confirmation=1">
              Youtube Music
            </a>
          </li>
          <li>
            <a href="https://music.apple.com/us/artist/brandon-mrgich/1516929028">
              Apple Music
            </a>
          </li>
          <li>
            <a href="https://music.amazon.com/artists/B089Q1C8S2/brandon-mrgich?marketplaceId=ATVPDKIKX0DER&musicTerritory=US">
              Amazon Music
            </a>
          </li>
          <li>
            <a href="https://brandonmrgich.bandcamp.com/">Bandcamp</a>
          </li>
          <li>
            <a href="https://audius.co/brandonmrgich">Audius</a>
          </li>
          <li>
            <a href="https://soundcloud.com/user-36814317">Soundcloud</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
