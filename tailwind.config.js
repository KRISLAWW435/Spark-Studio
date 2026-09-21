/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spark: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF9600',
          600: '#EA580C',
          700: '#CC7700',
          800: '#9A3412',
          900: '#7C2D12',
        },
      },
    },
  },
  plugins: [],
};
