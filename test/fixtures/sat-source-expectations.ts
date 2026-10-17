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

export interface AromaCategorySourceExpectation {
  id: string
  /** Approved descriptor IDs for the category, in source order. */
  descriptors: string[]
}

export interface AromaFamilySourceExpectation {
  id: string
  categories: AromaCategorySourceExpectation[]
}

export interface SatAromaSourceExpectations {
  families: AromaFamilySourceExpectation[]
  totalFamilyCount: number
  totalCategoryCount: number
  totalDescriptorCount: number
}

export interface SatSourceExpectations {
  schemaVersion: 1
  sections: SatSectionSourceExpectation[]
  totalOptionCount: number
  aromas: SatAromaSourceExpectations
}

/**
 * Independent, golden expectation of the canonical SAT v1 data set, derived from
 * the approved Appearance/Nose/Palate/Conclusions terms and the approved aroma
 * and flavour taxonomy. It lists the exact option IDs each field must offer and
 * the exact family/category/descriptor IDs of the aroma tree rather than a copy
 * of the data, so comparing the registry against it detects an omitted,
 * substituted, duplicated, renamed, or mis-filed term — any drift invisible to a
 * plain count.
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
  aromas: {
    families: [
      {
        id: 'aroma.primary',
        categories: [
          {
            id: 'aroma.primary.floral',
            descriptors: [
              'aroma.primary.floral.acacia',
              'aroma.primary.floral.honeysuckle',
              'aroma.primary.floral.chamomile',
              'aroma.primary.floral.elderflower',
              'aroma.primary.floral.geranium',
              'aroma.primary.floral.blossom',
              'aroma.primary.floral.rose',
              'aroma.primary.floral.violet',
            ],
          },
          {
            id: 'aroma.primary.green-fruit',
            descriptors: [
              'aroma.primary.green-fruit.apple',
              'aroma.primary.green-fruit.gooseberry',
              'aroma.primary.green-fruit.pear',
              'aroma.primary.green-fruit.pear-drop',
              'aroma.primary.green-fruit.quince',
              'aroma.primary.green-fruit.grape',
            ],
          },
          {
            id: 'aroma.primary.citrus-fruit',
            descriptors: [
              'aroma.primary.citrus-fruit.grapefruit',
              'aroma.primary.citrus-fruit.lemon',
              'aroma.primary.citrus-fruit.lime',
              'aroma.primary.citrus-fruit.orange-peel',
              'aroma.primary.citrus-fruit.lemon-peel',
            ],
          },
          {
            id: 'aroma.primary.stone-fruit',
            descriptors: [
              'aroma.primary.stone-fruit.peach',
              'aroma.primary.stone-fruit.apricot',
              'aroma.primary.stone-fruit.nectarine',
            ],
          },
          {
            id: 'aroma.primary.tropical-fruit',
            descriptors: [
              'aroma.primary.tropical-fruit.banana',
              'aroma.primary.tropical-fruit.lychee',
              'aroma.primary.tropical-fruit.mango',
              'aroma.primary.tropical-fruit.melon',
              'aroma.primary.tropical-fruit.passion-fruit',
              'aroma.primary.tropical-fruit.pineapple',
            ],
          },
          {
            id: 'aroma.primary.red-fruit',
            descriptors: [
              'aroma.primary.red-fruit.redcurrant',
              'aroma.primary.red-fruit.cranberry',
              'aroma.primary.red-fruit.raspberry',
              'aroma.primary.red-fruit.strawberry',
              'aroma.primary.red-fruit.red-cherry',
              'aroma.primary.red-fruit.red-plum',
            ],
          },
          {
            id: 'aroma.primary.black-fruit',
            descriptors: [
              'aroma.primary.black-fruit.blackcurrant',
              'aroma.primary.black-fruit.blackberry',
              'aroma.primary.black-fruit.bramble',
              'aroma.primary.black-fruit.blueberry',
              'aroma.primary.black-fruit.black-cherry',
              'aroma.primary.black-fruit.black-plum',
            ],
          },
          {
            id: 'aroma.primary.dried-fruit',
            descriptors: [
              'aroma.primary.dried-fruit.fig',
              'aroma.primary.dried-fruit.prune',
              'aroma.primary.dried-fruit.raisin',
              'aroma.primary.dried-fruit.sultana',
              'aroma.primary.dried-fruit.kirsch',
              'aroma.primary.dried-fruit.jamminess',
              'aroma.primary.dried-fruit.baked-stewed-fruits',
              'aroma.primary.dried-fruit.preserved-fruits',
            ],
          },
          {
            id: 'aroma.primary.herbaceous',
            descriptors: [
              'aroma.primary.herbaceous.green-bell-pepper',
              'aroma.primary.herbaceous.grass',
              'aroma.primary.herbaceous.tomato-leaf',
              'aroma.primary.herbaceous.asparagus',
              'aroma.primary.herbaceous.blackcurrant-leaf',
            ],
          },
          {
            id: 'aroma.primary.herbal',
            descriptors: [
              'aroma.primary.herbal.eucalyptus',
              'aroma.primary.herbal.mint',
              'aroma.primary.herbal.medicinal',
              'aroma.primary.herbal.lavender',
              'aroma.primary.herbal.fennel',
              'aroma.primary.herbal.dill',
            ],
          },
          {
            id: 'aroma.primary.pungent-spice',
            descriptors: [
              'aroma.primary.pungent-spice.black-white-pepper',
              'aroma.primary.pungent-spice.liquorice',
            ],
          },
          {
            id: 'aroma.primary.other',
            descriptors: [
              'aroma.primary.other.flint',
              'aroma.primary.other.wet-stones',
              'aroma.primary.other.wet-wool',
            ],
          },
        ],
      },
      {
        id: 'aroma.secondary',
        categories: [
          {
            id: 'aroma.secondary.yeast',
            descriptors: [
              'aroma.secondary.yeast.biscuit',
              'aroma.secondary.yeast.bread',
              'aroma.secondary.yeast.toast',
              'aroma.secondary.yeast.pastry',
              'aroma.secondary.yeast.brioche',
              'aroma.secondary.yeast.bread-dough',
              'aroma.secondary.yeast.cheese',
            ],
          },
          {
            id: 'aroma.secondary.malolactic',
            descriptors: [
              'aroma.secondary.malolactic.butter',
              'aroma.secondary.malolactic.cheese',
              'aroma.secondary.malolactic.cream',
            ],
          },
          {
            id: 'aroma.secondary.oak',
            descriptors: [
              'aroma.secondary.oak.vanilla',
              'aroma.secondary.oak.cloves',
              'aroma.secondary.oak.nutmeg',
              'aroma.secondary.oak.coconut',
              'aroma.secondary.oak.butterscotch',
              'aroma.secondary.oak.toast',
              'aroma.secondary.oak.cedar',
              'aroma.secondary.oak.charred-wood',
              'aroma.secondary.oak.smoke',
              'aroma.secondary.oak.chocolate',
              'aroma.secondary.oak.coffee',
              'aroma.secondary.oak.resinous',
            ],
          },
        ],
      },
      {
        id: 'aroma.tertiary',
        categories: [
          {
            id: 'aroma.tertiary.deliberate-oxidation',
            descriptors: [
              'aroma.tertiary.deliberate-oxidation.almond',
              'aroma.tertiary.deliberate-oxidation.marzipan',
              'aroma.tertiary.deliberate-oxidation.hazelnut',
              'aroma.tertiary.deliberate-oxidation.walnut',
              'aroma.tertiary.deliberate-oxidation.chocolate',
              'aroma.tertiary.deliberate-oxidation.coffee',
              'aroma.tertiary.deliberate-oxidation.toffee',
              'aroma.tertiary.deliberate-oxidation.caramel',
            ],
          },
          {
            id: 'aroma.tertiary.fruit-development-white',
            descriptors: [
              'aroma.tertiary.fruit-development-white.dried-apricot',
              'aroma.tertiary.fruit-development-white.marmalade',
              'aroma.tertiary.fruit-development-white.dried-apple',
              'aroma.tertiary.fruit-development-white.dried-banana',
            ],
          },
          {
            id: 'aroma.tertiary.fruit-development-red',
            descriptors: [
              'aroma.tertiary.fruit-development-red.fig',
              'aroma.tertiary.fruit-development-red.prune',
              'aroma.tertiary.fruit-development-red.tar',
              'aroma.tertiary.fruit-development-red.dried-blackberry',
              'aroma.tertiary.fruit-development-red.dried-cranberry',
              'aroma.tertiary.fruit-development-red.cooked-blackberry',
              'aroma.tertiary.fruit-development-red.cooked-red-plum',
            ],
          },
          {
            id: 'aroma.tertiary.bottle-age-white',
            descriptors: [
              'aroma.tertiary.bottle-age-white.petrol',
              'aroma.tertiary.bottle-age-white.kerosene',
              'aroma.tertiary.bottle-age-white.cinnamon',
              'aroma.tertiary.bottle-age-white.ginger',
              'aroma.tertiary.bottle-age-white.nutmeg',
              'aroma.tertiary.bottle-age-white.toast',
              'aroma.tertiary.bottle-age-white.nutty',
              'aroma.tertiary.bottle-age-white.mushroom',
              'aroma.tertiary.bottle-age-white.hay',
              'aroma.tertiary.bottle-age-white.honey',
            ],
          },
          {
            id: 'aroma.tertiary.bottle-age-red',
            descriptors: [
              'aroma.tertiary.bottle-age-red.leather',
              'aroma.tertiary.bottle-age-red.forest-floor',
              'aroma.tertiary.bottle-age-red.earth',
              'aroma.tertiary.bottle-age-red.mushroom',
              'aroma.tertiary.bottle-age-red.game',
              'aroma.tertiary.bottle-age-red.tobacco',
              'aroma.tertiary.bottle-age-red.vegetal',
              'aroma.tertiary.bottle-age-red.wet-leaves',
              'aroma.tertiary.bottle-age-red.savoury',
              'aroma.tertiary.bottle-age-red.meaty',
              'aroma.tertiary.bottle-age-red.farmyard',
            ],
          },
        ],
      },
    ],
    totalFamilyCount: 3,
    totalCategoryCount: 20,
    totalDescriptorCount: 126,
  },
}
