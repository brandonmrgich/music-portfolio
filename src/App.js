import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import About from "./components/About";
import InWork from "./components/InWork";
import Services from "./components/Services";

/**
 * Main App component that sets up the router and navigation.
 * @returns {React.Component} The main App component
 */
const App = () => {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/in-work">In Work</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/" component={About} />
          <Route path="/in-work" component={InWork} />
          <Route path="/services" component={Services} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
