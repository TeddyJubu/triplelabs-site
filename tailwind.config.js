/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        page: '#0a0a0a',
        card: '#121212',
        text: {
          DEFAULT: '#EDEDED',
          muted: '#999999',
          dark: '#444444'
        },
        brand: {
          orange: '#FF3D00',
          purple: '#7C3AED',
          yellow: '#FFD600'
        }
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    }
  },
  plugins: [],
}
