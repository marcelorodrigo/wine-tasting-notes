import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InlineNotice from '~/components/ui/InlineNotice.vue'

describe('InlineNotice', () => {
  it('renders when modelValue is true', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { modelValue: true },
      slots: { default: 'Notice content' },
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Notice content')
  })

  it('does not render when modelValue is false', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { modelValue: false },
      slots: { default: 'Hidden' },
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('renders with role="alert"', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { role: 'alert' },
      slots: { default: 'Error!' },
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('renders title from prop', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { title: 'Notice title' },
      slots: { default: 'Body' },
    })
    expect(wrapper.text()).toContain('Notice title')
    expect(wrapper.text()).toContain('Body')
  })

  it('applies tone classes', async () => {
    const info = await mountSuspended(InlineNotice, {
      props: { tone: 'info' },
      slots: { default: 'Info' },
    })
    expect(info.find('[role="status"]').classes().join(' ')).toContain('bg-information')

    const success = await mountSuspended(InlineNotice, {
      props: { tone: 'success' },
      slots: { default: 'Success' },
    })
    expect(success.find('[role="status"]').classes().join(' ')).toContain('bg-success')

    const warning = await mountSuspended(InlineNotice, {
      props: { tone: 'warning' },
      slots: { default: 'Warning' },
    })
    expect(warning.find('[role="status"]').classes().join(' ')).toContain('bg-warning')

    const error = await mountSuspended(InlineNotice, {
      props: { tone: 'error' },
      slots: { default: 'Error' },
    })
    expect(error.find('[role="status"]').classes().join(' ')).toContain('bg-danger')
  })

  it('does not render dismiss button when not dismissible', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { dismissible: false },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders dismiss button when dismissible', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { dismissible: true },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits dismiss and update:modelValue on dismiss click', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { dismissible: true, modelValue: true },
      slots: { default: 'Content' },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('dismiss')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('sets aria-live when live is not off', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { live: 'polite' },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true)
  })

  it('does not set aria-live when live is off', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { live: 'off' },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('[aria-live]').exists()).toBe(false)
  })

  it('does not include role when role is none', async () => {
    const wrapper = await mountSuspended(InlineNotice, {
      props: { role: 'none' },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('[role]').exists()).toBe(false)
  })
})
