import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  type Preferences,
} from '../../../app/ports/preferences'
import { createBrowserPreferenceRepository } from '../../../app/repositories/browser-preference-repository'

function createFakeStorage(initial: Record<string, string> = {}): Storage {
  const entries = new Map<string, string>(Object.entries(initial))
  return {
    get length() {
      return entries.size
    },
    clear() {
      entries.clear()
    },
    getItem(key: string) {
      return entries.get(key) ?? null
    },
    key(index: number) {
      return [...entries.keys()][index] ?? null
    },
    removeItem(key: string) {
      entries.delete(key)
    },
    setItem(key: string, value: string) {
      entries.set(key, value)
    },
  }
}

function unwrap<T>(result: { ok: true; value: T } | { ok: false; error: { code: string } }): T {
  if (!result.ok) {
    throw new Error(`expected a successful result, received ${result.error.code}`)
  }
  return result.value
}

describe('createBrowserPreferenceRepository', () => {
  it('loads the defaults when storage is empty', () => {
    const repository = createBrowserPreferenceRepository(createFakeStorage())
    expect(unwrap(repository.load())).toEqual(DEFAULT_PREFERENCES)
  })

  it('loads a valid stored preference', () => {
    const storage = createFakeStorage({
      [PREFERENCES_STORAGE_KEY]: JSON.stringify({
        schemaVersion: 1,
        theme: 'dark',
        aromaView: 'wheel',
      }),
    })
    const repository = createBrowserPreferenceRepository(storage)
    expect(unwrap(repository.load())).toEqual({
      schemaVersion: 1,
      theme: 'dark',
      aromaView: 'wheel',
    })
  })

  it('reports malformed storage as invalid', () => {
    const storage = createFakeStorage({ [PREFERENCES_STORAGE_KEY]: 'not-json' })
    const repository = createBrowserPreferenceRepository(storage)
    const result = repository.load()
    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.error.code).toBe('preferences.invalid')
  })

  it('reports unavailable storage when reading throws', () => {
    const storage = createFakeStorage()
    storage.getItem = () => {
      throw new Error('denied')
    }
    const repository = createBrowserPreferenceRepository(storage)
    const result = repository.load()
    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.error.code).toBe('preferences.storage-unavailable')
  })

  it('reports unavailable storage when no storage is provided', () => {
    const repository = createBrowserPreferenceRepository(null)
    const load = repository.load()
    expect(load.ok).toBe(false)
    if (load.ok) throw new Error('expected failure')
    expect(load.error.code).toBe('preferences.storage-unavailable')

    const save = repository.save(DEFAULT_PREFERENCES)
    expect(save.ok).toBe(false)
    if (save.ok) throw new Error('expected failure')
    expect(save.error.code).toBe('preferences.storage-unavailable')
  })

  it('writes only the documented key', () => {
    const storage = createFakeStorage()
    const repository = createBrowserPreferenceRepository(storage)
    const preferences: Preferences = { schemaVersion: 1, theme: 'light', aromaView: 'wheel' }
    expect(repository.save(preferences).ok).toBe(true)
    expect(storage.length).toBe(1)
    expect(storage.key(0)).toBe(PREFERENCES_STORAGE_KEY)
    expect(JSON.parse(storage.getItem(PREFERENCES_STORAGE_KEY) ?? '')).toEqual(preferences)
  })

  it('reports unavailable storage when writing throws', () => {
    const storage = createFakeStorage()
    storage.setItem = () => {
      throw new Error('quota exceeded')
    }
    const repository = createBrowserPreferenceRepository(storage)
    const result = repository.save(DEFAULT_PREFERENCES)
    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected failure')
    expect(result.error.code).toBe('preferences.storage-unavailable')
  })
})
