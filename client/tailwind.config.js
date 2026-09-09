/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        ink: {
          50: '#f7f7f5',
          100: '#eeeee9',
          200: '#d9d9d0',
          300: '#bfbfb2',
          400: '#9a9a8a',
          500: '#7a7a6b',
          600: '#5f5f54',
          700: '#4a4a42',
          800: '#2e2e29',
          900: '#1a1a16',
          950: '#0f0f0c',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26, 26, 22, 0.04), 0 8px 24px rgba(26, 26, 22, 0.06)',
        lift: '0 4px 12px rgba(26, 26, 22, 0.08), 0 16px 40px rgba(13, 148, 136, 0.08)',
        glow: '0 0 0 1px rgba(13, 148, 136, 0.12), 0 8px 32px rgba(13, 148, 136, 0.18)',
      },
      backgroundImage: {
        'mesh':
          'radial-gradient(at 20% 20%, rgba(20, 184, 166, 0.18) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(15, 118, 110, 0.12) 0px, transparent 45%), radial-gradient(at 70% 80%, rgba(45, 212, 191, 0.1) 0px, transparent 50%)',
        'auth-grid':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
