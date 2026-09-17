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
        hitchEmerald: {
          DEFAULT: "#10B981",
          hover: "#059669",
          light: "#ECFDF5",
        },
        zincBorder: "#E4E4E7",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Instrument Serif", "serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
}
