import {
  PREFERENCES_STORAGE_KEY,
  parsePreferences,
  serializePreferences,
  type LoadPreferencesResult,
  type PreferenceRepository,
  type Preferences,
  type SavePreferencesResult,
} from '../ports/preferences'

export function createBrowserPreferenceRepository(
  storage: Storage | null,
): PreferenceRepository {
  function load(): LoadPreferencesResult {
    if (!storage) {
      return { ok: false, error: { code: 'preferences.storage-unavailable' } }
    }

    let raw: string | null
    try {
      raw = storage.getItem(PREFERENCES_STORAGE_KEY)
    } catch {
      return { ok: false, error: { code: 'preferences.storage-unavailable' } }
    }

    return parsePreferences(raw)
  }

  function save(preferences: Preferences): SavePreferencesResult {
    if (!storage) {
      return { ok: false, error: { code: 'preferences.storage-unavailable' } }
    }

    try {
      storage.setItem(PREFERENCES_STORAGE_KEY, serializePreferences(preferences))
    } catch {
      return { ok: false, error: { code: 'preferences.storage-unavailable' } }
    }

    return { ok: true, value: preferences }
  }

  return { load, save }
}
