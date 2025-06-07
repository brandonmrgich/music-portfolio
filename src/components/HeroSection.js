import React, { useEffect, useRef } from 'react';
import beachImg from '../assets/images/profile-coat.png';

const heroData = {
  heading: "Brandon Mrgich",
  tagline: "From Indie Songs to Cinematic Scores\nMulti-Instrumentalist • Producer • Sound Designer • Software Engineer",
  background: beachImg,
};

const HeroSection = ({ onHeroExit, scrollLocked }) => {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!scrollLocked) return;
    const handleScroll = (e) => {
      if (window.scrollY > 10 && !hasTriggered.current) {
        hasTriggered.current = true;
        onHeroExit && onHeroExit();
      }
    };
    const handleWheel = (e) => {
      if (!hasTriggered.current && (e.deltaY > 0 || e.deltaY < 0)) {
        hasTriggered.current = true;
        onHeroExit && onHeroExit();
      }
    };
    const handleKeyDown = (e) => {
      if (!hasTriggered.current && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) {
        hasTriggered.current = true;
        onHeroExit && onHeroExit();
      }
    };
    let touchStartY = null;
    const SWIPE_THRESHOLD = 40;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchEnd = (e) => {
      if (touchStartY === null) return;
      let endY = null;
      if (e.changedTouches && e.changedTouches.length === 1) {
        endY = e.changedTouches[0].clientY;
      }
      if (endY !== null && Math.abs(endY - touchStartY) > SWIPE_THRESHOLD && !hasTriggered.current) {
        hasTriggered.current = true;
        onHeroExit && onHeroExit();
      }
      touchStartY = null;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onHeroExit, scrollLocked]);

  // Also allow click anywhere in hero to trigger exit
  const handleClick = () => {
    if (scrollLocked && !hasTriggered.current) {
      hasTriggered.current = true;
      onHeroExit && onHeroExit();
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen py-16 text-center overflow-hidden cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      aria-label="Scroll to enter site"
    >
      <img
        src={heroData.background}
        alt="Profile Beach Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 blur-md scale-110"
        style={{ filter: 'brightness(0.5) blur(8px)' }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <img
          src={heroData.background}
          alt="Profile Beach Album Cover"
          className="w-48 h-48 md:w-64 md:h-64 rounded-xl shadow-2xl border-4 border-white/20 object-cover object-center mb-6"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        />
        <div className="relative flex flex-col items-center w-full max-w-2xl">
          <div className="absolute inset-0 w-full h-full px-4 py-8 bg-black/40 rounded-xl backdrop-blur-sm" style={{ zIndex: 1 }} />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-accent-dark drop-shadow-lg relative" style={{ zIndex: 2 }}>
            {heroData.heading}
          </h1>
          <p className="text-xl md:text-2xl text-comfy-accent1 mb-6 max-w-2xl mx-auto relative whitespace-pre-line" style={{ zIndex: 2 }}>
            {heroData.tagline}
          </p>
        </div>
      </div>
      <div className="absolute bottom-8 w-full flex justify-center pointer-events-none">
        <span className="text-accent-dark text-lg animate-bounce opacity-80 select-none text-center block sm:hidden">Swipe or tap to enter</span>
        <span className="text-accent-dark text-lg animate-bounce opacity-80 select-none text-center hidden sm:block">Scroll or click to enter</span>
      </div>
    </div>
  );
};

export default HeroSection; 