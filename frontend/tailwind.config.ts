import type { Config } from 'tailwindcss'
import headlessui from '@headlessui/tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [headlessui]
} satisfies Config
