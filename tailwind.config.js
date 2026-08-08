/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f4f6fb',
        sidebar: '#ffffff',
        card: {
          DEFAULT: '#ffffff',
          hover: '#f8fafc',
        },
        border: {
          subtle: '#e2e8f0',
          strong: '#cbd5e1',
        },
        brand: {
          DEFAULT: '#2b00d9',
          hover: '#1f00a8',
          light: '#eef2ff',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted: '#475569',
          subtle: '#64748b',
          tertiary: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
