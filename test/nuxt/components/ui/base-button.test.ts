import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseButton from '~/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders native button with default props', async () => {
    const wrapper = await mountSuspended(BaseButton)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('renders accessible name from default slot', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies primary variant classes', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { variant: 'primary' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-action')
    expect(button.classes()).toContain('text-on-action')
  })

  it('applies secondary variant classes', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { variant: 'secondary' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-subtle')
    expect(button.classes()).toContain('border')
  })

  it('applies ghost variant classes', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { variant: 'ghost' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-transparent')
  })

  it('applies danger variant classes', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { variant: 'danger' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-danger')
  })

  it('applies size classes', async () => {
    const sm = await mountSuspended(BaseButton, { props: { size: 'sm' } })
    expect(sm.find('button').classes()).toContain('text-sm')

    const md = await mountSuspended(BaseButton, { props: { size: 'md' } })
    expect(md.find('button').classes()).toContain('text-base')

    const lg = await mountSuspended(BaseButton, { props: { size: 'lg' } })
    expect(lg.find('button').classes()).toContain('text-lg')
  })

  it('sets disabled when busy', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { busy: true },
    })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-busy')).toBe('true')
  })

  it('sets disabled when disabled prop is true', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { disabled: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('applies fullWidth class', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { fullWidth: true },
    })
    expect(wrapper.find('button').classes()).toContain('w-full')
  })

  it('triggers native click on mouse interaction', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      slots: { default: 'Click' },
    })
    const button = wrapper.find('button')
    const clickSpy = vi.fn()
    button.element.addEventListener('click', clickSpy)
    await button.trigger('click')
    expect(clickSpy).toHaveBeenCalled()
  })

  it('does not trigger click when disabled', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Click' },
    })
    const button = wrapper.find('button')
    const clickSpy = vi.fn()
    button.element.addEventListener('click', clickSpy)
    await button.trigger('click')
    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('does not trigger click when busy', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { busy: true },
      slots: { default: 'Click' },
    })
    const button = wrapper.find('button')
    const clickSpy = vi.fn()
    button.element.addEventListener('click', clickSpy)
    await button.trigger('click')
    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('renders leading and trailing slots', async () => {
    const wrapper = await mountSuspended(BaseButton, {
      slots: {
        leading: '<span data-testid="leading">L</span>',
        default: 'Label',
        trailing: '<span data-testid="trailing">T</span>',
      },
    })
    expect(wrapper.find('[data-testid="leading"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trailing"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Label')
  })
})
