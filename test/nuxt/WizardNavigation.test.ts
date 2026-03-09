import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WizardNavigation from '~/components/wizard/WizardNavigation.vue'
import { useWizardNavigation } from '~/composables/useWizardNavigation'

describe('WizardNavigation', () => {
  beforeEach(() => {
    const { goToStep } = useWizardNavigation()
    goToStep(1)
  })

  it('renders a navigation landmark', async () => {
    const wrapper = await mountSuspended(WizardNavigation)
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Wizard navigation')
  })

  it('hides Previous button on step 1', async () => {
    const wrapper = await mountSuspended(WizardNavigation)
    expect(wrapper.find('[data-testid="wizard-previous"]').exists()).toBe(false)
  })

  it('shows Next button on step 1', async () => {
    const wrapper = await mountSuspended(WizardNavigation)
    const next = wrapper.find('[data-testid="wizard-next"]')
    expect(next.exists()).toBe(true)
    expect(next.text()).toContain('Next')
  })

  it('does not show Generate button on step 1', async () => {
    const wrapper = await mountSuspended(WizardNavigation)
    expect(wrapper.find('[data-testid="wizard-generate"]').exists()).toBe(false)
  })

  it('shows both Previous and Next on a middle step', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(2)

    const wrapper = await mountSuspended(WizardNavigation)
    expect(wrapper.find('[data-testid="wizard-previous"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="wizard-next"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="wizard-generate"]').exists()).toBe(false)
  })

  it('shows Previous and Generate on step 3 (still has Next)', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(3)

    const wrapper = await mountSuspended(WizardNavigation)
    expect(wrapper.find('[data-testid="wizard-previous"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="wizard-next"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="wizard-generate"]').exists()).toBe(false)
  })

  it('shows Previous and Generate on the last step', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(4)

    const wrapper = await mountSuspended(WizardNavigation)
    expect(wrapper.find('[data-testid="wizard-previous"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="wizard-generate"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="wizard-next"]').exists()).toBe(false)
  })

  it('Generate button has prominent styling (size xl)', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(4)

    const wrapper = await mountSuspended(WizardNavigation)
    const generate = wrapper.find('[data-testid="wizard-generate"]')
    expect(generate.text()).toContain('Generate Notes')
  })

  it('emits "previous" when Previous is clicked', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(2)

    const wrapper = await mountSuspended(WizardNavigation)
    await wrapper.find('[data-testid="wizard-previous"]').trigger('click')
    expect(wrapper.emitted('previous')).toHaveLength(1)
  })

  it('emits "next" when Next is clicked', async () => {
    const wrapper = await mountSuspended(WizardNavigation)
    await wrapper.find('[data-testid="wizard-next"]').trigger('click')
    expect(wrapper.emitted('next')).toHaveLength(1)
  })

  it('emits "generate" when Generate is clicked', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(4)

    const wrapper = await mountSuspended(WizardNavigation)
    await wrapper.find('[data-testid="wizard-generate"]').trigger('click')
    expect(wrapper.emitted('generate')).toHaveLength(1)
  })

  it('all buttons meet minimum touch target size (44px)', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(2)

    const wrapper = await mountSuspended(WizardNavigation)
    const buttons = wrapper.findAll('button')
    for (const btn of buttons) {
      const classes = btn.classes().join(' ') + ' ' + (btn.attributes('class') || '')
      expect(classes).toContain('min-h-[44px]')
      expect(classes).toContain('min-w-[44px]')
    }
  })

  it('justifies content to the end when only Next is visible', async () => {
    const wrapper = await mountSuspended(WizardNavigation)
    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('justify-end')
  })

  it('justifies content between when both Previous and Next are visible', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(2)

    const wrapper = await mountSuspended(WizardNavigation)
    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('justify-between')
  })
})
