<script setup lang="ts">
import type { Mousse } from '~/types/tasting'
import RadioGroup from '~/components/wizard/inputs/RadioGroup.vue'

const { tastingData } = useTastingData()

const hasSparkling = computed(() => {
  const obs = tastingData.value.appearance.otherObservations
  if (!obs) return false
  return obs.includes('bubbles') || obs.includes('pétillance')
})

watch(hasSparkling, (sparkling) => {
  if (!sparkling) {
    tastingData.value.palate.mousse = null
  }
})

const fortifiedChecked = computed({
  get: () => tastingData.value.palate.fortified === true,
  set: (v: boolean) => {
    tastingData.value.palate.fortified = v || null
  }
})

const mousseModel = computed({
  get: () => tastingData.value.palate.mousse,
  set: (v: string | null) => {
    tastingData.value.palate.mousse = v as Mousse | null
  }
})
</script>

<template>
  <div
    data-testid="step-palate"
    class="space-y-6"
  >
    <div>
      <h2 class="font-display text-2xl font-bold text-highlighted">
        Palate
      </h2>
      <p class="mt-1 text-sm text-muted">
        Evaluate the structural components — sweetness, acidity, tannin, alcohol, and body. Describe flavor intensity, specific flavors, and the length of the finish.
      </p>
    </div>

    <!-- Structure section -->
    <div class="space-y-4">
      <h3 class="font-display text-lg font-semibold text-highlighted">
        Structure
      </h3>

      <RadioGroup
        v-model="tastingData.palate.sweetness"
        label="Sweetness"
        :items="['dry', 'off-dry', 'medium-dry', 'medium-sweet', 'sweet', 'luscious']"
      />

      <USeparator />

      <RadioGroup
        v-model="tastingData.palate.acidity"
        label="Acidity"
        :items="['low', 'medium(-)', 'medium', 'medium(+)', 'high']"
      />

      <USeparator />

      <RadioGroup
        v-model="tastingData.palate.tannin"
        label="Tannin"
        :items="['low', 'medium(-)', 'medium', 'medium(+)', 'high']"
      />

      <USeparator />

      <RadioGroup
        v-model="tastingData.palate.alcohol"
        label="Alcohol"
        :items="['low', 'medium', 'high']"
        orientation="horizontal"
      />

      <UCheckbox
        v-model="fortifiedChecked"
        label="This wine is fortified"
        data-testid="fortified-checkbox"
      />
    </div>

    <USeparator />

    <!-- Body & Texture section -->
    <div class="space-y-4">
      <h3 class="font-display text-lg font-semibold text-highlighted">
        Body &amp; Texture
      </h3>

      <RadioGroup
        v-model="tastingData.palate.body"
        label="Body"
        :items="['light', 'medium(-)', 'medium', 'medium(+)', 'full']"
      />

      <template v-if="hasSparkling">
        <USeparator />

        <RadioGroup
          v-model="mousseModel"
          label="Mousse"
          :items="['delicate', 'creamy', 'aggressive']"
          orientation="horizontal"
        />
      </template>
    </div>

    <USeparator />

    <!-- Flavor section -->
    <div class="space-y-4">
      <h3 class="font-display text-lg font-semibold text-highlighted">
        Flavor
      </h3>

      <RadioGroup
        v-model="tastingData.palate.flavorIntensity"
        label="Flavor Intensity"
        :items="['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced']"
      />

      <USeparator />

      <RadioGroup
        v-model="tastingData.palate.finish"
        label="Finish"
        :items="['short', 'medium(-)', 'medium', 'medium(+)', 'long']"
      />

      <USeparator />

      <UFormField label="Flavors">
        <div
          class="flex items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 p-8 dark:border-neutral-700"
          data-testid="flavor-wheel-placeholder"
        >
          <p class="text-sm text-muted italic">
            Flavor Wheel coming in a future update
          </p>
        </div>
      </UFormField>
    </div>
  </div>
</template>
