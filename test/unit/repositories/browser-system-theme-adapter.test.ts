import { describe, expect, it } from 'vitest'
import {
  DARK_COLOR_SCHEME_QUERY,
  createBrowserSystemThemeAdapter,
  type MatchMediaFactory,
} from '../../../app/repositories/browser-system-theme-adapter'

function createFakeMatchMedia(initialMatches: boolean) {
  const listeners: Array<(event: MediaQueryListEvent) => void> = []
  const queries: string[] = []

  const matchMedia: MatchMediaFactory = (query: string) => {
    queries.push(query)
    return {
      matches: initialMatches,
      media: query,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.push(listener)
      },
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        const index = listeners.indexOf(listener)
        if (index >= 0) {
          listeners.splice(index, 1)
        }
      },
    } as unknown as MediaQueryList
  }

  return {
    matchMedia,
    queries,
    emit(matches: boolean) {
      for (const listener of [...listeners]) {
        listener({ matches } as MediaQueryListEvent)
      }
    },
    listenerCount: () => listeners.length,
  }
}

describe('createBrowserSystemThemeAdapter', () => {
  it('reports dark when the system prefers dark', () => {
    const fake = createFakeMatchMedia(true)
    const adapter = createBrowserSystemThemeAdapter(fake.matchMedia)
    expect(adapter.get()).toBe('dark')
    expect(fake.queries).toEqual([DARK_COLOR_SCHEME_QUERY])
  })

  it('reports light when the system prefers light', () => {
    const adapter = createBrowserSystemThemeAdapter(createFakeMatchMedia(false).matchMedia)
    expect(adapter.get()).toBe('light')
  })

  it('falls back to light when matchMedia is unavailable', () => {
    const adapter = createBrowserSystemThemeAdapter(null)
    expect(adapter.get()).toBe('light')
    expect(adapter.subscribe(() => {})).toBeInstanceOf(Function)
  })

  it('notifies subscribers with the mapped theme', () => {
    const fake = createFakeMatchMedia(false)
    const adapter = createBrowserSystemThemeAdapter(fake.matchMedia)
    const received: string[] = []
    adapter.subscribe((theme) => received.push(theme))

    fake.emit(true)
    fake.emit(false)

    expect(received).toEqual(['dark', 'light'])
  })

  it('stops notifying after unsubscribe', () => {
    const fake = createFakeMatchMedia(false)
    const adapter = createBrowserSystemThemeAdapter(fake.matchMedia)
    const received: string[] = []
    const unsubscribe = adapter.subscribe((theme) => received.push(theme))

    expect(fake.listenerCount()).toBe(1)
    unsubscribe()
    expect(fake.listenerCount()).toBe(0)

    fake.emit(true)
    expect(received).toEqual([])
  })
})
