<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap'
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Wine Tasting Notes'
const description = 'Generate professional WSET Level 3-compliant wine tasting notes in multiple stylistic profiles. No data stored — everything stays on your device.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          aria-label="Wine Tasting Notes home"
        >
          <AppLogo />
        </NuxtLink>
      </template>

      <template #right>
        <UButton
          v-if="isHomePage"
          to="/tasting"
          label="Start Tasting"
          icon="i-lucide-wine"
          color="primary"
          variant="subtle"
          size="md"
        />

        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-lucide-wine" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with <ULink
            to="https://ui.nuxt.com"
            target="_blank"
            class="text-muted hover:text-default underline underline-offset-2"
          >Nuxt UI</ULink> • © {{ new Date().getFullYear() }} Wine Tasting Notes
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
