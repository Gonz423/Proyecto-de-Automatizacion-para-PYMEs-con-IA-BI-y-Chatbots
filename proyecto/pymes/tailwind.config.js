/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#C1E8FF',
          100: '#A8DEFF',
          200: '#7DA0CA',
          300: '#5483B3',
          400: '#052659',
          500: '#021024',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}