import { beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NoseStep from '~/components/wizard/steps/NoseStep.vue'
import { useTastingData } from '~/composables/useTastingData'

describe('NoseStep', () => {
  let resetTastingData: ReturnType<typeof useTastingData>['resetTastingData']
  let tastingData: ReturnType<typeof useTastingData>['tastingData']

  beforeEach(() => {
    const composable = useTastingData()
    tastingData = composable.tastingData
    resetTastingData = composable.resetTastingData
    resetTastingData()
  })

  it('renders the step container with correct testid', async () => {
    const wrapper = await mountSuspended(NoseStep)
    expect(wrapper.find('[data-testid="step-nose"]').exists()).toBe(true)
  })

  it('renders the "Nose" heading', async () => {
    const wrapper = await mountSuspended(NoseStep)
    expect(wrapper.find('h2').text()).toBe('Nose')
  })

  describe('Condition field', () => {
    it('renders the Condition label', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.text()).toContain('Condition')
    })

    it('renders "clean" and "unclean (faulty?)" options', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.text()).toContain('clean')
      expect(wrapper.text()).toContain('unclean (faulty?)')
    })

    it('renders exactly 2 condition options', async () => {
      const wrapper = await mountSuspended(NoseStep)
      const radios = wrapper.findAll('[role="radio"]')
      const conditionRadios = radios.filter(r =>
        r.attributes('value') === 'clean' || r.attributes('value') === 'unclean'
      )
      expect(conditionRadios).toHaveLength(2)
    })

    it('has no condition selected by default', async () => {
      await mountSuspended(NoseStep)
      expect(tastingData.value.nose.condition).toBeNull()
    })

    it('updates tasting data when "clean" is selected', async () => {
      const wrapper = await mountSuspended(NoseStep)
      const radios = wrapper.findAll('[role="radio"]')
      const cleanRadio = radios.find(r => r.attributes('value') === 'clean')
      await cleanRadio!.trigger('click')
      expect(tastingData.value.nose.condition).toBe('clean')
    })

    it('updates tasting data when "unclean" is selected', async () => {
      const wrapper = await mountSuspended(NoseStep)
      const radios = wrapper.findAll('[role="radio"]')
      const uncleanRadio = radios.find(r => r.attributes('value') === 'unclean')
      await uncleanRadio!.trigger('click')
      expect(tastingData.value.nose.condition).toBe('unclean')
    })
  })

  describe('Intensity field', () => {
    it('renders the Intensity label', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.text()).toContain('Intensity')
    })

    it('renders all five intensity options', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.text()).toContain('light')
      expect(wrapper.text()).toContain('medium(-)')
      expect(wrapper.text()).toContain('medium')
      expect(wrapper.text()).toContain('medium(+)')
      expect(wrapper.text()).toContain('pronounced')
    })

    it('has no intensity selected by default', async () => {
      await mountSuspended(NoseStep)
      expect(tastingData.value.nose.intensity).toBeNull()
    })

    it('updates tasting data when intensity is selected', async () => {
      const wrapper = await mountSuspended(NoseStep)
      const radios = wrapper.findAll('[role="radio"]')
      const pronouncedRadio = radios.find(r => r.attributes('value') === 'pronounced')
      await pronouncedRadio!.trigger('click')
      expect(tastingData.value.nose.intensity).toBe('pronounced')
    })

    it('updates tasting data when medium(-) is selected', async () => {
      const wrapper = await mountSuspended(NoseStep)
      const radios = wrapper.findAll('[role="radio"]')
      const medMinusRadio = radios.find(r => r.attributes('value') === 'medium(-)')
      await medMinusRadio!.trigger('click')
      expect(tastingData.value.nose.intensity).toBe('medium(-)')
    })
  })

  describe('Development field', () => {
    it('renders the Development label', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.text()).toContain('Development')
    })

    it('renders all four development options', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.text()).toContain('youthful')
      expect(wrapper.text()).toContain('developing')
      expect(wrapper.text()).toContain('fully developed')
      expect(wrapper.text()).toContain('tired/past its best')
    })

    it('has no development selected by default', async () => {
      await mountSuspended(NoseStep)
      expect(tastingData.value.nose.development).toBeNull()
    })

    it('updates tasting data when development is selected', async () => {
      const wrapper = await mountSuspended(NoseStep)
      const radios = wrapper.findAll('[role="radio"]')
      const developingRadio = radios.find(r => r.attributes('value') === 'developing')
      await developingRadio!.trigger('click')
      expect(tastingData.value.nose.development).toBe('developing')
    })

    it('updates tasting data when "fully developed" is selected', async () => {
      const wrapper = await mountSuspended(NoseStep)
      const radios = wrapper.findAll('[role="radio"]')
      const fullyDevelopedRadio = radios.find(r => r.attributes('value') === 'fully developed')
      await fullyDevelopedRadio!.trigger('click')
      expect(tastingData.value.nose.development).toBe('fully developed')
    })
  })

  describe('Aromas placeholder', () => {
    it('renders the aromas placeholder area', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.find('[data-testid="aroma-wheel-placeholder"]').exists()).toBe(true)
    })

    it('shows the "coming in a future update" message', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.find('[data-testid="aroma-wheel-placeholder"]').text()).toContain(
        'Aroma Wheel coming in a future update'
      )
    })

    it('renders the Aromas label', async () => {
      const wrapper = await mountSuspended(NoseStep)
      expect(wrapper.text()).toContain('Aromas')
    })
  })
})
