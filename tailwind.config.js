/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { bg: '#07111F', card: '#101D2B', line: '#1d2f44', soft: '#16273a', lime: '#A8F000', electric: '#3d8bff', org: '#ff9b3d', danger: '#ff4d5e', mu: '#8fa3b8' },
      fontFamily: { sans: ['Sora', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
