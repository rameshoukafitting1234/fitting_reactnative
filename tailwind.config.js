/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#06b6d4",
      },

      fontSize: {
        "2xs": "10px",
      },

      fontFamily: {
        jakarta: ["var(--font-plus-jakarta-sans)"],
        inter: ["var(--font-inter)"],
        mono: ["monospace"],
      },

      boxShadow: {
        soft: "0px 2px 10px rgba(0,0,0,0.1)",
        hard: "0px 3px 10px rgba(0,0,0,0.2)",
      },
    },
  },

  plugins: [],
};