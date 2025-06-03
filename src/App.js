import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Footer from './components/Footer';
import GlobalAudioBar from './components/AudioPlayer/GlobalAudioBar';
import About from './components/About';
import InWork from './components/InWork';
import Services from './components/Services';
import Scoring from './components/Scoring';
import { useTheme } from './contexts/ThemeContext';

import ContactButton from './components/Contact/ContactButton';
import ContactForm from './components/Contact/ContactForm';

import Logo from './pictures/asailboat.png';
import { SunMoon, Sun } from 'lucide-react';

/**
 * App - Main application shell.
 * Handles global theming, navigation, and page routing.
 * Renders the global audio bar and footer.
 * @returns {JSX.Element}
 */
const App = () => {
    const isDevelopment = process.env.REACT_APP_ENV === 'development';
    const [isAdmin, setIsAdmin] = useState(isDevelopment);
    const { darkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAdmin(true);
        }
    }, []);

    return (
        <Router>
            <div
                className="w-full min-h-screen flex flex-col text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark bg-cover bg-center"
                style={{ backgroundImage: 'var(--main-bg-image)' }}
            >

                <nav className="relative z-10 p-4 border border-border-light dark:border-border-dark text-xl bg-surface-light dark:bg-surface-dark">
                    <div className="flex justify-between items-center max-w-full overflow-hidden">
                        <section className="ml-1 sm:ml-3 flex flex-row justify-between items-center">
                            <a href="https://linktr.ee/brandonamrgich" className="hidden sm:block">
                                <img src={Logo} height="36" width="36" alt="Brandon Mrgich" />
                            </a>
                            <button
                                onClick={toggleDarkMode}
                                className="mx-1 sm:mx-3 scale-70 sm:scale-100 text-sm sm:text-base text-text-light dark:text-text-dark"
                            >
                                {darkMode ? <Sun /> : <SunMoon />}
                            </button>
                        </section>
                        <ul className="flex space-x-4">
                            <li>
                                <Link
                                    to="/"
                                    className="text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark focus:text-accent-light dark:focus:text-accent-dark transition-color"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/in-work"
                                    className="text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark focus:text-accent-light dark:focus:text-accent-dark transition-color"
                                >
                                    <span className="hidden sm:inline md:inline">
                                        Work In Progress
                                    </span>
                                    <span className="inline sm:hidden">WIP</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services"
                                    className="text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark focus:text-accent-light dark:focus:text-accent-dark transition-color"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/scoring"
                                    className="text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark focus:text-accent-light dark:focus:text-accent-dark transition-color"
                                >
                                    Scoring
                                </Link>
                            </li>
                        </ul>
                        <div className="flex-shrink-0">
                            <ContactButton />
                        </div>
                    </div>
                </nav>

                <main className="flex flex-col flex-grow relative z-10">
                    <Routes>
                        <Route path="/" element={<About />} />
                        <Route path="/about" element={<About isAdmin={isAdmin} />} />
                        <Route path="/in-work" element={<InWork isAdmin={isAdmin} />} />
                        <Route path="/services" element={<Services isAdmin={isAdmin} />} />
                        <Route path="/scoring" element={<Scoring isAdmin={isAdmin} />} />
                    </Routes>
                </main>

                {/* Global audio bar for current playing track */}
                <GlobalAudioBar />
                <Footer />
                <div>
                    <ContactForm />
                </div>
            </div>
        </Router>
    );
};

export default App;
