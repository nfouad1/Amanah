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
        // Sanad logo-inspired color palette
        primary: {
          50: '#f5f0f5',
          100: '#ead5e9',
          200: '#d5abd3',
          300: '#c081bd',
          400: '#ab57a7',
          500: '#8B4789', // Main purple from logo
          600: '#6f396e',
          700: '#532b52',
          800: '#371c37',
          900: '#1b0e1b',
        },
        secondary: {
          50: '#fefef5',
          100: '#fcfce8',
          200: '#f9f9d1',
          300: '#d4d47a',
          400: '#b8b85f',
          500: '#9B9B4A', // Olive green from logo
          600: '#7c7c3b',
          700: '#5d5d2c',
          800: '#3e3e1e',
          900: '#1f1f0f',
        },
        warm: {
          50: '#fef9f3',
          100: '#fdf3e7',
          200: '#fbe7cf',
          300: '#f7d4a7',
          400: '#f3c17f',
          500: '#E8B67C', // Peach/orange from logo
          600: '#d99a5a',
          700: '#b57d47',
          800: '#8a5f36',
          900: '#5f4125',
        },
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
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
