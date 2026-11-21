/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', '-apple-system', 'BlinkMacSystemFont', 'Roboto', '"Helvetica Neue"', 'sans-serif'],
      },
      colors: {
        fluent: {
          blue: '#0078d4',
          blueHover: '#106ebe',
          bluePressed: '#005a9e',
          blueTint: '#eff6fc',
          bg: '#f5f5f5',
          surface: '#ffffff',
          subtle: '#fafafa',
          hover: '#f0f2f5',
          border: '#e5e7eb',
          borderStrong: '#d1d5db',
          text: '#242424',
          textSecondary: '#616161',
          textTertiary: '#757575',
          // Status tokens
          criticalText: '#c42b1c',
          criticalBg: '#fde7e9',
          criticalBorder: '#f8b8bc',
          highText: '#bc4b09',
          highBg: '#fef0eb',
          highBorder: '#f9cebe',
          mediumText: '#8a6100',
          mediumBg: '#fff4ce',
          mediumBorder: '#feec9e',
          lowText: '#107c41',
          lowBg: '#dff6dd',
          lowBorder: '#a8e5ab',
          infoText: '#0078d4',
          infoBg: '#eff6fc',
          infoBorder: '#b4d6fa'
        }
      },
      boxShadow: {
        'fluent-2': '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.06), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.04)',
        'fluent-4': '0 3.2px 7.2px 0 rgba(0, 0, 0, 0.08), 0 0.6px 1.8px 0 rgba(0, 0, 0, 0.05)',
        'fluent-8': '0 6.4px 14.4px 0 rgba(0, 0, 0, 0.11), 0 1.2px 3.6px 0 rgba(0, 0, 0, 0.07)',
        'fluent-16': '0 12.8px 28.8px 0 rgba(0, 0, 0, 0.14), 0 2.4px 7.2px 0 rgba(0, 0, 0, 0.09)'
      },
      borderRadius: {
        'fluent-sm': '4px',
        'fluent-md': '6px',
        'fluent-lg': '8px',
        'fluent-xl': '12px'
      }
    },
  },
  plugins: [],
}
