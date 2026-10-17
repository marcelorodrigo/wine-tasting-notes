import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  THEME_INIT_SCRIPT,
  parsePreferences,
  serializePreferences,
} from '../../../app/ports/preferences'

function unwrap<T>(result: { ok: true; value: T } | { ok: false; error: { code: string } }): T {
  if (!result.ok) {
    throw new Error(`expected a successful result, received ${result.error.code}`)
  }
  return result.value
}

describe('preferences port', () => {
  it('exposes the documented storage key', () => {
    expect(PREFERENCES_STORAGE_KEY).toBe('wtng:preferences:v1')
  })

  it('returns the defaults when nothing is stored', () => {
    expect(unwrap(parsePreferences(null))).toEqual(DEFAULT_PREFERENCES)
  })

  it('parses a valid stored preference', () => {
    const stored = JSON.stringify({ schemaVersion: 1, theme: 'dark', aromaView: 'wheel' })
    expect(unwrap(parsePreferences(stored))).toEqual({
      schemaVersion: 1,
      theme: 'dark',
      aromaView: 'wheel',
    })
  })

  it('rejects malformed JSON as invalid', () => {
    const result = parsePreferences('not-json')
    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.error.code).toBe('preferences.invalid')
  })

  it('rejects an unknown theme as invalid', () => {
    const stored = JSON.stringify({ schemaVersion: 1, theme: 'blue', aromaView: 'hierarchy' })
    const result = parsePreferences(stored)
    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.error.code).toBe('preferences.invalid')
  })

  it('rejects an unsupported schema version as invalid', () => {
    const stored = JSON.stringify({ schemaVersion: 2, theme: 'dark', aromaView: 'hierarchy' })
    const result = parsePreferences(stored)
    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.error.code).toBe('preferences.invalid')
  })

  it('round-trips through serialize and parse', () => {
    const preferences = { schemaVersion: 1 as const, theme: 'light' as const, aromaView: 'hierarchy' as const }
    expect(unwrap(parsePreferences(serializePreferences(preferences)))).toEqual(preferences)
  })

  it('initialization script reads the documented key and writes data-theme', () => {
    expect(THEME_INIT_SCRIPT).toContain(PREFERENCES_STORAGE_KEY)
    expect(THEME_INIT_SCRIPT).toContain('data-theme')
  })
})
