/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zenith: {
          teal: '#03CCAB',
          strong: '#02B396',
          light: '#E1FAFA',
          dark: '#30628C',
        },
      },
    },
  },
  plugins: [],
}
