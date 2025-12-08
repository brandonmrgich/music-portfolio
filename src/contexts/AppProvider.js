import React from 'react';
import { AudioProvider } from './AudioContext';
import { ContactProvider } from './ContactContext';
import { ThemeProvider } from './ThemeContext';
import { AdminProvider } from './AdminContext';
import { ProjectProvider } from './ProjectContext';

// All providers will be nested here
const AppProvider = ({ children }) => {
    return (
        <AdminProvider>
            <ThemeProvider>
                <AudioProvider>
                    <ContactProvider>
                        <ProjectProvider>{children}</ProjectProvider>
                    </ContactProvider>
                </AudioProvider>
            </ThemeProvider>
        </AdminProvider>
    );
};

export default AppProvider;
