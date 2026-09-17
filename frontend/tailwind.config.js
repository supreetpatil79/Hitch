/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF8",
        foreground: "#09090B",
        hitchOrange: {
          DEFAULT: "#FF5C28",
          hover: "#E04818",
          light: "#FFF1EC",
        },
        hitchBlue: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        zincBorder: "#E4E4E7",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Instrument Serif", "serif"],
      },
    },
  },
  plugins: [],
}
