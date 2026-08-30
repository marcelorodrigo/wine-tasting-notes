import type { Page } from '@playwright/test'

export interface NetworkGuard {
  blockedUrls: string[]
  localFontUrls: string[]
}

export function installLocalOnlyNetworkGuard(page: Page, allowedOrigins: string[] = ['localhost']): NetworkGuard {
  const blockedUrls: string[] = []
  const localFontUrls: string[] = []

  page.on('response', (response) => {
    const url = response.url()
    try {
      const parsed = new URL(url)
      if (!allowedOrigins.includes(parsed.hostname)) {
        blockedUrls.push(url)
      }
      const contentType = response.headers()['content-type'] ?? ''
      if (
        contentType.includes('font') ||
        url.endsWith('.woff2') ||
        url.endsWith('.woff') ||
        url.endsWith('.ttf')
      ) {
        localFontUrls.push(url)
      }
    } catch {
      // ignore non-absolute URLs
    }
  })

  return { blockedUrls, localFontUrls }
}
