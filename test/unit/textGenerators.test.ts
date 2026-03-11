import { describe, expect, it } from 'vitest'
import {
  generateAppearanceText,
  generateConclusionsText,
  generateNoseText,
  generatePalateText
} from '../../app/utils/textGenerators'
import {
  emptyAppearance,
  emptyConclusions,
  emptyNose,
  emptyPalate,
  fullAppearance,
  fullConclusions,
  fullNose,
  fullPalate
} from './templates/_fixtures'

const profiles = ['professional', 'casual', 'bartalk', 'playful'] as const

describe('textGenerators facade', () => {
  describe('generates empty string for empty data', () => {
    for (const profile of profiles) {
      it(`${profile} appearance`, () => {
        expect(generateAppearanceText(emptyAppearance(), profile)).toBe('')
      })
      it(`${profile} nose`, () => {
        expect(generateNoseText(emptyNose(), profile)).toBe('')
      })
      it(`${profile} palate`, () => {
        expect(generatePalateText(emptyPalate(), profile)).toBe('')
      })
      it(`${profile} conclusions`, () => {
        expect(generateConclusionsText(emptyConclusions(), profile)).toBe('')
      })
    }
  })

  describe('different profiles produce different output', () => {
    it('appearance differs across profiles', () => {
      const results = profiles.map(p => generateAppearanceText(fullAppearance(), p))
      const unique = new Set(results)
      expect(unique.size).toBe(4)
    })

    it('nose differs across profiles', () => {
      const results = profiles.map(p => generateNoseText(fullNose(), p))
      const unique = new Set(results)
      expect(unique.size).toBe(4)
    })

    it('palate differs across profiles', () => {
      const results = profiles.map(p => generatePalateText(fullPalate(), p))
      const unique = new Set(results)
      expect(unique.size).toBe(4)
    })

    it('conclusions differs across profiles', () => {
      const results = profiles.map(p => generateConclusionsText(fullConclusions(), p))
      const unique = new Set(results)
      expect(unique.size).toBe(4)
    })
  })

  describe('no output contains "null" or "undefined"', () => {
    for (const profile of profiles) {
      it(`${profile} never outputs literal null/undefined`, () => {
        const appearance = generateAppearanceText(fullAppearance(), profile)
        const nose = generateNoseText(fullNose(), profile)
        const palate = generatePalateText(fullPalate(), profile)
        const conclusions = generateConclusionsText(fullConclusions(), profile)

        for (const text of [appearance, nose, palate, conclusions]) {
          expect(text).not.toContain('null')
          expect(text).not.toContain('undefined')
        }
      })
    }
  })
})
