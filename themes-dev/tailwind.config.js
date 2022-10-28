// const colors = require('tailwindcss/colors')

module.exports = {
  // presets: [
  //   // require('@acmecorp/base-tailwind-config'),
  //   // require('@acmecorp/tailwind-colors'),
  //   // require('@acmecorp/tailwind-fonts'),
  //   // require('@acmecorp/tailwind-spacing'),
  // ],
  // prefix: 'w-',
  content: [
    './src/**/*.{html,js,ts}',
    // './src/**/*.html',
    // './src/**/*.js',
  ],
  theme: {
    // colors: {
    //   gray: colors.coolGray,
    //   blue: colors.lightBlue,
    //   red: colors.rose,
    //   pink: colors.fuchsia,
    // },
    // fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    // },
    // extend: {
    //   spacing: {
    //     '128': '32rem',
    //     '144': '36rem',
    //   },
    //   borderRadius: {
    //     '4xl': '2rem',
    //   },
    // },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/typography'),
    // require('tailwindcss-children'),
  ],
}
