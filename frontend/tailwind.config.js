/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7CA982",
          dark: "#152E2B",
          light: "#E0EEC6",
          lighter: "#F1F7ED",
        },
        secondary: {
          DEFAULT: "#A9827B",
        },
        tertiary: {
          DEFAULT: "#817BA9",
        },
        myWhite: "#f5f5f5",
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
