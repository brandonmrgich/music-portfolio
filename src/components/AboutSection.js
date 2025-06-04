import React from 'react';
import backgroundImg from '../assets/images/background1.jpg';
import { SocialMediaLink, Links } from './SocialMediaLink';

const aboutData = {
  name: 'Brandon Mrgich',
  bio: `I'm a music producer, mixer, and composer passionate about creating immersive soundscapes. I work with artists, filmmakers, and game developers to bring their sonic visions to life.`,
  imageUrl: '', // Add your portrait or logo
  contact: 'brandon@example.com',
};

const socialKeys = ['instagram', 'tiktok', 'youtube'];

const AboutSection = () => (
  <div className="relative py-16 px-4 flex flex-col items-center overflow-hidden">
    <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-accent-dark text-center">About</h2>
      <p className="text-lg text-text-dark max-w-2xl text-center mb-4">
        Placeholder text for the About section. Add your content here.
      </p>
      {aboutData.imageUrl && (
        <img src={aboutData.imageUrl} alt={aboutData.name} className="w-32 h-32 rounded-full mb-6 object-cover" />
      )}
      <ul className="flex flex-row justify-center gap-4 mb-6 mt-2">
        {socialKeys.map((key) => (
          <SocialMediaLink key={Links.Social[key].label} {...Links.Social[key]} />
        ))}
      </ul>
      <a href={`mailto:${aboutData.contact}`} className="text-accent-dark hover:underline">{aboutData.contact}</a>
    </div>
  </div>
);

export default AboutSection; 