import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('base UI components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components-fixture')
  })

  test('renders all component sections', async ({ page }) => {
    const fixture = page.locator('[data-testid="base-ui-fixture"]')
    await expect(fixture).toBeVisible()
    await expect(page.locator('[data-testid="section-buttons"]')).toBeVisible()
    await expect(page.locator('[data-testid="section-cards"]')).toBeVisible()
    await expect(page.locator('[data-testid="section-dialog"]')).toBeVisible()
    await expect(page.locator('[data-testid="section-fieldset"]')).toBeVisible()
    await expect(page.locator('[data-testid="section-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="section-notices"]')).toBeVisible()
  })

  test('buttons have accessible roles', async ({ page }) => {
    const buttons = page.locator('[data-testid="section-buttons"] button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveRole('button')
    }
  })

  test('primary button has visible text', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-primary"]')).toHaveText('Primary action')
  })

  test('busy button has aria-busy', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-busy"]')).toHaveAttribute('aria-busy', 'true')
  })

  test('disabled button is not interactive', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-disabled"]')
    await expect(btn).toBeDisabled()
  })

  test('dialog opens and closes', async ({ page }) => {
    await page.locator('[data-testid="dialog-trigger"]').click()
    const dialog = page.locator('[data-testid="dialog-panel"]')
    await expect(dialog).toBeVisible()
    await expect(page.getByText('Dialog content')).toBeVisible()
    await page.locator('[data-testid="dialog-action"]').click()
    await expect(dialog).not.toBeVisible()
  })

  test('dialog closes on Escape', async ({ page }) => {
    await page.locator('[data-testid="dialog-trigger"]').click()
    const dialog = page.locator('[data-testid="dialog-panel"]')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })

  test('dialog traps focus on Tab', async ({ page }) => {
    await page.locator('[data-testid="dialog-trigger"]').click()
    const dialog = page.locator('[data-testid="dialog-panel"]')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.closest('dialog'))
    expect(focused).not.toBeNull()
  })

  test('fieldset renders legend and error', async ({ page }) => {
    const fieldset = page.locator('[data-testid="section-fieldset"] fieldset')
    await expect(fieldset).toBeVisible()
    await expect(fieldset.locator('legend')).toHaveText('Example group')
    await expect(fieldset).toHaveAttribute('aria-invalid', 'true')
  })

  test('progress has accessible role and label', async ({ page }) => {
    const progress = page.locator('[data-testid="progress-determinate"] progress')
    await expect(progress).toHaveRole('progressbar')
    await expect(progress).toHaveAttribute('aria-label', 'Progress')
  })

  test('notices render with correct roles', async ({ page }) => {
    await expect(page.locator('[data-testid="notice-info"]')).toHaveAttribute('role', 'status')
    await expect(page.locator('[data-testid="notice-error"]')).toHaveAttribute('role', 'alert')
  })

  test('skip link is visually hidden until focused', async ({ page }) => {
    const skipLink = page.locator('[data-testid="section-skip-link"] a')
    await expect(skipLink).toHaveClass(/visually-hidden/)
    await skipLink.focus()
    await expect(skipLink).toBeVisible()
  })

  test('skip link targets main content', async ({ page }) => {
    const skipLink = page.locator('[data-testid="section-skip-link"] a')
    await expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  test('no serious or critical axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('[data-testid="base-ui-fixture"]')
      .analyze()
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(blocking).toEqual([])
  })

  test('interactive controls have minimum 44px touch targets', async ({ page }) => {
    const controls = [
      page.locator('[data-testid="btn-primary"]'),
      page.locator('[data-testid="btn-secondary"]'),
      page.locator('[data-testid="dialog-trigger"]'),
    ]
    for (const control of controls) {
      const box = await control.boundingBox()
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
  })
})
