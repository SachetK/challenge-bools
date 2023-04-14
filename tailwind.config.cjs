/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "nav-yellow": "#f5f1e3",
        tan: "#dddbcb",
      },
      backgroundImage: {
        "banner-image": "url('/images/banner-bg.png')",
      },
      fontFamily: {
        "sans-serif": ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
