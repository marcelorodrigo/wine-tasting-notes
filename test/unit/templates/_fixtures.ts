import type { AppearanceData, AromaObject, ConclusionsData, NoseData, PalateData } from '../../../app/types/tasting'

export function emptyAromas(): AromaObject {
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
    secondary: { yeast: [], malolacticConversion: [], oak: [] },
    tertiary: {
      deliberateOxidation: [],
      fruitDevelopmentWhite: [],
      fruitDevelopmentRed: [],
      bottleAgeWhite: [],
      bottleAgeRed: []
    }
  }
}

/** Primary floral + greenFruit, secondary yeast */
export function sampleAromas(): AromaObject {
  const aromas = emptyAromas()
  aromas.primary.floral = ['acacia', 'violet']
  aromas.primary.greenFruit = ['gooseberry']
  aromas.secondary.yeast = ['bread']
  return aromas
}

/** Primary greenFruit, secondary oak */
export function sampleFlavors(): AromaObject {
  const flavors = emptyAromas()
  flavors.primary.greenFruit = ['gooseberry']
  flavors.secondary.oak = ['vanilla']
  return flavors
}

/** Single primary aroma only */
export function singleAroma(): AromaObject {
  const aromas = emptyAromas()
  aromas.primary.floral = ['acacia']
  return aromas
}

export function emptyAppearance(): AppearanceData {
  return { wineType: null, clarity: null, intensity: null, color: null, otherObservations: null }
}

export function fullAppearance(): AppearanceData {
  return { wineType: 'white', clarity: 'clear', intensity: 'pale', color: 'lemon', otherObservations: ['legs/tears', 'bubbles'] }
}

export function emptyNose(): NoseData {
  return { condition: null, intensity: null, development: null, aromas: null }
}

export function fullNose(): NoseData {
  return { condition: 'clean', intensity: 'medium(+)', development: 'developing', aromas: sampleAromas() }
}

export function emptyPalate(): PalateData {
  return {
    sweetness: null,
    acidity: null,
    tannin: null,
    alcohol: null,
    fortified: null,
    body: null,
    mousse: null,
    flavorIntensity: null,
    flavors: null,
    finish: null
  }
}

export function fullPalate(): PalateData {
  return {
    sweetness: 'dry',
    acidity: 'high',
    tannin: 'medium',
    alcohol: 'high',
    fortified: null,
    body: 'medium',
    mousse: 'delicate',
    flavorIntensity: 'medium(+)',
    flavors: sampleFlavors(),
    finish: 'medium(+)'
  }
}

export function emptyConclusions(): ConclusionsData {
  return { qualityLevel: null, readiness: null }
}

export function fullConclusions(): ConclusionsData {
  return { qualityLevel: 'good', readiness: 'can drink now, but has potential for ageing' }
}
