export const PREFERENCES_STORAGE_KEY = 'wtng:preferences:v1'

export type ThemePreference = 'system' | 'light' | 'dark'

export type AromaViewPreference = 'hierarchy' | 'wheel'

export interface Preferences {
  schemaVersion: 1
  theme: ThemePreference
  aromaView: AromaViewPreference
}

export const DEFAULT_PREFERENCES: Preferences = {
  schemaVersion: 1,
  theme: 'system',
  aromaView: 'hierarchy',
}

export type PreferencesErrorCode =
  | 'preferences.invalid'
  | 'preferences.storage-unavailable'

export interface PreferencesError {
  code: PreferencesErrorCode
}

export type LoadPreferencesResult =
  | { ok: true; value: Preferences }
  | { ok: false; error: PreferencesError }

export type SavePreferencesResult =
  | { ok: true; value: Preferences }
  | { ok: false; error: PreferencesError }

export interface PreferenceRepository {
  load(): LoadPreferencesResult
  save(preferences: Preferences): SavePreferencesResult
}

const THEME_PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark']

const AROMA_VIEW_PREFERENCES: readonly AromaViewPreference[] = ['hierarchy', 'wheel']

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value)
}

function isAromaViewPreference(value: unknown): value is AromaViewPreference {
  return typeof value === 'string' && (AROMA_VIEW_PREFERENCES as readonly string[]).includes(value)
}

function isPreferences(value: unknown): value is Preferences {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    candidate.schemaVersion === 1 &&
    isThemePreference(candidate.theme) &&
    isAromaViewPreference(candidate.aromaView)
  )
}

export function parsePreferences(raw: string | null): LoadPreferencesResult {
  if (raw === null) {
    return { ok: true, value: { ...DEFAULT_PREFERENCES } }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: { code: 'preferences.invalid' } }
  }

  if (!isPreferences(parsed)) {
    return { ok: false, error: { code: 'preferences.invalid' } }
  }

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      theme: parsed.theme,
      aromaView: parsed.aromaView,
    },
  }
}

export function serializePreferences(preferences: Preferences): string {
  return JSON.stringify({
    schemaVersion: preferences.schemaVersion,
    theme: preferences.theme,
    aromaView: preferences.aromaView,
  })
}

/**
 * Runs before first paint to apply an explicit stored theme and avoid a flash
 * of the wrong colors. It intentionally duplicates the persistence shape in
 * plain JavaScript because it cannot import application modules.
 */
export const THEME_INIT_SCRIPT = `!function(){try{var r=window.localStorage.getItem(${JSON.stringify(PREFERENCES_STORAGE_KEY)});if(!r)return;var p=JSON.parse(r);if(p&&p.schemaVersion===1&&(p.aromaView==="hierarchy"||p.aromaView==="wheel")&&(p.theme==="light"||p.theme==="dark")){document.documentElement.setAttribute("data-theme",p.theme)}}catch(e){}}();`
