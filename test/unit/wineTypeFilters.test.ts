import { describe, expect, it } from 'vitest'

import {
  AROMAS,
  getColorOptionsForWineType,
  getVisibleCategoriesForWineType,
  isAromaValidForWineType,
  isPrimaryCategoryVisibleForWineType,
  isSecondaryCategoryVisibleForWineType,
  isTertiaryCategoryVisibleForWineType
} from '../../app/utils/wineTypeFilters'

describe('wineTypeFilters', () => {
  it('exposes the full aroma taxonomy defined by the plan', () => {
    const categoryCount = Object.keys(AROMAS.primary).length
      + Object.keys(AROMAS.secondary).length
      + Object.keys(AROMAS.tertiary).length

    const descriptorCount = [...Object.values(AROMAS.primary), ...Object.values(AROMAS.secondary), ...Object.values(AROMAS.tertiary)]
      .reduce((total, category) => total + category.descriptors.length, 0)

    expect(categoryCount).toBe(20)
    expect(descriptorCount).toBe(126)
  })

  it('returns the correct visible categories for white wines', () => {
    expect(getVisibleCategoriesForWineType('white')).toEqual({
      primary: ['floral', 'greenFruit', 'citrusFruit', 'stoneFruit', 'tropicalFruit', 'herbaceous', 'herbal', 'pungentSpice', 'other'],
      secondary: ['yeast', 'malolacticConversion', 'oak'],
      tertiary: ['deliberateOxidation', 'fruitDevelopmentWhite', 'bottleAgeWhite']
    })

    expect(isPrimaryCategoryVisibleForWineType('greenFruit', 'white')).toBe(true)
    expect(isPrimaryCategoryVisibleForWineType('redFruit', 'white')).toBe(false)
    expect(isPrimaryCategoryVisibleForWineType('blackFruit', 'white')).toBe(false)
    expect(isPrimaryCategoryVisibleForWineType('driedCookedFruit', 'white')).toBe(false)
    expect(isTertiaryCategoryVisibleForWineType('fruitDevelopmentWhite', 'white')).toBe(true)
    expect(isTertiaryCategoryVisibleForWineType('fruitDevelopmentRed', 'white')).toBe(false)
    expect(isTertiaryCategoryVisibleForWineType('bottleAgeRed', 'white')).toBe(false)
  })

  it('returns the correct visible categories for red wines', () => {
    expect(getVisibleCategoriesForWineType('red')).toEqual({
      primary: ['floral', 'redFruit', 'blackFruit', 'driedCookedFruit', 'herbaceous', 'herbal', 'pungentSpice', 'other'],
      secondary: ['yeast', 'malolacticConversion', 'oak'],
      tertiary: ['deliberateOxidation', 'fruitDevelopmentRed', 'bottleAgeRed']
    })

    expect(isPrimaryCategoryVisibleForWineType('redFruit', 'red')).toBe(true)
    expect(isPrimaryCategoryVisibleForWineType('greenFruit', 'red')).toBe(false)
    expect(isPrimaryCategoryVisibleForWineType('citrusFruit', 'red')).toBe(false)
    expect(isPrimaryCategoryVisibleForWineType('stoneFruit', 'red')).toBe(false)
    expect(isPrimaryCategoryVisibleForWineType('tropicalFruit', 'red')).toBe(false)
    expect(isTertiaryCategoryVisibleForWineType('fruitDevelopmentRed', 'red')).toBe(true)
    expect(isTertiaryCategoryVisibleForWineType('fruitDevelopmentWhite', 'red')).toBe(false)
    expect(isTertiaryCategoryVisibleForWineType('bottleAgeWhite', 'red')).toBe(false)
  })

  it('reflects representative category transitions between white and red wines', () => {
    expect(isPrimaryCategoryVisibleForWineType('greenFruit', 'white')).toBe(true)
    expect(isPrimaryCategoryVisibleForWineType('greenFruit', 'red')).toBe(false)
    expect(isAromaValidForWineType('greenFruit', 'white', 'primary')).toBe(true)
    expect(isAromaValidForWineType('greenFruit', 'red', 'primary')).toBe(false)

    expect(isPrimaryCategoryVisibleForWineType('redFruit', 'red')).toBe(true)
    expect(isPrimaryCategoryVisibleForWineType('redFruit', 'white')).toBe(false)
    expect(isAromaValidForWineType('redFruit', 'red', 'primary')).toBe(true)
    expect(isAromaValidForWineType('redFruit', 'white', 'primary')).toBe(false)

    expect(isTertiaryCategoryVisibleForWineType('bottleAgeWhite', 'white')).toBe(true)
    expect(isTertiaryCategoryVisibleForWineType('bottleAgeWhite', 'red')).toBe(false)
    expect(isAromaValidForWineType('bottleAgeWhite', 'white', 'tertiary')).toBe(true)
    expect(isAromaValidForWineType('bottleAgeWhite', 'red', 'tertiary')).toBe(false)

    expect(isTertiaryCategoryVisibleForWineType('bottleAgeRed', 'red')).toBe(true)
    expect(isTertiaryCategoryVisibleForWineType('bottleAgeRed', 'white')).toBe(false)
    expect(isAromaValidForWineType('bottleAgeRed', 'red', 'tertiary')).toBe(true)
    expect(isAromaValidForWineType('bottleAgeRed', 'white', 'tertiary')).toBe(false)
  })

  it('gives rosé access to every aroma category', () => {
    expect(getVisibleCategoriesForWineType('rosé')).toEqual({
      primary: Object.keys(AROMAS.primary),
      secondary: Object.keys(AROMAS.secondary),
      tertiary: Object.keys(AROMAS.tertiary)
    })

    for (const category of Object.keys(AROMAS.primary)) {
      expect(isPrimaryCategoryVisibleForWineType(category as keyof typeof AROMAS.primary, 'rosé')).toBe(true)
      expect(isAromaValidForWineType(category as keyof typeof AROMAS.primary, 'rosé', 'primary')).toBe(true)
    }

    for (const category of Object.keys(AROMAS.secondary)) {
      expect(isSecondaryCategoryVisibleForWineType(category as keyof typeof AROMAS.secondary, 'rosé')).toBe(true)
      expect(isAromaValidForWineType(category as keyof typeof AROMAS.secondary, 'rosé', 'secondary')).toBe(true)
    }

    for (const category of Object.keys(AROMAS.tertiary)) {
      expect(isTertiaryCategoryVisibleForWineType(category as keyof typeof AROMAS.tertiary, 'rosé')).toBe(true)
      expect(isAromaValidForWineType(category as keyof typeof AROMAS.tertiary, 'rosé', 'tertiary')).toBe(true)
    }
  })

  it('keeps secondary categories visible for all named wine types', () => {
    expect(isSecondaryCategoryVisibleForWineType('yeast', 'white')).toBe(true)
    expect(isSecondaryCategoryVisibleForWineType('malolacticConversion', 'rosé')).toBe(true)
    expect(isSecondaryCategoryVisibleForWineType('oak', 'red')).toBe(true)
  })

  it('returns color options for each wine type', () => {
    expect(getColorOptionsForWineType('white')).toEqual(['lemon-green', 'lemon', 'gold', 'amber', 'brown'])
    expect(getColorOptionsForWineType('rosé')).toEqual(['pink', 'salmon', 'orange'])
    expect(getColorOptionsForWineType('red')).toEqual(['purple', 'ruby', 'garnet', 'tawny', 'brown'])
  })

  it('treats null or undefined wine types as all-disabled', () => {
    expect(getVisibleCategoriesForWineType(null)).toEqual({
      primary: [],
      secondary: [],
      tertiary: []
    })
    expect(getVisibleCategoriesForWineType(undefined)).toEqual({
      primary: [],
      secondary: [],
      tertiary: []
    })

    expect(isPrimaryCategoryVisibleForWineType('floral', null)).toBe(false)
    expect(isSecondaryCategoryVisibleForWineType('yeast', undefined)).toBe(false)
    expect(isTertiaryCategoryVisibleForWineType('deliberateOxidation', null)).toBe(false)
    expect(isAromaValidForWineType('oak', undefined, 'secondary')).toBe(false)
    expect(getColorOptionsForWineType(null)).toEqual([])
    expect(getColorOptionsForWineType(undefined)).toEqual([])
  })
})
