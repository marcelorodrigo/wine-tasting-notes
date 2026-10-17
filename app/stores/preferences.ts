import { defineStore } from 'pinia'
import {
  DEFAULT_PREFERENCES,
  type AromaViewPreference,
  type PreferenceRepository,
  type Preferences,
  type ThemePreference,
} from '../ports/preferences'
import type { SystemTheme, SystemThemePort } from '../ports/system-theme'
import { createBrowserPreferenceRepository } from '../repositories/browser-preference-repository'
import { createBrowserSystemThemeAdapter } from '../repositories/browser-system-theme-adapter'

export interface PreferencesStoreOptions {
  repository?: PreferenceRepository
  systemTheme?: SystemThemePort
}

function browserStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function browserMatchMedia(): ((query: string) => MediaQueryList) | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null
  }
  return window.matchMedia.bind(window)
}

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<ThemePreference>(DEFAULT_PREFERENCES.theme)
  const aromaView = ref<AromaViewPreference>(DEFAULT_PREFERENCES.aromaView)
  const systemTheme = ref<SystemTheme>('light')
  const ready = ref(false)

  let repository: PreferenceRepository | null = null
  let unsubscribe: (() => void) | null = null

  const resolvedTheme = computed<SystemTheme>(() =>
    theme.value === 'system' ? systemTheme.value : theme.value,
  )

  function initialize(options: PreferencesStoreOptions = {}) {
    repository = options.repository ?? createBrowserPreferenceRepository(browserStorage())
    const systemThemePort
      = options.systemTheme ?? createBrowserSystemThemeAdapter(browserMatchMedia())

    const loaded = repository.load()
    const preferences = loaded.ok ? loaded.value : DEFAULT_PREFERENCES
    theme.value = preferences.theme
    aromaView.value = preferences.aromaView

    systemTheme.value = systemThemePort.get()
    unsubscribe?.()
    unsubscribe = systemThemePort.subscribe((next) => {
      systemTheme.value = next
    })

    ready.value = true
  }

  function snapshot(): Preferences {
    return {
      schemaVersion: DEFAULT_PREFERENCES.schemaVersion,
      theme: theme.value,
      aromaView: aromaView.value,
    }
  }

  function persist() {
    repository ??= createBrowserPreferenceRepository(browserStorage())
    repository.save(snapshot())
  }

  function setTheme(next: ThemePreference) {
    theme.value = next
    persist()
  }

  function setAromaView(next: AromaViewPreference) {
    aromaView.value = next
    persist()
  }

  function dispose() {
    unsubscribe?.()
    unsubscribe = null
  }

  return {
    theme,
    aromaView,
    systemTheme,
    ready,
    resolvedTheme,
    initialize,
    setTheme,
    setAromaView,
    dispose,
  }
})
