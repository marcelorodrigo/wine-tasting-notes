<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
import RadioGroup from '~/components/wizard/inputs/RadioGroup.vue'

const { tastingData } = useTastingData()

const conditionItems: RadioGroupItem[] = [
  { label: 'clean', value: 'clean' },
  { label: 'unclean (faulty?)', value: 'unclean' }
]
</script>

<template>
  <div
    data-testid="step-nose"
    class="space-y-6"
  >
    <div>
      <h2 class="font-display text-2xl font-bold text-highlighted">
        Nose
      </h2>
      <p class="mt-1 text-sm text-muted">
        Assess the condition and intensity of the nose. Identify primary, secondary, and tertiary aromas, then evaluate the overall development.
      </p>
    </div>

    <RadioGroup
      v-model="tastingData.nose.condition"
      label="Condition"
      :items="conditionItems"
      orientation="horizontal"
    />

    <USeparator />

    <RadioGroup
      v-model="tastingData.nose.intensity"
      label="Intensity"
      :items="['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced']"
    />

    <USeparator />

    <RadioGroup
      v-model="tastingData.nose.development"
      label="Development"
      :items="['youthful', 'developing', 'fully developed', 'tired/past its best']"
    />

    <USeparator />

    <UFormField label="Aromas">
      <div
        class="flex items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 p-8 dark:border-neutral-700"
        data-testid="aroma-wheel-placeholder"
      >
        <p class="text-sm text-muted italic">
          Aroma Wheel coming in a future update
        </p>
      </div>
    </UFormField>
  </div>
</template>
