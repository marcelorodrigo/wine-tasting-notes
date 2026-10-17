import { usePreferencesStore } from '../stores/preferences'

export function useTheme() {
  const store = usePreferencesStore()

  if (import.meta.client) {
    watchEffect(() => {
      const root = document.documentElement
      if (store.theme === 'system') {
        root.removeAttribute('data-theme')
      } else {
        root.setAttribute('data-theme', store.theme)
      }
    })
  }

  return {
    theme: computed(() => store.theme),
    resolvedTheme: computed(() => store.resolvedTheme),
    setTheme: store.setTheme,
  }
}
