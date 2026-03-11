import { describe, expect, it } from 'vitest'
import {
  generateAppearanceText,
  generateConclusionsText,
  generateNoseText,
  generatePalateText
} from '../../../app/utils/templates/professional'
import {
  emptyAppearance,
  emptyAromas,
  emptyConclusions,
  emptyNose,
  emptyPalate,
  fullAppearance,
  fullConclusions,
  fullNose,
  fullPalate,
  singleAroma
} from './_fixtures'

describe('professional template', () => {
  describe('generateAppearanceText', () => {
    it('returns empty string for empty data', () => {
      expect(generateAppearanceText(emptyAppearance())).toBe('')
    })

    it('starts with APPEARANCE: header', () => {
      const result = generateAppearanceText(fullAppearance())
      expect(result).toMatch(/^APPEARANCE:/)
    })

    it('formats full data correctly', () => {
      expect(generateAppearanceText(fullAppearance()))
        .toBe('APPEARANCE: Clear and pale lemon in color, showing legs/tears and bubbles.')
    })

    it('handles only clarity', () => {
      const data = { ...emptyAppearance(), clarity: 'clear' as const }
      expect(generateAppearanceText(data)).toBe('APPEARANCE: Clear.')
    })

    it('handles only color', () => {
      const data = { ...emptyAppearance(), color: 'ruby' as const }
      expect(generateAppearanceText(data)).toBe('APPEARANCE: Ruby in color.')
    })

    it('handles intensity without color', () => {
      const data = { ...emptyAppearance(), intensity: 'deep' as const }
      expect(generateAppearanceText(data)).toBe('APPEARANCE: Deep in intensity.')
    })

    it('handles only observations', () => {
      const data = { ...emptyAppearance(), otherObservations: ['legs/tears' as const] }
      expect(generateAppearanceText(data)).toBe('APPEARANCE: , showing legs/tears.')
    })

    it('handles empty observations array as no data', () => {
      const data = { ...emptyAppearance(), otherObservations: [] as const }
      expect(generateAppearanceText(data)).toBe('')
    })
  })

  describe('generateNoseText', () => {
    it('returns empty string for empty data', () => {
      expect(generateNoseText(emptyNose())).toBe('')
    })

    it('starts with NOSE: header', () => {
      const result = generateNoseText(fullNose())
      expect(result).toMatch(/^NOSE:/)
    })

    it('formats full data correctly', () => {
      expect(generateNoseText(fullNose()))
        .toBe('NOSE: Clean, with medium(+) intensity. Detected floral (acacia, violet), green fruit (gooseberry) and yeast (bread) aromas. Developing.')
    })

    it('handles condition only', () => {
      const data = { ...emptyNose(), condition: 'clean' as const }
      expect(generateNoseText(data)).toBe('NOSE: Clean.')
    })

    it('handles unclean condition', () => {
      const data = { ...emptyNose(), condition: 'unclean' as const }
      expect(generateNoseText(data)).toBe('NOSE: Unclean.')
    })

    it('handles aromas only', () => {
      const data = { ...emptyNose(), aromas: singleAroma() }
      expect(generateNoseText(data)).toBe('NOSE: Detected floral (acacia) aromas.')
    })

    it('handles development only', () => {
      const data = { ...emptyNose(), development: 'youthful' as const }
      expect(generateNoseText(data)).toBe('NOSE: Youthful.')
    })

    it('does not crash with empty aromas object', () => {
      const data = { ...emptyNose(), aromas: emptyAromas() }
      expect(generateNoseText(data)).toBe('')
    })
  })

  describe('generatePalateText', () => {
    it('returns empty string for empty data', () => {
      expect(generatePalateText(emptyPalate())).toBe('')
    })

    it('starts with PALATE: header', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toMatch(/^PALATE:/)
    })

    it('formats full data correctly', () => {
      expect(generatePalateText(fullPalate()))
        .toBe('PALATE: Dry, with high acidity and medium tannin. Mousse is delicate. High alcohol. Body is medium, with medium(+) flavor intensity. Detected green fruit (gooseberry) and oak (vanilla) flavors. Medium(+) finish.')
    })

    it('handles only sweetness', () => {
      const data = { ...emptyPalate(), sweetness: 'dry' as const }
      expect(generatePalateText(data)).toBe('PALATE: Dry.')
    })

    it('handles fortified', () => {
      const data = { ...emptyPalate(), fortified: true }
      expect(generatePalateText(data)).toBe('PALATE: Fortified.')
    })

    it('handles alcohol when not fortified', () => {
      const data = { ...emptyPalate(), alcohol: 'medium' as const }
      expect(generatePalateText(data)).toBe('PALATE: Medium alcohol.')
    })

    it('fortified takes precedence over alcohol', () => {
      const data = { ...emptyPalate(), fortified: true, alcohol: 'high' as const }
      expect(generatePalateText(data)).toBe('PALATE: Fortified.')
    })

    it('handles mousse', () => {
      const data = { ...emptyPalate(), mousse: 'creamy' as const }
      expect(generatePalateText(data)).toBe('PALATE: Mousse is creamy.')
    })

    it('handles body and flavor intensity', () => {
      const data = { ...emptyPalate(), body: 'full' as const, flavorIntensity: 'pronounced' as const }
      expect(generatePalateText(data)).toBe('PALATE: Body is full, with pronounced flavor intensity.')
    })

    it('handles finish only', () => {
      const data = { ...emptyPalate(), finish: 'long' as const }
      expect(generatePalateText(data)).toBe('PALATE: Long finish.')
    })

    it('does not crash with empty flavors object', () => {
      const data = { ...emptyPalate(), flavors: emptyAromas() }
      expect(generatePalateText(data)).toBe('')
    })
  })

  describe('generateConclusionsText', () => {
    it('returns empty string for empty data', () => {
      expect(generateConclusionsText(emptyConclusions())).toBe('')
    })

    it('starts with CONCLUSIONS: header', () => {
      const result = generateConclusionsText(fullConclusions())
      expect(result).toMatch(/^CONCLUSIONS:/)
    })

    it('formats full data correctly', () => {
      expect(generateConclusionsText(fullConclusions()))
        .toBe('CONCLUSIONS: This wine is of good quality. Can drink now, but has potential for ageing.')
    })

    it('handles quality only', () => {
      const data = { ...emptyConclusions(), qualityLevel: 'outstanding' as const }
      expect(generateConclusionsText(data)).toBe('CONCLUSIONS: This wine is of outstanding quality.')
    })

    it('handles readiness only', () => {
      const data = { ...emptyConclusions(), readiness: 'too old' as const }
      expect(generateConclusionsText(data)).toBe('CONCLUSIONS: Too old.')
    })
  })
})
