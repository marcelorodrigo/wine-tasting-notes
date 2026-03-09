import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  AromaObject,
  AppearanceData,
  Body,
  BottleAgeRedDescriptor,
  Color,
  ConclusionsData,
  FloralDescriptor,
  NoseData,
  OakDescriptor,
  PalateData,
  TastingData,
  WineType
} from '../../app/types/tasting'
import type { ProfileType } from '../../app/types/profiles'

const aromaSelections: AromaObject = {
  primary: {
    floral: ['rose'],
    greenFruit: ['apple'],
    citrusFruit: ['lemon'],
    stoneFruit: ['peach'],
    tropicalFruit: ['pineapple'],
    redFruit: ['strawberry'],
    blackFruit: ['blackberry'],
    driedCookedFruit: ['fig'],
    herbaceous: ['grass'],
    herbal: ['mint'],
    pungentSpice: ['liquorice'],
    other: ['flint']
  },
  secondary: {
    yeast: ['bread'],
    malolacticConversion: ['butter'],
    oak: ['vanilla']
  },
  tertiary: {
    deliberateOxidation: ['almond'],
    fruitDevelopmentWhite: ['dried apricot'],
    fruitDevelopmentRed: ['tar'],
    bottleAgeWhite: ['petrol'],
    bottleAgeRed: ['tobacco']
  }
}

const tastingData: TastingData = {
  appearance: {
    wineType: 'rosé',
    clarity: 'clear',
    intensity: 'deep',
    color: 'salmon',
    otherObservations: ['bubbles']
  },
  nose: {
    condition: 'clean',
    intensity: 'medium(+)',
    development: 'developing',
    aromas: aromaSelections
  },
  palate: {
    sweetness: 'dry',
    acidity: 'high',
    tannin: null,
    alcohol: 'medium',
    fortified: false,
    body: 'medium(+)',
    mousse: 'creamy',
    flavorIntensity: 'pronounced',
    flavors: aromaSelections,
    finish: 'long'
  },
  conclusions: {
    qualityLevel: 'very good',
    readiness: 'can drink now, but has potential for ageing'
  }
}

describe('tasting data types', () => {
  it('supports a fully typed tasting data object with nullable fields', () => {
    expect(tastingData.appearance.wineType).toBe('rosé')
    expect(tastingData.palate.tannin).toBeNull()

    expectTypeOf<TastingData>().toEqualTypeOf<{
      appearance: AppearanceData
      nose: NoseData
      palate: PalateData
      conclusions: ConclusionsData
    }>()
    expectTypeOf<AppearanceData['wineType']>().toEqualTypeOf<WineType | null>()
    expectTypeOf<AppearanceData['color']>().toEqualTypeOf<Color | null>()
    expectTypeOf<PalateData['body']>().toEqualTypeOf<Body | null>()
  })

  it('keeps aroma selections aligned with their descriptor categories', () => {
    expect(aromaSelections.secondary.oak).toContain('vanilla')
    expect(aromaSelections.tertiary.bottleAgeRed).toContain('tobacco')

    expectTypeOf<AromaObject['primary']['floral']>().toEqualTypeOf<FloralDescriptor[]>()
    expectTypeOf<AromaObject['secondary']['oak']>().toEqualTypeOf<OakDescriptor[]>()
    expectTypeOf<AromaObject['tertiary']['bottleAgeRed']>().toEqualTypeOf<BottleAgeRedDescriptor[]>()
  })

  it('defines the four supported output profiles', () => {
    const profile: ProfileType = 'playful'

    expect(profile).toBe('playful')
    expectTypeOf<ProfileType>().toEqualTypeOf<'professional' | 'casual' | 'bartalk' | 'playful'>()
  })
})
