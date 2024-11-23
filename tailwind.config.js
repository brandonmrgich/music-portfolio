module.exports = {
    darkMode: 'class', // Enables class-based dark mode
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    light1: '#c9cba3',
                    light2: '#ffe1a8',
                    dark1: '#472d30',
                    dark2: '#723d46',
                    accent: '#e26d5c',
                    accent2: '#9C3938', // shirt color under coat
                },
                linktree: {
                    light: '#D1AE9F',
                    medium: '#a6987c',
                    dark: '#87625a',
                    accent: '#467599',
                    black: '#1d1e18',
                    gray: '#353535',
                },
                ac1: {
                    light: '#133A17',
                    medium: '#26472C',
                    dark: '#3A4B30',
                    accent: '#5D6F68',
                    black: '#173D1C',
                },
                comfylight: {
                    accent1: '#8F5A5A',
                    accent2: '#89A8C5',
                    light: '#E7E3DF',
                    medium: '#8B8C8A',
                    dark: '#2D2D2A',
                },
                comfy: {
                    accent1: '#B9807D',
                    accent2: '#467599',
                    tertiary: '#A199B2',
                    light: '#F2EBE3',
                    medium: '#E5D7C6',
                    dark: '#3F3E40',
                },
                comfydark: {
                    accent1: '#D1AE9F',
                    accent2: '#a6987c',
                    tertiary: '#87625a',
                    light: '#467599',
                    medium: '#1d1e18',
                    dark: '#353535',
                },
                overlay: 'rgba(0, 0, 0, .5)', // Add semi-transparent overlay
            },
            backgroundSize: {
                'size-200': '200%',
                'size-300': '300%',
            },
            blur: {
                xs: '2px',
                sm: '4px',
                md: '8px',
                lg: '16px',
                xl: '32px', // Optional: add an extreme blur for artistic effects
            },
            spacing: {
                128: '32rem', // Add larger spacing scale
                144: '36rem',
            },
            gridTemplateColumns: {
                // Custom grid templates
                'auto-fit': 'repeat(auto-fit, minmax(240px, 1fr))',
                'custom-layout': 'repeat(3, 1fr)', // Example of custom grid
            },
            boxShadow: {
                'inner-dark': 'inset 0 4px 6px rgba(0, 0, 0, 0.1)',
                'outer-light': '0 4px 6px rgba(255, 255, 255, 0.1)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'), // Add typography plugin for better text formatting
        require('@tailwindcss/aspect-ratio'), // Add aspect-ratio plugin for responsive media elements
    ],
    screens: {
        'xsm': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
    },
};
