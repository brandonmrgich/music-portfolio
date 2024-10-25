import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// TODO: Look up standard way to check tailwind config for dark mode
//import tailwindConfig from '../../tailwind.config';
//const light = tailwindConfig.theme.extend.colors.comfy;
//const dark = tailwindConfig.theme.extend.colors.comfydark;

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        console.log('Changing theme');
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
