import { describe, expect, it } from 'vitest'

import wsetSatSpec from '../../app/data/wset-sat-spec.json'
import type {
  Acidity,
  Alcohol,
  AppearanceIntensity,
  Body,
  Clarity,
  Finish,
  FlavorIntensity,
  Mousse,
  NoseCondition,
  NoseDevelopment,
  NoseIntensity,
  OtherObservation,
  PrimaryAromaSelections,
  QualityLevel,
  Readiness,
  SecondaryAromaSelections,
  Sweetness,
  Tannin,
  TertiaryAromaSelections,
  WhiteWineColor,
  WineType,
  RoseWineColor,
  RedWineColor
} from '../../app/types/tasting'
import { AROMAS, COLOR_OPTIONS_BY_WINE_TYPE, WINE_TYPE_FILTERS } from '../../app/utils/wineTypeFilters'

type OptionValue<TValue extends string> = TValue | {
  value: TValue
  faultyIndicator?: boolean
}

type SingleSelectField<TValue extends string> = {
  inputType: 'single'
  options: readonly OptionValue<TValue>[]
}

type MultiSelectField<TValue extends string> = {
  inputType: 'multi'
  options: readonly TValue[]
}

type DescriptorOf<TSelections extends Record<string, unknown[]>, TCategory extends Extract<keyof TSelections, string>>
  = TSelections[TCategory] extends Array<infer TDescriptor extends string> ? TDescriptor : never

type AromaCategoriesSpec<TSelections extends Record<string, unknown[]>> = {
  [TCategory in Extract<keyof TSelections, string>]: {
    label: string
    color: `#${string}`
    descriptors: readonly DescriptorOf<TSelections, TCategory>[]
  }
}

type AromaGroupSpec<TSelections extends Record<string, unknown[]>> = {
  label: string
  description: string
  categories: AromaCategoriesSpec<TSelections>
}

type WsetSatSpec = {
  $schema: string
  version: string
  standard: {
    name: string
    issue: string
    copyright: string
  }
  wineTypes: readonly WineType[]
  appearance: {
    clarity: SingleSelectField<Clarity>
    intensity: SingleSelectField<AppearanceIntensity>
    color: {
      inputType: 'single'
      optionsByWineType: {
        white: readonly WhiteWineColor[]
        rosé: readonly RoseWineColor[]
        red: readonly RedWineColor[]
      }
    }
    otherObservations: MultiSelectField<OtherObservation>
  }
  nose: {
    condition: SingleSelectField<NoseCondition>
    intensity: SingleSelectField<NoseIntensity>
    development: SingleSelectField<NoseDevelopment>
    aromas: {
      inputType: 'aromaWheel'
      ref: '#/aromas'
    }
  }
  palate: {
    sweetness: SingleSelectField<Sweetness>
    acidity: SingleSelectField<Acidity>
    tannin: SingleSelectField<Tannin>
    alcohol: SingleSelectField<Alcohol>
    fortified: {
      inputType: 'boolean'
      description: string
    }
    body: SingleSelectField<Body>
    mousse: SingleSelectField<Mousse> & {
      visibleWhen: {
        field: '/appearance/otherObservations'
        includes: readonly OtherObservation[]
      }
    }
    flavorIntensity: SingleSelectField<FlavorIntensity>
    flavors: {
      inputType: 'aromaWheel'
      ref: '#/aromas'
    }
    finish: SingleSelectField<Finish>
  }
  conclusions: {
    qualityLevel: SingleSelectField<QualityLevel>
    readiness: SingleSelectField<Readiness>
  }
  aromas: {
    primary: AromaGroupSpec<PrimaryAromaSelections>
    secondary: AromaGroupSpec<SecondaryAromaSelections>
    tertiary: AromaGroupSpec<TertiaryAromaSelections>
  }
  wineTypeFilters: typeof WINE_TYPE_FILTERS
}

const typedWsetSatSpec: WsetSatSpec = wsetSatSpec

function getOptionValues<TValue extends string>(options: readonly OptionValue<TValue>[]): TValue[] {
  return options.map(option => typeof option === 'string' ? option : option.value)
}

