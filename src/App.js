import React, { useRef, useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InWorkSection from './components/InWorkSection';
import ServicesSection from './components/ServicesSection';
import ScoringSection from './components/ScoringSection';
import AboutSection from './components/AboutSection';
import ContactModal from './components/Contact/ContactModal';
import GlobalAudioBar from './components/AudioPlayer/GlobalAudioBar';
import Footer from './components/Footer';
import backgroundImg from './assets/images/background1.jpg';
import SectionDivider from './components/SectionDivider';
import beachImg from './assets/images/profile-beach.jpeg';

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
    const aboutRef = useRef(null);
    const [scrollLocked, setScrollLocked] = useState(true);

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
            scoringRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 10);
    }, [scrollLocked]);

    return (
        <div className="w-full min-h-screen flex flex-col text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            <Navbar
                refs={{
                    hero: heroRef,
                    inwork: inWorkRef,
                    services: servicesRef,
                    scoring: scoringRef,
                    about: aboutRef,
                }}
            />
            <main className="flex flex-col flex-grow relative z-10">
                <section ref={heroRef} id="hero"><HeroSection onHeroExit={unlockAndScroll} scrollLocked={scrollLocked} /></section>
                <SectionDivider variant={1} />
                <section ref={scoringRef} id="scoring"><ScoringSection /></section>
                <SectionDivider variant={0} />
                <section ref={inWorkRef} id="inwork" className="scroll-mt-24"><InWorkSection /></section>
                <SectionDivider variant={0} />
                <section ref={servicesRef} id="services"><ServicesSection /></section>
                <SectionDivider variant={0} />
                <section ref={aboutRef} id="about"><AboutSection /></section>
            </main>
            <GlobalAudioBar />
            <Footer />
            <ContactModal />
        </div>
    );
};

export default App;
