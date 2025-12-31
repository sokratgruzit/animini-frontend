import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0a0a0a',
          indigo: '#6366f1',
          emerald: '#10b981',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
