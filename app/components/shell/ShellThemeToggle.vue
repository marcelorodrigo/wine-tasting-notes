<script setup lang="ts">
import type { ThemePreference } from '~/ports/preferences'

const { t } = useI18n()
const { theme, setTheme } = useTheme()

const options = computed<{ value: ThemePreference; label: string }[]>(() => [
  { value: 'system', label: t('shell.theme.system') },
  { value: 'light', label: t('shell.theme.light') },
  { value: 'dark', label: t('shell.theme.dark') },
])
</script>

<template>
  <div
    role="group"
    :aria-label="t('shell.theme.label')"
    class="inline-flex items-center gap-1 rounded-control border border-border bg-subtle p-1"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="inline-flex min-h-[2.75rem] items-center justify-center rounded-control px-3 font-interface text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
      :class="theme === option.value ? 'bg-surface text-foreground shadow-sm' : ''"
      :aria-pressed="theme === option.value"
      @click="setTheme(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
