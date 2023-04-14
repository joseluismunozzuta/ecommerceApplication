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
  plugins: [require('tailwindcss-aspect-ratio'), require('daisyui')],

  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
