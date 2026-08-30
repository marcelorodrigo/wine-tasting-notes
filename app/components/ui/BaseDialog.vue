<script setup lang="ts">
import { useId } from 'vue'
import { useFocusTrap } from '~/composables/useFocusTrap'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  description?: string
  closeOnEscape?: boolean
  dismissible?: boolean
  returnFocus?: boolean
  initialFocus?: string
  panelClass?: string
}>(), {
  title: undefined,
  description: undefined,
  closeOnEscape: true,
  dismissible: true,
  returnFocus: true,
  initialFocus: undefined,
  panelClass: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'open': []
  'close': [reason: 'escape' | 'programmatic' | 'native']
}>()

const slots = useSlots()
const uid = useId()
const titleId = computed(() => props.title || slots.title ? `dialog-${uid}-title` : undefined)
const descId = computed(() => props.description || slots.description ? `dialog-${uid}-desc` : undefined)

const dialogRef = ref<HTMLDialogElement | null>(null)
const { activate, deactivate, restoreFocus, focusElement } = useFocusTrap()
let closeReason: 'escape' | 'programmatic' | 'native' | null = null

function openDialog() {
  const dialog = dialogRef.value
  if (!dialog) return
  const opener = document.activeElement as HTMLElement | null
  if (typeof dialog.showModal === 'function') {
    dialog.showModal()
  }
  nextTick(() => {
    activate(dialog, opener)
    if (props.initialFocus) {
      focusElement(dialog, props.initialFocus)
    }
  })
  emit('open')
}

function closeDialog(reason: 'escape' | 'programmatic' | 'native' = 'programmatic') {
  const dialog = dialogRef.value
  if (!dialog) return
  closeReason = reason
  if (typeof dialog.close === 'function') {
    dialog.close()
  }
  deactivate()
  if (props.returnFocus) {
    nextTick(() => restoreFocus())
  }
  emit('update:open', false)
  emit('close', reason)
}

function handleCancel(event: Event) {
  event.preventDefault()
  if (!props.closeOnEscape || !props.dismissible) return
  closeDialog('escape')
}

function handleClose() {
  if (closeReason) {
    closeReason = null
    return
  }
  closeDialog('native')
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    nextTick(() => openDialog())
  } else {
    closeDialog('programmatic')
  }
}, { immediate: true })

onBeforeUnmount(() => {
  deactivate()
})

defineExpose<{
  close: (reason?: 'programmatic') => void
}>({
  close: (reason = 'programmatic') => closeDialog(reason),
})
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="[
      'rounded-dialog bg-surface border border-border shadow-dialog p-6 font-interface backdrop:bg-black/50',
      panelClass,
    ]"
    :aria-labelledby="titleId"
    :aria-describedby="descId"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div v-if="title || $slots.title" class="mb-4">
      <h2
        :id="titleId"
        class="text-xl font-semibold font-editorial text-foreground"
      >
        <slot name="title">{{ title }}</slot>
      </h2>
    </div>

    <div
      v-if="description || $slots.description"
      :id="descId"
      class="text-sm text-muted mb-4"
    >
      <slot name="description">{{ description }}</slot>
    </div>

    <slot />

    <div v-if="$slots.footer" class="mt-6">
      <slot name="footer" />
    </div>
  </dialog>
</template>
