import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseProgress from '~/components/ui/BaseProgress.vue'

describe('BaseProgress', () => {
  it('renders native progress element', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 50, label: 'Progress' },
    })
    expect(wrapper.find('progress').exists()).toBe(true)
  })

  it('renders accessible name from label', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 50, label: 'Upload progress' },
    })
    const progress = wrapper.find('progress')
    expect(progress.attributes('aria-label')).toBe('Upload progress')
  })

  it('displays label text', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 50, label: 'Upload progress' },
    })
    expect(wrapper.find('label').text()).toBe('Upload progress')
  })

  it('sets value and max attributes', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 75, max: 100, label: 'Progress' },
    })
    const progress = wrapper.find('progress')
    expect(progress.attributes('value')).toBe('75')
    expect(progress.attributes('max')).toBe('100')
  })

  it('handles indeterminate state when value is null', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: null, label: 'Loading' },
    })
    const progress = wrapper.find('progress')
    expect(progress.attributes('value')).toBeUndefined()
  })

  it('shows default value text when showValue is true', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 42, max: 100, label: 'Progress', showValue: true },
    })
    expect(wrapper.text()).toContain('42 / 100')
  })

  it('shows custom text from prop', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 50, label: 'Progress', text: 'Half done' },
    })
    expect(wrapper.text()).toContain('Half done')
  })

  it('overrides text with text slot', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 50, label: 'Progress', text: 'Prop text' },
      slots: { text: '<span>Slot text</span>' },
    })
    expect(wrapper.text()).toContain('Slot text')
    expect(wrapper.text()).not.toContain('Prop text')
  })

  it('applies variant classes', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 50, label: 'Progress', variant: 'success' },
    })
    expect(wrapper.find('progress').classes().join(' ')).toContain('bg-success')
  })

  it('clamps out-of-range values', async () => {
    const wrapper = await mountSuspended(BaseProgress, {
      props: { value: 150, max: 100, label: 'Progress', showValue: true },
    })
    expect(wrapper.text()).toContain('100 / 100')
  })
})
