/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bnb': '#F0B90B',
        'pancake': '#00ADE8',
        'alpaca': '#00A86B',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        sans: ['Nunito', 'serif'], // Gunakan font ini untuk teks sans default
      },
    },
  },
  plugins: [],
}
