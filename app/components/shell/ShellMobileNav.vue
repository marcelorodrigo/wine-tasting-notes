<script setup lang="ts">
const { t } = useI18n()
const { activate, deactivate, restoreFocus } = useFocusTrap()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const navLinks = computed(() => [
  { to: '/academy', label: t('shell.nav.academy') },
  { to: '/tasting', label: t('shell.nav.tasting') },
  { to: '/faq', label: t('shell.nav.faq') },
  { to: '/about', label: t('shell.nav.about') },
])

function handleClose() {
  emit('close')
}

function handleCancel(event: Event) {
  event.preventDefault()
  emit('close')
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    emit('close')
  }
}

function handleLinkClick() {
  emit('close')
}

function openDialog() {
  const dialog = dialogRef.value
  if (!dialog) return
  const opener = document.activeElement as HTMLElement | null
  if (typeof dialog.showModal === 'function') {
    dialog.showModal()
  }
  nextTick(() => activate(dialog, opener))
}

function closeDialog() {
  const dialog = dialogRef.value
  if (!dialog) return
  if (typeof dialog.close === 'function') {
    dialog.close()
  }
  deactivate()
  nextTick(() => restoreFocus())
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    openDialog()
  } else {
    closeDialog()
  }
})

onMounted(() => {
  dialogRef.value?.addEventListener('click', handleBackdropClick)
  if (props.open) {
    openDialog()
  }
})

onUnmounted(() => {
  dialogRef.value?.removeEventListener('click', handleBackdropClick)
  deactivate()
})

const route = useRoute()
watch(() => route.fullPath, () => {
  if (props.open) {
    emit('close')
  }
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="mobile-nav fixed inset-0 m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-ink-950/50 lg:hidden"
    :aria-label="t('shell.nav.primary')"
    @cancel="handleCancel"
  >
    <nav
      class="absolute inset-y-0 right-0 w-72 overflow-y-auto bg-surface shadow-dialog"
      :aria-label="t('shell.nav.primary')"
    >
      <div class="flex items-center justify-between border-b border-border px-4 py-4">
        <ShellAppLogo />
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-control p-2 text-foreground transition-colors hover:bg-subtle"
          :aria-label="t('shell.menu.close')"
          @click="handleClose"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="px-4 py-6">
        <ul class="space-y-1">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="block rounded-control px-3 py-2.5 font-interface text-base font-medium text-foreground no-underline transition-colors hover:bg-subtle"
              active-class="bg-subtle text-action"
              @click="handleLinkClick"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </dialog>
</template>

<style scoped>
.mobile-nav {
  opacity: 1;
  transition:
    opacity 0.2s ease,
    overlay 0.2s allow-discrete,
    display 0.2s allow-discrete;
}

.mobile-nav:not([open]) {
  opacity: 0;
}

@starting-style {
  .mobile-nav[open] {
    opacity: 0;
  }
}

.mobile-nav > nav {
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.mobile-nav:not([open]) > nav {
  transform: translateX(100%);
}

@starting-style {
  .mobile-nav[open] > nav {
    transform: translateX(100%);
  }
}
</style>
