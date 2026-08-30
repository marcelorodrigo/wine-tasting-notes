import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Application shell', () => {
  test('skip link is focusable and targets main-content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
  })

  test('skip link moves focus to main on activation', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    const main = page.locator('#main-content')
    await expect(main).toBeFocused()
  })

  test('desktop navigation is visible and operable', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Primary navigation' })
    await expect(nav).toBeVisible()
    const links = nav.getByRole('link')
    await expect(links).toHaveCount(4)
  })

  test('header contains the brand logo', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    const brandLink = header.getByRole('link', { name: /Wine Tasting Notes/i })
    await expect(brandLink).toBeVisible()
  })

  test('footer contains navigation links', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer.getByRole('link', { name: /Academy/i }).first()).toBeVisible()
    await expect(footer.getByRole('link', { name: /Privacy/i }).first()).toBeVisible()
    await expect(footer.getByRole('link', { name: /Terms/i }).first()).toBeVisible()
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })
  test('mobile menu button opens the off-canvas menu', async ({ page }) => {
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: /Open menu/i })
    await expect(menuButton).toBeVisible()
    await menuButton.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
  })

  test('mobile menu closes on Escape key', async ({ page }) => {
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: /Open menu/i })
    await menuButton.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })

  test('mobile menu closes when a link is clicked', async ({ page }) => {
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: /Open menu/i })
    await menuButton.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const link = dialog.getByRole('link', { name: /FAQ/i })
    await link.click()
    await expect(dialog).not.toBeVisible()
  })

  test('mobile menu closes when overlay is clicked', async ({ page }) => {
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: /Open menu/i })
    await menuButton.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.locator('.fixed.inset-0.bg-ink-950\\/50').click({ position: { x: 8, y: 8 } })
    await expect(dialog).not.toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('shell has no serious or critical axe violations with menu closed', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(blocking).toEqual([])
  })

  test('shell has no serious or critical axe violations with menu open', async ({ page }) => {
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: /Open menu/i })
    await menuButton.click()
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(blocking).toEqual([])
  })
})
