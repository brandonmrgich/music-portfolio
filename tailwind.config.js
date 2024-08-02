module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: "#D6EAF8",
                    DEFAULT: "#3498DB",
                    dark: "#2C3E50",
                },
                secondary: {
                    light: "#F9EBEA",
                    DEFAULT: "#E74C3C",
                    dark: "#78281F",
                },
                accent: {
                    light: "#FDEBD0",
                    DEFAULT: "#F39C12",
                    dark: "#7E5109",
                },
            },
        },
    },
    // theme: {
    //     extend: {
    //         colors: {
    //             background: "#a8c0ff", // Example background color
    //             link: "#3f6c9b", // Example link color
    //         },
    //     },
    // },
    plugins: [require("@tailwindcss/forms")],
};
