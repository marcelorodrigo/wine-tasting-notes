import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SkipLink from '~/components/ui/SkipLink.vue'

describe('SkipLink', () => {
  it('renders native anchor', async () => {
    const wrapper = await mountSuspended(SkipLink, {
      slots: { default: 'Skip to content' },
    })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').text()).toBe('Skip to content')
  })

  it('defaults href to #main-content', async () => {
    const wrapper = await mountSuspended(SkipLink)
    expect(wrapper.find('a').attributes('href')).toBe('#main-content')
  })

  it('accepts custom href', async () => {
    const wrapper = await mountSuspended(SkipLink, {
      props: { href: '#custom-target' },
    })
    expect(wrapper.find('a').attributes('href')).toBe('#custom-target')
  })

  it('applies visually-hidden class', async () => {
    const wrapper = await mountSuspended(SkipLink, {
      slots: { default: 'Skip' },
    })
    expect(wrapper.find('a').classes()).toContain('visually-hidden')
  })

  it('forwards attributes', async () => {
    const wrapper = await mountSuspended(SkipLink, {
      props: { id: 'skip-nav' },
      slots: { default: 'Skip' },
    })
    expect(wrapper.find('a').attributes('id')).toBe('skip-nav')
  })

  it('does not have hardcoded product text', async () => {
    const wrapper = await mountSuspended(SkipLink, {
      slots: { default: 'Skip to navigation' },
    })
    expect(wrapper.text()).not.toContain('Skip to content')
    expect(wrapper.text()).toBe('Skip to navigation')
  })

  it('includes focus:[clip:auto] to override visually-hidden clip', async () => {
    const wrapper = await mountSuspended(SkipLink, {
      slots: { default: 'Skip to content' },
    })
    expect(wrapper.find('a').classes()).toContain('focus:[clip:auto]')
  })
})
