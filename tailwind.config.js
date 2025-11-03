/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        danger: "#ef4444",
      }
    },
  },
  plugins: [],
}
