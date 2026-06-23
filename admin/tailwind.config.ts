import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ask: {
          50: '#F1E4E8',
          400: '#CB52B5',
          600: '#A32F8E',
          gold: '#E0C13D',
          ink: '#23212B'
        }
      }
    }
  },
  plugins: []
} satisfies Config
