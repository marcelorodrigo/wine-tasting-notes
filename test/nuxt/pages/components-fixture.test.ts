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

  it('renders all button variants', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    expect(wrapper.find('[data-testid="btn-primary"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-secondary"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-ghost"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-danger"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-busy"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-disabled"]').exists()).toBe(true)
  })

  it('renders card variants', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    expect(wrapper.find('[data-testid="card-default"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="card-outlined"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="card-elevated"]').exists()).toBe(true)
  })

  it('renders dialog with trigger and panel', async () => {
    const wrapper = await mountSuspended(ComponentsFixture)
    expect(wrapper.find('[data-testid="dialog-trigger"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="dialog-panel"]').exists()).toBe(true)
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
