/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        error: "red",
        light: "#838383",
        lightBg: "#fafafa",
        lightPrimary: "#60C2CF",
        box: "#ECF9FF",
        boxBorder: "#73CAEE",
        secondary: "#87CEEB",
        lightSecondary: "#73CAEE",
        primary: "#000050",
        text: "#003334",
        white: "#fff",
        border: "#efefef",
      },
    },
  },
  plugins: [],
};
