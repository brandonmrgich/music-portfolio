module.exports = {
    darkMode: 'class', // Enables class-based dark mode
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
				fontFamily: {
					// Elegant serif for headings
					heading: ['"Spectral"', 'serif'],
					// Clean sans for body
					sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				},
            // Modern, soft pastel/tan semantic tokens for the site (all rgba for easy tweaking)
            colors: {
                surface: {
					light: 'rgb(232, 225, 218)',
					// Deep, muted near-black for dark backgrounds (softer than pure black)
					dark: '#0e1116',
                },
                card: {
					light: 'rgba(255,247,241,1)', // #FFF7F1
					// Dark glassy panel color with slight purple tint (subtle lift)
					dark: '#151826',
                },
                button: {
					light: 'rgba(70, 117, 153, .5)', // #467599
					// Muted pastel green for primary CTA buttons on dark
					dark: '#9ec7b0',
                },
                buttonText: {
					light: 'rgba(255,255,255,1)',
					// Ensure strong contrast on pastel buttons
					dark: '#0e1116',
                },
                text: {
					light: 'rgb(64, 62, 62)',
					// High-contrast off-white for readability on dark
					dark: '#e6e9ef',
                },
                playercardText: {
					// Secondary text on cards/players (muted, readable)
					light: '#5f6b7a',
					dark: '#a8b4c2',
                },
                border: {
					light: 'rgb(203, 191, 175)', // #E5D7C6
					// Subtle outline for dark cards/panels
					dark: '#2a2f3a',
                },
                accent: {
					light: 'rgba(70, 117, 153, 1)', // #467599
					// Pastel purple accent for highlights on dark
					dark: '#b7a6e0',
                },
				// Optional secondary accent (pastel green) for selective highlights
				accent2: {
					dark: '#a7d3b9',
				},
                playicon: {
                    light: 'rgba(63,62,64,1)',    // #3F3E40
                    dark: 'rgba(248,245,242,.5)', // #F8F5F2
                },
				// Additional muted pastel accents suitable for dark UI
				muted: {
					green: '#a8c8b1',
					purple: '#c1b0e3',
					amber: '#c8a77f',
					rose: '#c19aa3',
					indigo: '#9aa3d6',
				},
				// Dark glass overlay for modals/overlays
				overlay: 'rgba(10, 12, 18, .55)',
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
