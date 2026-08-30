<script setup lang="ts">
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

const computedInvalid = computed(() => props.invalid ?? Boolean(props.error))

const helpId = computed(() => props.id ? `${props.id}-help` : undefined)
const errorId = computed(() => props.id ? `${props.id}-error` : undefined)

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.help && helpId.value) ids.push(helpId.value)
  if (computedInvalid.value && props.error && errorId.value) ids.push(errorId.value)
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

    <div v-if="(help || $slots.help) && helpId" :id="helpId" class="text-sm text-muted mt-1 mb-3">
      <slot name="help">{{ help }}</slot>
    </div>

    <slot />

    <div
      v-if="computedInvalid && (error || $slots.error) && errorId"
      :id="errorId"
      role="alert"
      class="text-sm text-danger mt-2"
    >
      <slot name="error">{{ error }}</slot>
    </div>
  </fieldset>
</template>
