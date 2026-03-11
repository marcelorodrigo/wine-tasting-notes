import { describe, expect, it } from 'vitest'
import { formatAromaList } from '../../app/utils/aromaCategorizer'
import { AROMA_LABELS } from '../../app/utils/templates/_shared'
import { emptyAromas, sampleAromas, singleAroma } from './templates/_fixtures'

describe('formatAromaList', () => {
  it('returns empty string for empty AromaObject', () => {
    expect(formatAromaList(emptyAromas(), AROMA_LABELS)).toBe('')
  })

  it('formats single aroma in one category', () => {
    expect(formatAromaList(singleAroma(), AROMA_LABELS)).toBe('floral (acacia)')
  })

  it('formats multiple aromas in one category', () => {
    const aromas = emptyAromas()
    aromas.primary.floral = ['acacia', 'violet', 'rose']
    expect(formatAromaList(aromas, AROMA_LABELS)).toBe('floral (acacia, violet, rose)')
  })

  it('joins two categories with "and"', () => {
    const aromas = emptyAromas()
    aromas.primary.floral = ['acacia']
    aromas.primary.greenFruit = ['gooseberry']
    expect(formatAromaList(aromas, AROMA_LABELS))
      .toBe('floral (acacia) and green fruit (gooseberry)')
  })

  it('joins three+ categories with commas and "and"', () => {
    expect(formatAromaList(sampleAromas(), AROMA_LABELS))
      .toBe('floral (acacia, violet), green fruit (gooseberry) and yeast (bread)')
  })

  it('includes secondary aromas in order', () => {
    const aromas = emptyAromas()
    aromas.secondary.yeast = ['bread']
    aromas.secondary.oak = ['vanilla', 'cedar']
    expect(formatAromaList(aromas, AROMA_LABELS))
      .toBe('yeast (bread) and oak (vanilla, cedar)')
  })

  it('includes tertiary aromas in order', () => {
    const aromas = emptyAromas()
    aromas.tertiary.deliberateOxidation = ['marzipan']
    aromas.tertiary.bottleAgeWhite = ['petrol']
    expect(formatAromaList(aromas, AROMA_LABELS))
      .toBe('deliberate oxidation (marzipan) and bottle age (white) (petrol)')
  })

  it('formats all three tiers combined', () => {
    const aromas = emptyAromas()
    aromas.primary.floral = ['acacia']
    aromas.secondary.yeast = ['bread']
    aromas.tertiary.deliberateOxidation = ['marzipan']
    expect(formatAromaList(aromas, AROMA_LABELS))
      .toBe('floral (acacia), yeast (bread) and deliberate oxidation (marzipan)')
  })

  it('lowercases category labels', () => {
    const aromas = emptyAromas()
    aromas.primary.pungentSpice = ['liquorice']
    expect(formatAromaList(aromas, AROMA_LABELS)).toBe('pungent spice (liquorice)')
  })

  it('skips categories with empty arrays', () => {
    const aromas = emptyAromas()
    aromas.primary.floral = ['acacia']
    aromas.primary.greenFruit = []
    aromas.primary.citrusFruit = ['lemon']
    expect(formatAromaList(aromas, AROMA_LABELS))
      .toBe('floral (acacia) and citrus fruit (lemon)')
  })
})
