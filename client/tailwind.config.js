module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbea',
          100: '#fdf6e3',
          200: '#f6e7b8',
          300: '#f0d98c',
          400: '#e9c95e',
          500: '#d4af37', // main gold
          600: '#b8962e',
          700: '#9c7c25',
          800: '#80631c',
          900: '#665014',
        },
        ruby: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
        royal: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        luxury: {
          cream: '#f8f5f0',
          black: '#181818',
          white: '#fff',
          bright: '#faf9f6', // Tanishq-like bright white
          brown: '#300708', // Deep luxury brown for text
        },
        tanishq: {
          red: '#b11c22', // Tanishq luxury red
          redLight: '#fbeaec', // subtle red hover bg
        },
      },
      fontFamily: {
        luxury: [
          'Playfair Display',
          'serif',
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
        'premium-gradient': 'linear-gradient(135deg, #F7E7CE 0%, #FDF8F3 50%, #E5E4E2 100%)',
        'royal-gradient': 'linear-gradient(135deg, #4169E1 0%, #1E40AF 50%, #1E3A8A 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'gold': '0 10px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -2px rgba(245, 158, 11, 0.2)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}; 