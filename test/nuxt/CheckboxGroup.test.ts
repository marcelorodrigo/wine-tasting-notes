import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CheckboxGroup from '~/components/wizard/inputs/CheckboxGroup.vue'

describe('CheckboxGroup', () => {
  const stringItems = ['legs/tears', 'deposit', 'pétillance', 'bubbles']
  const objectItems = [
    { label: 'Legs/Tears', value: 'legs/tears' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Bubbles', value: 'bubbles' }
  ]

  it('renders correct number of options from string items', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Other Observations', items: stringItems }
    })
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    expect(checkboxes).toHaveLength(4)
  })

  it('renders correct number of options from object items', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: objectItems }
    })
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    expect(checkboxes).toHaveLength(3)
  })

  it('displays string items as labels', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Other Observations', items: stringItems }
    })
    expect(wrapper.text()).toContain('legs/tears')
    expect(wrapper.text()).toContain('deposit')
    expect(wrapper.text()).toContain('pétillance')
    expect(wrapper.text()).toContain('bubbles')
  })

  it('displays object item labels', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: objectItems }
    })
    expect(wrapper.text()).toContain('Legs/Tears')
    expect(wrapper.text()).toContain('Deposit')
    expect(wrapper.text()).toContain('Bubbles')
  })

  it('displays the label prop as form field label', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Other Observations', items: stringItems }
    })
    expect(wrapper.text()).toContain('Other Observations')
  })

  it('displays optional description text', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: {
        label: 'Other Observations',
        items: stringItems,
        description: 'Select any that apply'
      }
    })
    expect(wrapper.text()).toContain('Select any that apply')
  })

  it('has no options selected by default (empty array)', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: stringItems }
    })
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    for (const checkbox of checkboxes) {
      expect(checkbox.attributes('aria-checked')).toBe('false')
    }
  })

  it('reflects modelValue as selected options', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: {
        label: 'Observations',
        items: stringItems,
        modelValue: ['deposit', 'bubbles']
      }
    })
    const checked = wrapper.findAll('[role="checkbox"][aria-checked="true"]')
    expect(checked).toHaveLength(2)
  })

  it('emits update:modelValue when a checkbox is clicked', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: stringItems }
    })
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    await checkboxes[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['legs/tears']])
  })

  it('supports multiple selections', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: {
        label: 'Observations',
        items: stringItems,
        modelValue: ['legs/tears']
      }
    })
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    await checkboxes[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['legs/tears', 'deposit']])
  })

  it('renders data-testid on wrapper', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: stringItems }
    })
    expect(wrapper.find('[data-testid="checkbox-group"]').exists()).toBe(true)
  })

  it('renders toggle-all button', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: stringItems }
    })
    const toggleBtn = wrapper.find('[data-testid="toggle-all"]')
    expect(toggleBtn.exists()).toBe(true)
    expect(toggleBtn.text()).toBe('Select all')
  })

  it('toggle-all selects all items when none selected', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: stringItems }
    })
    const toggleBtn = wrapper.find('[data-testid="toggle-all"]')
    await toggleBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['legs/tears', 'deposit', 'pétillance', 'bubbles']
    ])
  })

  it('toggle-all deselects all items when all selected', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: {
        label: 'Observations',
        items: stringItems,
        modelValue: ['legs/tears', 'deposit', 'pétillance', 'bubbles']
      }
    })
    const toggleBtn = wrapper.find('[data-testid="toggle-all"]')
    expect(toggleBtn.text()).toBe('Deselect all')
    await toggleBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })

  it('applies disabled state to all checkboxes', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: { label: 'Observations', items: stringItems, disabled: true }
    })
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    for (const checkbox of checkboxes) {
      expect(checkbox.attributes('disabled')).toBeDefined()
    }
  })

  it('works with object items and reflects selection', async () => {
    const wrapper = await mountSuspended(CheckboxGroup, {
      props: {
        label: 'Observations',
        items: objectItems,
        modelValue: ['deposit']
      }
    })
    const checked = wrapper.findAll('[role="checkbox"][aria-checked="true"]')
    expect(checked).toHaveLength(1)
  })
})
