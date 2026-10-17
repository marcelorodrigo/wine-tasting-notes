import type { AromaNode } from '../../../domain/sat/types'

interface AromaCategorySeed {
  readonly slug: string
  readonly descriptors: readonly string[]
}

interface AromaFamilySeed {
  readonly slug: string
  readonly categories: readonly AromaCategorySeed[]
}

function colourTokenFor(slug: string): string {
  return `--color-aroma-${slug}`
}

function familyLabelKey(slug: string): string {
  return `sat.aromas.families.${slug}`
}

function categoryLabelKey(slug: string): string {
  return `sat.aromas.categories.${slug}`
}

function descriptorLabelKey(categorySlug: string, slug: string): string {
  return `sat.aromas.descriptors.${categorySlug}.${slug}`
}

function buildAromaNodes(families: readonly AromaFamilySeed[]): AromaNode[] {
  return families.flatMap((family, familyIndex) => {
    const familyId = `aroma.${family.slug}`
    const familyColour = colourTokenFor(family.slug)
    const nodes: AromaNode[] = [
      {
        id: familyId,
        parentId: null,
        kind: 'family',
        selectable: false,
        labelKey: familyLabelKey(family.slug),
        order: familyIndex + 1,
        colourToken: familyColour,
      },
    ]

    family.categories.forEach((category, categoryIndex) => {
      const categoryId = `${familyId}.${category.slug}`
      const categoryColour = colourTokenFor(category.slug)
      nodes.push({
        id: categoryId,
        parentId: familyId,
        kind: 'category',
        selectable: false,
        labelKey: categoryLabelKey(category.slug),
        order: categoryIndex + 1,
        colourToken: categoryColour,
      })

      category.descriptors.forEach((descriptor, descriptorIndex) => {
        nodes.push({
          id: `${categoryId}.${descriptor}`,
          parentId: categoryId,
          kind: 'descriptor',
          selectable: true,
          labelKey: descriptorLabelKey(category.slug, descriptor),
          order: descriptorIndex + 1,
          colourToken: categoryColour,
        })
      })
    })

    return nodes
  })
}

/**
 * Source terms grouped by the WSET Level 3 Systematic Approach to Tasting
 * structure: Primary (grape and alcoholic fermentation), Secondary
 * (post-fermentation winemaking) and Tertiary (maturation). The wording is a
 * project draft pending a recorded source edition (see
 * docs/legal/wset-attribution.md); ids are stable and carry no wording.
 */
const AROMA_FAMILIES: readonly AromaFamilySeed[] = [
  {
    slug: 'primary',
    categories: [
      {
        slug: 'floral',
        descriptors: [
          'acacia',
          'honeysuckle',
          'chamomile',
          'elderflower',
          'geranium',
          'blossom',
          'rose',
          'violet',
        ],
      },
      {
        slug: 'green-fruit',
        descriptors: ['apple', 'gooseberry', 'pear', 'pear-drop', 'quince', 'grape'],
      },
      {
        slug: 'citrus-fruit',
        descriptors: ['grapefruit', 'lemon', 'lime', 'orange-peel', 'lemon-peel'],
      },
      {
        slug: 'stone-fruit',
        descriptors: ['peach', 'apricot', 'nectarine'],
      },
      {
        slug: 'tropical-fruit',
        descriptors: ['banana', 'lychee', 'mango', 'melon', 'passion-fruit', 'pineapple'],
      },
      {
        slug: 'red-fruit',
        descriptors: [
          'redcurrant',
          'cranberry',
          'raspberry',
          'strawberry',
          'red-cherry',
          'red-plum',
        ],
      },
      {
        slug: 'black-fruit',
        descriptors: [
          'blackcurrant',
          'blackberry',
          'bramble',
          'blueberry',
          'black-cherry',
          'black-plum',
        ],
      },
      {
        slug: 'dried-fruit',
        descriptors: [
          'fig',
          'prune',
          'raisin',
          'sultana',
          'kirsch',
          'jamminess',
          'baked-stewed-fruits',
          'preserved-fruits',
        ],
      },
      {
        slug: 'herbaceous',
        descriptors: [
          'green-bell-pepper',
          'grass',
          'tomato-leaf',
          'asparagus',
          'blackcurrant-leaf',
        ],
      },
      {
        slug: 'herbal',
        descriptors: ['eucalyptus', 'mint', 'medicinal', 'lavender', 'fennel', 'dill'],
      },
      {
        slug: 'pungent-spice',
        descriptors: ['black-white-pepper', 'liquorice'],
      },
      {
        slug: 'other',
        descriptors: ['flint', 'wet-stones', 'wet-wool'],
      },
    ],
  },
  {
    slug: 'secondary',
    categories: [
      {
        slug: 'yeast',
        descriptors: [
          'biscuit',
          'bread',
          'toast',
          'pastry',
          'brioche',
          'bread-dough',
          'cheese',
        ],
      },
      {
        slug: 'malolactic',
        descriptors: ['butter', 'cheese', 'cream'],
      },
      {
        slug: 'oak',
        descriptors: [
          'vanilla',
          'cloves',
          'nutmeg',
          'coconut',
          'butterscotch',
          'toast',
          'cedar',
          'charred-wood',
          'smoke',
          'chocolate',
          'coffee',
          'resinous',
        ],
      },
    ],
  },
  {
    slug: 'tertiary',
    categories: [
      {
        slug: 'deliberate-oxidation',
        descriptors: [
          'almond',
          'marzipan',
          'hazelnut',
          'walnut',
          'chocolate',
          'coffee',
          'toffee',
          'caramel',
        ],
      },
      {
        slug: 'fruit-development-white',
        descriptors: ['dried-apricot', 'marmalade', 'dried-apple', 'dried-banana'],
      },
      {
        slug: 'fruit-development-red',
        descriptors: [
          'fig',
          'prune',
          'tar',
          'dried-blackberry',
          'dried-cranberry',
          'cooked-blackberry',
          'cooked-red-plum',
        ],
      },
      {
        slug: 'bottle-age-white',
        descriptors: [
          'petrol',
          'kerosene',
          'cinnamon',
          'ginger',
          'nutmeg',
          'toast',
          'nutty',
          'mushroom',
          'hay',
          'honey',
        ],
      },
      {
        slug: 'bottle-age-red',
        descriptors: [
          'leather',
          'forest-floor',
          'earth',
          'mushroom',
          'game',
          'tobacco',
          'vegetal',
          'wet-leaves',
          'savoury',
          'meaty',
          'farmyard',
        ],
      },
    ],
  },
]

/**
 * Canonical, versioned aroma and flavour taxonomy. The single ordered hierarchy
 * is shared by nose aromas and palate flavours: families and categories are
 * navigation-only, descriptors are selectable.
 */
export const satV1Aromas: AromaNode[] = buildAromaNodes(AROMA_FAMILIES)
