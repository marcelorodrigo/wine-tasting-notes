// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    'nuxt-site-config'
  ],
  devtools: {
    enabled: true
  },

  app: {
    head: {
      titleTemplate: '%s - Wine Tasting Notes'
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://wine-tasting-notes.app',
    name: 'Wine Tasting Notes',
    description: 'Make wine tasting accessible to everyone through guided, structured exploration',
    defaultLocale: 'en'
  },

  routeRules: {
    '/': { prerender: true }
  },
  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
