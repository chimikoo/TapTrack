/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6D9773",
          dark: "#0C3B2E",
          light: "#E0EEC6",
          lighter: "#F1F7ED",
        },
        secondary: {
          DEFAULT: "#B46617",
        },
        tertiary: {
          DEFAULT: "#FFBA00",
        },
        myWhite: "#f5f5f5",
        myGray: "#C9C9C9",
        backgroundColorMenu: 'rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
