/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030303',
          900: '#0a0a0a',
          850: '#111111',
          800: '#1a1a1a',
          700: '#262626',
          400: '#525252',
        },
        accent: {
          gold: '#D4A843',
          goldLight: '#E8C56D',
          goldDark: '#B89030',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'fade-in-up-delay-1': 'fadeInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.1s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards',
        'fade-in-up-delay-3': 'fadeInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards',
        'fade-in-up-delay-4': 'fadeInUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.4s forwards',
        'clip-reveal': 'clipReveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' },
        },
        clipReveal: {
          '0%': { clipPath: 'inset(0 0 100% 0)' },
          '100%': { clipPath: 'inset(0 0 0% 0)' },
        },
      },
    },
  },
  plugins: [],
}