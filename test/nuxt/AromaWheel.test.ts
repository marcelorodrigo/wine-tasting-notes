import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AromaWheel from '~/components/wizard/inputs/AromaWheel.vue'
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

describe('AromaWheel', () => {
  describe('rendering', () => {
    it('renders the root container', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      expect(wrapper.find('[data-testid="aroma-wheel"]').exists()).toBe(true)
    })

    it('renders an SVG element with viewBox', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
      // happy-dom lowercases SVG attributes
      const vb = svg.attributes('viewBox') ?? svg.attributes('viewbox')
      expect(vb).toBe('0 0 500 500')
    })

    it('renders the default "Aromas" label in the center', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      expect(wrapper.text()).toContain('Aromas')
    })

    it('renders custom label when provided', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas(), label: 'Flavors' }
      })
      expect(wrapper.text()).toContain('Flavors')
    })

    it('renders the three concentric ring groups', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      expect(wrapper.find('[data-testid="inner-ring"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="middle-ring"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="outer-ring"]').exists()).toBe(true)
    })

    it('renders 3 inner ring segments (Primary/Secondary/Tertiary)', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      const innerPaths = wrapper.find('[data-testid="inner-ring"]').findAll('path')
      expect(innerPaths).toHaveLength(3)
    })

    it('renders 20 middle ring segments (one per category)', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'rosé', modelValue: createEmptyAromas() }
      })
      const middlePaths = wrapper.find('[data-testid="middle-ring"]').findAll('path')
      expect(middlePaths).toHaveLength(20)
    })

    it('renders outer ring segments for all descriptors', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'rosé', modelValue: createEmptyAromas() }
      })
      const outerPaths = wrapper.find('[data-testid="outer-ring"]').findAll('path')
      // Total descriptors across all 20 categories: 126
      expect(outerPaths.length).toBe(126)
    })
  })

  describe('accessibility', () => {
    it('does not set role="img" on SVG (fieldset/legend provides labeling)', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      const svg = wrapper.find('svg')
      expect(svg.attributes('role')).toBeUndefined()
      expect(svg.attributes('aria-label')).toBeUndefined()
    })

    it('sets role="checkbox" on active outer ring segments', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      // 'acacia' is in the floral category, visible for white wines
      const segment = wrapper.find('[data-testid="aroma-acacia"]')
      expect(segment.exists()).toBe(true)
      expect(segment.attributes('role')).toBe('checkbox')
      expect(segment.attributes('aria-checked')).toBe('false')
      expect(segment.attributes('tabindex')).toBe('0')
    })

    it('sets role="checkbox" on inactive segments with aria-disabled', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      // 'redcurrant' is in redFruit, not visible for white wines
      const segment = wrapper.find('[data-testid="aroma-redcurrant"]')
      expect(segment.exists()).toBe(true)
      expect(segment.attributes('role')).toBe('checkbox')
      expect(segment.attributes('aria-disabled')).toBe('true')
      expect(segment.attributes('aria-checked')).toBe('false')
      expect(segment.attributes('tabindex')).toBe('-1')
    })

    it('has aria-live region for selection count', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      const liveRegion = wrapper.find('[aria-live="polite"]')
      expect(liveRegion.exists()).toBe(true)
      expect(liveRegion.text()).toContain('0 aromas selected')
    })
  })

  describe('click interaction', () => {
    it('adds descriptor to model when clicking an active segment', async () => {
      const aromas = createEmptyAromas()
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })
      const segment = wrapper.find('[data-testid="aroma-acacia"]')
      await segment.trigger('click')

      // toggleAroma mutates the model in place
      expect(aromas.primary.floral).toContain('acacia')
    })

    it('removes descriptor from model on second click', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia']
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })

      const segment = wrapper.find('[data-testid="aroma-acacia"]')
      await segment.trigger('click')

      expect(aromas.primary.floral).not.toContain('acacia')
    })

    it('does not modify model when clicking an inactive segment', async () => {
      const aromas = createEmptyAromas()
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })
      // redFruit is not visible for white wines
      const segment = wrapper.find('[data-testid="aroma-redcurrant"]')
      await segment.trigger('click')

      expect(aromas.primary.redFruit).toEqual([])
    })

    it('adds descriptor via keyboard Enter', async () => {
      const aromas = createEmptyAromas()
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })
      const segment = wrapper.find('[data-testid="aroma-acacia"]')
      await segment.trigger('keydown', { key: 'Enter' })

      expect(aromas.primary.floral).toContain('acacia')
    })

    it('adds descriptor via keyboard Space', async () => {
      const aromas = createEmptyAromas()
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })
      const segment = wrapper.find('[data-testid="aroma-apple"]')
      await segment.trigger('keydown', { key: ' ' })

      expect(aromas.primary.greenFruit).toContain('apple')
    })

    it('can select multiple aromas across categories', async () => {
      const aromas = createEmptyAromas()
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })

      await wrapper.find('[data-testid="aroma-acacia"]').trigger('click')
      await wrapper.find('[data-testid="aroma-apple"]').trigger('click')
      await wrapper.find('[data-testid="aroma-vanilla"]').trigger('click')

      expect(aromas.primary.floral).toContain('acacia')
      expect(aromas.primary.greenFruit).toContain('apple')
      expect(aromas.secondary.oak).toContain('vanilla')
    })
  })

  describe('wine type filtering', () => {
    it('marks greenFruit segments as active for white wine', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      const segment = wrapper.find('[data-testid="aroma-apple"]')
      expect(segment.attributes('role')).toBe('checkbox')
      expect(segment.attributes('tabindex')).toBe('0')
    })

    it('marks greenFruit segments as inactive for red wine', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'red', modelValue: createEmptyAromas() }
      })
      const segment = wrapper.find('[data-testid="aroma-apple"]')
      expect(segment.attributes('role')).toBe('checkbox')
      expect(segment.attributes('aria-disabled')).toBe('true')
      expect(segment.attributes('aria-checked')).toBe('false')
      expect(segment.attributes('tabindex')).toBe('-1')
      expect(segment.attributes('opacity')).toBe('0.15')
    })

    it('marks redFruit segments as active for red wine', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'red', modelValue: createEmptyAromas() }
      })
      const segment = wrapper.find('[data-testid="aroma-raspberry"]')
      expect(segment.attributes('role')).toBe('checkbox')
    })

    it('marks redFruit segments as inactive for white wine', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      const segment = wrapper.find('[data-testid="aroma-raspberry"]')
      expect(segment.attributes('role')).toBe('checkbox')
      expect(segment.attributes('aria-disabled')).toBe('true')
      expect(segment.attributes('aria-checked')).toBe('false')
      expect(segment.attributes('opacity')).toBe('0.15')
    })

    it('shows all categories as active for rosé wine', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'rosé', modelValue: createEmptyAromas() }
      })
      // Both greenFruit and redFruit active for rosé
      expect(wrapper.find('[data-testid="aroma-apple"]').attributes('role')).toBe('checkbox')
      expect(wrapper.find('[data-testid="aroma-raspberry"]').attributes('role')).toBe('checkbox')
    })

    it('shows warning and hides aroma UI when wineType is null', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: null, modelValue: createEmptyAromas() }
      })
      expect(wrapper.find('[data-testid="aroma-wheel-no-wine-type"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="aroma-wheel-no-wine-type"]').attributes('role')).toBe('alert')
      expect(wrapper.find('svg').exists()).toBe(false)
      expect(wrapper.find('[data-testid="aroma-acacia"]').exists()).toBe(false)
    })

    it('filters tertiary categories by wine type', async () => {
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: createEmptyAromas() }
      })
      // bottleAgeWhite visible for white; bottleAgeRed not
      const whiteAging = wrapper.find('[data-testid="aroma-petrol"]')
      expect(whiteAging.attributes('role')).toBe('checkbox')
      expect(whiteAging.attributes('aria-disabled')).toBe('false')

      const redAging = wrapper.find('[data-testid="aroma-leather"]')
      expect(redAging.attributes('role')).toBe('checkbox')
      expect(redAging.attributes('aria-disabled')).toBe('true')
      expect(redAging.attributes('opacity')).toBe('0.15')
    })
  })

  describe('selected state rendering', () => {
    it('shows aria-checked="true" for selected aromas', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia', 'violet']
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })
      expect(wrapper.find('[data-testid="aroma-acacia"]').attributes('aria-checked')).toBe('true')
      expect(wrapper.find('[data-testid="aroma-violet"]').attributes('aria-checked')).toBe('true')
      expect(wrapper.find('[data-testid="aroma-honeysuckle"]').attributes('aria-checked')).toBe('false')
    })

    it('applies glow filter to selected segments', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia']
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })
      const selected = wrapper.find('[data-testid="aroma-acacia"]')
      expect(selected.attributes('filter')).toBe('url(#glow)')

      const unselected = wrapper.find('[data-testid="aroma-honeysuckle"]')
      expect(unselected.attributes('filter')).toBeUndefined()
    })

    it('updates aria-live count for selected aromas', async () => {
      const aromas = createEmptyAromas()
      aromas.primary.floral = ['acacia', 'violet']
      aromas.secondary.oak = ['vanilla']
      const wrapper = await mountSuspended(AromaWheel, {
        props: { wineType: 'white', modelValue: aromas }
      })
      const liveRegion = wrapper.find('[aria-live="polite"]')
      expect(liveRegion.text()).toContain('3 aromas selected')
    })
  })
})
