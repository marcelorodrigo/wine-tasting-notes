import { describe, expect, it } from 'vitest'
import {
  generateAppearanceText,
  generateConclusionsText,
  generateNoseText,
  generatePalateText
} from '../../../app/utils/templates/bartalk'
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

describe('bartalk template', () => {
  describe('generateAppearanceText', () => {
    it('returns empty string for empty data', () => {
      expect(generateAppearanceText(emptyAppearance())).toBe('')
    })

    it('has no section header', () => {
      const result = generateAppearanceText(fullAppearance())
      expect(result).not.toMatch(/^(APPEARANCE|Appearance|On the)/)
    })

    it('starts with Looks', () => {
      const result = generateAppearanceText(fullAppearance())
      expect(result).toMatch(/^Looks/)
    })

    it('formats full data with em-dash for observations', () => {
      expect(generateAppearanceText(fullAppearance()))
        .toBe('Looks clear, pale and lemon — with legs/tears and bubbles.')
    })

    it('handles only clarity', () => {
      const data = { ...emptyAppearance(), clarity: 'hazy' as const }
      expect(generateAppearanceText(data)).toBe('Looks hazy.')
    })

    it('handles only observations', () => {
      const data = { ...emptyAppearance(), otherObservations: ['deposit' as const] }
      expect(generateAppearanceText(data)).toBe('Shows deposit.')
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

    it('uses flat aroma list (not grouped)', () => {
      const result = generateNoseText(fullNose())
      expect(result).not.toContain('floral (acacia')
      expect(result).toContain('acacia')
      expect(result).toContain('gooseberry')
    })

    it('integrates condition and aromas with em-dash', () => {
      expect(generateNoseText(fullNose()))
        .toBe('Clean, medium(+) nose — acacia, violet, gooseberry and bread. Developing nicely.')
    })

    it('handles unclean condition', () => {
      const data = { ...emptyNose(), condition: 'unclean' as const }
      expect(generateNoseText(data)).toBe('Something\'s off on the nose.')
    })

    it('handles clean condition without aromas', () => {
      const data = { ...emptyNose(), condition: 'clean' as const }
      expect(generateNoseText(data)).toBe('Clean nose.')
    })

    it('handles intensity only without condition', () => {
      const data = { ...emptyNose(), intensity: 'pronounced' as const }
      expect(generateNoseText(data)).toBe('Pronounced on the nose.')
    })

    it('handles aromas only (no condition/intensity)', () => {
      const data = { ...emptyNose(), aromas: singleAroma() }
      expect(generateNoseText(data)).toBe('Smells of acacia.')
    })

    it('uses casual development descriptions', () => {
      const data = { ...emptyNose(), development: 'tired/past its best' as const }
      expect(generateNoseText(data)).toBe('A bit tired.')
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

    it('uses casual vocabulary for acidity', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toContain('zippy acid')
    })

    it('uses casual vocabulary for tannin', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toContain('moderate tannins')
    })

    it('formats full data correctly', () => {
      expect(generatePalateText(fullPalate()))
        .toBe('Dry, zippy acid and moderate tannins. Fine bubbles. Pretty warm. Medium-bodied. Tastes of gooseberry and vanilla. Nice long finish.')
    })

    it('handles fortified with em-dash', () => {
      const data = { ...emptyPalate(), fortified: true }
      expect(generatePalateText(data)).toBe('Fortified — packs a punch.')
    })

    it('fortified takes precedence over alcohol', () => {
      const data = { ...emptyPalate(), fortified: true, alcohol: 'high' as const }
      const result = generatePalateText(data)
      expect(result).toContain('Fortified')
      expect(result).not.toContain('Pretty warm')
    })

    it('uses bar-talk mousse descriptions', () => {
      const data = { ...emptyPalate(), mousse: 'creamy' as const }
      expect(generatePalateText(data)).toBe('Creamy fizz.')
    })

    it('uses bar-talk body descriptions', () => {
      const data = { ...emptyPalate(), body: 'full' as const }
      expect(generatePalateText(data)).toBe('Full-bodied.')
    })

    it('uses flat flavor list', () => {
      const result = generatePalateText(fullPalate())
      expect(result).toContain('Tastes of gooseberry and vanilla')
      expect(result).not.toContain('green fruit (gooseberry)')
    })

    it('handles finish only', () => {
      const data = { ...emptyPalate(), finish: 'short' as const }
      expect(generatePalateText(data)).toBe('Quick finish.')
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

    it('combines quality and readiness with em-dash', () => {
      expect(generateConclusionsText(fullConclusions()))
        .toBe('Solid wine — drink it now or hold it.')
    })

    it('handles quality only', () => {
      const data = { ...emptyConclusions(), qualityLevel: 'outstanding' as const }
      expect(generateConclusionsText(data)).toBe('Knockout wine.')
    })

    it('handles readiness only', () => {
      const data = { ...emptyConclusions(), readiness: 'too old' as const }
      expect(generateConclusionsText(data)).toBe('Past its best.')
    })

    it('maps all quality levels', () => {
      const qualities = ['faulty', 'poor', 'acceptable', 'good', 'very good', 'outstanding'] as const
      for (const q of qualities) {
        const result = generateConclusionsText({ ...emptyConclusions(), qualityLevel: q })
        expect(result).not.toBe('')
        expect(result).not.toContain(q)
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
