import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BaseCard from '~/components/ui/BaseCard.vue'

describe('BaseCard', () => {
  it('renders as div by default', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      slots: { default: 'Content' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.text()).toBe('Content')
  })

  it('renders as article', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: { as: 'article' },
      slots: { default: 'Article content' },
    })
    expect(wrapper.element.tagName).toBe('ARTICLE')
  })

  it('renders as section', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: { as: 'section' },
      slots: { default: 'Section content' },
    })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('applies default variant classes', async () => {
    const wrapper = await mountSuspended(BaseCard)
    expect(wrapper.classes()).toContain('bg-surface')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('shadow-card')
  })

  it('applies outlined variant classes', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: { variant: 'outlined' },
    })
    expect(wrapper.classes()).toContain('bg-transparent')
    expect(wrapper.classes()).toContain('border')
  })

  it('applies elevated variant classes', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: { variant: 'elevated' },
    })
    expect(wrapper.classes()).toContain('shadow-dialog')
  })

  it('applies padding classes', async () => {
    const none = await mountSuspended(BaseCard, { props: { padding: 'none' } })
    expect(none.classes()).not.toContain('p-5')

    const sm = await mountSuspended(BaseCard, { props: { padding: 'sm' } })
    expect(sm.classes()).toContain('p-3')

    const md = await mountSuspended(BaseCard, { props: { padding: 'md' } })
    expect(md.classes()).toContain('p-5')

    const lg = await mountSuspended(BaseCard, { props: { padding: 'lg' } })
    expect(lg.classes()).toContain('p-7')
  })

  it('renders header and footer slots', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      slots: {
        header: '<div data-testid="header">Header</div>',
        default: 'Body',
        footer: '<div data-testid="footer">Footer</div>',
      },
    })
    expect(wrapper.find('[data-testid="header"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="footer"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Body')
  })

  it('does not render empty header/footer wrappers', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      slots: { default: 'Body only' },
    })
    expect(wrapper.find('[class*="mb-4"]').exists()).toBe(false)
    expect(wrapper.find('[class*="mt-4"]').exists()).toBe(false)
  })

  it('forwards attributes', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: { id: 'test-card' },
    })
    expect(wrapper.attributes('id')).toBe('test-card')
  })

  it('applies rounded-card class', async () => {
    const wrapper = await mountSuspended(BaseCard)
    expect(wrapper.classes()).toContain('rounded-card')
  })
})
