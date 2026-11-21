/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16'
        },
        civic: {
          blue: '#1d4ed8',
          blueHover: '#1e40af',
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#22c55e'
        }
      }
    },
  },
  plugins: [],
}
