import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WizardContainer from '~/components/wizard/WizardContainer.vue'
import { useWizardNavigation } from '~/composables/useWizardNavigation'

describe('WizardContainer', () => {
  beforeEach(() => {
    const { goToStep } = useWizardNavigation()
    goToStep(1)
  })

  it('renders the WizardProgress component', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    const nav = wrapper.find('nav[aria-label="Tasting wizard progress"]')
    expect(nav.exists()).toBe(true)
  })

  it('renders a UCard wrapper', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    expect(wrapper.find('[data-testid="wizard-card"]').exists()).toBe(true)
  })

  it('renders the WizardNavigation component', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    const nav = wrapper.find('nav[aria-label="Wizard navigation"]')
    expect(nav.exists()).toBe(true)
  })

  it('shows step 1 (Appearance) by default', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    expect(wrapper.find('[data-testid="step-appearance"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Appearance')
  })

  it('displays the current step label in the card header', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    expect(wrapper.text()).toContain('Step 1 of 4')
    expect(wrapper.text()).toContain('Appearance')
  })

  it('navigates to step 2 when Next is clicked', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    await wrapper.find('[data-testid="wizard-next"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="step-nose"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Step 2 of 4')
    expect(wrapper.text()).toContain('Nose')
  })

  it('navigates back to step 1 when Previous is clicked from step 2', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(2)

    const wrapper = await mountSuspended(WizardContainer)
    await wrapper.find('[data-testid="wizard-previous"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="step-appearance"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Step 1 of 4')
  })

  it('shows step 3 (Palate) content', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(3)

    const wrapper = await mountSuspended(WizardContainer)
    expect(wrapper.find('[data-testid="step-palate"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Step 3 of 4')
    expect(wrapper.text()).toContain('Palate')
  })

  it('shows step 4 (Conclusions) content', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(4)

    const wrapper = await mountSuspended(WizardContainer)
    expect(wrapper.find('[data-testid="step-conclusions"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Step 4 of 4')
    expect(wrapper.text()).toContain('Conclusions')
  })

  it('shows Generate Notes button on step 4', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(4)

    const wrapper = await mountSuspended(WizardContainer)
    expect(wrapper.find('[data-testid="wizard-generate"]').exists()).toBe(true)
  })

  it('does not show Generate Notes button on step 1', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    expect(wrapper.find('[data-testid="wizard-generate"]').exists()).toBe(false)
  })

  it('navigates through all 4 steps sequentially', async () => {
    const wrapper = await mountSuspended(WizardContainer)

    expect(wrapper.find('[data-testid="step-appearance"]').exists()).toBe(true)

    await wrapper.find('[data-testid="wizard-next"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="step-nose"]').exists()).toBe(true)

    await wrapper.find('[data-testid="wizard-next"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="step-palate"]').exists()).toBe(true)

    await wrapper.find('[data-testid="wizard-next"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="step-conclusions"]').exists()).toBe(true)
  })

  it('has responsive container styling', async () => {
    const wrapper = await mountSuspended(WizardContainer)
    const container = wrapper.find('div')
    expect(container.classes()).toContain('max-w-3xl')
    expect(container.classes()).toContain('mx-auto')
  })
})
