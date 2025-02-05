import React from 'react';
import { AudioProvider } from './AudioContext';
import { ContactProvider } from './ContactContext';
import { ThemeProvider } from './ThemeContext';

// All providers will be nested here
const AppProvider = ({ children }) => {
    return (
        <ThemeProvider>
            <AudioProvider>
                <ContactProvider>{children}</ContactProvider>
            </AudioProvider>
        </ThemeProvider>
    );
};

export default AppProvider;
