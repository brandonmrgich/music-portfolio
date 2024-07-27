module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#a8c0ff", // Example background color
        link: "#3f6c9b", // Example link color
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
