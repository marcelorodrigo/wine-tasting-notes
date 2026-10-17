import type { SystemTheme, SystemThemePort } from '../ports/system-theme'

export const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

export type MatchMediaFactory = (query: string) => MediaQueryList

export function createBrowserSystemThemeAdapter(
  matchMedia: MatchMediaFactory | null,
): SystemThemePort {
  function get(): SystemTheme {
    if (!matchMedia) {
      return 'light'
    }

    try {
      return matchMedia(DARK_COLOR_SCHEME_QUERY).matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  }

  function subscribe(listener: (theme: SystemTheme) => void): () => void {
    if (!matchMedia) {
      return () => {}
    }

    let mediaQueryList: MediaQueryList
    try {
      mediaQueryList = matchMedia(DARK_COLOR_SCHEME_QUERY)
    } catch {
      return () => {}
    }

    const handleChange = (event: MediaQueryListEvent) => {
      listener(event.matches ? 'dark' : 'light')
    }

    mediaQueryList.addEventListener('change', handleChange)
    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }

  return { get, subscribe }
}
