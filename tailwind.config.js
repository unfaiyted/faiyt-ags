/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fg: "#f2ecbc",
        bg: "rgb(24 22 22 / 0.8)",
        border: "#f2ecbc",
      },
    },
  },
  plugins: [],
};
