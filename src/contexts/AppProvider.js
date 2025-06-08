import React from 'react';
import { AudioProvider } from './AudioContext';
import { ContactProvider } from './ContactContext';
import { ThemeProvider } from './ThemeContext';
import { AdminProvider } from './AdminContext';

// All providers will be nested here
const AppProvider = ({ children }) => {
    return (
        <AdminProvider>
            <ThemeProvider>
                <AudioProvider>
                    <ContactProvider>{children}</ContactProvider>
                </AudioProvider>
            </ThemeProvider>
        </AdminProvider>
    );
};

export default AppProvider;
