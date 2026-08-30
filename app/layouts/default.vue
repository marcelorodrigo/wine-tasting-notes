<script setup lang="ts">
const { t } = useI18n()
const mobileNavOpen = ref(false)
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <SkipLink :href="'#main-content'">
      {{ t('shell.skip.toContent') }}
    </SkipLink>

    <ShellAppHeader @open-menu="mobileNavOpen = true" />
    <ShellMobileNav
      :open="mobileNavOpen"
      @close="mobileNavOpen = false"
    />

    <main
      id="main-content"
      tabindex="-1"
      class="flex-1"
    >
      <slot />
    </main>

    <ShellAppFooter />
  </div>
</template>
