import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  DEFAULT_PREFERENCES,
  type LoadPreferencesResult,
  type PreferenceRepository,
  type Preferences,
  type SavePreferencesResult,
  type ThemePreference,
} from '~/ports/preferences'
import type { SystemTheme, SystemThemePort } from '~/ports/system-theme'
import { usePreferencesStore } from '~/stores/preferences'

function createFakeRepository(loadResult: LoadPreferencesResult) {
  const save = vi.fn(
    (preferences: Preferences): SavePreferencesResult => ({ ok: true, value: preferences }),
  )
  const repository: PreferenceRepository = { load: () => loadResult, save }
  return { repository, save }
}

function createStoredPreferences(theme: ThemePreference): LoadPreferencesResult {
  return { ok: true, value: { schemaVersion: 1, theme, aromaView: 'hierarchy' } }
}

function createFakeSystemTheme(initial: SystemTheme = 'light') {
  let listener: ((theme: SystemTheme) => void) | null = null
  const port: SystemThemePort = {
    get: () => initial,
    subscribe(next) {
      listener = next
      return () => {
        listener = null
      }
    },
  }
  return {
    port,
    emit(theme: SystemTheme) {
      listener?.(theme)
    },
    hasListener: () => listener !== null,
  }
}

describe('preferences store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes from stored preferences', () => {
    const store = usePreferencesStore()
    const { repository } = createFakeRepository(createStoredPreferences('dark'))
    store.initialize({ repository, systemTheme: createFakeSystemTheme('light').port })

    expect(store.theme).toBe('dark')
    expect(store.aromaView).toBe('hierarchy')
    expect(store.ready).toBe(true)
  })

  it('falls back to the defaults when storage is invalid', () => {
    const store = usePreferencesStore()
    const { repository } = createFakeRepository({
      ok: false,
      error: { code: 'preferences.invalid' },
    })
    store.initialize({ repository, systemTheme: createFakeSystemTheme().port })

    expect(store.theme).toBe(DEFAULT_PREFERENCES.theme)
    expect(store.aromaView).toBe(DEFAULT_PREFERENCES.aromaView)
  })

  it('falls back to the defaults when storage is unavailable', () => {
    const store = usePreferencesStore()
    const { repository } = createFakeRepository({
      ok: false,
      error: { code: 'preferences.storage-unavailable' },
    })
    store.initialize({ repository, systemTheme: createFakeSystemTheme().port })

    expect(store.theme).toBe(DEFAULT_PREFERENCES.theme)
  })

  it('resolves the system theme while the preference is system', () => {
    const store = usePreferencesStore()
    const { repository } = createFakeRepository(createStoredPreferences('system'))
    const system = createFakeSystemTheme('dark')
    store.initialize({ repository, systemTheme: system.port })

    expect(store.resolvedTheme).toBe('dark')
    system.emit('light')
    expect(store.systemTheme).toBe('light')
    expect(store.resolvedTheme).toBe('light')
  })

  it('uses the explicit theme for the resolved theme', () => {
    const store = usePreferencesStore()
    const { repository } = createFakeRepository(createStoredPreferences('system'))
    store.initialize({ repository, systemTheme: createFakeSystemTheme('dark').port })

    store.setTheme('light')
    expect(store.resolvedTheme).toBe('light')
  })

  it('persists theme changes', () => {
    const store = usePreferencesStore()
    const { repository, save } = createFakeRepository(createStoredPreferences('system'))
    store.initialize({ repository, systemTheme: createFakeSystemTheme().port })

    store.setTheme('dark')
    expect(save).toHaveBeenCalledWith({
      schemaVersion: 1,
      theme: 'dark',
      aromaView: 'hierarchy',
    })
  })

  it('persists aroma view changes', () => {
    const store = usePreferencesStore()
    const { repository, save } = createFakeRepository(createStoredPreferences('system'))
    store.initialize({ repository, systemTheme: createFakeSystemTheme().port })

    store.setAromaView('wheel')
    expect(save).toHaveBeenCalledWith({
      schemaVersion: 1,
      theme: 'system',
      aromaView: 'wheel',
    })
  })

  it('unsubscribes from system theme changes on dispose', () => {
    const store = usePreferencesStore()
    const { repository } = createFakeRepository(createStoredPreferences('system'))
    const system = createFakeSystemTheme()
    store.initialize({ repository, systemTheme: system.port })

    expect(system.hasListener()).toBe(true)
    store.dispose()
    expect(system.hasListener()).toBe(false)
  })
})
