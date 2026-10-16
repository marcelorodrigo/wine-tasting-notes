import { describe, expect, it } from 'vitest'
import { createListFormatter } from '../../../app/services/i18n/list-formatter'

describe('createListFormatter', () => {
  it('formats a single item', () => {
    const fmt = createListFormatter('en')
    expect(fmt(['Merlot'])).toBe('Merlot')
  })

  it('formats two items with conjunction', () => {
    const fmt = createListFormatter('en')
    expect(fmt(['Merlot', 'Cabernet'])).toBe('Merlot and Cabernet')
  })

  it('formats three items with conjunction', () => {
    const fmt = createListFormatter('en')
    expect(fmt(['Merlot', 'Cabernet', 'Syrah'])).toBe(
      'Merlot, Cabernet, and Syrah',
    )
  })

  it('formats with disjunction', () => {
    const fmt = createListFormatter('en', 'disjunction')
    expect(fmt(['Merlot', 'Cabernet'])).toBe('Merlot or Cabernet')
  })

  it('formats with short style', () => {
    const fmt = createListFormatter('en', 'conjunction', 'short')
    expect(fmt(['Merlot', 'Cabernet', 'Syrah'])).toBe(
      'Merlot, Cabernet, & Syrah',
    )
  })

  it('formats empty array', () => {
    const fmt = createListFormatter('en')
    expect(fmt([])).toBe('')
  })

  it('uses different locale formatting', () => {
    const fmt = createListFormatter('de')
    expect(fmt(['Merlot', 'Cabernet'])).toBe('Merlot und Cabernet')
  })
})
