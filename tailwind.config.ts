import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic Dark Palette
        dark: {
          base: '#020617',
          card: '#0f172a',
        },
        // Action & Status Colors
        brand: {
          primary: '#6366f1',
          success: '#10b981',
          danger: '#f43f5e',
          warning: '#f59e0b',
        },
        // Typography Hierarchy
        surface: {
          100: '#ffffff', // High emphasis
          200: '#94a3b8', // Medium (secondary)
          300: '#64748b', // Low (muted)
        },
        // System tokens for Glassmorphism
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.08)',
        },
      },
      // Special Typography tokens
      letterSpacing: {
        'super-wide': '0.2em',
      },
      fontSize: {
        micro: '10px',
      },
      // Effects
      boxShadow: {
        'brand-glow': '0 0 20px rgba(99, 102, 241, 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;
