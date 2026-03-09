<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
import type { Color } from '~/types/tasting'
import { getColorOptionsForWineType } from '~/utils/wineTypeFilters'

const { tastingData, handleWineTypeChange } = useTastingData()

watch(
  () => tastingData.value.appearance.wineType,
  (newType, oldType) => {
    if (newType !== oldType) {
      handleWineTypeChange(newType, oldType)
    }
  }
)

const clarityItems: RadioGroupItem[] = [
  { label: 'clear', value: 'clear' },
  { label: 'hazy (faulty?)', value: 'hazy' }
]

const colorSwatchMap: Record<string, string> = {
  'lemon-green': 'bg-lime-300',
  'lemon': 'bg-yellow-300',
  'gold': 'bg-amber-400',
  'amber': 'bg-amber-600',
  'brown': 'bg-amber-900',
  'pink': 'bg-pink-300',
  'salmon': 'bg-orange-300',
  'orange': 'bg-orange-400',
  'purple': 'bg-purple-800',
  'ruby': 'bg-red-700',
  'garnet': 'bg-red-900',
  'tawny': 'bg-orange-800'
}

const colorOptions = computed(() => {
  const wineType = tastingData.value.appearance.wineType
  if (!wineType) return []
  return getColorOptionsForWineType(wineType).map(color => ({
    label: color,
    value: color,
    swatch: colorSwatchMap[color] || 'bg-neutral-400'
  }))
})

const hasWineType = computed(() => !!tastingData.value.appearance.wineType)

function selectColor(color: string) {
  tastingData.value.appearance.color = color as Color
}
</script>

<template>
  <div
    data-testid="step-appearance"
    class="space-y-6"
  >
    <div>
      <h2 class="font-display text-2xl font-bold text-highlighted">
        Appearance
      </h2>
      <p class="mt-1 text-sm text-muted">
        Select the wine type, then describe its clarity, color intensity, and color. Note any other observations such as legs, deposit, or bubbles.
      </p>
    </div>

    <WineTypeSelector v-model="tastingData.appearance.wineType" />

    <USeparator />

    <RadioGroup
      v-model="tastingData.appearance.clarity"
      label="Clarity"
      :items="clarityItems"
      orientation="horizontal"
    />

    <USeparator />

    <RadioGroup
      v-model="tastingData.appearance.intensity"
      label="Intensity"
      :items="['pale', 'medium', 'deep']"
      orientation="horizontal"
    />

    <USeparator />

    <UFormField
      label="Color"
      data-testid="color-field"
    >
      <p
        v-if="!hasWineType"
        class="text-sm text-muted italic"
        data-testid="color-disabled-message"
      >
        Select a wine type first
      </p>
      <div
        v-else
        class="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Color"
      >
        <button
          v-for="option in colorOptions"
          :key="option.value"
          type="button"
          role="radio"
          :aria-checked="tastingData.appearance.color === option.value"
          :data-testid="`color-${option.value}`"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          :class="tastingData.appearance.color === option.value
            ? 'border-primary-500 bg-primary-50 shadow-sm dark:bg-primary-950'
            : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-700'"
          @click="selectColor(option.value)"
        >
          <span
            class="inline-block size-4 shrink-0 rounded-full ring-1 ring-black/10"
            :class="option.swatch"
            aria-hidden="true"
          />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </UFormField>

    <USeparator />

    <CheckboxGroup
      v-model="tastingData.appearance.otherObservations"
      label="Other Observations"
      :items="['legs/tears', 'deposit', 'pétillance', 'bubbles']"
    />
  </div>
</template>
