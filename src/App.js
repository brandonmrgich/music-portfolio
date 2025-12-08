import React, { useRef, useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InWorkSection from './components/InWorkSection';
import ServicesSection from './components/ServicesSection';
import ScoringSection from './components/ScoringSection';
import ContactModal from './components/Contact/ContactModal';
import GlobalAudioBar from './components/AudioPlayer/GlobalAudioBar';
import Footer from './components/Footer';
import SectionDivider from './components/SectionDivider';
import lakaBanner from './assets/images/laka-noch/banner.png';
import AppProvider from './contexts/AppProvider';
import { useAdmin } from './contexts/AdminContext';
import Login from './components/Login';
import ProjectSelector from './components/Projects/ProjectSelector';
import ProjectView from './components/Projects/ProjectView';
import ContactSection from './components/ContactSection';

/**
 * App - Main application shell.
 * Handles global theming, navigation, and page routing.
 * Renders the global audio bar and footer.
 * @returns {JSX.Element}
 */
const App = () => {
    // Refs for smooth scroll navigation
    const heroRef = useRef(null);
    const inWorkRef = useRef(null);
    const servicesRef = useRef(null);
    const scoringRef = useRef(null);
    const projectsRef = useRef(null);
    const contactRef = useRef(null);
    const [scrollLocked, setScrollLocked] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const { isAdmin } = useAdmin();

    // Lock scroll on mount
    useEffect(() => {
        if (scrollLocked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [scrollLocked]);

    // Handler to unlock scroll and scroll to next section
    const unlockAndScroll = useCallback(() => {
        if (!scrollLocked) return;
        setScrollLocked(false);
        setTimeout(() => {
            servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 10);
    }, [scrollLocked]);

    return (
        <AppProvider>
            <div
                className="w-full min-h-screen flex flex-col text-text-light dark:text-text-dark"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(21,24,38,0.88), rgba(14,17,22,0.92)), url(${lakaBanner})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto 360px',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center top',
                    backgroundBlendMode: 'overlay',
                }}
            >
                <Navbar
                    refs={{
                        hero: heroRef,
                        services: servicesRef,
                        scoring: scoringRef,
                        inwork: inWorkRef,
                        projects: projectsRef,
                        // about: aboutRef,
                        contact: contactRef,
                    }}
                    setShowLogin={setShowLogin}
                />
                <main className="flex flex-col flex-grow relative z-10">
                    <section ref={heroRef} id="hero"><HeroSection onHeroExit={unlockAndScroll} scrollLocked={scrollLocked} /></section>
                    <SectionDivider variant={1} />
                    <section ref={servicesRef} id="services"><ServicesSection /></section>
                    <SectionDivider variant={0} />
                    <section ref={scoringRef} id="scoring"><ScoringSection /></section>
                    <SectionDivider variant={0} />
                    <section ref={inWorkRef} id="inwork" className="scroll-mt-24"><InWorkSection /></section>
                    <SectionDivider variant={0} />
                    {/* About section now showcases the Project Selector */}
                    <section ref={projectsRef} id="projects"><ProjectSelector /></section>
                    <SectionDivider variant={0} />
                    {/* New Contact section with contact info previously in About */}
                    <section ref={contactRef} id="contact"><ContactSection /></section>
                </main>
                <GlobalAudioBar />
                <Footer />
                <ContactModal />
                {/* Project View Overlay */}
                <ProjectView />
                {/* Login Modal rendered at root level for proper overlay */}
                {showLogin && !isAdmin && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-xs flex flex-col items-center justify-center">
                      <button onClick={() => setShowLogin(false)} className="absolute top-2 right-2 text-gray-500">&times;</button>
                      <Login onSuccess={() => setShowLogin(false)} />
                    </div>
                  </div>
                )}
            </div>
        </AppProvider>
    );
};

export default App;
