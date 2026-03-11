import type { AromaObject } from '../../types/tasting'
import type { AromaDefinitions } from '../aromaCategorizer'

export function joinWithAnd(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]!
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]!}`
}

export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function hasAromaData(aromas: AromaObject | null | undefined): boolean {
  if (!aromas) return false
  return [
    ...Object.values(aromas.primary),
    ...Object.values(aromas.secondary),
    ...Object.values(aromas.tertiary)
  ].some((items: string[]) => items.length > 0)
}

export function flatAromaItems(aromas: AromaObject): string[] {
  return [
    ...Object.values(aromas.primary).flat(),
    ...Object.values(aromas.secondary).flat(),
    ...Object.values(aromas.tertiary).flat()
  ]
}

/** Simplified aroma category labels suitable for inline text output */
export const AROMA_LABELS: AromaDefinitions = {
  primary: {
    floral: { label: 'Floral' },
    greenFruit: { label: 'Green Fruit' },
    citrusFruit: { label: 'Citrus Fruit' },
    stoneFruit: { label: 'Stone Fruit' },
    tropicalFruit: { label: 'Tropical Fruit' },
    redFruit: { label: 'Red Fruit' },
    blackFruit: { label: 'Black Fruit' },
    driedCookedFruit: { label: 'Dried/Cooked Fruit' },
    herbaceous: { label: 'Herbaceous' },
    herbal: { label: 'Herbal' },
    pungentSpice: { label: 'Pungent Spice' },
    other: { label: 'Other' }
  },
  secondary: {
    yeast: { label: 'Yeast' },
    malolacticConversion: { label: 'Malolactic Conversion' },
    oak: { label: 'Oak' }
  },
  tertiary: {
    deliberateOxidation: { label: 'Deliberate Oxidation' },
    fruitDevelopmentWhite: { label: 'Fruit Development (white)' },
    fruitDevelopmentRed: { label: 'Fruit Development (red)' },
    bottleAgeWhite: { label: 'Bottle Age (white)' },
    bottleAgeRed: { label: 'Bottle Age (red)' }
  }
}
