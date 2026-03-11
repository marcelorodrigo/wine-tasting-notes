import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PalateStep from '~/components/wizard/steps/PalateStep.vue'
import { useTastingData } from '~/composables/useTastingData'

function findRadioInField(wrapper: VueWrapper, fieldLabel: string, value: string) {
  const fields = wrapper.findAll('[data-testid="radio-group"]')
  const field = fields.find(f => f.text().includes(fieldLabel))
  if (!field) throw new Error(`Field "${fieldLabel}" not found`)
  return field.findAll('[role="radio"]').find(r => r.attributes('value') === value)
}

describe('PalateStep', () => {
  let resetTastingData: ReturnType<typeof useTastingData>['resetTastingData']
  let tastingData: ReturnType<typeof useTastingData>['tastingData']

  beforeEach(() => {
    const composable = useTastingData()
    tastingData = composable.tastingData
    resetTastingData = composable.resetTastingData
    resetTastingData()
  })

  it('renders the step container with correct testid', async () => {
    const wrapper = await mountSuspended(PalateStep)
    expect(wrapper.find('[data-testid="step-palate"]').exists()).toBe(true)
  })

  it('renders the "Palate" heading', async () => {
    const wrapper = await mountSuspended(PalateStep)
    expect(wrapper.find('h2').text()).toBe('Palate')
  })

  it('renders section headings', async () => {
    const wrapper = await mountSuspended(PalateStep)
    const headings = wrapper.findAll('h3').map(h => h.text())
    expect(headings).toContain('Structure')
    expect(headings).toContain('Body & Texture')
    expect(headings).toContain('Flavor')
  })

  describe('Sweetness field', () => {
    it('renders the Sweetness label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Sweetness')
    })

    it('renders all six sweetness options', async () => {
      const wrapper = await mountSuspended(PalateStep)
      for (const opt of ['dry', 'off-dry', 'medium-dry', 'medium-sweet', 'sweet', 'luscious']) {
        expect(wrapper.text()).toContain(opt)
      }
    })

    it('has no sweetness selected by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.sweetness).toBeNull()
    })

    it('updates tasting data when sweetness is selected', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Sweetness', 'off-dry')
      await radio!.trigger('click')
      expect(tastingData.value.palate.sweetness).toBe('off-dry')
    })
  })

  describe('Acidity field', () => {
    it('renders the Acidity label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Acidity')
    })

    it('renders all five acidity options', async () => {
      const wrapper = await mountSuspended(PalateStep)
      for (const opt of ['low', 'medium(-)', 'medium', 'medium(+)', 'high']) {
        expect(wrapper.text()).toContain(opt)
      }
    })

    it('has no acidity selected by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.acidity).toBeNull()
    })

    it('updates tasting data when acidity is selected', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Acidity', 'high')
      await radio!.trigger('click')
      expect(tastingData.value.palate.acidity).toBe('high')
    })
  })

  describe('Tannin field', () => {
    it('renders the Tannin label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Tannin')
    })

    it('renders all five tannin options', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const text = wrapper.text()
      expect(text).toContain('low')
      expect(text).toContain('medium(-)')
      expect(text).toContain('medium(+)')
      expect(text).toContain('high')
    })

    it('has no tannin selected by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.tannin).toBeNull()
    })

    it('updates tasting data when tannin is selected', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Tannin', 'medium(+)')
      await radio!.trigger('click')
      expect(tastingData.value.palate.tannin).toBe('medium(+)')
    })
  })

  describe('Alcohol field', () => {
    it('renders the Alcohol label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Alcohol')
    })

    it('renders low, medium, and high options', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('low')
      expect(wrapper.text()).toContain('medium')
      expect(wrapper.text()).toContain('high')
    })

    it('has no alcohol selected by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.alcohol).toBeNull()
    })

    it('updates tasting data when alcohol is selected', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Alcohol', 'medium')
      await radio!.trigger('click')
      expect(tastingData.value.palate.alcohol).toBe('medium')
    })
  })

  describe('Fortified checkbox', () => {
    it('renders the fortified checkbox', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.find('[data-testid="fortified-checkbox"]').exists()).toBe(true)
    })

    it('renders the "This wine is fortified" label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('This wine is fortified')
    })

    it('is unchecked by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.fortified).toBeNull()
    })

    it('updates tasting data when checked', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const checkbox = wrapper.find('[data-testid="fortified-checkbox"]')
      await checkbox.trigger('click')
      expect(tastingData.value.palate.fortified).toBe(true)
    })
  })

  describe('Body field', () => {
    it('renders the Body label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Body')
    })

    it('renders all five body options', async () => {
      const wrapper = await mountSuspended(PalateStep)
      for (const opt of ['light', 'medium(-)', 'medium', 'medium(+)', 'full']) {
        expect(wrapper.text()).toContain(opt)
      }
    })

    it('has no body selected by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.body).toBeNull()
    })

    it('updates tasting data when body is selected', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Body', 'full')
      await radio!.trigger('click')
      expect(tastingData.value.palate.body).toBe('full')
    })
  })

  describe('Mousse field (conditional)', () => {
    it('is hidden when no sparkling observations', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).not.toContain('Mousse')
    })

    it('appears when otherObservations includes "bubbles"', async () => {
      tastingData.value.appearance.otherObservations = ['bubbles']
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Mousse')
    })

    it('appears when otherObservations includes "pétillance"', async () => {
      tastingData.value.appearance.otherObservations = ['pétillance']
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Mousse')
    })

    it('renders delicate, creamy, and aggressive options when visible', async () => {
      tastingData.value.appearance.otherObservations = ['bubbles']
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('delicate')
      expect(wrapper.text()).toContain('creamy')
      expect(wrapper.text()).toContain('aggressive')
    })

    it('has no mousse selected by default', async () => {
      tastingData.value.appearance.otherObservations = ['bubbles']
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.mousse).toBeNull()
    })

    it('updates tasting data when mousse is selected', async () => {
      tastingData.value.appearance.otherObservations = ['bubbles']
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Mousse', 'creamy')
      await radio!.trigger('click')
      expect(tastingData.value.palate.mousse).toBe('creamy')
    })

    it('clears mousse when sparkling observation is removed', async () => {
      tastingData.value.appearance.otherObservations = ['bubbles']
      tastingData.value.palate.mousse = 'creamy'
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Mousse')

      tastingData.value.appearance.otherObservations = []
      await wrapper.vm.$nextTick()
      expect(tastingData.value.palate.mousse).toBeNull()
    })
  })

  describe('Flavor Intensity field', () => {
    it('renders the Flavor Intensity label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Flavor Intensity')
    })

    it('renders all five flavor intensity options', async () => {
      const wrapper = await mountSuspended(PalateStep)
      for (const opt of ['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced']) {
        expect(wrapper.text()).toContain(opt)
      }
    })

    it('has no flavor intensity selected by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.flavorIntensity).toBeNull()
    })

    it('updates tasting data when flavor intensity is selected', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Flavor Intensity', 'pronounced')
      await radio!.trigger('click')
      expect(tastingData.value.palate.flavorIntensity).toBe('pronounced')
    })
  })

  describe('Finish field', () => {
    it('renders the Finish label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Finish')
    })

    it('renders all five finish options', async () => {
      const wrapper = await mountSuspended(PalateStep)
      for (const opt of ['short', 'medium(-)', 'medium', 'medium(+)', 'long']) {
        expect(wrapper.text()).toContain(opt)
      }
    })

    it('has no finish selected by default', async () => {
      await mountSuspended(PalateStep)
      expect(tastingData.value.palate.finish).toBeNull()
    })

    it('updates tasting data when finish is selected', async () => {
      const wrapper = await mountSuspended(PalateStep)
      const radio = findRadioInField(wrapper, 'Finish', 'long')
      await radio!.trigger('click')
      expect(tastingData.value.palate.finish).toBe('long')
    })
  })

  describe('Flavor Wheel', () => {
    it('renders the flavor wheel component', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.find('[data-testid="aroma-wheel"]').exists()).toBe(true)
    })

    it('renders the flavor wheel chips component', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.find('[data-testid="aroma-wheel-chips"]').exists()).toBe(true)
    })

    it('renders the Flavors label', async () => {
      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Flavors')
    })
  })

  describe('pre-loaded state', () => {
    it('renders with partial palate data preloaded', async () => {
      tastingData.value.palate.sweetness = 'dry'
      tastingData.value.palate.acidity = 'high'

      const wrapper = await mountSuspended(PalateStep)

      expect(wrapper.find('[role="radio"][value="dry"][aria-checked="true"]').exists()).toBe(true)
      expect(wrapper.find('[role="radio"][value="high"][aria-checked="true"]').exists()).toBe(true)
      expect(tastingData.value.palate.tannin).toBeNull()
      expect(tastingData.value.palate.body).toBeNull()
    })

    it('renders with mousse visible when sparkling data is preloaded', async () => {
      tastingData.value.appearance.otherObservations = ['bubbles']
      tastingData.value.palate.mousse = 'delicate'

      const wrapper = await mountSuspended(PalateStep)
      expect(wrapper.text()).toContain('Mousse')
      expect(wrapper.find('[role="radio"][value="delicate"][aria-checked="true"]').exists()).toBe(true)
    })
  })
})
