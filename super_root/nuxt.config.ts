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
    classSuffix: '',
    fallback: 'dark'
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
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png' }
      ],
      meta: [
        { name: 'theme-color', content: '#0f172a' }
      ]
    }
  },
  devServer: {
    host: '0.0.0.0'
  },
  routeRules: {
    '/api/**': {
      proxy: 'http://localhost:3001/api/**'
    }
  },
  runtimeConfig: {
    imgbbApiKey: process.env.NUXT_IMGBB_API_KEY || '', // Private key
    public: {
      apiBase: '/api'
    }
  }
})
