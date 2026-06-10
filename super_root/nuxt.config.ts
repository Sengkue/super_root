import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@pinia/nuxt', '@nuxtjs/color-mode', '@nuxtjs/i18n'],
  colorMode: {
    classSuffix: ''
  },
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'lo', file: 'lo.json' },
      { code: 'hmn', file: 'hmn.json' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales/'
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  devServer: {
    host: '0.0.0.0'
  },
  runtimeConfig: {
    imgbbApiKey: process.env.NUXT_IMGBB_API_KEY || '', // Private key
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api'
    }
  }
})
