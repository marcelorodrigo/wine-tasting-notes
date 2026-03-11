import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AromaWheelChips from '~/components/wizard/inputs/AromaWheelChips.vue'
import type { AromaObject } from '~/types/tasting'

function createEmptyAromas(): AromaObject {
  return {
    primary: {
      floral: [],
      greenFruit: [],
      citrusFruit: [],
      stoneFruit: [],
      tropicalFruit: [],
      redFruit: [],
      blackFruit: [],
      driedCookedFruit: [],
      herbaceous: [],
      herbal: [],
      pungentSpice: [],
      other: []
    },
    secondary: {
      yeast: [],
      malolacticConversion: [],
      oak: []
    },
    tertiary: {
      deliberateOxidation: [],
      fruitDevelopmentWhite: [],
      fruitDevelopmentRed: [],
      bottleAgeWhite: [],
      bottleAgeRed: []
    }
  }
}

describe('AromaWheelChips', () => {
  describe('no wine type warning', () => {
    it('shows warning when wineType is null', async () => {
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: null, modelValue: createEmptyAromas() }
      })
      const warning = wrapper.find('[data-testid="no-wine-type-warning"]')
      expect(warning.exists()).toBe(true)
      expect(warning.text()).toContain('Select a wine type first')
    })

    it('sets role="alert" on the warning', async () => {
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: null, modelValue: createEmptyAromas() }
      })
      expect(wrapper.find('[data-testid="no-wine-type-warning"]').attributes('role')).toBe('alert')
    })

    it('does not show chips or empty message when wineType is null', async () => {
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: null, modelValue: createEmptyAromas() }
      })
      expect(wrapper.find('[data-testid="no-aromas-message"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="chip-group-primary"]').exists()).toBe(false)
    })
  })

  describe('empty state', () => {
    it('shows "No aromas selected" when no aromas are selected', async () => {
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      const message = wrapper.find('[data-testid="no-aromas-message"]')
      expect(message.exists()).toBe(true)
      expect(message.text()).toContain('No aromas selected')
    })

    it('uses custom label in empty message', async () => {
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: createEmptyAromas(), label: 'flavors' }
      })
      expect(wrapper.find('[data-testid="no-aromas-message"]').text()).toContain('No flavors selected')
    })

    it('does not show warning when wineType is set', async () => {
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'red', modelValue: createEmptyAromas() }
      })
      expect(wrapper.find('[data-testid="no-wine-type-warning"]').exists()).toBe(false)
    })
  })

  describe('displaying chips', () => {
    it('shows chips for selected primary aromas', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia', 'violet']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      expect(wrapper.find('[data-testid="chip-acacia"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="chip-violet"]').exists()).toBe(true)
    })

    it('shows chips for selected secondary aromas', async () => {
      const aromas = createEmptyAromas()
      aromas.secondary.oak = ['vanilla', 'cedar']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      expect(wrapper.find('[data-testid="chip-vanilla"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="chip-cedar"]').exists()).toBe(true)
    })

    it('shows chips for selected tertiary aromas', async () => {
      const aromas = createEmptyAromas()
      aromas.tertiary.deliberateOxidation = ['almond']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      expect(wrapper.find('[data-testid="chip-almond"]').exists()).toBe(true)
    })

    it('groups chips by aroma type with labels', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia']
      aromas.secondary.oak = ['vanilla']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      const primaryGroup = wrapper.find('[data-testid="chip-group-primary"]')
      expect(primaryGroup.exists()).toBe(true)
      expect(primaryGroup.text()).toContain('Primary')

      const secondaryGroup = wrapper.find('[data-testid="chip-group-secondary"]')
      expect(secondaryGroup.exists()).toBe(true)
      expect(secondaryGroup.text()).toContain('Secondary')
    })

    it('does not show group for aroma types with no selections', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      expect(wrapper.find('[data-testid="chip-group-primary"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="chip-group-secondary"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="chip-group-tertiary"]').exists()).toBe(false)
    })

    it('applies category color as background on chips', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      const chip = wrapper.find('[data-testid="chip-acacia"]')
      // Floral color is #9B59B6
      expect(chip.attributes('style')).toContain('background-color')
      expect(chip.attributes('style')).toContain('#9B59B6')
    })

    it('does not show empty message when aromas are selected', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      expect(wrapper.find('[data-testid="no-aromas-message"]').exists()).toBe(false)
    })
  })

  describe('removing chips', () => {
    it('has a remove button with aria-label on each chip', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      const removeBtn = wrapper.find('[data-testid="remove-acacia"]')
      expect(removeBtn.exists()).toBe(true)
      expect(removeBtn.attributes('aria-label')).toBe('Remove acacia')
    })

    it('removes aroma from model when remove button is clicked', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia', 'violet']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      await wrapper.find('[data-testid="remove-acacia"]').trigger('click')

      expect(aromas.primary.floral).not.toContain('acacia')
      expect(aromas.primary.floral).toContain('violet')
    })

    it('removes aroma from a different category', async () => {
      const aromas = createEmptyAromas()
      aromas.secondary.oak = ['vanilla', 'cedar']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'white', modelValue: aromas }
      })

      await wrapper.find('[data-testid="remove-vanilla"]').trigger('click')

      expect(aromas.secondary.oak).not.toContain('vanilla')
      expect(aromas.secondary.oak).toContain('cedar')
    })
  })

  describe('multiple wine types', () => {
    it('shows chips regardless of wine type', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.redFruit = ['raspberry']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'red', modelValue: aromas }
      })

      expect(wrapper.find('[data-testid="chip-raspberry"]').exists()).toBe(true)
    })

    it('shows all chip groups for rosé with mixed selections', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.greenFruit = ['apple']
      aromas.primary.redFruit = ['raspberry']
      aromas.tertiary.bottleAgeWhite = ['petrol']
      const wrapper = await mountSuspended(AromaWheelChips, {
        props: { wineType: 'rosé', modelValue: aromas }
      })

      expect(wrapper.find('[data-testid="chip-apple"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="chip-raspberry"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="chip-petrol"]').exists()).toBe(true)
    })
  })
})
