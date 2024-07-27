import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Footer from "./components/Footer";
import About from "./components/About";
import InWork from "./components/InWork";
import Services from "./components/Services";

import Logo from "./pictures/asailboat.png";

/**
 * Main App component that sets up the router and navigation.
 * @returns {React.Component} The main App component
 */
const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4">
            <li>
              <a href="https://linktr.ee/brandonamrgich">
                <img src={Logo} height="24" width="24" alt="Brandon Mrgich" />
              </a>
            </li>

            <li>
              <Link to="/" className="text-white hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/in-work" className="text-white hover:text-gray-300">
                In Work
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-white hover:text-gray-300">
                Services
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/in-work" element={<InWork />} />
          <Route path="/services" element={<Services />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
