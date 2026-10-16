import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ShellMobileNav from '~/components/shell/ShellMobileNav.vue'

describe('ShellMobileNav', () => {
  it('renders a native dialog element', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: false },
    })
    expect(wrapper.find('dialog').exists()).toBe(true)
  })

  it('does not open the dialog when closed', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: false },
    })
    expect(wrapper.find('dialog').element.open).toBe(false)
  })

  it('opens the dialog when open', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('dialog').element.open).toBe(true)
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

  it('emits close when Escape cancels the dialog', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    wrapper.find('dialog').element.dispatchEvent(new Event('cancel', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when the backdrop is clicked', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    await wrapper.find('dialog').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not emit close when the panel content is clicked', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    await wrapper.find('nav').trigger('click')
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('has an accessible dialog name', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    expect(wrapper.find('dialog').attributes('aria-label')).toBeTruthy()
  })

  it('has an accessible nav landmark', async () => {
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

  it('closes the dialog when open becomes false', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ open: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('dialog').element.open).toBe(false)
  })

  it('does not throw when unmounted while open', async () => {
    const wrapper = await mountSuspended(ShellMobileNav, {
      props: { open: true },
    })
    expect(() => wrapper.unmount()).not.toThrow()
  })
})
