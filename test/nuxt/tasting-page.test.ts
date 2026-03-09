import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TastingPage from '~/pages/tasting.vue'
import { useWizardNavigation } from '~/composables/useWizardNavigation'
import { useTastingData } from '~/composables/useTastingData'

describe('Tasting page (tasting.vue)', () => {
  beforeEach(() => {
    const { goToStep } = useWizardNavigation()
    goToStep(1)
    const { resetTastingData } = useTastingData()
    resetTastingData()
  })

  it('mounts the WizardContainer with step content', async () => {
    const wrapper = await mountSuspended(TastingPage)
    expect(wrapper.find('[data-testid="wizard-card"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="step-appearance"]').exists()).toBe(true)
  })

  it('renders the wizard progress indicator', async () => {
    const wrapper = await mountSuspended(TastingPage)
    const nav = wrapper.find('nav[aria-label="Tasting wizard progress"]')
    expect(nav.exists()).toBe(true)
  })

  it('renders a "Back to Home" link pointing to /', async () => {
    const wrapper = await mountSuspended(TastingPage)
    const link = wrapper.find('[data-testid="back-home"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/')
  })

  it('renders a "Start Over" button', async () => {
    const wrapper = await mountSuspended(TastingPage)
    const btn = wrapper.find('[data-testid="start-over"]')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toContain('Start Over')
  })

  it('resets tasting data and navigates to step 1 when Start Over is clicked', async () => {
    const { goToStep } = useWizardNavigation()
    const { tastingData } = useTastingData()

    goToStep(3)
    tastingData.value.appearance.wineType = 'red'

    const wrapper = await mountSuspended(TastingPage)
    await wrapper.find('[data-testid="start-over"]').trigger('click')
    await wrapper.vm.$nextTick()

    expect(tastingData.value.appearance.wineType).toBeNull()
    expect(wrapper.find('[data-testid="step-appearance"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Step 1 of 4')
  })
})
