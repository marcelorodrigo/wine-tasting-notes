import { describe, expect, it } from 'vitest'
import { satV1Options } from '../../../../app/data/sat/v1/options'
import { hasLocaleKey } from './locale'

const DOT_ID = /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/

describe('canonical SAT options', () => {
  it('assigns every option a unique id', () => {
    const ids = satV1Options.map((option) => option.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses a canonical dot-separated id', () => {
    for (const option of satV1Options) {
      expect(option.id, option.id).toMatch(DOT_ID)
    }
  })

  it('prefixes every option id with its section', () => {
    for (const option of satV1Options) {
      expect(option.id.startsWith(`${option.sectionId}.`), option.id).toBe(true)
    }
  })

  it('provides a resolvable label key for every option', () => {
    const missing = satV1Options
      .filter((option) => !hasLocaleKey(option.labelKey))
      .map((option) => option.labelKey)
    expect(missing).toEqual([])
  })

  it('covers all four tasting sections', () => {
    const sections = new Set(satV1Options.map((option) => option.sectionId))
    expect(sections).toEqual(new Set(['appearance', 'nose', 'palate', 'conclusions']))
  })
})
