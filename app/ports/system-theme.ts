export type SystemTheme = 'light' | 'dark'

export interface SystemThemePort {
  get(): SystemTheme
  subscribe(listener: (theme: SystemTheme) => void): () => void
}
