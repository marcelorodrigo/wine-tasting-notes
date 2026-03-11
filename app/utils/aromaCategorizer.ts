import type {
  AromaObject,
  PrimaryAromaCategory,
  SecondaryAromaCategory,
  TertiaryAromaCategory
} from '../types/tasting'

type CategoryDefinition = {
  label: string
}

/**
 * A subset of the AROMAS structure providing human-readable labels for each category.
 * Pass `AROMAS` from `wineTypeFilters.ts` to satisfy this type.
 */
export type AromaDefinitions = {
  primary: Record<PrimaryAromaCategory, CategoryDefinition>
  secondary: Record<SecondaryAromaCategory, CategoryDefinition>
  tertiary: Record<TertiaryAromaCategory, CategoryDefinition>
}

function buildCategoryPart(label: string, items: string[]): string {
  return `${label.toLowerCase()} (${items.join(', ')})`
}

/**
 * Joins an array of formatted category parts with Oxford-comma-free grammar:
 *   - 0 parts → ""
 *   - 1 part  → "floral (acacia)"
 *   - 2 parts → "floral (acacia) and green fruit (gooseberry)"
 *   - 3+ parts → "floral (acacia), green fruit (gooseberry) and yeast (bread)"
 */
function joinWithAnd(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]!
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]!}`
}

/**
 * Formats an AromaObject into a single human-readable string.
 * Aromas are grouped by category in primary → secondary → tertiary order.
 * Categories with no selections are omitted.
 *
 * @example
 * // "floral (acacia, violet), green fruit (gooseberry) and yeast (bread)"
 * formatAromaList(aromas, AROMAS)
 */
export function formatAromaList(aromas: AromaObject, definitions: AromaDefinitions): string {
  const parts: string[] = []

  for (const [category, items] of Object.entries(aromas.primary)) {
    if (items.length > 0) {
      const def = definitions.primary[category as PrimaryAromaCategory]
      parts.push(buildCategoryPart(def.label, items))
    }
  }

  for (const [category, items] of Object.entries(aromas.secondary)) {
    if (items.length > 0) {
      const def = definitions.secondary[category as SecondaryAromaCategory]
      parts.push(buildCategoryPart(def.label, items))
    }
  }

  for (const [category, items] of Object.entries(aromas.tertiary)) {
    if (items.length > 0) {
      const def = definitions.tertiary[category as TertiaryAromaCategory]
      parts.push(buildCategoryPart(def.label, items))
    }
  }

  return joinWithAnd(parts)
}
