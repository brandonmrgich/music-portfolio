import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage for the initial value
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme ? JSON.parse(savedTheme) : false; // Default to light mode if no value is saved
    });

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newValue = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newValue)); // Save new value
            return newValue;
        });
    };

    // Ensure the body class updates on initial render
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
