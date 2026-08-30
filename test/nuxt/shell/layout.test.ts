import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '~/layouts/default.vue'

describe('Default layout', () => {
  it('renders the main landmark with correct id', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<p>Page content</p>' },
    })
    const main = wrapper.find('main#main-content')
    expect(main.exists()).toBe(true)
    expect(main.attributes('tabindex')).toBe('-1')
  })

  it('includes a skip link targeting main-content', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<p>Page content</p>' },
    })
    const skipLink = wrapper.find('a[href="#main-content"]')
    expect(skipLink.exists()).toBe(true)
  })

  it('renders header and footer landmarks', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<p>Page content</p>' },
    })
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('renders page content in main', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<p data-testid="content">Hello</p>' },
    })
    const main = wrapper.find('main')
    expect(main.find('[data-testid="content"]').exists()).toBe(true)
  })

  it('opens mobile nav when header emits openMenu', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<p>Page content</p>' },
    })
    const header = wrapper.findComponent({ name: 'ShellAppHeader' })
    expect(header.exists()).toBe(true)
    await header.vm.$emit('openMenu')
    await wrapper.vm.$nextTick()
    const mobileNav = wrapper.findComponent({ name: 'ShellMobileNav' })
    expect(mobileNav.props('open')).toBe(true)
  })

  it('closes mobile nav when ShellMobileNav emits close', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: '<p>Page content</p>' },
    })
    const header = wrapper.findComponent({ name: 'ShellAppHeader' })
    await header.vm.$emit('openMenu')
    await wrapper.vm.$nextTick()
    const mobileNav = wrapper.findComponent({ name: 'ShellMobileNav' })
    expect(mobileNav.props('open')).toBe(true)
    await mobileNav.vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(mobileNav.props('open')).toBe(false)
  })
})
