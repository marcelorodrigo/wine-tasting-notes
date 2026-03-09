import { beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ConclusionsStep from '~/components/wizard/steps/ConclusionsStep.vue'
import { useTastingData } from '~/composables/useTastingData'

describe('ConclusionsStep', () => {
  let resetTastingData: ReturnType<typeof useTastingData>['resetTastingData']
  let tastingData: ReturnType<typeof useTastingData>['tastingData']

  beforeEach(() => {
    const composable = useTastingData()
    tastingData = composable.tastingData
    resetTastingData = composable.resetTastingData
    resetTastingData()
  })

  it('renders the step container with correct testid', async () => {
    const wrapper = await mountSuspended(ConclusionsStep)
    expect(wrapper.find('[data-testid="step-conclusions"]').exists()).toBe(true)
  })

  it('renders the "Conclusions" heading', async () => {
    const wrapper = await mountSuspended(ConclusionsStep)
    expect(wrapper.find('h2').text()).toBe('Conclusions')
  })

  describe('Quality Level field', () => {
    it('renders the Quality Level label', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.text()).toContain('Quality Level')
    })

    it('renders all six quality level options', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      for (const opt of ['Faulty', 'Poor', 'Acceptable', 'Good', 'Very good', 'Outstanding']) {
        expect(wrapper.text()).toContain(opt)
      }
    })

    it('renders quality level descriptions', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.text()).toContain('The wine has a fault that makes it unpleasant')
      expect(wrapper.text()).toContain('Exceptional quality')
    })

    it('has no quality level selected by default', async () => {
      await mountSuspended(ConclusionsStep)
      expect(tastingData.value.conclusions.qualityLevel).toBeNull()
    })

    it('updates tasting data when quality level is selected', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      const radio = wrapper.findAll('[role="radio"]').find(r => r.attributes('value') === 'very good')
      await radio!.trigger('click')
      expect(tastingData.value.conclusions.qualityLevel).toBe('very good')
    })

    it('updates tasting data when "faulty" is selected', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      const radio = wrapper.findAll('[role="radio"]').find(r => r.attributes('value') === 'faulty')
      await radio!.trigger('click')
      expect(tastingData.value.conclusions.qualityLevel).toBe('faulty')
    })

    it('updates tasting data when "outstanding" is selected', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      const radio = wrapper.findAll('[role="radio"]').find(r => r.attributes('value') === 'outstanding')
      await radio!.trigger('click')
      expect(tastingData.value.conclusions.qualityLevel).toBe('outstanding')
    })
  })

  describe('Readiness field', () => {
    it('renders the Readiness label', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.text()).toContain('Readiness')
    })

    it('renders all four readiness options', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.text()).toContain('Too young')
      expect(wrapper.text()).toContain('Can drink now, but has potential for ageing')
      expect(wrapper.text()).toContain('Drink now: not suitable for ageing')
      expect(wrapper.text()).toContain('Too old')
    })

    it('renders readiness descriptions', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.text()).toContain('Not yet ready')
      expect(wrapper.text()).toContain('Past its best')
    })

    it('has no readiness selected by default', async () => {
      await mountSuspended(ConclusionsStep)
      expect(tastingData.value.conclusions.readiness).toBeNull()
    })

    it('updates tasting data when readiness is selected', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      const radio = wrapper.findAll('[role="radio"]').find(r =>
        r.attributes('value') === 'can drink now, but has potential for ageing'
      )
      await radio!.trigger('click')
      expect(tastingData.value.conclusions.readiness).toBe('can drink now, but has potential for ageing')
    })

    it('updates tasting data when "too young" is selected', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      const radio = wrapper.findAll('[role="radio"]').find(r => r.attributes('value') === 'too young')
      await radio!.trigger('click')
      expect(tastingData.value.conclusions.readiness).toBe('too young')
    })

    it('updates tasting data when "too old" is selected', async () => {
      const wrapper = await mountSuspended(ConclusionsStep)
      const radio = wrapper.findAll('[role="radio"]').find(r => r.attributes('value') === 'too old')
      await radio!.trigger('click')
      expect(tastingData.value.conclusions.readiness).toBe('too old')
    })
  })

  describe('pre-loaded state', () => {
    it('renders with quality level preloaded', async () => {
      tastingData.value.conclusions.qualityLevel = 'good'

      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.find('[role="radio"][value="good"][aria-checked="true"]').exists()).toBe(true)
    })

    it('renders with readiness preloaded', async () => {
      tastingData.value.conclusions.readiness = 'too old'

      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.find('[role="radio"][value="too old"][aria-checked="true"]').exists()).toBe(true)
    })

    it('renders with complete conclusions data preloaded', async () => {
      tastingData.value.conclusions.qualityLevel = 'outstanding'
      tastingData.value.conclusions.readiness = 'can drink now, but has potential for ageing'

      const wrapper = await mountSuspended(ConclusionsStep)
      expect(wrapper.find('[role="radio"][value="outstanding"][aria-checked="true"]').exists()).toBe(true)
      expect(wrapper.find('[role="radio"][value="can drink now, but has potential for ageing"][aria-checked="true"]').exists()).toBe(true)
    })
  })
})
