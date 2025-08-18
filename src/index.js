import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';

import AppProvider from './contexts/AppProvider';

/**
 * Entry point for the React application.
 * Wraps the App in AppProvider for global context (theme, audio, etc).
 * Renders the app to the root DOM node.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppProvider>
        <App />
    </AppProvider>
    //<React.StrictMode>
    //    <AppProvider>
    //        <App />
    //    </AppProvider>
    //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

// Expose a lightweight global for deep-link copy of current times
if (!window.__APP__) window.__APP__ = {};
