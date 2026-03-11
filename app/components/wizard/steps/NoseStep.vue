<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
import type { AromaObject } from '~/types/tasting'
import RadioGroup from '~/components/wizard/inputs/RadioGroup.vue'
import AromaWheel from '~/components/wizard/inputs/AromaWheel.vue'
import AromaWheelChips from '~/components/wizard/inputs/AromaWheelChips.vue'

const { tastingData } = useTastingData()

const conditionItems: RadioGroupItem[] = [
  { label: 'clean', value: 'clean' },
  { label: 'unclean (faulty?)', value: 'unclean' }
]

const aromasModel = computed({
  get: () => tastingData.value.nose.aromas as AromaObject,
  set: (v: AromaObject) => {
    tastingData.value.nose.aromas = v
  }
})
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

    <AromaWheel
      v-model="aromasModel"
      :wine-type="tastingData.appearance.wineType"
      label="Aromas"
    />

    <AromaWheelChips
      v-model="aromasModel"
      :wine-type="tastingData.appearance.wineType"
      label="aromas"
    />
  </div>
</template>
