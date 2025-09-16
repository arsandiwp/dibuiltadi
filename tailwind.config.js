/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#048fea",
          dark: "#000e17",
          light: "#e6f4fd",
        },
        secondary: {
          DEFAULT: "#3B82F6",
        },
        error: {
          DEFAULT: "#EF4444",
        },
        success: {
          DEFAULT: "#22C55E",
        },
      },
    },
  },
  plugins: [],
};
