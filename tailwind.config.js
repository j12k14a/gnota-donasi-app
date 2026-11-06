/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gnota: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffe',
          300: '#7cc3fd',
          400: '#36a2fa',
          500: '#0c87eb',
          600: '#0070cc',
          700: '#0059a4',
          800: '#034a86',
          900: '#083e6f',
          950: '#052749',
          yellow: '#f59e0b',
          gold: '#eab308',
        }
      }
    },
  },
  plugins: [],
}
