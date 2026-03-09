<script setup lang="ts">
import type { WineType } from '~/types/tasting'

const model = defineModel<WineType | null>({ default: null })

interface WineTypeOption {
  value: WineType
  label: string
  subtitle: string
  swatch: string
  id: string
}

const wineTypes: WineTypeOption[] = [
  {
    value: 'white',
    label: 'White',
    subtitle: 'Chardonnay, Sauvignon Blanc, Riesling…',
    swatch: 'bg-amber-200',
    id: 'white'
  },
  {
    value: 'rosé',
    label: 'Rosé',
    subtitle: 'Provence, White Zinfandel, Grenache…',
    swatch: 'bg-rose-300',
    id: 'rose'
  },
  {
    value: 'red',
    label: 'Red',
    subtitle: 'Cabernet, Merlot, Pinot Noir…',
    swatch: 'bg-red-800',
    id: 'red'
  }
]

function select(type: WineType) {
  model.value = type
}

function getTabIndex(index: number): number {
  if (model.value) {
    const wt = wineTypes[index]
    return wt && wt.value === model.value ? 0 : -1
  }
  return index === 0 ? 0 : -1
}

function handleKeydown(event: KeyboardEvent, index: number) {
  let newIndex: number | undefined
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      newIndex = (index + 1) % wineTypes.length
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      newIndex = (index - 1 + wineTypes.length) % wineTypes.length
      break
    case ' ':
    case 'Enter': {
      event.preventDefault()
      const current = wineTypes[index]
      if (current) select(current.value)
      return
    }
    default:
      return
  }
  event.preventDefault()
  const target = wineTypes[newIndex]
  if (target) select(target.value)
  const container = (event.currentTarget as HTMLElement).parentElement
  const cards = container?.querySelectorAll<HTMLElement>('[role="radio"]')
  cards?.[newIndex]?.focus()
}
</script>

<template>
  <div data-testid="wine-type-selector">
    <fieldset>
      <legend class="font-display text-lg font-bold text-highlighted">
        Wine Type
      </legend>
      <div
        class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Wine type"
      >
        <div
          v-for="(wt, index) in wineTypes"
          :key="wt.value"
          role="radio"
          :aria-checked="model === wt.value"
          :aria-label="wt.label"
          :tabindex="getTabIndex(index)"
          :data-testid="`wine-type-${wt.id}`"
          class="flex min-h-[56px] cursor-pointer select-none items-center gap-3 rounded-lg border-2 p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          :class="model === wt.value
            ? 'border-primary-500 bg-primary-50 shadow-sm dark:bg-primary-950'
            : 'border-neutral-200 bg-white hover:border-primary-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-700'"
          @click="select(wt.value)"
          @keydown="handleKeydown($event, index)"
        >
          <span
            class="inline-block size-8 shrink-0 rounded-full shadow-inner ring-1 ring-black/10"
            :class="wt.swatch"
            aria-hidden="true"
          />
          <div class="flex min-w-0 flex-col">
            <span class="font-display text-lg font-semibold">{{ wt.label }}</span>
            <span class="truncate text-sm text-muted">{{ wt.subtitle }}</span>
          </div>
          <UIcon
            v-if="model === wt.value"
            name="i-lucide-check"
            class="ml-auto size-5 shrink-0 text-primary-500"
            aria-hidden="true"
          />
        </div>
      </div>
    </fieldset>
  </div>
</template>
