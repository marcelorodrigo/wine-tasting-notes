import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { installLocalOnlyNetworkGuard } from './support/network'

test('no remote requests are attempted', async ({ page }) => {
  const guard = installLocalOnlyNetworkGuard(page)

  await page.goto('/')

  expect(guard.blockedUrls).toEqual([])
})

test('Manrope and Newsreader font families are available', async ({ page }) => {
  await page.goto('/')

  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe('loaded')

  const fonts = await page.evaluate(async () => {
    await document.fonts.ready
    const entries = [...document.fonts]
    return {
      manrope: entries.filter((f) => f.family === 'Manrope Variable').map((f) => f.status),
      newsreader: entries.filter((f) => f.family === 'Newsreader Variable').map((f) => f.status),
    }
  })

  expect(fonts.manrope.length).toBeGreaterThan(0)
  expect(fonts.manrope.every((s) => s === 'loaded')).toBe(true)
  expect(fonts.newsreader.length).toBeGreaterThan(0)
  expect(fonts.newsreader.every((s) => s === 'loaded')).toBe(true)
})

test('font responses are same-origin generated assets', async ({ page }) => {
  const guard = installLocalOnlyNetworkGuard(page)

  await page.goto('/')
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe('loaded')

  expect(guard.localFontUrls.length).toBeGreaterThan(0)

  for (const url of guard.localFontUrls) {
    expect(url).toContain('localhost')
  }
})

test('body text has no horizontal overflow at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')

  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth
    const bodyWidth = document.body.scrollWidth
    return bodyWidth - docWidth
  })

  expect(overflow).toBeLessThanOrEqual(1)
})

test('no serious or critical axe violations on starter shell', async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(blocking).toEqual([])
})
