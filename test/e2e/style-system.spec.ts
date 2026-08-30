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

  await page.waitForLoadState('networkidle')

  const manrope = await page.evaluate(() => document.fonts.check('1em "Manrope Variable"'))
  const newsreader = await page.evaluate(() => document.fonts.check('1em "Newsreader Variable"'))

  expect(manrope).toBe(true)
  expect(newsreader).toBe(true)
})

test('font responses are same-origin generated assets', async ({ page }) => {
  const guard = installLocalOnlyNetworkGuard(page)

  await page.goto('/')
  await page.waitForLoadState('networkidle')

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
