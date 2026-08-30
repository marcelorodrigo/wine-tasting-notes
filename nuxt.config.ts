import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-30',
  devtools: { enabled: true },

  ssr: false,

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
    },
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/test-utils',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json',
      },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
})
