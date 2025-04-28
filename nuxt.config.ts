// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    app: {
        head: {
            title: 'Wine Tasting Notes Generator',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Generate your wine tasting notes with ease and style following WSET Level 3 Systematic Approach to Tasting Wine.',
                }
            ]
        },
        htmlAttrs: {
            lang: 'en',
        },
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
        ]
    },
    compatibilityDate: '2024-11-01',
    css: ['~/assets/css/main.css'],
    devtools: {enabled: true},
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
})
