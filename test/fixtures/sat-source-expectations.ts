import type { TastingSectionId } from '../../app/domain/sat/types'

export interface SatFieldSourceExpectation {
  id: string
  /** Approved option IDs for the field; empty for free-text (`text-list`) fields. */
  optionIds: string[]
}

export interface SatSectionSourceExpectation {
  id: TastingSectionId
  order: number
  fields: SatFieldSourceExpectation[]
}

export interface SatSourceExpectations {
  schemaVersion: 1
  sections: SatSectionSourceExpectation[]
  totalOptionCount: number
}

/**
 * Independent, golden expectation of the canonical SAT v1 data set, derived from
 * the approved Appearance/Nose/Palate/Conclusions terms. It lists the exact
 * option IDs each field must offer rather than a copy of the data, so comparing
 * the registry against it detects an omitted, substituted, duplicated, renamed,
 * or mis-filed term — any drift invisible to a plain option count.
 */
export const SAT_SOURCE_EXPECTATIONS: SatSourceExpectations = {
  schemaVersion: 1,
  sections: [
    {
      id: 'appearance',
      order: 1,
      fields: [
        {
          id: 'appearance.clarity',
          optionIds: ['appearance.clarity.clear', 'appearance.clarity.hazy'],
        },
        {
          id: 'appearance.intensity',
          optionIds: [
            'appearance.intensity.pale',
            'appearance.intensity.medium',
            'appearance.intensity.deep',
          ],
        },
        {
          id: 'appearance.colour',
          optionIds: [
            'appearance.colour.lemon-green',
            'appearance.colour.lemon',
            'appearance.colour.gold',
            'appearance.colour.amber',
            'appearance.colour.brown',
            'appearance.colour.pink',
            'appearance.colour.salmon',
            'appearance.colour.orange',
            'appearance.colour.purple',
            'appearance.colour.ruby',
            'appearance.colour.garnet',
            'appearance.colour.tawny',
          ],
        },
        {
          id: 'appearance.other-observations',
          optionIds: [],
        },
      ],
    },
    {
      id: 'nose',
      order: 2,
      fields: [
        {
          id: 'nose.condition',
          optionIds: ['nose.condition.clean', 'nose.condition.unclean'],
        },
        {
          id: 'nose.faults',
          optionIds: [
            'nose.faults.cork-taint',
            'nose.faults.oxidised',
            'nose.faults.volatile-acidity',
            'nose.faults.reduction',
            'nose.faults.brettanomyces',
            'nose.faults.sulphur-dioxide',
          ],
        },
        {
          id: 'nose.intensity',
          optionIds: [
            'nose.intensity.light',
            'nose.intensity.medium-minus',
            'nose.intensity.medium',
            'nose.intensity.medium-plus',
            'nose.intensity.pronounced',
          ],
        },
        {
          id: 'nose.development',
          optionIds: [
            'nose.development.youthful',
            'nose.development.developing',
            'nose.development.fully-developed',
            'nose.development.tired',
          ],
        },
        {
          id: 'nose.other-aromas',
          optionIds: [],
        },
      ],
    },
    {
      id: 'palate',
      order: 3,
      fields: [
        {
          id: 'palate.sweetness',
          optionIds: [
            'palate.sweetness.dry',
            'palate.sweetness.off-dry',
            'palate.sweetness.medium-dry',
            'palate.sweetness.medium-sweet',
            'palate.sweetness.sweet',
            'palate.sweetness.luscious',
          ],
        },
        {
          id: 'palate.acidity',
          optionIds: [
            'palate.acidity.low',
            'palate.acidity.medium-minus',
            'palate.acidity.medium',
            'palate.acidity.medium-plus',
            'palate.acidity.high',
          ],
        },
        {
          id: 'palate.tannin',
          optionIds: [
            'palate.tannin.low',
            'palate.tannin.medium-minus',
            'palate.tannin.medium',
            'palate.tannin.medium-plus',
            'palate.tannin.high',
          ],
        },
        {
          id: 'palate.alcohol',
          optionIds: [
            'palate.alcohol.low',
            'palate.alcohol.medium',
            'palate.alcohol.high',
          ],
        },
        {
          id: 'palate.body',
          optionIds: [
            'palate.body.light',
            'palate.body.medium-minus',
            'palate.body.medium',
            'palate.body.medium-plus',
            'palate.body.full',
          ],
        },
        {
          id: 'palate.mousse',
          optionIds: [
            'palate.mousse.delicate',
            'palate.mousse.creamy',
            'palate.mousse.aggressive',
          ],
        },
        {
          id: 'palate.flavour-intensity',
          optionIds: [
            'palate.flavour-intensity.light',
            'palate.flavour-intensity.medium-minus',
            'palate.flavour-intensity.medium',
            'palate.flavour-intensity.medium-plus',
            'palate.flavour-intensity.pronounced',
          ],
        },
        {
          id: 'palate.other-flavours',
          optionIds: [],
        },
        {
          id: 'palate.finish',
          optionIds: [
            'palate.finish.short',
            'palate.finish.medium-minus',
            'palate.finish.medium',
            'palate.finish.medium-plus',
            'palate.finish.long',
          ],
        },
      ],
    },
    {
      id: 'conclusions',
      order: 4,
      fields: [
        {
          id: 'conclusions.quality',
          optionIds: [
            'conclusions.quality.faulty',
            'conclusions.quality.poor',
            'conclusions.quality.acceptable',
            'conclusions.quality.good',
            'conclusions.quality.very-good',
            'conclusions.quality.outstanding',
          ],
        },
        {
          id: 'conclusions.readiness',
          optionIds: [
            'conclusions.readiness.too-young',
            'conclusions.readiness.can-drink-now-but-has-potential-for-ageing',
            'conclusions.readiness.drink-now-not-suitable-for-ageing',
            'conclusions.readiness.too-old',
          ],
        },
      ],
    },
  ],
  totalOptionCount: 81,
}
