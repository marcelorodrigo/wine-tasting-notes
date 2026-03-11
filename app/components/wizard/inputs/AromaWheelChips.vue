<script setup lang="ts">
import type { AromaObject, WineType, PrimaryAromaCategory, TertiaryAromaCategory } from '~/types/tasting'
import { AROMAS, isPrimaryCategoryVisibleForWineType, isTertiaryCategoryVisibleForWineType } from '~/utils/wineTypeFilters'
import {
  AROMA_RING_TYPES,
  AROMA_TYPE_LABELS,
  type AromaRingType
} from '~/composables/useAromaWheel'

const model = defineModel<AromaObject>({ required: true })

const props = defineProps<{
  wineType: WineType | null
  label?: string
}>()

interface ChipItem {
  aromaType: AromaRingType
  categoryKey: string
  descriptor: string
  categoryLabel: string
  color: string
}

function getCategoryMeta(aromaType: AromaRingType, categoryKey: string): { label: string, color: string } {
  const group = AROMAS[aromaType] as Record<string, { label: string, color: string }>
  const cat = group[categoryKey]
  return cat ?? { label: categoryKey, color: '#999' }
}

const groupedChips = computed(() => {
  const groups: { aromaType: AromaRingType, label: string, chips: ChipItem[] }[] = []
  const currentWineType = props.wineType

  for (const aromaType of AROMA_RING_TYPES) {
    const chips: ChipItem[] = []
    const selections = model.value[aromaType] as unknown as Record<string, string[]>

    for (const [categoryKey, descriptors] of Object.entries(selections)) {
      if (!descriptors || descriptors.length === 0) continue
      if (currentWineType) {
        if (aromaType === 'primary' && !isPrimaryCategoryVisibleForWineType(categoryKey as PrimaryAromaCategory, currentWineType)) continue
        if (aromaType === 'tertiary' && !isTertiaryCategoryVisibleForWineType(categoryKey as TertiaryAromaCategory, currentWineType)) continue
      }
      const meta = getCategoryMeta(aromaType, categoryKey)

      for (const descriptor of descriptors) {
        chips.push({
          aromaType,
          categoryKey,
          descriptor,
          categoryLabel: meta.label,
          color: meta.color
        })
      }
    }

    if (chips.length > 0) {
      groups.push({
        aromaType,
        label: AROMA_TYPE_LABELS[aromaType],
        chips
      })
    }
  }

  return groups
})

const totalSelected = computed(() =>
  groupedChips.value.reduce((sum, g) => sum + g.chips.length, 0)
)

function removeAroma(chip: ChipItem) {
  const categoryArr = (model.value[chip.aromaType] as unknown as Record<string, string[]>)[chip.categoryKey]
  if (!categoryArr) return
  const index = categoryArr.indexOf(chip.descriptor)
  if (index >= 0) {
    categoryArr.splice(index, 1)
  }
}
</script>

<template>
  <div data-testid="aroma-wheel-chips">
    <!-- Warning: no wine type -->
    <div
      v-if="!wineType"
      class="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
      role="alert"
      data-testid="no-wine-type-warning"
    >
      <UIcon
        name="i-lucide-alert-triangle"
        class="mr-1.5 inline-block size-4 align-text-bottom"
      />
      Select a wine type first
    </div>

    <!-- Empty state -->
    <p
      v-else-if="totalSelected === 0"
      class="text-sm text-muted italic"
      data-testid="no-aromas-message"
    >
      No {{ label ?? 'aromas' }} selected
    </p>

    <!-- Grouped chips -->
    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div
        v-for="group in groupedChips"
        :key="group.aromaType"
        :data-testid="`chip-group-${group.aromaType}`"
      >
        <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          {{ group.label }}
        </span>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="chip in group.chips"
            :key="`${chip.categoryKey}::${chip.descriptor}`"
            class="inline-flex items-center gap-1 rounded-full py-0.5 pl-2.5 pr-1 text-xs font-medium text-white shadow-sm"
            :style="{ backgroundColor: chip.color }"
            :data-testid="`chip-${chip.categoryKey}-${chip.descriptor.replace(/[\s/]+/g, '-')}`"
          >
            <span class="capitalize">{{ chip.descriptor }} ({{ chip.categoryLabel }})</span>
            <button
              type="button"
              class="ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
              :aria-label="`Remove ${chip.descriptor} (${chip.categoryLabel})`"
              :data-testid="`remove-${chip.categoryKey}-${chip.descriptor.replace(/[\s/]+/g, '-')}`"
              @click="removeAroma(chip)"
            >
              <UIcon
                name="i-lucide-x"
                class="size-3"
              />
            </button>
          </span>
        </div>
      </div>

      <!-- Screen reader summary -->
      <div
        class="sr-only"
        aria-live="polite"
      >
        {{ totalSelected }} {{ label ?? 'aromas' }} selected
      </div>
    </div>
  </div>
</template>
