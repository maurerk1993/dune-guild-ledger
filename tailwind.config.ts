import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        dune: {
          night: '#101722',
          sand: '#dac8a1',
          gold: '#e4b85d',
          azure: '#5c8db8'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
