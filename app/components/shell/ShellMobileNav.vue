<script setup lang="ts">
const { t } = useI18n()
const { activate, deactivate, restoreFocus } = useFocusTrap()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement | null>(null)

const navLinks = computed(() => [
  { to: '/academy', label: t('shell.nav.academy') },
  { to: '/tasting', label: t('shell.nav.tasting') },
  { to: '/faq', label: t('shell.nav.faq') },
  { to: '/about', label: t('shell.nav.about') },
])

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

function handleLinkClick() {
  emit('close')
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
    await nextTick()
    if (panelRef.value) {
      activate(panelRef.value)
    }
  } else {
    document.removeEventListener('keydown', handleEscape)
    deactivate()
    restoreFocus()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
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
  <Transition name="mobile-nav">
    <div
      v-if="open"
      class="fixed inset-0 z-50 lg:hidden"
    >
      <div
        class="fixed inset-0 bg-ink-950/50"
        aria-hidden="true"
        @click="emit('close')"
      />

      <nav
        ref="panelRef"
        class="fixed inset-y-0 right-0 w-72 overflow-y-auto bg-surface shadow-dialog"
        :aria-label="t('shell.nav.primary')"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-between border-b border-border px-4 py-4">
          <ShellAppLogo />
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-control p-2 text-foreground transition-colors hover:bg-subtle"
            :aria-label="t('shell.menu.close')"
            @click="emit('close')"
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
    </div>
  </Transition>
</template>

<style scoped>
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-nav-enter-active > nav,
.mobile-nav-leave-active > nav {
  transition: transform 0.2s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
}

.mobile-nav-enter-from > nav,
.mobile-nav-leave-to > nav {
  transform: translateX(100%);
}
</style>
