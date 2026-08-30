import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseFieldset from '~/components/ui/BaseFieldset.vue'

describe('BaseFieldset', () => {
  it('renders native fieldset', async () => {
    const wrapper = await mountSuspended(BaseFieldset)
    expect(wrapper.find('fieldset').exists()).toBe(true)
  })

  it('renders legend from prop', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { legend: 'Personal info' },
    })
    expect(wrapper.find('legend').text()).toBe('Personal info')
  })

  it('renders legend from slot', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      slots: { legend: 'Slot legend' },
    })
    expect(wrapper.find('legend').text()).toBe('Slot legend')
  })

  it('renders help text with id association', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { id: 'test', legend: 'Group', help: 'Help text' },
    })
    const fieldset = wrapper.find('fieldset')
    expect(fieldset.attributes('aria-describedby')).toContain('test-help')
    expect(wrapper.find('#test-help').text()).toBe('Help text')
  })

  it('renders error text with id association when invalid', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { id: 'test', legend: 'Group', error: 'Required field', invalid: true },
    })
    const fieldset = wrapper.find('fieldset')
    expect(fieldset.attributes('aria-describedby')).toContain('test-error')
    expect(fieldset.attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('#test-error').text()).toBe('Required field')
  })

  it('defaults invalid to true when error is provided', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { error: 'Something wrong' },
    })
    expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true')
  })

  it('does not set aria-invalid when no error', async () => {
    const wrapper = await mountSuspended(BaseFieldset)
    expect(wrapper.find('fieldset').attributes('aria-invalid')).toBeUndefined()
  })

  it('applies disabled to fieldset', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { disabled: true },
    })
    expect(wrapper.find('fieldset').attributes('disabled')).toBeDefined()
  })

  it('does not render empty help/error wrappers', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { legend: 'Group' },
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('renders help via slot only without help prop', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { id: 'test' },
      slots: { help: '<span>Slot help</span>' },
    })
    expect(wrapper.find('#test-help').exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot help')
  })

  it('renders error via slot only without error prop', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { id: 'test', invalid: true },
      slots: { error: '<span>Slot error</span>' },
    })
    expect(wrapper.find('#test-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot error')
  })

  it('forwards attributes', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { id: 'custom' },
    })
    expect(wrapper.find('fieldset').attributes('id')).toBe('custom')
  })

  it('renders help slot without id prop and associates via aria-describedby', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      slots: { help: '<span>Slot help text</span>' },
    })
    const fieldset = wrapper.find('fieldset')
    const describedby = fieldset.attributes('aria-describedby')
    expect(describedby).toBeDefined()
    expect(wrapper.text()).toContain('Slot help text')
  })

  it('renders error slot without id prop when invalid', async () => {
    const wrapper = await mountSuspended(BaseFieldset, {
      props: { invalid: true },
      slots: { error: '<span>Slot error text</span>' },
    })
    const fieldset = wrapper.find('fieldset')
    const describedby = fieldset.attributes('aria-describedby')
    expect(describedby).toBeDefined()
    expect(fieldset.attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Slot error text')
  })
})
