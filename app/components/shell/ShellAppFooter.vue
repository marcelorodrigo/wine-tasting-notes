<script setup lang="ts">
const { t } = useI18n()

const currentYear = useState('currentYear', () => new Date().getFullYear())

const productLinks = computed(() => [
  { to: '/academy', label: t('shell.footer.academy') },
  { to: '/tasting', label: t('shell.footer.tasting') },
  { to: '/faq', label: t('shell.footer.faq') },
])

const legalLinks = computed(() => [
  { to: '/privacy', label: t('shell.footer.privacy') },
  { to: '/terms', label: t('shell.footer.terms') },
])
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <ShellAppLogo />
        </div>

        <div>
          <h2 class="font-interface text-sm font-semibold text-foreground">
            {{ t('shell.footer.academy') }}
          </h2>
          <ul class="mt-4 space-y-3">
            <li v-for="link in productLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="font-interface text-sm text-muted no-underline transition-colors hover:text-foreground"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="font-interface text-sm font-semibold text-foreground">
            {{ t('shell.footer.about') }}
          </h2>
          <ul class="mt-4 space-y-3">
            <li>
              <NuxtLink
                to="/about"
                class="font-interface text-sm text-muted no-underline transition-colors hover:text-foreground"
              >
                {{ t('shell.nav.about') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="font-interface text-sm font-semibold text-foreground">
            {{ t('shell.footer.terms') }}
          </h2>
          <ul class="mt-4 space-y-3">
            <li v-for="link in legalLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="font-interface text-sm text-muted no-underline transition-colors hover:text-foreground"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-border pt-6">
        <p class="font-interface text-xs text-muted">
          &copy; {{ currentYear }} {{ t('app.name') }}. {{ t('shell.footer.copyright') }}
        </p>
      </div>
    </div>
  </footer>
</template>
