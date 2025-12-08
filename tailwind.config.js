module.exports = {
    darkMode: 'class', // Enables class-based dark mode
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            // Modern, soft pastel/tan semantic tokens for the site (all rgba for easy tweaking)
            colors: {
                surface: {
					light: 'rgb(232, 225, 218)',
					// Deep, muted blue-gray for dark backgrounds (nearly black, but softer)
					dark: '#0e1116',
                },
                card: {
					light: 'rgba(255,247,241,1)', // #FFF7F1
					// Dark glassy panel color (subtle lift from surface.dark)
					dark: '#151a23',
                },
                button: {
					light: 'rgba(70, 117, 153, .5)', // #467599
					// Muted accent for buttons on dark
					dark: '#8aa9b7',
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
					// Muted teal-blue pastel used across CTAs/highlights
					dark: '#9bb8c7',
                },
                playicon: {
                    light: 'rgba(63,62,64,1)',    // #3F3E40
                    dark: 'rgba(248,245,242,.5)', // #F8F5F2
                },
				// Additional muted pastel accents suitable for dark UI
				muted: {
					blue: '#93a4b2',
					teal: '#87a8a3',
					mauve: '#b7a6c7',
					amber: '#c9a479',
					rose: '#b98c92',
					indigo: '#8f9ac8',
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
