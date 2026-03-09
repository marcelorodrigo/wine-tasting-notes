import type {
  Color,
  PrimaryAromaCategory,
  PrimaryAromaSelections,
  RedWineColor,
  RoseWineColor,
  SecondaryAromaCategory,
  SecondaryAromaSelections,
  TertiaryAromaCategory,
  TertiaryAromaSelections,
  WhiteWineColor,
  WineType
} from '../types/tasting'

type AromaCategoryDefinition<TDescriptor extends string> = {
  label: string
  color: `#${string}`
  descriptors: readonly TDescriptor[]
}

type AromaCategoryMap<TSelections extends object> = {
  [K in Extract<keyof TSelections, string>]: AromaCategoryDefinition<
    TSelections[K] extends Array<infer TDescriptor extends string> ? TDescriptor : never
  >
}

type WineTypeFilterMap<TCategory extends string> = Record<TCategory, readonly WineType[]>

type VisibleCategories = {
  primary: PrimaryAromaCategory[]
  secondary: SecondaryAromaCategory[]
  tertiary: TertiaryAromaCategory[]
}

const ALL_WINE_TYPES = ['white', 'rosé', 'red'] as const satisfies readonly WineType[]

export const AROMAS = {
  primary: {
    floral: {
      label: 'Floral',
      color: '#9B59B6',
      descriptors: ['acacia', 'honeysuckle', 'chamomile', 'elderflower', 'geranium', 'blossom', 'rose', 'violet']
    },
    greenFruit: {
      label: 'Green Fruit',
      color: '#27AE60',
      descriptors: ['apple', 'gooseberry', 'pear', 'pear drop', 'quince', 'grape']
    },
    citrusFruit: {
      label: 'Citrus Fruit',
      color: '#F1C40F',
      descriptors: ['grapefruit', 'lemon', 'lime', 'orange peel', 'lemon peel']
    },
    stoneFruit: {
      label: 'Stone Fruit',
      color: '#E67E22',
      descriptors: ['peach', 'apricot', 'nectarine']
    },
    tropicalFruit: {
      label: 'Tropical Fruit',
      color: '#2ECC71',
      descriptors: ['banana', 'lychee', 'mango', 'melon', 'passion fruit', 'pineapple']
    },
    redFruit: {
      label: 'Red Fruit',
      color: '#E74C3C',
      descriptors: ['redcurrant', 'cranberry', 'raspberry', 'strawberry', 'red cherry', 'red plum']
    },
    blackFruit: {
      label: 'Black Fruit',
      color: '#8E44AD',
      descriptors: ['blackcurrant', 'blackberry', 'bramble', 'blueberry', 'black cherry', 'black plum']
    },
    driedCookedFruit: {
      label: 'Dried/Cooked Fruit',
      color: '#D35400',
      descriptors: ['fig', 'prune', 'raisin', 'sultana', 'kirsch', 'jamminess', 'baked/stewed fruits', 'preserved fruits']
    },
    herbaceous: {
      label: 'Herbaceous',
      color: '#6B8E23',
      descriptors: ['green bell pepper (capsicum)', 'grass', 'tomato leaf', 'asparagus', 'blackcurrant leaf']
    },
    herbal: {
      label: 'Herbal',
      color: '#1ABC9C',
      descriptors: ['eucalyptus', 'mint', 'medicinal', 'lavender', 'fennel', 'dill']
    },
    pungentSpice: {
      label: 'Pungent Spice',
      color: '#795548',
      descriptors: ['black/white pepper', 'liquorice']
    },
    other: {
      label: 'Other',
      color: '#7F8C8D',
      descriptors: ['flint', 'wet stones', 'wet wool']
    }
  },
  secondary: {
    yeast: {
      label: 'Yeast (lees, autolysis)',
      color: '#D4A574',
      descriptors: ['biscuit', 'bread', 'toast', 'pastry', 'brioche', 'bread dough', 'cheese']
    },
    malolacticConversion: {
      label: 'Malolactic Conversion',
      color: '#FDEBD0',
      descriptors: ['butter', 'cheese', 'cream']
    },
    oak: {
      label: 'Oak',
      color: '#8B4513',
      descriptors: ['vanilla', 'cloves', 'nutmeg', 'coconut', 'butterscotch', 'toast', 'cedar', 'charred wood', 'smoke', 'chocolate', 'coffee', 'resinous']
    }
  },
  tertiary: {
    deliberateOxidation: {
      label: 'Deliberate Oxidation',
      color: '#D4A017',
      descriptors: ['almond', 'marzipan', 'hazelnut', 'walnut', 'chocolate', 'coffee', 'toffee', 'caramel']
    },
    fruitDevelopmentWhite: {
      label: 'Fruit Development (white)',
      color: '#DAA520',
      descriptors: ['dried apricot', 'marmalade', 'dried apple', 'dried banana']
    },
    fruitDevelopmentRed: {
      label: 'Fruit Development (red)',
      color: '#6A0D47',
      descriptors: ['fig', 'prune', 'tar', 'dried blackberry', 'dried cranberry', 'cooked blackberry', 'cooked red plum']
    },
    bottleAgeWhite: {
      label: 'Bottle Age (white)',
      color: '#B8860B',
      descriptors: ['petrol', 'kerosene', 'cinnamon', 'ginger', 'nutmeg', 'toast', 'nutty', 'mushroom', 'hay', 'honey']
    },
    bottleAgeRed: {
      label: 'Bottle Age (red)',
      color: '#5D4037',
      descriptors: ['leather', 'forest floor', 'earth', 'mushroom', 'game', 'tobacco', 'vegetal', 'wet leaves', 'savoury', 'meaty', 'farmyard']
    }
  }
} as const satisfies {
  primary: AromaCategoryMap<PrimaryAromaSelections>
  secondary: AromaCategoryMap<SecondaryAromaSelections>
  tertiary: AromaCategoryMap<TertiaryAromaSelections>
}

