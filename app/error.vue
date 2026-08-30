<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const statusMessage = computed(() => {
  if (props.error.statusCode) {
    return `${props.error.statusCode}`
  }
  return undefined
})
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center px-4">
    <div class="w-full max-w-md text-center">
      <h1 class="font-editorial text-4xl font-bold text-foreground">
        {{ t('error.title') }}
      </h1>

      <div class="mt-6 space-y-2">
        <p
          v-if="statusMessage"
          class="font-interface text-sm text-muted"
        >
          {{ t('error.status') }}: {{ statusMessage }}
        </p>
        <p
          v-if="error.message"
          class="font-interface text-sm text-muted"
        >
          {{ t('error.message') }}: {{ error.message }}
        </p>
      </div>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center rounded-control bg-action px-5 py-2.5 font-interface text-base font-medium text-on-action no-underline transition-opacity hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
        >
          {{ t('error.backToHome') }}
        </NuxtLink>
        <NuxtLink
          to="/tasting"
          class="inline-flex items-center justify-center rounded-control bg-subtle px-5 py-2.5 font-interface text-base font-medium text-foreground border border-border no-underline transition-colors hover:bg-surface focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
        >
          {{ t('error.startTasting') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
