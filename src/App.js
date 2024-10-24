import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Footer from './components/Footer';
import About from './components/About';
import InWork from './components/InWork';
import Services from './components/Services';
import Scoring from './components/Scoring';

import ContactButton from './components/Contact/ContactButton';
import ContactForm from './components/Contact/ContactForm';

import Logo from './pictures/asailboat.png';

const App = () => {
    const isDevelopment = process.env.REACT_APP_ENV === 'development';
    const [isAdmin, setIsAdmin] = useState(isDevelopment);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAdmin(true);
        }
    }, []);

    return (
        <Router>
            <div className="min-h-screen flex flex-col text-comfy-dark bg-gradient-to-b from-comfy-light to-comfy-medium">
                <nav className="p-4 border border-comfy-medium text-xl">
                    <div className="flex justify-between items-center">
                        <a href="https://linktr.ee/brandonamrgich">
                            <img src={Logo} height="36" width="36" alt="Brandon Mrgich" />
                        </a>

                        <ul className="flex space-x-4">
                            <li>
                                <Link
                                    to="/"
                                    className="text-comfy-dark hover:text-comfy-accent1 focus:text-comfy-accent2 transition-color"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/in-work"
                                    className="text-comfy-dark hover:text-comfy-accent1 focus:text-comfy-accent2 transition-color"
                                >
                                    <span className="hidden sm:inline">Work In Progress</span>
                                    <span className="inline sm:hidden">WIP</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services"
                                    className="text-comfy-dark hover:text-comfy-accent1 focus:text-comfy-accent2 transition-color"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/scoring"
                                    className="text-comfy-dark hover:text-comfy-accent1 focus:text-comfy-accent2 transition-color"
                                >
                                    Scoring
                                </Link>
                            </li>
                        </ul>

                        <div>
                            <ContactButton />
                        </div>
                    </div>
                </nav>

                <main className="flex flex-col flex-grow">
                    <Routes>
                        <Route path="/" element={<About />} />
                        <Route path="/about" element={<About isAdmin={isAdmin} />} />
                        <Route path="/in-work" element={<InWork isAdmin={isAdmin} />} />
                        <Route path="/services" element={<Services isAdmin={isAdmin} />} />
                        <Route path="/scoring" element={<Scoring isAdmin={isAdmin} />} />
                    </Routes>
                </main>

                <Footer />
                <ContactForm />
            </div>
        </Router>
    );
};

export default App;
