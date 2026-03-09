import { ref } from 'vue'
import type {
  AromaObject,
  PrimaryAromaCategory,
  SecondaryAromaCategory,
  TastingData,
  TertiaryAromaCategory,
  WineType
} from '../types/tasting'
import { isAromaValidForWineType } from '../utils/wineTypeFilters'

export type RemovedAromaEntry = {
  field: 'aromas' | 'flavors'
  aromaType: 'primary' | 'secondary' | 'tertiary'
  category: string
  descriptors: string[]
}

export type DataInconsistency = {
  field: 'aromas' | 'flavors'
  aromaType: 'primary' | 'secondary' | 'tertiary'
  category: string
  descriptors: string[]
}

function createInitialAromaObject(): AromaObject {
  return {
    primary: {
      floral: [],
      greenFruit: [],
      citrusFruit: [],
      stoneFruit: [],
      tropicalFruit: [],
      redFruit: [],
      blackFruit: [],
      driedCookedFruit: [],
      herbaceous: [],
      herbal: [],
      pungentSpice: [],
      other: []
    },
    secondary: {
      yeast: [],
      malolacticConversion: [],
      oak: []
    },
    tertiary: {
      deliberateOxidation: [],
      fruitDevelopmentWhite: [],
      fruitDevelopmentRed: [],
      bottleAgeWhite: [],
      bottleAgeRed: []
    }
  }
}

function createInitialTastingData(): TastingData {
  return {
    appearance: {
      wineType: null,
      clarity: null,
      intensity: null,
      color: null,
      otherObservations: []
    },
    nose: {
      condition: null,
      intensity: null,
      development: null,
      aromas: createInitialAromaObject()
    },
    palate: {
      sweetness: null,
      acidity: null,
      tannin: null,
      alcohol: null,
      fortified: null,
      body: null,
      mousse: null,
      flavorIntensity: null,
      flavors: createInitialAromaObject(),
      finish: null
    },
    conclusions: {
      qualityLevel: null,
      readiness: null
    }
  }
}

function collectAndClearInvalidAromas(
  aromaObj: AromaObject,
  newWineType: WineType | null,
  fieldName: 'aromas' | 'flavors'
): RemovedAromaEntry[] {
  const removed: RemovedAromaEntry[] = []
  const primary = aromaObj.primary as Record<PrimaryAromaCategory, string[]>
  const secondary = aromaObj.secondary as Record<SecondaryAromaCategory, string[]>
  const tertiary = aromaObj.tertiary as Record<TertiaryAromaCategory, string[]>

  for (const category of Object.keys(aromaObj.primary) as PrimaryAromaCategory[]) {
    const arr = primary[category]
    if (arr.length > 0 && !isAromaValidForWineType(category, newWineType, 'primary')) {
      removed.push({ field: fieldName, aromaType: 'primary', category, descriptors: [...arr] })
      arr.splice(0)
    }
  }

  for (const category of Object.keys(aromaObj.secondary) as SecondaryAromaCategory[]) {
    const arr = secondary[category]
    if (arr.length > 0 && !isAromaValidForWineType(category, newWineType, 'secondary')) {
      removed.push({ field: fieldName, aromaType: 'secondary', category, descriptors: [...arr] })
      arr.splice(0)
    }
  }

  for (const category of Object.keys(aromaObj.tertiary) as TertiaryAromaCategory[]) {
    const arr = tertiary[category]
    if (arr.length > 0 && !isAromaValidForWineType(category, newWineType, 'tertiary')) {
      removed.push({ field: fieldName, aromaType: 'tertiary', category, descriptors: [...arr] })
      arr.splice(0)
    }
  }

  return removed
}

function findAromaInconsistencies(
  aromaObj: AromaObject,
  wineType: WineType | null,
  fieldName: 'aromas' | 'flavors'
): DataInconsistency[] {
  const inconsistencies: DataInconsistency[] = []
  const primary = aromaObj.primary as Record<PrimaryAromaCategory, string[]>
  const secondary = aromaObj.secondary as Record<SecondaryAromaCategory, string[]>
  const tertiary = aromaObj.tertiary as Record<TertiaryAromaCategory, string[]>

  for (const category of Object.keys(aromaObj.primary) as PrimaryAromaCategory[]) {
    const arr = primary[category]
    if (arr.length > 0 && !isAromaValidForWineType(category, wineType, 'primary')) {
      inconsistencies.push({ field: fieldName, aromaType: 'primary', category, descriptors: [...arr] })
    }
  }

  for (const category of Object.keys(aromaObj.secondary) as SecondaryAromaCategory[]) {
    const arr = secondary[category]
    if (arr.length > 0 && !isAromaValidForWineType(category, wineType, 'secondary')) {
      inconsistencies.push({ field: fieldName, aromaType: 'secondary', category, descriptors: [...arr] })
    }
  }

  for (const category of Object.keys(aromaObj.tertiary) as TertiaryAromaCategory[]) {
    const arr = tertiary[category]
    if (arr.length > 0 && !isAromaValidForWineType(category, wineType, 'tertiary')) {
      inconsistencies.push({ field: fieldName, aromaType: 'tertiary', category, descriptors: [...arr] })
    }
  }

  return inconsistencies
}

const tastingData = ref<TastingData>(createInitialTastingData())

export function useTastingData() {
  function resetTastingData(): void {
    tastingData.value = createInitialTastingData()
  }

  function handleWineTypeChange(newType: WineType | null, _oldType?: WineType | null): RemovedAromaEntry[] {
    tastingData.value.appearance.color = null
    const removed: RemovedAromaEntry[] = []

    const aromas = tastingData.value.nose.aromas
    if (aromas) {
      removed.push(...collectAndClearInvalidAromas(aromas, newType, 'aromas'))
    }

    const flavors = tastingData.value.palate.flavors
    if (flavors) {
      removed.push(...collectAndClearInvalidAromas(flavors, newType, 'flavors'))
    }

    return removed
  }

  function validateDataConsistency(): DataInconsistency[] {
    const wineType = tastingData.value.appearance.wineType
    const inconsistencies: DataInconsistency[] = []

    const aromas = tastingData.value.nose.aromas
    if (aromas) {
      inconsistencies.push(...findAromaInconsistencies(aromas, wineType, 'aromas'))
    }

    const flavors = tastingData.value.palate.flavors
    if (flavors) {
      inconsistencies.push(...findAromaInconsistencies(flavors, wineType, 'flavors'))
    }

    return inconsistencies
  }

  return {
    tastingData,
    resetTastingData,
    handleWineTypeChange,
    validateDataConsistency
  }
}
