import { usePreferencesStore } from '../stores/preferences'

export function useTheme() {
  const store = usePreferencesStore()

  if (import.meta.client) {
    watchEffect(() => {
      const root = document.documentElement
      if (store.theme === 'system') {
        delete root.dataset.theme
      } else {
        root.dataset.theme = store.theme
      }
    })
  }

  return {
    theme: computed(() => store.theme),
    resolvedTheme: computed(() => store.resolvedTheme),
    setTheme: store.setTheme,
  }
}
