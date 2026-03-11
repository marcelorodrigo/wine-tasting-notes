import { describe, expect, it } from 'vitest'
import {
  generateAppearanceText,
  generateConclusionsText,
  generateNoseText,
  generatePalateText
} from '../../../app/utils/templates/playful'
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

describe('playful template', () => {
  describe('generateAppearanceText', () => {
    it('returns empty string for empty data', () => {
      expect(generateAppearanceText(emptyAppearance())).toBe('')
    })

    it('has no section header', () => {
      const result = generateAppearanceText(fullAppearance())
      expect(result).not.toMatch(/^(APPEARANCE|Appearance|On the)/)
    })

    it('uses creative color metaphors', () => {
      const result = generateAppearanceText(fullAppearance())
      expect(result).toContain('like bottled sunshine')
    })

    it('formats full data with color metaphor and observations', () => {
      expect(generateAppearanceText(fullAppearance()))
        .toBe('Clear and pale lemony — like bottled sunshine — showing legs/tears and bubbles.')
    })

    it('handles color without intensity', () => {
      const data = { ...emptyAppearance(), color: 'ruby' as const }
      expect(generateAppearanceText(data)).toContain('like a jewel in the glass')
    })

    it('handles all wine colors with metaphors', () => {
      const colors = [
        'lemon-green', 'lemon', 'gold', 'amber', 'brown',
        'pink', 'salmon', 'orange',
        'purple', 'ruby', 'garnet', 'tawny'
      ] as const
      for (const color of colors) {
        const data = { ...emptyAppearance(), color }
        const result = generateAppearanceText(data)
        expect(result).toContain('—')
      }
    })

    it('handles only clarity', () => {
      const data = { ...emptyAppearance(), clarity: 'hazy' as const }
      expect(generateAppearanceText(data)).toBe('Hazy.')
    })

    it('handles only observations', () => {
      const data = { ...emptyAppearance(), otherObservations: ['bubbles' as const] }
      expect(generateAppearanceText(data)).toBe('Shows bubbles.')
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

    it('has no section header', () => {
      const result = generateNoseText(fullNose())
      expect(result).not.toMatch(/^(NOSE|Nose|On the nose)/)
    })

    it('uses grouped aroma formatting', () => {
      const result = generateNoseText(fullNose())
      expect(result).toContain('floral (acacia, violet)')
    })

    it('formats full data with creative intro', () => {
      expect(generateNoseText(fullNose()))
        .toBe('A delightful medium(+) nose of floral (acacia, violet), green fruit (gooseberry) and yeast (bread). Nicely developing.')
    })

    it('uses special intro for pronounced intensity', () => {
      const data = { ...emptyNose(), condition: 'clean' as const, intensity: 'pronounced' as const, aromas: singleAroma() }
      expect(generateNoseText(data)).toContain('Your nose is in for a treat')
    })

    it('handles unclean condition', () => {
      const data = { ...emptyNose(), condition: 'unclean' as const }
      expect(generateNoseText(data)).toBe('Watch out — something smells off here.')
    })

    it('handles clean condition without aromas', () => {
      const data = { ...emptyNose(), condition: 'clean' as const }
      expect(generateNoseText(data)).toBe('Clean on the nose.')
    })

    it('handles aromas only', () => {
      const data = { ...emptyNose(), aromas: singleAroma() }
      expect(generateNoseText(data)).toBe('A delightful mix of floral (acacia).')
    })

    it('uses playful development descriptions', () => {
      const data = { ...emptyNose(), development: 'tired/past its best' as const }
      expect(generateNoseText(data)).toBe('A bit tired — probably past its best.')
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

    it('has no section header', () => {
      const result = generatePalateText(fullPalate())
      expect(result).not.toMatch(/^(PALATE|Palate|On the palate)/)
    })

    it('uses playful vocabulary for sweetness', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toContain('Bone dry')
    })

    it('uses playful vocabulary for acidity', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toContain('zippy acidity')
    })

    it('uses playful vocabulary for tannin', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toContain('balanced tannin')
    })

    it('formats full data correctly', () => {
      expect(generatePalateText(fullPalate()))
        .toBe('Bone dry, zippy acidity and balanced tannin. Tiny, playful bubbles. Warming alcohol — it shows. Medium-bodied. Flavors burst with green fruit (gooseberry) and oak (vanilla). Lingering finish.')
    })

    it('uses playful mousse descriptions', () => {
      const data = { ...emptyPalate(), mousse: 'delicate' as const }
      expect(generatePalateText(data)).toBe('Tiny, playful bubbles.')
    })

    it('uses playful mousse for creamy', () => {
      const data = { ...emptyPalate(), mousse: 'creamy' as const }
      expect(generatePalateText(data)).toBe('Bubbles smooth as silk.')
    })

    it('uses playful mousse for aggressive', () => {
      const data = { ...emptyPalate(), mousse: 'aggressive' as const }
      expect(generatePalateText(data)).toBe('Bubbles going wild!')
    })

    it('handles fortified with punch', () => {
      const data = { ...emptyPalate(), fortified: true }
      expect(generatePalateText(data)).toBe('Fortified — packs a punch!')
    })

    it('uses playful body descriptions', () => {
      const data = { ...emptyPalate(), body: 'light' as const }
      expect(generatePalateText(data)).toBe('Light as a feather.')
    })

    it('uses grouped flavor formatting', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toContain('green fruit (gooseberry)')
    })

    it('uses playful finish descriptions', () => {
      const data = { ...emptyPalate(), finish: 'long' as const }
      expect(generatePalateText(data)).toBe('Epic finish.')
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

    it('has no section header', () => {
      const result = generateConclusionsText(fullConclusions())
      expect(result).not.toMatch(/^(CONCLUSIONS|Overall|Conclusion)/)
    })

    it('formats full data with fun vocabulary', () => {
      expect(generateConclusionsText(fullConclusions()))
        .toBe('Solid sipper! Delicious now, but worth the wait if you can resist.')
    })

    it('handles quality only with exclamation', () => {
      const data = { ...emptyConclusions(), qualityLevel: 'outstanding' as const }
      expect(generateConclusionsText(data)).toBe('Absolutely outstanding!')
    })

    it('handles readiness only', () => {
      const data = { ...emptyConclusions(), readiness: 'too old' as const }
      expect(generateConclusionsText(data)).toBe('Past its prime — should have opened this sooner.')
    })

    it('maps all quality levels to fun descriptions', () => {
      const qualities = ['faulty', 'poor', 'acceptable', 'good', 'very good', 'outstanding'] as const
      for (const q of qualities) {
        const result = generateConclusionsText({ ...emptyConclusions(), qualityLevel: q })
        expect(result).not.toBe('')
        expect(result).toContain('!')
      }
    })

    it('maps all readiness levels', () => {
      const readiness = [
        'too young',
        'can drink now, but has potential for ageing',
        'drink now: not suitable for ageing or further ageing',
        'too old'
      ] as const
      for (const r of readiness) {
        const result = generateConclusionsText({ ...emptyConclusions(), readiness: r })
        expect(result).not.toBe('')
      }
    })
  })
})
