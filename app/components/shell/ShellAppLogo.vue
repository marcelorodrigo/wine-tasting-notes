<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    to="/"
    class="flex items-center gap-2 text-foreground no-underline transition-opacity hover:opacity-80"
    :aria-label="t('app.name')"
  >
    <svg
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-6 text-action"
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 4 10 4 18C4 24.627 7.373 30 12 30C16.627 30 20 24.627 20 18C20 10 12 2 12 2Z"
        fill="currentColor"
      />
      <ellipse cx="12" cy="18" rx="4" ry="5" fill="var(--color-canvas)" opacity="0.3" />
    </svg>
    <span class="font-editorial text-xl font-semibold tracking-tight">
      {{ t('app.name') }}
    </span>
  </NuxtLink>
</template>
