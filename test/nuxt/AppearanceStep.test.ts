import { beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppearanceStep from '~/components/wizard/steps/AppearanceStep.vue'
import { useTastingData } from '~/composables/useTastingData'

describe('AppearanceStep', () => {
  let resetTastingData: ReturnType<typeof useTastingData>['resetTastingData']
  let tastingData: ReturnType<typeof useTastingData>['tastingData']

  beforeEach(() => {
    const composable = useTastingData()
    tastingData = composable.tastingData
    resetTastingData = composable.resetTastingData
    resetTastingData()
  })

  it('renders the step container with correct testid', async () => {
    const wrapper = await mountSuspended(AppearanceStep)
    expect(wrapper.find('[data-testid="step-appearance"]').exists()).toBe(true)
  })

  it('renders the "Appearance" heading', async () => {
    const wrapper = await mountSuspended(AppearanceStep)
    expect(wrapper.find('h2').text()).toBe('Appearance')
  })

  it('renders the WineTypeSelector as the first control', async () => {
    const wrapper = await mountSuspended(AppearanceStep)
    expect(wrapper.find('[data-testid="wine-type-selector"]').exists()).toBe(true)
  })

  describe('Clarity field', () => {
    it('renders the Clarity radio group', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      expect(wrapper.text()).toContain('Clarity')
    })

    it('renders "clear" and "hazy (faulty?)" options', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      expect(wrapper.text()).toContain('clear')
      expect(wrapper.text()).toContain('hazy (faulty?)')
    })

    it('has no clarity selected by default', async () => {
      await mountSuspended(AppearanceStep)
      expect(tastingData.value.appearance.clarity).toBeNull()
    })

    it('updates tasting data when clarity is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      const radios = wrapper.findAll('[role="radio"]')
      const clearRadio = radios.find(r => r.attributes('value') === 'clear')
      await clearRadio!.trigger('click')
      expect(tastingData.value.appearance.clarity).toBe('clear')
    })

    it('updates tasting data when hazy is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      const radios = wrapper.findAll('[role="radio"]')
      const hazyRadio = radios.find(r => r.attributes('value') === 'hazy')
      await hazyRadio!.trigger('click')
      expect(tastingData.value.appearance.clarity).toBe('hazy')
    })
  })

  describe('Intensity field', () => {
    it('renders the Intensity radio group', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      expect(wrapper.text()).toContain('Intensity')
    })

    it('renders pale, medium, and deep options', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      expect(wrapper.text()).toContain('pale')
      expect(wrapper.text()).toContain('medium')
      expect(wrapper.text()).toContain('deep')
    })

    it('updates tasting data when intensity is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      const radios = wrapper.findAll('[role="radio"]')
      const deepRadio = radios.find(r => r.attributes('value') === 'deep')
      await deepRadio!.trigger('click')
      expect(tastingData.value.appearance.intensity).toBe('deep')
    })
  })

  describe('Color field', () => {
    it('shows "Select a wine type first" when no wine type selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      expect(wrapper.find('[data-testid="color-disabled-message"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-disabled-message"]').text()).toContain('Select a wine type first')
    })

    it('hides the disabled message once a wine type is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-white"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="color-disabled-message"]').exists()).toBe(false)
    })

    it('shows white wine color options after selecting White', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-white"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="color-lemon-green"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-lemon"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-gold"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-amber"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-brown"]').exists()).toBe(true)
    })

    it('shows rosé wine color options after selecting Rosé', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-rose"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="color-pink"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-salmon"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-orange"]').exists()).toBe(true)
    })

    it('shows red wine color options after selecting Red', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-red"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="color-purple"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-ruby"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-garnet"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-tawny"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="color-brown"]').exists()).toBe(true)
    })

    it('does not show white-only colors for red wine', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-red"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="color-lemon-green"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="color-lemon"]').exists()).toBe(false)
    })

    it('updates tasting data when a color is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-white"]').trigger('click')
      await wrapper.vm.$nextTick()
      await wrapper.find('[data-testid="color-gold"]').trigger('click')
      expect(tastingData.value.appearance.color).toBe('gold')
    })

    it('clears color selection when wine type changes', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-white"]').trigger('click')
      await wrapper.vm.$nextTick()
      await wrapper.find('[data-testid="color-gold"]').trigger('click')
      expect(tastingData.value.appearance.color).toBe('gold')

      await wrapper.find('[data-testid="wine-type-red"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(tastingData.value.appearance.color).toBeNull()
    })

    it('color buttons render with a swatch span', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-white"]').trigger('click')
      await wrapper.vm.$nextTick()
      const goldBtn = wrapper.find('[data-testid="color-gold"]')
      expect(goldBtn.find('[aria-hidden="true"]').exists()).toBe(true)
    })
  })

  describe('Wine type selection', () => {
    it('updates tasting data when White is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-white"]').trigger('click')
      expect(tastingData.value.appearance.wineType).toBe('white')
    })

    it('updates tasting data when Rosé is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-rose"]').trigger('click')
      expect(tastingData.value.appearance.wineType).toBe('rosé')
    })

    it('updates tasting data when Red is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      await wrapper.find('[data-testid="wine-type-red"]').trigger('click')
      expect(tastingData.value.appearance.wineType).toBe('red')
    })
  })

  describe('Other Observations field', () => {
    it('renders the Other Observations checkbox group', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      expect(wrapper.text()).toContain('Other Observations')
    })

    it('renders all four observation options', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      expect(wrapper.text()).toContain('legs/tears')
      expect(wrapper.text()).toContain('deposit')
      expect(wrapper.text()).toContain('pétillance')
      expect(wrapper.text()).toContain('bubbles')
    })

    it('has no observations selected by default', async () => {
      await mountSuspended(AppearanceStep)
      expect(tastingData.value.appearance.otherObservations).toEqual([])
    })

    it('updates tasting data when an observation is selected', async () => {
      const wrapper = await mountSuspended(AppearanceStep)
      const checkboxes = wrapper.findAll('[role="checkbox"]')
      await checkboxes[0]!.trigger('click')
      expect(tastingData.value.appearance.otherObservations).toContain('legs/tears')
    })
  })
})