describe('wset SAT spec', () => {
  it('type-checks the JSON spec against the tasting type model', () => {
    expect(typedWsetSatSpec.wineTypes).toEqual(['white', 'rosé', 'red'])
    expect(typedWsetSatSpec.standard.name).toBe('WSET Level 3 Systematic Approach to Tasting Wine®')
    expect(typedWsetSatSpec.nose.aromas.ref).toBe('#/aromas')
    expect(typedWsetSatSpec.palate.flavors.ref).toBe('#/aromas')
  })

  it('keeps scalar field options aligned with the tasting unions', () => {
    expect(typedWsetSatSpec.appearance.clarity.options).toEqual([
      { value: 'clear' },
      { value: 'hazy', faultyIndicator: true }
    ])
    expect(getOptionValues(typedWsetSatSpec.appearance.intensity.options)).toEqual(['pale', 'medium', 'deep'])
    expect(typedWsetSatSpec.appearance.otherObservations.options).toEqual(['legs/tears', 'deposit', 'pétillance', 'bubbles'])

    expect(typedWsetSatSpec.nose.condition.options).toEqual([
      { value: 'clean' },
      { value: 'unclean', faultyIndicator: true }
    ])
    expect(getOptionValues(typedWsetSatSpec.nose.intensity.options)).toEqual(['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced'])
    expect(getOptionValues(typedWsetSatSpec.nose.development.options)).toEqual(['youthful', 'developing', 'fully developed', 'tired/past its best'])

    expect(getOptionValues(typedWsetSatSpec.palate.sweetness.options)).toEqual(['dry', 'off-dry', 'medium-dry', 'medium-sweet', 'sweet', 'luscious'])
    expect(getOptionValues(typedWsetSatSpec.palate.acidity.options)).toEqual(['low', 'medium(-)', 'medium', 'medium(+)', 'high'])
    expect(getOptionValues(typedWsetSatSpec.palate.tannin.options)).toEqual(['low', 'medium(-)', 'medium', 'medium(+)', 'high'])
    expect(getOptionValues(typedWsetSatSpec.palate.alcohol.options)).toEqual(['low', 'medium', 'high'])
    expect(getOptionValues(typedWsetSatSpec.palate.body.options)).toEqual(['light', 'medium(-)', 'medium', 'medium(+)', 'full'])
    expect(getOptionValues(typedWsetSatSpec.palate.mousse.options)).toEqual(['delicate', 'creamy', 'aggressive'])
    expect(getOptionValues(typedWsetSatSpec.palate.flavorIntensity.options)).toEqual(['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced'])
    expect(getOptionValues(typedWsetSatSpec.palate.finish.options)).toEqual(['short', 'medium(-)', 'medium', 'medium(+)', 'long'])

    expect(getOptionValues(typedWsetSatSpec.conclusions.qualityLevel.options)).toEqual(['faulty', 'poor', 'acceptable', 'good', 'very good', 'outstanding'])
    expect(getOptionValues(typedWsetSatSpec.conclusions.readiness.options)).toEqual([
      'too young',
      'can drink now, but has potential for ageing',
      'drink now: not suitable for ageing or further ageing',
      'too old'
    ])
  })

  it('matches the canonical aroma taxonomy, filters and color options', () => {
    expect(typedWsetSatSpec.appearance.color.optionsByWineType).toEqual(COLOR_OPTIONS_BY_WINE_TYPE)
    expect(typedWsetSatSpec.palate.mousse.visibleWhen).toEqual({
      field: '/appearance/otherObservations',
      includes: ['bubbles', 'pétillance']
    })

    expect(typedWsetSatSpec.aromas.primary.categories).toEqual(AROMAS.primary)
    expect(typedWsetSatSpec.aromas.secondary.categories).toEqual(AROMAS.secondary)
    expect(typedWsetSatSpec.aromas.tertiary.categories).toEqual(AROMAS.tertiary)
    expect(typedWsetSatSpec.wineTypeFilters).toEqual(WINE_TYPE_FILTERS)
  })
})
