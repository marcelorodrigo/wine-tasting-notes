<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'

const model = defineModel<string | null>({ default: null })

const props = withDefaults(defineProps<{
  label: string
  items: (string | RadioGroupItem)[]
  description?: string
  variant?: 'card' | 'list'
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  description: undefined,
  variant: 'list',
  orientation: 'vertical',
  disabled: false,
  size: 'lg'
})

const normalizedItems = computed<RadioGroupItem[]>(() =>
  props.items.map(item =>
    typeof item === 'string'
      ? { label: item, value: item }
      : item
  )
)
</script>

<template>
  <UFormField
    :label="label"
    :description="description"
    data-testid="radio-group"
  >
    <URadioGroup
      v-model="model"
      :items="normalizedItems"
      :variant="variant"
      :orientation="orientation"
      :disabled="disabled"
      :size="size"
    />
  </UFormField>
</template>
