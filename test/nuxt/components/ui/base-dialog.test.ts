import { describe, expect, it } from 'vitest'
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
})
