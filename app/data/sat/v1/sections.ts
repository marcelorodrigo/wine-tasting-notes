import type {
  SatControl,
  SatFieldDefinition,
  SatSectionDefinition,
  TastingSectionId,
} from '../../../domain/sat/types'
import { satV1Options } from './options'

function optionIdsFor(fieldId: string): string[] {
  return satV1Options
    .filter((option) => option.id.startsWith(`${fieldId}.`))
    .map((option) => option.id)
}

function defineField(
  sectionId: TastingSectionId,
  id: string,
  order: number,
  control: SatControl,
  minSelections: number,
  maxSelections: number,
  help = false,
): SatFieldDefinition {
  return {
    id,
    sectionId,
    order,
    labelKey: `sat.fields.${id}.label`,
    promptKey: `sat.fields.${id}.prompt`,
    ...(help ? { helpKey: `sat.fields.${id}.help` } : {}),
    control,
    required: minSelections > 0,
    minSelections,
    maxSelections,
    ...(control === 'text-list' ? {} : { optionIds: optionIdsFor(id) }),
  }
}

function singleField(
  sectionId: TastingSectionId,
  id: string,
  order: number,
  help = false,
): SatFieldDefinition {
  return defineField(sectionId, id, order, 'single', 1, 1, help)
}

function multiField(
  sectionId: TastingSectionId,
  id: string,
  order: number,
  maxSelections: number,
  help = false,
): SatFieldDefinition {
  return defineField(sectionId, id, order, 'multi', 0, maxSelections, help)
}

function textListField(
  sectionId: TastingSectionId,
  id: string,
  order: number,
  maxSelections: number,
): SatFieldDefinition {
  return defineField(sectionId, id, order, 'text-list', 0, maxSelections)
}

const appearanceFields: SatFieldDefinition[] = [
  singleField('appearance', 'appearance.clarity', 1, true),
  singleField('appearance', 'appearance.intensity', 2, true),
  singleField('appearance', 'appearance.colour', 3, true),
  textListField('appearance', 'appearance.other-observations', 4, 1),
]

const noseFields: SatFieldDefinition[] = [
  singleField('nose', 'nose.condition', 1, true),
  multiField('nose', 'nose.faults', 2, optionIdsFor('nose.faults').length, true),
  singleField('nose', 'nose.intensity', 3),
  singleField('nose', 'nose.development', 4, true),
  textListField('nose', 'nose.other-aromas', 5, 12),
]

const palateFields: SatFieldDefinition[] = [
  singleField('palate', 'palate.sweetness', 1),
  singleField('palate', 'palate.acidity', 2, true),
  singleField('palate', 'palate.tannin', 3, true),
  singleField('palate', 'palate.alcohol', 4),
  singleField('palate', 'palate.body', 5),
  singleField('palate', 'palate.mousse', 6, true),
  singleField('palate', 'palate.flavour-intensity', 7),
  textListField('palate', 'palate.other-flavours', 8, 12),
  singleField('palate', 'palate.finish', 9),
]

const conclusionsFields: SatFieldDefinition[] = [
  singleField('conclusions', 'conclusions.quality', 1),
  singleField('conclusions', 'conclusions.readiness', 2, true),
]

/**
 * Canonical, versioned SAT section and field registry. Field metadata is the
 * single source of truth for renderers and validators; selection-cardinality
 * limits live here rather than in consumers. Applicability rules attach in
 * WT-015 and the aroma/flavour taxonomy fields in WT-014.
 */
export const satV1Sections: SatSectionDefinition[] = [
  {
    id: 'appearance',
    order: 1,
    labelKey: 'sat.sections.appearance',
    fields: appearanceFields,
  },
  {
    id: 'nose',
    order: 2,
    labelKey: 'sat.sections.nose',
    fields: noseFields,
  },
  {
    id: 'palate',
    order: 3,
    labelKey: 'sat.sections.palate',
    fields: palateFields,
  },
  {
    id: 'conclusions',
    order: 4,
    labelKey: 'sat.sections.conclusions',
    fields: conclusionsFields,
  },
]
