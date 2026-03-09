import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTastingData } from '../../app/composables/useTastingData'

const { mockToastAdd } = vi.hoisted(() => {
  const mockToastAdd = vi.fn()
  return { mockToastAdd }
})

vi.mock('#imports', () => ({
  useToast: () => ({ add: mockToastAdd })
}))

describe('useTastingData', () => {
  let tastingData: ReturnType<typeof useTastingData>['tastingData']
  let resetTastingData: ReturnType<typeof useTastingData>['resetTastingData']
  let handleWineTypeChange: ReturnType<typeof useTastingData>['handleWineTypeChange']
  let validateDataConsistency: ReturnType<typeof useTastingData>['validateDataConsistency']

  beforeEach(() => {
    mockToastAdd.mockClear()
    const composable = useTastingData()
    tastingData = composable.tastingData
    resetTastingData = composable.resetTastingData
    handleWineTypeChange = composable.handleWineTypeChange
    validateDataConsistency = composable.validateDataConsistency
    resetTastingData()
  })

  describe('initial state', () => {
    it('initializes appearance with all null fields and empty observations', () => {
      expect(tastingData.value.appearance.wineType).toBeNull()
      expect(tastingData.value.appearance.clarity).toBeNull()
      expect(tastingData.value.appearance.intensity).toBeNull()
      expect(tastingData.value.appearance.color).toBeNull()
      expect(tastingData.value.appearance.otherObservations).toEqual([])
    })

    it('initializes nose with all null fields and empty aromas', () => {
      expect(tastingData.value.nose.condition).toBeNull()
      expect(tastingData.value.nose.intensity).toBeNull()
      expect(tastingData.value.nose.development).toBeNull()
    })

    it('initializes all primary aroma arrays as empty', () => {
      const aromas = tastingData.value.nose.aromas!
      expect(aromas.primary.floral).toEqual([])
      expect(aromas.primary.greenFruit).toEqual([])
      expect(aromas.primary.citrusFruit).toEqual([])
      expect(aromas.primary.stoneFruit).toEqual([])
      expect(aromas.primary.tropicalFruit).toEqual([])
      expect(aromas.primary.redFruit).toEqual([])
      expect(aromas.primary.blackFruit).toEqual([])
      expect(aromas.primary.driedCookedFruit).toEqual([])
      expect(aromas.primary.herbaceous).toEqual([])
      expect(aromas.primary.herbal).toEqual([])
      expect(aromas.primary.pungentSpice).toEqual([])
      expect(aromas.primary.other).toEqual([])
    })

    it('initializes all secondary and tertiary aroma arrays as empty', () => {
      const aromas = tastingData.value.nose.aromas!
      expect(aromas.secondary.yeast).toEqual([])
      expect(aromas.secondary.malolacticConversion).toEqual([])
      expect(aromas.secondary.oak).toEqual([])
      expect(aromas.tertiary.deliberateOxidation).toEqual([])
      expect(aromas.tertiary.fruitDevelopmentWhite).toEqual([])
      expect(aromas.tertiary.fruitDevelopmentRed).toEqual([])
      expect(aromas.tertiary.bottleAgeWhite).toEqual([])
      expect(aromas.tertiary.bottleAgeRed).toEqual([])
    })

    it('initializes palate with all null fields and empty flavors', () => {
      expect(tastingData.value.palate.sweetness).toBeNull()
      expect(tastingData.value.palate.acidity).toBeNull()
      expect(tastingData.value.palate.tannin).toBeNull()
      expect(tastingData.value.palate.alcohol).toBeNull()
      expect(tastingData.value.palate.fortified).toBeNull()
      expect(tastingData.value.palate.body).toBeNull()
      expect(tastingData.value.palate.mousse).toBeNull()
      expect(tastingData.value.palate.flavorIntensity).toBeNull()
      expect(tastingData.value.palate.finish).toBeNull()
    })

    it('initializes all palate flavor arrays as empty', () => {
      const flavors = tastingData.value.palate.flavors!
      expect(flavors.primary.floral).toEqual([])
      expect(flavors.primary.redFruit).toEqual([])
      expect(flavors.secondary.oak).toEqual([])
      expect(flavors.tertiary.bottleAgeRed).toEqual([])
    })

    it('initializes conclusions with all null fields', () => {
      expect(tastingData.value.conclusions.qualityLevel).toBeNull()
      expect(tastingData.value.conclusions.readiness).toBeNull()
    })
  })

  describe('resetTastingData()', () => {
    it('clears all fields back to initial state', () => {
      tastingData.value.appearance.wineType = 'red'
      tastingData.value.appearance.clarity = 'clear'
      tastingData.value.appearance.color = 'ruby'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry', 'strawberry']
      tastingData.value.palate.sweetness = 'dry'
      tastingData.value.conclusions.qualityLevel = 'good'

      resetTastingData()

      expect(tastingData.value.appearance.wineType).toBeNull()
      expect(tastingData.value.appearance.clarity).toBeNull()
      expect(tastingData.value.appearance.color).toBeNull()
      expect(tastingData.value.nose.aromas!.primary.redFruit).toEqual([])
      expect(tastingData.value.palate.sweetness).toBeNull()
      expect(tastingData.value.conclusions.qualityLevel).toBeNull()
    })

    it('returns the same shared reactive ref after reset', () => {
      const ref1 = useTastingData().tastingData
      resetTastingData()
      const ref2 = useTastingData().tastingData
      expect(ref1).toBe(ref2)
    })
  })

  describe('handleWineTypeChange()', () => {
    it('always clears color when wine type changes', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.appearance.color = 'gold'

      handleWineTypeChange('red')

      expect(tastingData.value.appearance.color).toBeNull()
    })

    it('clears color even when switching to null', () => {
      tastingData.value.appearance.wineType = 'red'
      tastingData.value.appearance.color = 'ruby'

      handleWineTypeChange(null)

      expect(tastingData.value.appearance.color).toBeNull()
    })

    it('switching to null does not remove aromas', () => {
      tastingData.value.nose.aromas!.primary.floral = ['rose']
      tastingData.value.nose.aromas!.secondary.oak = ['vanilla']

      const removed = handleWineTypeChange(null)

      expect(removed).toEqual([])
      expect(tastingData.value.nose.aromas!.primary.floral).toEqual(['rose'])
      expect(tastingData.value.nose.aromas!.secondary.oak).toEqual(['vanilla'])
    })

    it('returns empty list when no aromas are selected', () => {
      tastingData.value.appearance.wineType = 'white'

      const removed = handleWineTypeChange('red')

      expect(removed).toEqual([])
    })

    it('white→red: removes white-only primary aromas from nose', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.greenFruit = ['apple', 'pear']
      tastingData.value.nose.aromas!.primary.citrusFruit = ['lemon']
      tastingData.value.nose.aromas!.primary.stoneFruit = ['peach']
      tastingData.value.nose.aromas!.primary.tropicalFruit = ['mango']

      const removed = handleWineTypeChange('red')

      expect(tastingData.value.nose.aromas!.primary.greenFruit).toEqual([])
      expect(tastingData.value.nose.aromas!.primary.citrusFruit).toEqual([])
      expect(tastingData.value.nose.aromas!.primary.stoneFruit).toEqual([])
      expect(tastingData.value.nose.aromas!.primary.tropicalFruit).toEqual([])

      const removedCategories = removed.map(r => r.category)
      expect(removedCategories).toContain('greenFruit')
      expect(removedCategories).toContain('citrusFruit')
      expect(removedCategories).toContain('stoneFruit')
      expect(removedCategories).toContain('tropicalFruit')
    })

    it('white→red: removes white-only tertiary aromas from nose', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.tertiary.fruitDevelopmentWhite = ['dried apricot']
      tastingData.value.nose.aromas!.tertiary.bottleAgeWhite = ['petrol', 'honey']

      const removed = handleWineTypeChange('red')

      expect(tastingData.value.nose.aromas!.tertiary.fruitDevelopmentWhite).toEqual([])
      expect(tastingData.value.nose.aromas!.tertiary.bottleAgeWhite).toEqual([])

      const removedCategories = removed.map(r => r.category)
      expect(removedCategories).toContain('fruitDevelopmentWhite')
      expect(removedCategories).toContain('bottleAgeWhite')
    })

    it('white→red: preserves shared aromas (floral, herbal, oak)', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.floral = ['rose', 'violet']
      tastingData.value.nose.aromas!.primary.herbal = ['mint']
      tastingData.value.nose.aromas!.secondary.oak = ['vanilla', 'cedar']

      const removed = handleWineTypeChange('red')

      expect(tastingData.value.nose.aromas!.primary.floral).toEqual(['rose', 'violet'])
      expect(tastingData.value.nose.aromas!.primary.herbal).toEqual(['mint'])
      expect(tastingData.value.nose.aromas!.secondary.oak).toEqual(['vanilla', 'cedar'])

      const removedCategories = removed.map(r => r.category)
      expect(removedCategories).not.toContain('floral')
      expect(removedCategories).not.toContain('herbal')
      expect(removedCategories).not.toContain('oak')
    })

    it('red→white: removes red-only primary aromas', () => {
      tastingData.value.appearance.wineType = 'red'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry', 'strawberry']
      tastingData.value.nose.aromas!.primary.blackFruit = ['blackcurrant']
      tastingData.value.nose.aromas!.primary.driedCookedFruit = ['prune']

      const removed = handleWineTypeChange('white')

      expect(tastingData.value.nose.aromas!.primary.redFruit).toEqual([])
      expect(tastingData.value.nose.aromas!.primary.blackFruit).toEqual([])
      expect(tastingData.value.nose.aromas!.primary.driedCookedFruit).toEqual([])

      const removedCategories = removed.map(r => r.category)
      expect(removedCategories).toContain('redFruit')
      expect(removedCategories).toContain('blackFruit')
      expect(removedCategories).toContain('driedCookedFruit')
    })

    it('red→white: removes red-only tertiary aromas', () => {
      tastingData.value.appearance.wineType = 'red'
      tastingData.value.nose.aromas!.tertiary.fruitDevelopmentRed = ['fig']
      tastingData.value.nose.aromas!.tertiary.bottleAgeRed = ['leather', 'tobacco']

      const removed = handleWineTypeChange('white')

      expect(tastingData.value.nose.aromas!.tertiary.fruitDevelopmentRed).toEqual([])
      expect(tastingData.value.nose.aromas!.tertiary.bottleAgeRed).toEqual([])

      const removedCategories = removed.map(r => r.category)
      expect(removedCategories).toContain('fruitDevelopmentRed')
      expect(removedCategories).toContain('bottleAgeRed')
    })

    it('rosé→white: removes red-only aromas but keeps white and shared ones', () => {
      tastingData.value.appearance.wineType = 'rosé'
      tastingData.value.nose.aromas!.primary.greenFruit = ['apple']
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']
      tastingData.value.nose.aromas!.primary.floral = ['rose']
      tastingData.value.nose.aromas!.tertiary.fruitDevelopmentWhite = ['marmalade']
      tastingData.value.nose.aromas!.tertiary.fruitDevelopmentRed = ['prune']
      tastingData.value.nose.aromas!.tertiary.bottleAgeWhite = ['honey']
      tastingData.value.nose.aromas!.tertiary.bottleAgeRed = ['leather']

      handleWineTypeChange('white')

      expect(tastingData.value.nose.aromas!.primary.greenFruit).toEqual(['apple'])
      expect(tastingData.value.nose.aromas!.primary.floral).toEqual(['rose'])
      expect(tastingData.value.nose.aromas!.tertiary.fruitDevelopmentWhite).toEqual(['marmalade'])
      expect(tastingData.value.nose.aromas!.tertiary.bottleAgeWhite).toEqual(['honey'])

      expect(tastingData.value.nose.aromas!.primary.redFruit).toEqual([])
      expect(tastingData.value.nose.aromas!.tertiary.fruitDevelopmentRed).toEqual([])
      expect(tastingData.value.nose.aromas!.tertiary.bottleAgeRed).toEqual([])
    })

    it('any→rosé: removes nothing (rosé accepts all categories)', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.greenFruit = ['apple']
      tastingData.value.nose.aromas!.primary.floral = ['rose']
      tastingData.value.nose.aromas!.secondary.oak = ['vanilla']
      tastingData.value.nose.aromas!.tertiary.bottleAgeWhite = ['petrol']

      const removed = handleWineTypeChange('rosé')

      expect(removed).toEqual([])
      expect(tastingData.value.nose.aromas!.primary.greenFruit).toEqual(['apple'])
      expect(tastingData.value.nose.aromas!.primary.floral).toEqual(['rose'])
      expect(tastingData.value.nose.aromas!.secondary.oak).toEqual(['vanilla'])
      expect(tastingData.value.nose.aromas!.tertiary.bottleAgeWhite).toEqual(['petrol'])
    })

    it('cleans both nose aromas AND palate flavors', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.greenFruit = ['apple']
      tastingData.value.palate.flavors!.primary.greenFruit = ['pear']

      const removed = handleWineTypeChange('red')

      expect(tastingData.value.nose.aromas!.primary.greenFruit).toEqual([])
      expect(tastingData.value.palate.flavors!.primary.greenFruit).toEqual([])

      const aromasRemoved = removed.filter(r => r.field === 'aromas')
      const flavorsRemoved = removed.filter(r => r.field === 'flavors')
      expect(aromasRemoved.some(r => r.category === 'greenFruit')).toBe(true)
      expect(flavorsRemoved.some(r => r.category === 'greenFruit')).toBe(true)
    })

    it('includes removed descriptors in the returned list', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.greenFruit = ['apple', 'pear']

      const removed = handleWineTypeChange('red')

      const greenFruitEntry = removed.find(r => r.category === 'greenFruit' && r.field === 'aromas')
      expect(greenFruitEntry).toBeDefined()
      expect(greenFruitEntry!.descriptors).toEqual(['apple', 'pear'])
      expect(greenFruitEntry!.aromaType).toBe('primary')
    })

    it('shows a toast when incompatible aromas are cleared', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.greenFruit = ['apple']
      tastingData.value.nose.aromas!.primary.citrusFruit = ['lemon']

      handleWineTypeChange('red')

      expect(mockToastAdd).toHaveBeenCalledOnce()
      const call = mockToastAdd.mock.calls[0]![0]
      expect(call).toMatchObject({ color: 'warning' })
      expect(call.description).toMatch(/2 incompatible/)
    })

    it('does not show a toast when no aromas are cleared', () => {
      tastingData.value.appearance.wineType = 'red'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']

      handleWineTypeChange('red')

      expect(mockToastAdd).not.toHaveBeenCalled()
    })

    it('toast message uses singular form when exactly one selection is cleared', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.greenFruit = ['apple']

      handleWineTypeChange('red')

      expect(mockToastAdd).toHaveBeenCalledOnce()
      const call = mockToastAdd.mock.calls[0]![0]
      expect(call.description).toMatch(/1 incompatible aroma\/flavor selection for/)
    })
  })

  describe('validateDataConsistency()', () => {
    it('returns empty array when data is consistent with wine type', () => {
      tastingData.value.appearance.wineType = 'red'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']
      tastingData.value.nose.aromas!.secondary.oak = ['vanilla']
      tastingData.value.nose.aromas!.tertiary.bottleAgeRed = ['leather']

      const inconsistencies = validateDataConsistency()

      expect(inconsistencies).toEqual([])
    })

    it('returns empty array when wine type is null (no selections to validate against)', () => {
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']
      tastingData.value.palate.flavors!.tertiary.bottleAgeRed = ['leather']

      const inconsistencies = validateDataConsistency()

      expect(inconsistencies).toEqual([])
    })

    it('detects aromas invalid for current wine type in nose', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']

      const inconsistencies = validateDataConsistency()

      expect(inconsistencies.length).toBeGreaterThan(0)
      expect(inconsistencies[0]!.category).toBe('redFruit')
      expect(inconsistencies[0]!.field).toBe('aromas')
      expect(inconsistencies[0]!.aromaType).toBe('primary')
      expect(inconsistencies[0]!.descriptors).toEqual(['raspberry'])
    })

    it('detects aromas invalid for current wine type in palate flavors', () => {
      tastingData.value.appearance.wineType = 'red'
      tastingData.value.palate.flavors!.primary.greenFruit = ['apple']

      const inconsistencies = validateDataConsistency()

      expect(inconsistencies.length).toBeGreaterThan(0)
      const inconsistency = inconsistencies.find(i => i.category === 'greenFruit' && i.field === 'flavors')
      expect(inconsistency).toBeDefined()
      expect(inconsistency!.aromaType).toBe('primary')
    })

    it('detects tertiary inconsistencies', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.tertiary.bottleAgeRed = ['leather']

      const inconsistencies = validateDataConsistency()

      const found = inconsistencies.find(i => i.category === 'bottleAgeRed')
      expect(found).toBeDefined()
      expect(found!.aromaType).toBe('tertiary')
    })

    it('does NOT mutate the data (read-only check)', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']

      validateDataConsistency()

      expect(tastingData.value.nose.aromas!.primary.redFruit).toEqual(['raspberry'])
    })

    it('reports multiple inconsistencies at once', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']
      tastingData.value.nose.aromas!.primary.blackFruit = ['blackcurrant']
      tastingData.value.nose.aromas!.tertiary.bottleAgeRed = ['leather']
      tastingData.value.palate.flavors!.primary.driedCookedFruit = ['prune']

      const inconsistencies = validateDataConsistency()

      expect(inconsistencies.length).toBe(4)
    })

    it('all-clear after handleWineTypeChange cleans the data', () => {
      tastingData.value.appearance.wineType = 'white'
      tastingData.value.nose.aromas!.primary.redFruit = ['raspberry']
      tastingData.value.nose.aromas!.primary.blackFruit = ['blackcurrant']

      handleWineTypeChange('white')

      tastingData.value.appearance.wineType = 'white'
      const inconsistencies = validateDataConsistency()
      expect(inconsistencies).toEqual([])
    })
  })

  describe('shared singleton state', () => {
    it('returns the same tastingData ref from multiple calls', () => {
      const a = useTastingData()
      const b = useTastingData()
      expect(a.tastingData).toBe(b.tastingData)
    })

    it('mutations from one call are visible from another', () => {
      const a = useTastingData()
      const b = useTastingData()

      a.tastingData.value.appearance.wineType = 'red'

      expect(b.tastingData.value.appearance.wineType).toBe('red')
    })
  })
})
