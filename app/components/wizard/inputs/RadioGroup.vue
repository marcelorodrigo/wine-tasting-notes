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
  props.items.map((item) => {
    if (typeof item === 'string') {
      return { label: item, value: item }
    }
    if (typeof item === 'object' && item !== null) {
      return { ...item, value: String(item.value ?? item.label ?? '') }
    }
    return { label: String(item), value: String(item) }
  })
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
