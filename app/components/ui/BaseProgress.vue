<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(defineProps<{
  value: number | null
  max?: number
  label: string
  text?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  showValue?: boolean
}>(), {
  max: 100,
  variant: 'default',
  showValue: false,
  text: undefined,
})

const progressId = `progress-${useId()}`
const clampedValue = computed(() => {
  if (props.value === null) return null
  return Math.max(0, Math.min(props.value, props.max))
})

const progressValue = computed(() => clampedValue.value ?? undefined)

const variantClasses: Record<string, string> = {
  default: '',
  success: '[&::-webkit-progress-value]:bg-success [&::-moz-progress-bar]:bg-success',
  warning: '[&::-webkit-progress-value]:bg-warning [&::-moz-progress-bar]:bg-warning',
  error: '[&::-webkit-progress-value]:bg-danger [&::-moz-progress-bar]:bg-danger',
}
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="progressId"
      class="block text-sm font-medium text-foreground mb-1"
    >
      <slot name="label">{{ label }}</slot>
    </label>
    <progress
      :id="progressId"
      :value="progressValue"
      :max="max"
      :aria-label="label"
      class="w-full h-3 appearance-none rounded-control bg-subtle [&::-webkit-progress-bar]:rounded-control [&::-webkit-progress-value]:rounded-control [&::-webkit-progress-value]:bg-action [&::-moz-progress-bar]:rounded-control [&::-moz-progress-bar]:bg-action [&::-moz-progress-value]:rounded-control"
      :class="variantClasses[props.variant]"
    />
    <p
      v-if="showValue || text || $slots.text"
      class="mt-1 text-sm text-muted"
    >
      <slot name="text">{{ text ?? `${clampedValue ?? 0} / ${max}` }}</slot>
    </p>
  </div>
</template>
