/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,handlebars}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var'],
      }
    },
  },
  plugins: [require('tailwindcss-aspect-ratio')],
}
