import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Footer from "./components/Footer";
import About from "./components/About";
import InWork from "./components/InWork";
import Services from "./components/Services";
import Scoring from "./components/Scoring";

import Logo from "./pictures/asailboat.png";

/**
 * Main App component that sets up the router and navigation.
 * @returns {React.Component} The main App component
 */
const App = () => {
    const isDevelopment = process.env.REACT_APP_ENV === "development";
    const [isAdmin, setIsAdmin] = useState(isDevelopment);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // In a real application, you would verify the token here
            setIsAdmin(true);
        }
    }, []);

    return (
        <Router>
            <div className="min-h-screen flex flex-col text-comfy-dark bg-gradient-to-b from-comfy-light to-comfy-medium">
                <nav className="p-4 border border-comfy-medium text-xl">
                    <ul className="flex justify-center space-x-4">
                        <li>
                            <a href="https://linktr.ee/brandonamrgich">
                                <img src={Logo} height="24" width="24" alt="Brandon Mrgich" />
                            </a>
                        </li>

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
                                Work In Progress
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
                </nav>

                <main className="flex flex-col flex-grow min-h-screen">
                    <div>
                        <Routes>
                            <Route path="/" element={<About />} />
                            <Route path="/about" element={<About isAdmin={isAdmin} />} />
                            <Route path="/in-work" element={<InWork isAdmin={isAdmin} />} />
                            <Route path="/services" element={<Services isAdmin={isAdmin} />} />
                            <Route path="/scoring" element={<Scoring isAdmin={isAdmin} />} />
                        </Routes>
                    </div>

                    <Footer />
                </main>
            </div>
        </Router>
    );
};

export default App;
