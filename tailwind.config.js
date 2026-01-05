/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        dashboard: {
          dark: '#0a0e1a',
          card: '#151a28',
          green: '#00ff88',
          orange: '#ff6b35',
          blue: '#3b82f6',
        },
        analytics: {
          green: '#4ade80',
          purple: '#a855f7',
          gray: '#f3f4f6',
          dark: '#1f2937',
        },
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-purple-light': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
        'gradient-slate': 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #faf9f7 0%, #f5f3f0 50%, #edeae5 100%)',
        'gradient-cool': 'linear-gradient(135deg, #f7f8fa 0%, #f0f2f5 50%, #e8ebef 100%)',
        'gradient-slate-dark': 'linear-gradient(135deg, #1a1d24 0%, #252932 50%, #2d3239 100%)',
        'gradient-warm-dark': 'linear-gradient(135deg, #1f1e1c 0%, #2a2825 50%, #34322e 100%)',
        'gradient-cool-dark': 'linear-gradient(135deg, #1a1d24 0%, #22252d 50%, #2a2e36 100%)',
      },
    },
  },
  plugins: [],
}

