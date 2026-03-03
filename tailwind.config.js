/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bungee: ['Bungee', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        marvin: ['Marvin Visions', 'Bungee', 'cursive'],
      },
      colors: {
        /* Identidade: amarelo e vermelho forte + respiro em branco */
        'brand-yellow': '#ffed00',
        'brand-yellow-soft': '#fff7b3',
        'brand-red': '#e30613',
        'brand-red-hover': '#c10510',
        'surface': '#ffffff',
        'app-bg': '#fffdf5',
      },
      animation: {
        'pulse-active': 'pulse-active 2s infinite ease-in-out',
        'pulse-red': 'pulse-red 2s infinite',
      },
      keyframes: {
        'pulse-active': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(227, 6, 19, 0.35)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 8px rgba(227, 6, 19, 0)' },
        },
        'pulse-red': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(227, 6, 19, 0.5)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(227, 6, 19, 0)' },
        },
      },
    },
  },
  plugins: [],
}
