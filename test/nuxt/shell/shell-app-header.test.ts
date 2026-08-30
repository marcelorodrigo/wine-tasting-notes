import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ShellAppHeader from '~/components/shell/ShellAppHeader.vue'

describe('ShellAppHeader', () => {
  it('renders the brand logo', async () => {
    const wrapper = await mountSuspended(ShellAppHeader)
    expect(wrapper.findComponent({ name: 'ShellAppLogo' }).exists()).toBe(true)
  })

  it('renders desktop navigation links', async () => {
    const wrapper = await mountSuspended(ShellAppHeader)
    const links = wrapper.findAll('nav a')
    const hrefs = links.map((l) => l.attributes('href'))
    expect(hrefs).toContain('/academy')
    expect(hrefs).toContain('/faq')
    expect(hrefs).toContain('/about')
  })

  it('renders the CTA link to /tasting', async () => {
    const wrapper = await mountSuspended(ShellAppHeader)
    const cta = wrapper.find('a[href="/tasting"]')
    expect(cta.exists()).toBe(true)
    expect(cta.text()).toContain('Start Tasting')
  })

  it('emits openMenu when mobile menu button is clicked', async () => {
    const wrapper = await mountSuspended(ShellAppHeader)
    const menuButton = wrapper.find('button')
    await menuButton.trigger('click')
    expect(wrapper.emitted('openMenu')).toHaveLength(1)
  })

  it('has accessible aria-label on mobile menu button', async () => {
    const wrapper = await mountSuspended(ShellAppHeader)
    const menuButton = wrapper.find('button')
    expect(menuButton.attributes('aria-label')).toBeTruthy()
  })
})
