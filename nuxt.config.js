export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: "Wordle Solver" || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { property: "og:site_name", content: "Wordle Solver" },
      { hid: "og:type", property: "og:type", content: "website"},
      {
        hid: "og:title",
        property: "og:title",
        content: "Wordle Solver",
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "Ran out of brain thinking vocab?",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "/wordle-solver/wordle-solver-preview.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/wordle-solver/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  router: {
    base: '/wordle-solver/'
  }
}
