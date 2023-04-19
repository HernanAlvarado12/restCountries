/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.{html,js}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    extend: {
      screens: {
        lm: '900px'
      },
      spacing: {
        '0.5': '0.5rem',
        '1': '1rem',
        '1.5': '1.5rem',
        '2': '2rem',
        '3': '3rem',
        '3.5': '3.5rem',
        '4': '4rem',
        '4.5': '4.5rem',
        '5': '5rem',
        '6': '6rem',
        '8': '8rem',
        '9': '9rem',
        '10': '10rem',
        '85': '85%',
        '90': '90%'
      },
      fontSize: {
        xs: '1.4rem',
        sm: '1.6rem',
        md: '1.8rem',
        base: '2.4rem',
        lg: '3.2rem',
        xl: '4.2rem'
      },
      gridTemplateColumns: {
        main: 'repeat(auto-fill, minmax(28rem, 40rem))'
      },
      borderRadius: {
        sm: '0.6rem',
        md: '0.8rem',
        lg: '1rem'
      },
      colors: {
        white: 'hsl(0, 0%, 100%)',
        gray: {
          DEFAULT: 'hsl(0, 0%, 98%)',
          100: 'hsl(0, 0%, 52%)'
        },
        blue: {
          DEFAULT: 'hsl(200, 15%, 8%)',
          '100-dark': 'hsl(209, 23%, 22%)',
          '200-dark': 'hsl(207, 26%, 17%)'
        },
        shadow: '#1e2b34'
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}

