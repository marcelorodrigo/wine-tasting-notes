import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentsFixture from '~/pages/components-fixture.vue'

describe('components-fixture page', () => {
  it('renders all sections', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    expect(wrapper.find('[data-testid="base-ui-fixture"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-buttons"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-cards"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-dialog"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-fieldset"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-progress"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-notices"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-skip-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="main-content"]').exists()).toBe(true)
  })

  it.each([
    {
      name: 'button variants',
      selectors: ['btn-primary', 'btn-secondary', 'btn-ghost', 'btn-danger', 'btn-busy', 'btn-disabled'],
    },
    {
      name: 'card variants',
      selectors: ['card-default', 'card-outlined', 'card-elevated'],
    },
    {
      name: 'dialog trigger and panel',
      selectors: ['dialog-trigger', 'dialog-panel'],
    },
  ])('renders $name', async ({ selectors }) => {
    const wrapper = await mountSuspended(ComponentsFixture)
    for (const selector of selectors) {
      expect(wrapper.find(`[data-testid="${selector}"]`).exists()).toBe(true)
    }
  })

  it('renders fieldset with all props', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    const fieldset = wrapper.find('#example-fieldset')
    expect(fieldset.exists()).toBe(true)
    expect(fieldset.find('legend').text()).toBe('Example group')
    expect(fieldset.attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Example help text')
    expect(wrapper.text()).toContain('Example error text')
  })

  it('renders progress bars', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    expect(wrapper.find('[data-testid="progress-determinate"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="progress-indeterminate"]').exists()).toBe(true)
  })

  it('renders notices', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    expect(wrapper.find('[data-testid="notice-info"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="notice-error"]').exists()).toBe(true)
  })

  it('renders skip link and main content', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    expect(wrapper.text()).toContain('Skip to main content')
    expect(wrapper.text()).toContain('Main content target')
  })
})
