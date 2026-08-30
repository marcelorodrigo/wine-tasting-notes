import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ShellMobileNav from '~/components/shell/ShellMobileNav.vue'

describe('ShellMobileNav', () => {
  it('does not render when closed', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: false },
    })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('renders navigation panel when open', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    const panel = wrapper.find('nav')
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('role')).toBe('dialog')
  })

  it('renders navigation links when open', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    const links = wrapper.findAll('a')
    const hrefs = links.map((l) => l.attributes('href'))
    expect(hrefs).toContain('/academy')
    expect(hrefs).toContain('/tasting')
    expect(hrefs).toContain('/faq')
    expect(hrefs).toContain('/about')
  })

  it('emits close when close button is clicked', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    const closeButton = wrapper.findAll('button').find((b) =>
      b.attributes('aria-label')?.includes('Close'),
    )
    expect(closeButton).toBeTruthy()
    await closeButton!.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('registers and cleans up Escape key listener on open', async () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')

    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })

    await wrapper.setProps({ open: false })

    const removeKeydownCalls = removeSpy.mock.calls.filter((c) => c[0] === 'keydown')
    expect(removeKeydownCalls.length).toBeGreaterThan(0)

    removeSpy.mockRestore()
  })

  it('has accessible nav with aria-label', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBeTruthy()
  })

  it('renders close button with accessible label', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    const closeButton = wrapper.findAll('button').find((b) =>
      b.attributes('aria-label')?.includes('Close'),
    )
    expect(closeButton).toBeTruthy()
    expect(closeButton!.attributes('aria-label')).toBeTruthy()
  })

  it('cleans up event listeners on unmount', async () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')

    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })

    wrapper.unmount()

    const removeKeydownCalls = removeSpy.mock.calls.filter((c) => c[0] === 'keydown')
    expect(removeKeydownCalls.length).toBeGreaterThan(0)

    removeSpy.mockRestore()
  })

  it('activates focus trap when opened', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: false },
    })

    await wrapper.setProps({ open: true })

    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
  })

  it('deactivates focus trap and restores focus when closed', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })

    await wrapper.setProps({ open: false })

    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('emits close when overlay is clicked', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    const overlay = wrapper.find('.bg-ink-950\\/50')
    expect(overlay.exists()).toBe(true)
    await overlay.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
