import { test, expect, type Page } from '@playwright/test'
import { installLocalOnlyNetworkGuard } from './support/network'

const STORAGE_KEY = 'wtng:preferences:v1'

async function chooseTheme(page: Page, name: 'System' | 'Light' | 'Dark') {
  await expect(page.locator('header')).toBeVisible()
  const headerToggle = page.locator('header').getByRole('group', { name: 'Color theme' })
  if (await headerToggle.isVisible()) {
    await headerToggle.getByRole('button', { name }).click()
    return
  }

  const dialog = page.getByRole('dialog')
  if (!(await dialog.isVisible())) {
    await page.getByRole('button', { name: 'Open menu' }).click()
  }
  await dialog.getByRole('group', { name: 'Color theme' }).getByRole('button', { name }).click()
}

test.describe('Theme preference', () => {
  test('defaults to the system preference with no stored theme', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('html').getAttribute('data-theme')).toBeNull()
  })

  test('applies and persists an explicit theme across reloads', async ({ page }) => {
    await page.goto('/')
    await chooseTheme(page, 'Dark')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY)
    expect(JSON.parse(stored ?? '{}')).toEqual({
      schemaVersion: 1,
      theme: 'dark',
      aromaView: 'hierarchy',
    })
  })

  test('returns to the system preference when selected', async ({ page }) => {
    await page.goto('/')
    await chooseTheme(page, 'Dark')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await chooseTheme(page, 'System')
    expect(await page.locator('html').getAttribute('data-theme')).toBeNull()
  })

  test('stores only the documented preference key', async ({ page }) => {
    await page.goto('/')
    await chooseTheme(page, 'Light')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    const keys = await page.evaluate(() => Object.keys(window.localStorage))
    expect(keys).toEqual([STORAGE_KEY])
  })

  test('applying a theme makes no remote requests', async ({ page }) => {
    const guard = installLocalOnlyNetworkGuard(page)
    await page.goto('/')
    await chooseTheme(page, 'Dark')
    expect(guard.blockedUrls).toEqual([])
  })
})
