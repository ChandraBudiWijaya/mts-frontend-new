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
          50: '#f0f9f4',
          100: '#dcf4e3',
          200: '#bce8ca',
          300: '#8fd5a5',
          400: '#5abe78',
          500: '#1e8e3e',
          600: '#1a7a37',
          700: '#176a31',
          800: '#15552a',
          900: '#134725',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
