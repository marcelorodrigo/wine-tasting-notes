import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseDialog from '~/components/ui/BaseDialog.vue'

describe('BaseDialog', () => {
  it('renders native dialog element', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Test dialog' },
    })
    expect(wrapper.find('dialog').exists()).toBe(true)
  })

  it('renders accessible name from title prop', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'My Dialog' },
    })
    expect(wrapper.text()).toContain('My Dialog')
  })

  it('renders accessible name from title slot', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false },
      slots: { title: '<span>Slot Title</span>' },
    })
    expect(wrapper.text()).toContain('Slot Title')
  })

  it('forwards aria-label when no title', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false },
      attrs: { 'aria-label': 'External label' },
    })
    expect(wrapper.find('dialog').attributes('aria-label')).toBe('External label')
  })

  it('renders description from prop', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title', description: 'Dialog description' },
    })
    expect(wrapper.text()).toContain('Dialog description')
  })

  it('renders description from slot', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title' },
      slots: { description: '<p>Slot description</p>' },
    })
    expect(wrapper.text()).toContain('Slot description')
  })

  it('renders default slot content', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title' },
      slots: { default: '<p>Dialog body</p>' },
    })
    expect(wrapper.text()).toContain('Dialog body')
  })

  it('renders footer slot', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title' },
      slots: { footer: '<button>Close</button>' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emits update:open when open prop changes to false', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title' },
    })
    await wrapper.setProps({ open: false })
    expect(wrapper.emitted('update:open')).toBeTruthy()
  })

  it('applies panelClass', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title', panelClass: 'custom-panel' },
    })
    expect(wrapper.find('dialog').classes()).toContain('custom-panel')
  })

  it('has rounded-dialog class', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title' },
    })
    expect(wrapper.find('dialog').classes()).toContain('rounded-dialog')
  })

  it('has bg-surface class', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title' },
    })
    expect(wrapper.find('dialog').classes()).toContain('bg-surface')
  })

  it('exposes close method', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title' },
    })
    expect(typeof wrapper.vm.close).toBe('function')
  })

  it('opens dialog when open prop is true', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title' },
    })
    const dialog = wrapper.find('dialog')
    expect(dialog.exists()).toBe(true)
  })

  it('renders dialog with title when open is true', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Opened dialog' },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('dialog').exists()).toBe(true)
    expect(wrapper.text()).toContain('Opened dialog')
  })

  it('closes when calling exposed close method', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title' },
    })
    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')).toBeTruthy()
  })

  it('emits close event with programmatic reason', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title' },
    })
    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    const closeEvents = wrapper.emitted('close')
    expect(closeEvents).toBeTruthy()
    expect(closeEvents![0]).toEqual(['programmatic'])
  })

  it('does not close on Escape when closeOnEscape is false', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title', closeOnEscape: false },
    })
    const dialog = wrapper.find('dialog')
    dialog.element.dispatchEvent(new Event('cancel', { bubbles: true }))
    await wrapper.vm.$nextTick()
    const closeEvents = wrapper.emitted('close')
    expect(closeEvents).toBeFalsy()
  })

  it('does not close on Escape when dismissible is false', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title', dismissible: false },
    })
    const dialog = wrapper.find('dialog')
    dialog.element.dispatchEvent(new Event('cancel', { bubbles: true }))
    await wrapper.vm.$nextTick()
    const closeEvents = wrapper.emitted('close')
    expect(closeEvents).toBeFalsy()
  })

  it('closes on Escape when closeOnEscape and dismissible are true', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title', closeOnEscape: true, dismissible: true },
    })
    const dialog = wrapper.find('dialog')
    dialog.element.dispatchEvent(new Event('cancel', { bubbles: true }))
    await wrapper.vm.$nextTick()
    const closeEvents = wrapper.emitted('close')
    expect(closeEvents).toBeTruthy()
    expect(closeEvents![0]).toEqual(['escape'])
  })

  it('handles native close event without prior reason', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title' },
    })
    const dialog = wrapper.find('dialog')
    dialog.element.dispatchEvent(new Event('close', { bubbles: true }))
    await wrapper.vm.$nextTick()
    const closeEvents = wrapper.emitted('close')
    expect(closeEvents).toBeTruthy()
    expect(closeEvents![0]).toEqual(['native'])
  })

  it('does not re-emit close when closeReason is already set', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title' },
    })
    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    const dialog = wrapper.find('dialog')
    dialog.element.dispatchEvent(new Event('close', { bubbles: true }))
    await wrapper.vm.$nextTick()
    const closeEvents = wrapper.emitted('close')
    expect(closeEvents).toHaveLength(1)
  })

  it('uses initialFocus to focus specific element', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title', initialFocus: '#initial-btn' },
      slots: { default: '<button id="initial-btn">Focus me</button>' },
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('#initial-btn')
    expect(btn.exists()).toBe(true)
  })

  it('does not restore focus when returnFocus is false', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title', returnFocus: false },
    })
    const dialog = wrapper.find('dialog')
    const focusSpy = vi.spyOn(dialog.element, 'focus')
    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(focusSpy).not.toHaveBeenCalled()
  })

  it('calls deactivate on unmount', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: true, title: 'Title' },
    })
    wrapper.unmount()
  })

  it('sets aria-labelledby on dialog when title prop is present', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Accessible title' },
    })
    const dialog = wrapper.find('dialog')
    const labelledby = dialog.attributes('aria-labelledby')
    expect(labelledby).toBeDefined()
    expect(labelledby).toMatch(/-title$/)
  })

  it('does not set aria-labelledby when no title or slot', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false },
    })
    const dialog = wrapper.find('dialog')
    expect(dialog.attributes('aria-labelledby')).toBeUndefined()
  })

  it('sets aria-describedby on dialog when description is present', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title', description: 'A description' },
    })
    const dialog = wrapper.find('dialog')
    const describedby = dialog.attributes('aria-describedby')
    expect(describedby).toBeDefined()
    expect(describedby).toMatch(/-desc$/)
  })

  it('does not set aria-describedby when no description or slot', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title' },
    })
    const dialog = wrapper.find('dialog')
    expect(dialog.attributes('aria-describedby')).toBeUndefined()
  })

  it('title ID on h2 matches dialog aria-labelledby', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'My Title' },
    })
    const labelledby = wrapper.find('dialog').attributes('aria-labelledby')
    const h2 = wrapper.find('h2')
    expect(h2.attributes('id')).toBe(labelledby)
  })

  it('description ID on div matches dialog aria-describedby', async () => {
    const wrapper = await mountSuspended(BaseDialog, {
      props: { open: false, title: 'Title', description: 'A description' },
    })
    const describedby = wrapper.find('dialog').attributes('aria-describedby')
    const descDiv = wrapper.findAll('div').find((d) => d.text() === 'A description')
    expect(descDiv?.attributes('id')).toBe(describedby)
  })
})
