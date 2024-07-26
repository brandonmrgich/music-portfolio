import React from "react";

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
        <img src="/path/to/your/image.jpg" alt="Your Name" />
      </div>
      <div className="bio-section">
        <h2>Bio</h2>
        <p>Your biography goes here...</p>
      </div>
      <div className="skills-section">
        <h2>Skills</h2>
        <ul>
          <li>Skill 1</li>
          <li>Skill 2</li>
          <li>Skill 3</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
