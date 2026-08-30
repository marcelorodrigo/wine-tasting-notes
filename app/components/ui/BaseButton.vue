<script setup lang="ts">
import type { BaseButtonSize, BaseButtonVariant } from './types'

const props = withDefaults(defineProps<{
  variant?: BaseButtonVariant
  size?: BaseButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  busy?: boolean
  fullWidth?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  busy: false,
  fullWidth: false,
})

const variantClasses: Record<BaseButtonVariant, string> = {
  primary: 'bg-action text-on-action hover:opacity-90',
  secondary: 'bg-subtle text-foreground border border-border hover:bg-surface',
  ghost: 'bg-transparent text-foreground hover:bg-subtle',
  danger: 'bg-danger text-on-action hover:opacity-90',
}

const sizeClasses: Record<BaseButtonSize, string> = {
  sm: 'min-h-[2.75rem] px-3 py-1.5 text-sm',
  md: 'min-h-[2.75rem] px-5 py-2.5 text-base',
  lg: 'min-h-[2.75rem] px-7 py-3 text-lg',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || busy"
    :aria-busy="busy || undefined"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-control font-interface transition-opacity focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus',
      variantClasses[props.variant],
      sizeClasses[props.size],
      fullWidth && 'w-full',
      (disabled || busy) && 'pointer-events-none opacity-50',
    ]"
  >
    <slot name="leading" />
    <slot />
    <slot name="trailing" />
    <slot name="busy" />
  </button>
</template>
