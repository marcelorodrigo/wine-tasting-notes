import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WizardProgress from '~/components/wizard/WizardProgress.vue'
import { useWizardNavigation } from '~/composables/useWizardNavigation'

describe('WizardProgress', () => {
  beforeEach(() => {
    const { goToStep } = useWizardNavigation()
    goToStep(1)
  })

  it('renders a navigation landmark', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Tasting wizard progress')
  })

  it('renders an ordered list of steps', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const ol = wrapper.find('ol')
    expect(ol.exists()).toBe(true)
    const listItems = ol.findAll('li')
    expect(listItems.length).toBe(4)
  })

  it('renders all 4 step labels', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const text = wrapper.text()
    expect(text).toContain('Appearance')
    expect(text).toContain('Nose')
    expect(text).toContain('Palate')
    expect(text).toContain('Conclusions')
  })

  it('renders step trigger buttons with accessible labels', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(4)
    expect(buttons[0]!.attributes('aria-label')).toBe('Step 1: Appearance')
    expect(buttons[1]!.attributes('aria-label')).toBe('Step 2: Nose')
    expect(buttons[2]!.attributes('aria-label')).toBe('Step 3: Palate')
    expect(buttons[3]!.attributes('aria-label')).toBe('Step 4: Conclusions')
  })

  it('marks step 1 as active initially', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('data-state')).toBe('active')
    expect(buttons[0]!.attributes('aria-current')).toBe('step')
  })

  it('marks future steps as upcoming', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const buttons = wrapper.findAll('button')
    expect(buttons[1]!.attributes('data-state')).toBe('upcoming')
    expect(buttons[2]!.attributes('data-state')).toBe('upcoming')
    expect(buttons[3]!.attributes('data-state')).toBe('upcoming')
  })

  it('does not set aria-current on non-active steps', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const buttons = wrapper.findAll('button')
    expect(buttons[1]!.attributes('aria-current')).toBeUndefined()
    expect(buttons[2]!.attributes('aria-current')).toBeUndefined()
    expect(buttons[3]!.attributes('aria-current')).toBeUndefined()
  })

  it('shows completed state for previous steps', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(3)

    const wrapper = await mountSuspended(WizardProgress)
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('data-state')).toBe('completed')
    expect(buttons[1]!.attributes('data-state')).toBe('completed')
    expect(buttons[2]!.attributes('data-state')).toBe('active')
    expect(buttons[3]!.attributes('data-state')).toBe('upcoming')
  })

  it('navigates to a step when clicked', async () => {
    const { currentStep } = useWizardNavigation()
    const wrapper = await mountSuspended(WizardProgress)

    const buttons = wrapper.findAll('button')
    await buttons[2]!.trigger('click')
    expect(currentStep.value).toBe(3)
  })

  it('navigates back to step 1 when first step is clicked', async () => {
    const { goToStep, currentStep } = useWizardNavigation()
    goToStep(4)

    const wrapper = await mountSuspended(WizardProgress)
    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    expect(currentStep.value).toBe(1)
  })

  it('renders connector lines between steps', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const connectors = wrapper.findAll('div[aria-hidden="true"]')
    expect(connectors.length).toBe(3)
  })

  it('renders step icons', async () => {
    const wrapper = await mountSuspended(WizardProgress)
    const icons = wrapper.findAll('span.iconify')
    expect(icons.length).toBeGreaterThanOrEqual(4)
  })

  it('shows all steps as completed on the last step', async () => {
    const { goToStep } = useWizardNavigation()
    goToStep(4)

    const wrapper = await mountSuspended(WizardProgress)
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('data-state')).toBe('completed')
    expect(buttons[1]!.attributes('data-state')).toBe('completed')
    expect(buttons[2]!.attributes('data-state')).toBe('completed')
    expect(buttons[3]!.attributes('data-state')).toBe('active')
  })
})
