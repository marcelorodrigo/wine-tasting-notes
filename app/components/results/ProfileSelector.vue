<script setup lang="ts">
import type { ProfileType } from '~/types/profiles'
import RadioGroup from '~/components/wizard/inputs/RadioGroup.vue'

const model = defineModel<ProfileType>({ default: 'professional' })

interface ProfileOption {
  value: ProfileType
  label: string
  description: string
  icon: string
}

const profiles: ProfileOption[] = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal WSET-style notes',
    icon: 'i-lucide-graduation-cap'
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Friendly and accessible',
    icon: 'i-lucide-message-circle'
  },
  {
    value: 'bartalk',
    label: 'Bar Talk',
    description: 'Quick and punchy',
    icon: 'i-lucide-beer'
  },
  {
    value: 'playful',
    label: 'Playful',
    description: 'Fun and creative',
    icon: 'i-lucide-sparkles'
  }
]
</script>

<template>
  <div data-testid="profile-selector">
    <RadioGroup
      v-model="model"
      label="Tasting Note Style"
      :items="profiles"
      variant="card"
      class="mt-3"
      :ui="{ fieldset: 'flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0' }"
    >
      <template #label="{ item }">
        <div
          :data-testid="`profile-${item.value}`"
          class="flex flex-col items-center gap-1.5 text-center w-full"
        >
          <UIcon
            :name="item.icon"
            class="size-6"
            :class="model === item.value ? 'text-primary-500' : 'text-muted'"
            aria-hidden="true"
          />
          <span
            class="font-display text-sm font-semibold"
            :class="model === item.value ? 'text-primary-600 dark:text-primary-400' : 'text-highlighted'"
          >
            {{ item.label }}
          </span>
          <span class="hidden text-xs text-muted sm:block">
            {{ item.description }}
          </span>
        </div>
      </template>
    </RadioGroup>
  </div>
</template>
