module.exports = {
    darkMode: 'class', // Enables class-based dark mode
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            // Modern, soft pastel/tan semantic tokens for the site (all rgba for easy tweaking)
            colors: {
                surface: {
                    light: 'rgb(232, 225, 218)', //rgb(89, 67, 45)
                    dark: 'rgba(35, 35, 43, 0.5)',    // #23232B
                },
                card: {
                    light: 'rgba(255,247,241,1)', // #FFF7F1
                    dark: 'rgba(44,44,54,1)',    // #2C2C36
                },
                button: {
                    light: 'rgba(70, 117, 153, .5)', // #467599
                    dark: 'rgb(212, 153, 149)', // #F7B2AD
                },
                buttonText: {
                    light: 'rgba(255,255,255,1)', // #fff
                    dark: 'rgba(35,35,43,1)',    // #23232B
                },
                text: {
                    light: 'rgb(64, 62, 62)',    // #3F3E40
                    dark: 'rgba(248,245,242,1)', // #F8F5F2
                },
                playercardText: {
                    light: 'rgba(185,128,125,1)', // soft pastel red, matches comfy.accent1
                    dark: 'rgba(247,178,173,1)', // blush pastel for dark mode
                },
                border: {
                    light: 'rgb(203, 191, 175)', // #E5D7C6
                    dark: 'rgba(58,58,74,1)',    // #3A3A4A
                },
                accent: {
                    light: 'rgba(70, 117, 153, 1)', // #467599
                    dark: 'rgba(247,178,173,1)', // #A3BFFA
                },
                playicon: {
                    light: 'rgba(63,62,64,1)',    // #3F3E40
                    dark: 'rgba(248,245,242,.5)', // #F8F5F2
                },
                // For page background gradient, use Tailwind's bg-gradient-to-b from-surface-light to-card-light
                // Keep original palette for reference/legacy
                primary: {
                    light1: '#c9cba3',
                    light2: '#ffe1a8',
                    dark1: '#472d30',
                    dark2: '#723d46',
                    accent: '#e26d5c',
                    accent2: '#9C3938',
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
                overlay: 'rgba(0, 0, 0, .5)',
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
                xl: '32px',
            },
            spacing: {
                128: '32rem',
                144: '36rem',
            },
            gridTemplateColumns: {
                'auto-fit': 'repeat(auto-fit, minmax(240px, 1fr))',
                'custom-layout': 'repeat(3, 1fr)',
            },
            boxShadow: {
                'inner-dark': 'inset 0 4px 6px rgba(0, 0, 0, 0.1)',
                'outer-light': '0 4px 6px rgba(255, 255, 255, 0.1)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
    screens: {
        'xsm': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
    },
    // CSS variable-based background images for modular theming
    // In your global CSS (e.g., index.css):
    // :root { --main-bg-image: url('/background1.jpg'); }
    // .dark { --main-bg-image: url('/background1.jpg'); }
    // Then in your main container: style={{ backgroundImage: 'var(--main-bg-image)' }}
};
