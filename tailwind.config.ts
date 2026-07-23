import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6ff',
          200: '#b8ccff',
          300: '#8aa9ff',
          400: '#5c7fff',
          500: '#3654f5',
          600: '#2740d1',
          700: '#1f32a8',
          800: '#1c2b83',
          900: '#1b276b',
        },
        gold: {
          400: '#f4c95d',
          500: '#e8b13a',
          600: '#c8931f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
