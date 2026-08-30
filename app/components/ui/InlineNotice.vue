<script setup lang="ts">
import type { InlineNoticeRole, InlineNoticeTone } from './types'

const props = withDefaults(defineProps<{
  tone?: InlineNoticeTone
  role?: InlineNoticeRole
  title?: string
  dismissible?: boolean
  modelValue?: boolean
  live?: 'off' | 'polite' | 'assertive'
}>(), {
  tone: 'info',
  role: 'status',
  title: undefined,
  dismissible: false,
  modelValue: true,
  live: 'off',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'dismiss': []
}>()

const toneClasses: Record<InlineNoticeTone, string> = {
  info: 'bg-information/10 border-information/30 text-foreground',
  success: 'bg-success/10 border-success/30 text-foreground',
  warning: 'bg-warning/10 border-warning/30 text-foreground',
  error: 'bg-danger/10 border-danger/30 text-foreground',
}

function handleDismiss() {
  emit('dismiss')
  emit('update:modelValue', false)
}
</script>

<template>
  <div
    v-if="modelValue"
    :role="role === 'none' ? undefined : role"
    :aria-live="live !== 'off' ? live : undefined"
    :class="[
      'relative rounded-card border p-4 font-interface',
      toneClasses[props.tone],
    ]"
  >
    <p v-if="title" class="font-semibold text-foreground mb-1">
      <slot name="title">{{ title }}</slot>
    </p>
    <slot />
    <button
      v-if="dismissible"
      type="button"
      :class="[
        'absolute top-3 right-3 min-w-[2.75rem] min-h-[2.75rem] inline-flex items-center justify-center rounded-control text-muted hover:text-foreground hover:bg-subtle transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus',
      ]"
      @click="handleDismiss"
    >
      <slot name="dismiss">&#x2715;</slot>
    </button>
  </div>
</template>
