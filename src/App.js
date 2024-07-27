import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Footer from "./components/Footer";
import About from "./components/About";
import InWork from "./components/InWork";
import Services from "./components/Services";

// import Login from "./components/Login";
// import Signup from "./components/Signup";

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
            <div className="app">
                <nav className="bg-gray-800 p-4">
                    <ul className="flex space-x-4">
                        <li>
                            <a href="https://linktr.ee/brandonamrgich">
                                <img
                                    src={Logo}
                                    height="24"
                                    width="24"
                                    alt="Brandon Mrgich"
                                />
                            </a>
                        </li>

                        <li>
                            <Link
                                to="/"
                                className="text-white hover:text-gray-300"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/in-work"
                                className="text-white hover:text-gray-300"
                            >
                                In Work
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/services"
                                className="text-white hover:text-gray-300"
                            >
                                Services
                            </Link>
                        </li>
                        {/*<li>
                            <Link
                                to="/login"
                                className="text-white hover:text-gray-300"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/signup"
                                className="text-white hover:text-gray-300"
                            >
                                Signup
                            </Link>
                        </li>*/}
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<About />} />
                    <Route
                        path="/about"
                        element={<About isAdmin={isAdmin} />}
                    />
                    <Route
                        path="/in-work"
                        element={<InWork isAdmin={isAdmin} />}
                    />
                    <Route
                        path="/services"
                        element={<Services isAdmin={isAdmin} />}
                    />
                    {/*<Route
                        path="/login"
                        element={<Login isAdmin={setIsAdmin} />}
                    />
                    <Route
                        path="/signup"
                        element={<Login isAdmin={setIsAdmin} />}
                    />*/}
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
