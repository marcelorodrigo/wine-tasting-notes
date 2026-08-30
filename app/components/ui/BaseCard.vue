<script setup lang="ts">
import type { BaseCardVariant } from './types'

const props = withDefaults(defineProps<{
  as?: 'div' | 'article' | 'section'
  variant?: BaseCardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>(), {
  as: 'div',
  variant: 'default',
  padding: 'md',
})

const variantClasses: Record<BaseCardVariant, string> = {
  default: 'bg-surface border border-border shadow-card',
  outlined: 'bg-transparent border border-border',
  elevated: 'bg-surface shadow-dialog',
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}
</script>

<template>
  <component
    :is="as"
    :class="[
      'rounded-card font-interface',
      variantClasses[props.variant],
      paddingClasses[props.padding],
    ]"
  >
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </div>
  </component>
</template>
