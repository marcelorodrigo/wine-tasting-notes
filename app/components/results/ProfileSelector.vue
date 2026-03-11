<script setup lang="ts">
import type { ProfileType } from '~/types/profiles'

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

function select(profile: ProfileType) {
  model.value = profile
}

function getTabIndex(index: number): number {
  const selectedIndex = profiles.findIndex(p => p.value === model.value)
  if (selectedIndex >= 0) {
    return index === selectedIndex ? 0 : -1
  }
  return index === 0 ? 0 : -1
}

function handleKeydown(event: KeyboardEvent, index: number) {
  let newIndex: number | undefined
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      newIndex = (index + 1) % profiles.length
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      newIndex = (index - 1 + profiles.length) % profiles.length
      break
    case ' ':
    case 'Enter': {
      event.preventDefault()
      const current = profiles[index]
      if (current) select(current.value)
      return
    }
    default:
      return
  }
  event.preventDefault()
  const target = profiles[newIndex]
  if (target) select(target.value)
  const container = (event.currentTarget as HTMLElement).parentElement
  const cards = container?.querySelectorAll<HTMLElement>('[role="radio"]')
  cards?.[newIndex]?.focus()
}
</script>

<template>
  <div data-testid="profile-selector">
    <fieldset>
      <legend class="font-display text-lg font-bold text-highlighted">
        Tasting Note Style
      </legend>

      <div
        class="mt-3 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0"
        role="radiogroup"
        aria-label="Tasting note style"
      >
        <div
          v-for="(profile, index) in profiles"
          :key="profile.value"
          role="radio"
          :aria-checked="model === profile.value"
          :aria-label="profile.label"
          :tabindex="getTabIndex(index)"
          :data-testid="`profile-${profile.value}`"
          class="flex min-w-[140px] shrink-0 cursor-pointer select-none flex-col items-center gap-1.5 rounded-lg border-2 px-3 py-3 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:min-w-0 sm:shrink"
          :class="model === profile.value
            ? 'border-primary-500 bg-primary-50 shadow-sm dark:bg-primary-950'
            : 'border-neutral-200 bg-white hover:border-primary-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-700'"
          @click="select(profile.value)"
          @keydown="handleKeydown($event, index)"
        >
          <UIcon
            :name="profile.icon"
            class="size-6"
            :class="model === profile.value
              ? 'text-primary-500'
              : 'text-muted'"
            aria-hidden="true"
          />
          <span
            class="font-display text-sm font-semibold"
            :class="model === profile.value
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-highlighted'"
          >
            {{ profile.label }}
          </span>
          <span class="hidden text-xs text-muted sm:block">
            {{ profile.description }}
          </span>
        </div>
      </div>
    </fieldset>
  </div>
</template>
