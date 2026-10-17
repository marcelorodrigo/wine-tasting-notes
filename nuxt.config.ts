import tailwindcss from '@tailwindcss/vite'
import { THEME_INIT_SCRIPT } from './app/ports/preferences'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-30',
  devtools: { enabled: true },

  ssr: false,

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      script: [{ innerHTML: THEME_INIT_SCRIPT }],
    },
  },

  css: ['~/assets/css/main.css'],

  components: [
    {
      path: '~/components/ui',
      pathPrefix: false,
    },
    '~/components',
  ],

  modules: [
    '@nuxt/test-utils',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vite-pwa/nuxt',
  ],

  // WT-004: the PWA module is registered at its minimum viable setting so the
  // dependency and config key exist. Service worker generation, the client
  // registration plugin, the manifest, and offline behavior are deferred to
  // WT-041.
  pwa: {
    disable: true,
    client: {
      registerPlugin: false,
    },
  },

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
    restructureDir: 'app/i18n',
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
})
