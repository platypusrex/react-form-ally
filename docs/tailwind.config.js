/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minHeight: {
        full: 'calc(100vh - 4rem)',
      },
    },
  },
  plugins: [],
};
