import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RadioGroup from '~/components/wizard/inputs/RadioGroup.vue'

describe('RadioGroup', () => {
  const stringItems = ['clear', 'hazy']
  const objectItems = [
    { label: 'Pale', value: 'pale', description: 'Light color' },
    { label: 'Medium', value: 'medium', description: 'Moderate color' },
    { label: 'Deep', value: 'deep', description: 'Rich color' }
  ]

  it('renders correct number of options from string items', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems }
    })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios).toHaveLength(2)
  })

  it('renders correct number of options from object items', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Intensity', items: objectItems }
    })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios).toHaveLength(3)
  })

  it('displays string items as labels', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems }
    })
    expect(wrapper.text()).toContain('clear')
    expect(wrapper.text()).toContain('hazy')
  })

  it('displays object item labels', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Intensity', items: objectItems }
    })
    expect(wrapper.text()).toContain('Pale')
    expect(wrapper.text()).toContain('Medium')
    expect(wrapper.text()).toContain('Deep')
  })

  it('displays the label prop as form field label', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems }
    })
    expect(wrapper.text()).toContain('Clarity')
  })

  it('displays optional description text', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: {
        label: 'Clarity',
        items: stringItems,
        description: 'How clear is the wine?'
      }
    })
    expect(wrapper.text()).toContain('How clear is the wine?')
  })

  it('has no option selected by default (null state)', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems }
    })
    const radios = wrapper.findAll('[role="radio"]')
    for (const radio of radios) {
      expect(radio.attributes('aria-checked')).toBe('false')
    }
  })

  it('reflects modelValue as selected option', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems, modelValue: 'hazy' }
    })
    const checked = wrapper.find('[role="radio"][aria-checked="true"]')
    expect(checked.exists()).toBe(true)
    expect(checked.attributes('value')).toBe('hazy')
  })

  it('emits update:modelValue when an option is clicked', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems }
    })
    const radios = wrapper.findAll('[role="radio"]')
    await radios[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hazy'])
  })

  it('selects correct value from object items', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Intensity', items: objectItems, modelValue: 'deep' }
    })
    const checked = wrapper.find('[role="radio"][aria-checked="true"]')
    expect(checked.exists()).toBe(true)
    expect(checked.attributes('value')).toBe('deep')
  })

  it('renders data-testid on wrapper', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems }
    })
    expect(wrapper.find('[data-testid="radio-group"]').exists()).toBe(true)
  })

  it('applies disabled state to all radio buttons', async () => {
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Clarity', items: stringItems, disabled: true }
    })
    const radios = wrapper.findAll('[role="radio"]')
    for (const radio of radios) {
      expect(radio.attributes('disabled')).toBeDefined()
    }
  })

  it('works with a longer list of options', async () => {
    const longItems = ['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced']
    const wrapper = await mountSuspended(RadioGroup, {
      props: { label: 'Nose Intensity', items: longItems }
    })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios).toHaveLength(5)
    expect(wrapper.text()).toContain('medium(+)')
  })
})
