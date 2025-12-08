import React, { useState, useEffect, useRef } from 'react';
import ContentLinks from '../utils/ContentLinks';
import { useAdmin } from '../contexts/AdminContext';
import Login from './Login';

const navLinks = [
  { label: 'Home', section: 'hero' },
  { label: 'Mixing & Mastering', section: 'services' },
  { label: 'Film & Game Scoring', section: 'scoring' },
  { label: 'In Work', section: 'inwork' },
  { label: 'Projects', section: 'projects' },
  { label: 'Contact', section: 'contact' },
];

const Navbar = ({ refs, setShowLogin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const { isAdmin, logout } = useAdmin();

  useEffect(() => {
    const SCROLL_THRESHOLD = 20;
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > lastScrollY.current + SCROLL_THRESHOLD) {
            setHidden(true); // Hide on scroll down
            lastScrollY.current = currentY;
          } else if (currentY < lastScrollY.current - SCROLL_THRESHOLD) {
            setHidden(false); // Show on scroll up
            lastScrollY.current = currentY;
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (section) => {
    setMenuOpen(false);
    const ref = refs[section];
    console.log('Scrolling to section:', section, ref?.current);
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 px-4 py-3 flex items-center justify-between bg-card-dark border-b border-border-dark shadow-md backdrop-blur-md transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center space-x-2">
        {isAdmin ? (
          <>
            <a href="https://linktr.ee/brandonamrgich" target="_blank" rel="noopener noreferrer" aria-label="Linktree">
              <img src="/asailboat.png" alt="Logo" className="h-9 w-9 rounded-full hover:scale-105 transition-transform duration-200" />
            </a>
            <button onClick={logout} className="ml-4 px-3 py-1 rounded bg-accent-dark text-white text-sm">Logout</button>
          </>
        ) : (
          <button 
            onClick={() => setShowLogin(true)} 
            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
            aria-label="Admin Login"
          >
            <img src="/asailboat.png" alt="Logo" className="h-9 w-9 rounded-full" />
          </button>
        )}
      </div>
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <span className="block w-6 h-0.5 bg-accent-dark mb-1"></span>
          <span className="block w-6 h-0.5 bg-accent-dark mb-1"></span>
          <span className="block w-6 h-0.5 bg-accent-dark"></span>
        </button>
      </div>
      <ul className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <li key={link.section}>
            <button
              onClick={() => handleScroll(link.section)}
              className="text-text-dark hover:text-accent-dark transition-colors font-medium"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
      {/* Mobile menu */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-card-dark flex flex-col items-center space-y-4 py-4 shadow-lg md:hidden backdrop-blur-md">
          {navLinks.map((link) => (
            <li key={link.section}>
              <button
                onClick={() => handleScroll(link.section)}
                className="text-text-dark hover:text-accent-dark transition-colors font-medium text-lg"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar; 