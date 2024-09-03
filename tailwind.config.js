/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // 改为 'class' 而不是 'media'
  theme: {
    extend: {
      colors: {
        'coffee': '#6F4E37',
        'light-bg': '#e8e8e8',  // 更改为稍微深一点的灰色
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}