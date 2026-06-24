import type { Config } from 'tailwindcss'
import headlessui from '@headlessui/tailwindcss'

export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ask: {
          50: '#F1E4E8',
          100: '#EAD4DF',
          400: '#CB52B5',
          600: '#A32F8E',
          700: '#862574',
          gold: '#E0C13D',
          ink: '#23212B'
        }
      },
      boxShadow: {
        soft: '0 24px 70px -35px rgba(35, 33, 43, 0.28)',
        glow: '0 18px 55px -24px rgba(163, 47, 142, 0.58)'
      },
      backgroundImage: {
        'ask-mesh': 'radial-gradient(circle at 15% 20%, rgba(203,82,181,.24), transparent 34%), radial-gradient(circle at 86% 10%, rgba(224,193,61,.22), transparent 30%), linear-gradient(135deg, #23212B 0%, #34213A 52%, #A32F8E 140%)'
      }
    }
  },
  plugins: [headlessui]
} satisfies Config
