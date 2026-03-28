<script setup lang="ts">
import type { ProfileType } from '~/types/profiles'

const props = defineProps<{
  text?: string | null
  profile?: ProfileType | string
  wineType?: 'white' | 'red' | 'rose' | string
}>()

interface NoteParagraph {
  header?: string
  body: string
}

const HEADER_PATTERN = /^([A-Z][A-Za-z\s]*?):\s*/

const paragraphs = computed<NoteParagraph[]>(() => {
  if (!props.text?.trim()) return []

  return props.text
    .split('\n\n')
    .filter(p => p.trim())
    .map((paragraph) => {
      const match = paragraph.match(HEADER_PATTERN)
      if (match && match[1]) {
        return {
          header: match[1],
          body: paragraph.slice(match[0].length).trim()
        }
      }
      return { body: paragraph.trim() }
    })
})
</script>

<template>
  <UCard
    data-testid="tasting-note-display"
    :ui="{
      root: 'ring-1 ring-neutral-200 dark:ring-neutral-700',
      body: 'sm:p-8'
    }"
    class="bg-amber-50/50 dark:bg-neutral-900"
  >
    <!-- Empty state -->
    <div
      v-if="paragraphs.length === 0"
      data-testid="tasting-note-empty"
      class="flex flex-col items-center gap-3 py-8 text-center"
    >
      <UIcon
        name="i-lucide-wine"
        class="size-10 text-muted"
        aria-hidden="true"
      />
      <p class="max-w-xs text-sm text-muted">
        Complete the wizard and click Generate to see your tasting note
      </p>
    </div>

    <!-- Note content -->
    <div
      v-else
      data-testid="tasting-note-content"
      class="space-y-4 select-text"
    >
      <div
        v-for="(paragraph, index) in paragraphs"
        :key="index"
      >
        <h3
          v-if="paragraph.header"
          class="font-display mb-1 text-sm font-bold tracking-wide text-primary-600 dark:text-primary-400"
          :class="{ uppercase: profile === 'professional' }"
        >
          {{ paragraph.header }}
        </h3>
        <p class="text-base leading-relaxed text-highlighted">
          {{ paragraph.body }}
        </p>
        <p
          v-if="wineType === 'red' && index === paragraphs.length - 1"
          class="text-xs mt-2 text-muted hidden"
        >
          Red wine filtered
        </p>
      </div>
    </div>
  </UCard>
</template>
