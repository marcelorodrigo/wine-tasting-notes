<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
import RadioGroup from '~/components/wizard/inputs/RadioGroup.vue'

const { tastingData } = useTastingData()

const qualityItems: RadioGroupItem[] = [
  { label: 'Faulty', value: 'faulty', description: 'The wine has a fault that makes it unpleasant' },
  { label: 'Poor', value: 'poor', description: 'Without fault but with noticeable shortcomings' },
  { label: 'Acceptable', value: 'acceptable', description: 'Clean and correct, but simple' },
  { label: 'Good', value: 'good', description: 'Well-made with some complexity' },
  { label: 'Very good', value: 'very good', description: 'High quality with notable complexity and character' },
  { label: 'Outstanding', value: 'outstanding', description: 'Exceptional quality — precise, complex, and long' }
]

const readinessItems: RadioGroupItem[] = [
  { label: 'Too young', value: 'too young', description: 'Not yet ready — needs more time to develop' },
  { label: 'Can drink now, but has potential for ageing', value: 'can drink now, but has potential for ageing', description: 'Enjoyable now and will improve with age' },
  { label: 'Drink now: not suitable for ageing', value: 'drink now: not suitable for ageing or further ageing', description: 'At its peak or will not improve with further ageing' },
  { label: 'Too old', value: 'too old', description: 'Past its best — quality has declined' }
]
</script>

<template>
  <div
    data-testid="step-conclusions"
    class="space-y-6"
  >
    <div>
      <h2 class="font-display text-2xl font-bold text-highlighted">
        Conclusions
      </h2>
      <p class="mt-1 text-sm text-muted">
        Assess the overall quality level of the wine and its readiness for drinking — whether it's too young, at its peak, or past its best.
      </p>
    </div>

    <RadioGroup
      v-model="tastingData.conclusions.qualityLevel"
      label="Quality Level"
      :items="qualityItems"
      variant="card"
    />

    <USeparator />

    <RadioGroup
      v-model="tastingData.conclusions.readiness"
      label="Readiness"
      :items="readinessItems"
      variant="card"
    />
  </div>
</template>
