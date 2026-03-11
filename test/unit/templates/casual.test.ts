import { describe, expect, it } from 'vitest'
import {
  generateAppearanceText,
  generateConclusionsText,
  generateNoseText,
  generatePalateText
} from '../../../app/utils/templates/casual'
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

describe('casual template', () => {
  describe('generateAppearanceText', () => {
    it('returns empty string for empty data', () => {
      expect(generateAppearanceText(emptyAppearance())).toBe('')
    })

    it('starts with sentence-case Appearance: header', () => {
      const result = generateAppearanceText(fullAppearance())
      expect(result).toMatch(/^Appearance:/)
    })

    it('formats full data correctly', () => {
      expect(generateAppearanceText(fullAppearance()))
        .toBe('Appearance: This wine shows a clear, pale, lemon color, with legs/tears and bubbles noted.')
    })

    it('handles only clarity', () => {
      const data = { ...emptyAppearance(), clarity: 'clear' as const }
      expect(generateAppearanceText(data)).toBe('Appearance: This wine shows a clear color.')
    })

    it('handles only observations', () => {
      const data = { ...emptyAppearance(), otherObservations: ['deposit' as const] }
      expect(generateAppearanceText(data)).toBe('Appearance: Showing deposit.')
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

    it('starts with On the nose: header', () => {
      const result = generateNoseText(fullNose())
      expect(result).toMatch(/^On the nose:/)
    })

    it('formats full data correctly', () => {
      expect(generateNoseText(fullNose()))
        .toBe('On the nose: The nose is clean and medium(+) intensity. On the nose you\'ll find notes of floral (acacia, violet), green fruit (gooseberry), and yeast (bread). Developing.')
    })

    it('handles condition only', () => {
      const data = { ...emptyNose(), condition: 'clean' as const }
      expect(generateNoseText(data)).toBe('On the nose: The nose is clean.')
    })

    it('handles aromas only', () => {
      const data = { ...emptyNose(), aromas: singleAroma() }
      expect(generateNoseText(data)).toBe('On the nose: On the nose you\'ll find notes of floral (acacia).')
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

    it('starts with On the palate: header', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toMatch(/^On the palate:/)
    })

    it('formats full data correctly', () => {
      expect(generatePalateText(fullPalate()))
        .toBe('On the palate: Dry, high acidity and medium tannin. The bubbles are delicate. Alcohol feels high. Medium body and medium(+) flavor intensity. You can taste green fruit (gooseberry) and oak (vanilla). The finish is medium(+).')
    })

    it('handles fortified', () => {
      const data = { ...emptyPalate(), fortified: true }
      expect(generatePalateText(data)).toBe('On the palate: This is a fortified wine.')
    })

    it('fortified takes precedence over alcohol', () => {
      const data = { ...emptyPalate(), fortified: true, alcohol: 'high' as const }
      const result = generatePalateText(data)
      expect(result).toContain('fortified')
      expect(result).not.toContain('Alcohol feels')
    })

    it('handles mousse', () => {
      const data = { ...emptyPalate(), mousse: 'aggressive' as const }
      expect(generatePalateText(data)).toBe('On the palate: The bubbles are aggressive.')
    })

    it('handles finish only', () => {
      const data = { ...emptyPalate(), finish: 'short' as const }
      expect(generatePalateText(data)).toBe('On the palate: The finish is short.')
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

    it('starts with Overall: header', () => {
      const result = generateConclusionsText(fullConclusions())
      expect(result).toMatch(/^Overall:/)
    })

    it('formats full data correctly', () => {
      expect(generateConclusionsText(fullConclusions()))
        .toBe('Overall: Overall, this is a good wine. Can drink now, but has potential for ageing.')
    })

    it('handles quality only', () => {
      const data = { ...emptyConclusions(), qualityLevel: 'outstanding' as const }
      expect(generateConclusionsText(data)).toBe('Overall: Overall, this is a outstanding wine.')
    })

    it('handles readiness only', () => {
      const data = { ...emptyConclusions(), readiness: 'too young' as const }
      expect(generateConclusionsText(data)).toBe('Overall: Too young.')
    })
  })
})
