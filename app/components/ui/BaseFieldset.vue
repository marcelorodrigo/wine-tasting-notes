<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  id?: string
  legend?: string
  help?: string
  error?: string
  disabled?: boolean
  invalid?: boolean
}>(), {
  id: undefined,
  legend: undefined,
  help: undefined,
  error: undefined,
  disabled: false,
  invalid: undefined,
})

const slots = useSlots()
const uid = useId()

const computedInvalid = computed(() => props.invalid ?? Boolean(props.error))

const helpId = computed(() => `${props.id ?? uid}-help`)
const errorId = computed(() => `${props.id ?? uid}-error`)

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.help || slots.help) ids.push(helpId.value)
  if (computedInvalid.value && (props.error || slots.error)) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})
</script>

<template>
  <fieldset
    :id="id"
    :disabled="disabled"
    :aria-describedby="describedBy"
    :aria-invalid="computedInvalid || undefined"
    class="border border-border rounded-card p-5 font-interface"
  >
    <legend
      v-if="legend || $slots.legend"
      class="font-editorial text-lg font-semibold text-foreground px-1"
    >
      <slot name="legend">{{ legend }}</slot>
    </legend>

    <div v-if="help || $slots.help" :id="helpId" class="text-sm text-muted mt-1 mb-3">
      <slot name="help">{{ help }}</slot>
    </div>

    <slot />

    <div
      v-if="computedInvalid && (error || $slots.error)"
      :id="errorId"
      role="alert"
      class="text-sm text-danger mt-2"
    >
      <slot name="error">{{ error }}</slot>
    </div>
  </fieldset>
</template>
