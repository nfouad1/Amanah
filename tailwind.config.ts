import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sanad logo palette: earthy browns, deep forest greens, warm golden accents
        primary: {
          50:  '#f5ede4',
          100: '#e8d5be',
          200: '#d4b08a',
          300: '#bf8a56',
          400: '#a86d35',
          500: '#8B5E3C', // earthy brown medium
          600: '#6F4A2A',
          700: '#5C3D1E', // earthy brown dark
          800: '#3D2710',
          900: '#1F1308',
        },
        secondary: {
          50:  '#fdf8e7',
          100: '#faefc4',
          200: '#f5e08a',
          300: '#eecf50',
          400: '#E6BC2A',
          500: '#D4A017', // warm gold
          600: '#B8860B',
          700: '#8B6508',
          800: '#5C4205',
          900: '#2E2103',
        },
        forest: {
          50:  '#e8f5ee',
          100: '#c8e8d6',
          200: '#95d1ae',
          300: '#62b986',
          400: '#3D9E68',
          500: '#2D6A4F', // deep forest green
          600: '#1F5038',
          700: '#1A3D2B', // darkest forest
          800: '#102618',
          900: '#081308',
        },
        warm: {
          50:  '#faf7f4',
          100: '#f0ebe4',
          200: '#ddd3c7',
          300: '#c4b5a5',
          400: '#a89280',
          500: '#8B7355',
          600: '#6B5840',
          700: '#4F4030',
          800: '#342A1F',
          900: '#1A1510',
        },
        neutral: {
          50:  '#fafaf9',
          100: '#f5f4f3',
          200: '#e8e6e4',
          300: '#d4d1ce',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
    },
  },
  plugins: [],
};
export default config;