export const WINE_TYPE_FILTERS = {
  primary: {
    floral: ALL_WINE_TYPES,
    greenFruit: ['white', 'rosé'],
    citrusFruit: ['white', 'rosé'],
    stoneFruit: ['white', 'rosé'],
    tropicalFruit: ['white', 'rosé'],
    redFruit: ['rosé', 'red'],
    blackFruit: ['rosé', 'red'],
    driedCookedFruit: ['rosé', 'red'],
    herbaceous: ALL_WINE_TYPES,
    herbal: ALL_WINE_TYPES,
    pungentSpice: ALL_WINE_TYPES,
    other: ALL_WINE_TYPES
  },
  secondary: {
    yeast: ALL_WINE_TYPES,
    malolacticConversion: ALL_WINE_TYPES,
    oak: ALL_WINE_TYPES
  },
  tertiary: {
    deliberateOxidation: ALL_WINE_TYPES,
    fruitDevelopmentWhite: ['white', 'rosé'],
    fruitDevelopmentRed: ['rosé', 'red'],
    bottleAgeWhite: ['white', 'rosé'],
    bottleAgeRed: ['rosé', 'red']
  }
} as const satisfies {
  primary: WineTypeFilterMap<PrimaryAromaCategory>
  secondary: WineTypeFilterMap<SecondaryAromaCategory>
  tertiary: WineTypeFilterMap<TertiaryAromaCategory>
}

export const COLOR_OPTIONS_BY_WINE_TYPE = {
  white: ['lemon-green', 'lemon', 'gold', 'amber', 'brown'],
  rosé: ['pink', 'salmon', 'orange'],
  red: ['purple', 'ruby', 'garnet', 'tawny', 'brown']
} as const satisfies {
  white: readonly WhiteWineColor[]
  rosé: readonly RoseWineColor[]
  red: readonly RedWineColor[]
}

