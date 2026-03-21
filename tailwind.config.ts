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
        // Sanad logo color palette: Muted Coral, Soft Mustard Yellow, Deep Warm Grey
        primary: {
          50:  '#fdf4f2',
          100: '#fbe4de',
          200: '#f6c9be',
          300: '#eeaa97',
          400: '#e48a74',
          500: '#C8705A', // Muted Coral (main)
          600: '#a85848',
          700: '#874237',
          800: '#5e2e26',
          900: '#3a1b17',
        },
        secondary: {
          50:  '#fdfbf0',
          100: '#faf5d9',
          200: '#f4eab3',
          300: '#ecdb87',
          400: '#e0c95e',
          500: '#C9A84C', // Soft Mustard Yellow
          600: '#a68838',
          700: '#7f6629',
          800: '#57441b',
          900: '#30250e',
        },
        warm: {
          50:  '#f7f6f5',
          100: '#edecea',
          200: '#d9d7d4',
          300: '#bfbcb8',
          400: '#a09c97',
          500: '#6B6560', // Deep Warm Grey
          600: '#524e4a',
          700: '#3d3a37',
          800: '#282624',
          900: '#161412',
        },
        accent: {
          50:  '#fdf4f2',
          100: '#fbe4de',
          200: '#f6c9be',
          300: '#eeaa97',
          400: '#e48a74',
          500: '#C8705A',
          600: '#a85848',
          700: '#874237',
          800: '#5e2e26',
          900: '#3a1b17',
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
