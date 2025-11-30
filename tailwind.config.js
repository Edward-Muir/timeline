/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Era category colors
        ancient: '#8B4513',      // warm brown
        classical: '#DAA520',    // gold
        medieval: '#4B0082',     // deep purple
        renaissance: '#008080',  // teal
        eighteenth: '#000080',   // navy
        nineteenth: '#228B22',   // forest green
        earlyModern: '#800020',  // burgundy
        lateModern: '#FF8C00',   // orange
        contemporary: '#1E90FF', // bright blue
        // UI colors
        cream: '#FDF5E6',
        paper: '#FFFEF9',
        sketch: '#2C2C2C',
      },
      fontFamily: {
        hand: ['Caveat', 'cursive'],
        sketch: ['Patrick Hand', 'cursive'],
      },
      animation: {
        'card-hover': 'cardHover 0.2s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'fade-out': 'fadeOut 1.5s ease-out forwards',
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        cardHover: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '100%': { transform: 'scale(1.1) rotate(-2deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(30, 144, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(30, 144, 255, 0.8)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      boxShadow: {
        'sketch': '3px 3px 0px rgba(0, 0, 0, 0.2)',
        'sketch-lg': '5px 5px 0px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
