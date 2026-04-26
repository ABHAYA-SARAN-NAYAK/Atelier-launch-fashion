/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FAFAF8',
          dark: '#0A0A0A',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1A1A1A',
        },
        primary: {
          DEFAULT: '#0A0A0A',
          light: '#0A0A0A',
          dark: '#FAFAF8',
        },
        secondary: {
          DEFAULT: '#6B6B6B',
          light: '#6B6B6B',
          dark: '#B3B3B3',
        },
        accent: '#D4AF6A',
        cta: '#FF6B6B',
        border: {
          light: '#E5E5E5',
          dark: '#2A2A2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}