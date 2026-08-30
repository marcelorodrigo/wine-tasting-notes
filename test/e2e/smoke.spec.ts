import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.route('**/*', (route) => {
    const { hostname, protocol } = new URL(route.request().url())
    if (protocol === 'data:' || protocol === 'blob:' || hostname === 'localhost') {
      return route.continue()
    }
    return route.abort()
  })
})

test('loads starter shell from generated output', async ({ page }) => {
  await page.goto('/')
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()
})

test('starter shell has no serious or critical axe violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()
  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(blocking).toEqual([])
})
