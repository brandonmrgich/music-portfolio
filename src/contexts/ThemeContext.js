/**
 * ThemeContext - React context for managing dark/light mode theme.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * ThemeProvider - Provides darkMode state and toggle function.
 * Persists theme preference in localStorage and updates body class.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const ThemeProvider = ({ children }) => {
    // Initialize darkMode from localStorage, default to false (light mode)
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    /**
     * Toggle dark mode and persist preference to localStorage.
     */
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newValue = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newValue));
            return newValue;
        });
    };

    // Update body class on theme change
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

/**
 * useTheme - React hook to access theme state and controls.
 * @returns {object} Theme context value
 */
export const useTheme = () => useContext(ThemeContext);
