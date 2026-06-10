/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.3)',
          lighter: 'rgba(255, 255, 255, 0.4)',
          lightest: 'rgba(255, 255, 255, 0.5)',
          border: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.4)',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'hero-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        'hero-gradient-light': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      },
      boxShadow: {
        'glass-sm': '0 8px 32px rgba(31, 38, 135, 0.12)',
        'glass-md': '0 8px 32px rgba(31, 38, 135, 0.20)',
        'glass-lg': '0 8px 32px rgba(31, 38, 135, 0.30)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.6)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.8)' },
        },
      },
      transitionDuration: {
        '300': '300ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
