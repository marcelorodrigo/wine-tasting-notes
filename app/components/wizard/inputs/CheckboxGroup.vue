<script setup lang="ts">
import type { CheckboxGroupItem } from '@nuxt/ui'

const model = defineModel<string[]>({ default: () => [] })

const props = withDefaults(defineProps<{
  label: string
  items: (string | CheckboxGroupItem)[]
  description?: string
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  description: undefined,
  orientation: 'vertical',
  disabled: false,
  size: 'lg'
})

const normalizedItems = computed<CheckboxGroupItem[]>(() =>
  props.items.map(item =>
    typeof item === 'string'
      ? { label: item, value: item }
      : item
  )
)

const allValues = computed(() =>
  normalizedItems.value.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return String(item.value ?? item.label ?? '')
    }
    return String(item)
  })
)

const allSelected = computed(() =>
  allValues.value.length > 0 && allValues.value.every(v => model.value.includes(v))
)

function toggleAll() {
  model.value = allSelected.value ? [] : [...allValues.value]
}
</script>

<template>
  <UFormField
    :label="label"
    :description="description"
    data-testid="checkbox-group"
  >
    <div class="flex flex-col gap-2">
      <button
        type="button"
        class="text-sm text-primary cursor-pointer hover:underline self-start"
        data-testid="toggle-all"
        :disabled="disabled"
        @click="toggleAll"
      >
        {{ allSelected ? 'Deselect all' : 'Select all' }}
      </button>

      <UCheckboxGroup
        v-model="model"
        :items="normalizedItems"
        :orientation="orientation"
        :disabled="disabled"
        :size="size"
      />
    </div>
  </UFormField>
</template>
