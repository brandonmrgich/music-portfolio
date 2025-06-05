import React from 'react';
import { SocialMediaLink, Links } from './SocialMediaLink';
import profileImg from '../assets/images/profile-glasses.png';

const aboutData = {
  name: 'Brandon Mrgich',
  bio: `Multi-instrumentalist based in Florida simply exploring the massive world of sound. Attracted to music and sound since the age of 7, the sense of curiosity and desire to create fuels a never-ending journey of music composition.`,
  imageUrl: profileImg,
  contact: 'musicwithmrgich@gmail.com',
};

const socialKeys = ['instagram', 'tiktok', 'youtube'];

const AboutSection = () => (
  <div className="relative min-h-screen py-16 px-4 flex flex-col items-center overflow-hidden">
    <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-accent-dark text-center">About</h2>
      <p className="text-lg text-text-dark max-w-2xl text-center mb-4">
        {aboutData.bio}
      </p>
      {aboutData.imageUrl && (
        <img src={aboutData.imageUrl} alt={aboutData.name} className="w-32 h-32 rounded-full mb-6 object-cover" />
      )}
      {/* Contact Call-to-Action */}
      <div className="mb-4 text-center">
        <p className="text-xl font-semibold text-accent-dark mb-2">Contact me directly!</p>
        <p className="text-base text-text-dark mb-2">Reach out via <span className="font-bold text-accent-dark">email</span> or <span className="font-bold text-accent-dark">Instagram</span> for inquiries, collaborations, or just to say hi.</p>
        <a
          href={`mailto:${aboutData.contact}`}
          className="inline-block text-2xl font-bold text-accent-dark bg-white/10 px-4 py-2 rounded-lg shadow-md hover:bg-accent-dark hover:text-white transition-colors duration-200 mb-2"
          style={{ letterSpacing: '0.01em' }}
        >
          {aboutData.contact}
        </a>
      </div>
      <ul className="flex flex-row justify-center gap-4 mb-6 mt-2">
        {socialKeys.map((key) => (
          <SocialMediaLink key={Links.Social[key].label} {...Links.Social[key]} />
        ))}
      </ul>
    </div>
  </div>
);

export default AboutSection; 