const PRIMARY_AROMA_CATEGORIES: PrimaryAromaCategory[] = Object.keys(AROMAS.primary) as PrimaryAromaCategory[]
const SECONDARY_AROMA_CATEGORIES: SecondaryAromaCategory[] = Object.keys(AROMAS.secondary) as SecondaryAromaCategory[]
const TERTIARY_AROMA_CATEGORIES: TertiaryAromaCategory[] = Object.keys(AROMAS.tertiary) as TertiaryAromaCategory[]

function isCategoryVisibleForWineType<TCategory extends string>(
  filters: WineTypeFilterMap<TCategory>,
  category: TCategory,
  wineType: WineType | null | undefined
): boolean {
  return wineType ? filters[category].includes(wineType) : false
}

function getVisibleCategoriesForGroup<TCategory extends string>(
  categories: readonly TCategory[],
  filters: WineTypeFilterMap<TCategory>,
  wineType: WineType | null | undefined
): TCategory[] {
  if (!wineType) {
    return []
  }

  return categories.filter(category => filters[category].includes(wineType))
}

export function isPrimaryCategoryVisibleForWineType(
  category: PrimaryAromaCategory,
  wineType: WineType | null | undefined
): boolean {
  return isCategoryVisibleForWineType(WINE_TYPE_FILTERS.primary, category, wineType)
}

export function isSecondaryCategoryVisibleForWineType(
  category: SecondaryAromaCategory,
  wineType: WineType | null | undefined
): boolean {
  return isCategoryVisibleForWineType(WINE_TYPE_FILTERS.secondary, category, wineType)
}

export function isTertiaryCategoryVisibleForWineType(
  category: TertiaryAromaCategory,
  wineType: WineType | null | undefined
): boolean {
  return isCategoryVisibleForWineType(WINE_TYPE_FILTERS.tertiary, category, wineType)
}

export function getVisibleCategoriesForWineType(wineType: WineType | null | undefined): VisibleCategories {
  return {
    primary: getVisibleCategoriesForGroup(PRIMARY_AROMA_CATEGORIES, WINE_TYPE_FILTERS.primary, wineType),
    secondary: getVisibleCategoriesForGroup(SECONDARY_AROMA_CATEGORIES, WINE_TYPE_FILTERS.secondary, wineType),
    tertiary: getVisibleCategoriesForGroup(TERTIARY_AROMA_CATEGORIES, WINE_TYPE_FILTERS.tertiary, wineType)
  }
}

export function isAromaValidForWineType(
  aromaCategory: PrimaryAromaCategory,
  wineType: WineType | null | undefined,
  aromaType: 'primary'
): boolean
export function isAromaValidForWineType(
  aromaCategory: SecondaryAromaCategory,
  wineType: WineType | null | undefined,
  aromaType: 'secondary'
): boolean
export function isAromaValidForWineType(
  aromaCategory: TertiaryAromaCategory,
  wineType: WineType | null | undefined,
  aromaType: 'tertiary'
): boolean
export function isAromaValidForWineType(
  aromaCategory: PrimaryAromaCategory | SecondaryAromaCategory | TertiaryAromaCategory,
  wineType: WineType | null | undefined,
  aromaType: 'primary' | 'secondary' | 'tertiary'
): boolean {
  if (aromaType === 'primary') {
    return isPrimaryCategoryVisibleForWineType(aromaCategory as PrimaryAromaCategory, wineType)
  }

  if (aromaType === 'secondary') {
    return isSecondaryCategoryVisibleForWineType(aromaCategory as SecondaryAromaCategory, wineType)
  }

  return isTertiaryCategoryVisibleForWineType(aromaCategory as TertiaryAromaCategory, wineType)
}

export function getColorOptionsForWineType(wineType: 'white'): readonly WhiteWineColor[]
export function getColorOptionsForWineType(wineType: 'rosé'): readonly RoseWineColor[]
export function getColorOptionsForWineType(wineType: 'red'): readonly RedWineColor[]
export function getColorOptionsForWineType(wineType: null | undefined): readonly []
export function getColorOptionsForWineType(wineType: WineType | null | undefined): readonly Color[] {
  return wineType ? COLOR_OPTIONS_BY_WINE_TYPE[wineType] : []
}
