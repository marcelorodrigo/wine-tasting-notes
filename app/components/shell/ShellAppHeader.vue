<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  openMenu: []
}>()

const navLinks = computed(() => [
  { to: '/academy', label: t('shell.nav.academy') },
  { to: '/faq', label: t('shell.nav.faq') },
  { to: '/about', label: t('shell.nav.about') },
])

const ctaLink = computed(() => ({
  to: '/tasting',
  label: t('shell.nav.tasting'),
}))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-surface">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <ShellAppLogo />

      <nav
        class="hidden items-center gap-1 lg:flex"
        :aria-label="t('shell.nav.primary')"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-control px-3 py-2 font-interface text-sm font-medium text-foreground no-underline transition-colors hover:bg-subtle"
          active-class="bg-subtle text-action"
        >
          {{ link.label }}
        </NuxtLink>

        <NuxtLink
          :to="ctaLink.to"
          class="ml-4 inline-flex items-center justify-center rounded-control bg-action px-4 py-2 font-interface text-sm font-medium text-on-action no-underline transition-opacity hover:opacity-90"
        >
          {{ ctaLink.label }}
        </NuxtLink>
      </nav>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-control p-2 text-foreground transition-colors hover:bg-subtle lg:hidden"
        :aria-label="t('shell.menu.open')"
        @click="emit('openMenu')"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </div>
  </header>
</template>
