/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        success: "#2ECC71",
        warning: "#F39C12",
        danger: "#E74C3C",
        dark: "#2C3E50",
        light: "#ECF0F1",
        bg: "#F8F9FA",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
}
