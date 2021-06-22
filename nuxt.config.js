export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  ssr: false,
  router: {
    middleware: 'auth',
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true,
      silent: true,
    },
  },
  head: {
    title: 'Student Grade Management',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.0.6/css/all.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/shardsVue',
    '@/plugins/axios',
    '@/plugins/gate',
    '@/plugins/datepicker',
    '@/plugins/vueAdsPagination',
    '@/plugins/vueSelect',
    '@/plugins/veeValidate',
    '@/plugins/notification',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/moment',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],
  env: {
    NUXT_ENV_BACKEND_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://backend.basarhimager.com'
        : 'http://127.0.0.1:8000',
    NUXT_ENV_BASE_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://basarhimager.com'
        : 'http://127.0.0.1:3000',
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL:
      process.env.NODE_ENV !== 'production'
        ? 'http://127.0.0.1:8000/api'
        : 'https://backend.basarhimager.com/api',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ['vee-validate/dist/rules'],
  },
}
