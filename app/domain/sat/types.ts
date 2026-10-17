export type TastingSectionId = 'appearance' | 'nose' | 'palate' | 'conclusions'

export type SatControl = 'single' | 'multi' | 'text-list'

/**
 * Identifier for an applicability rule. The applicability module (WT-015)
 * registers the concrete rule ids and validates that every referenced id
 * resolves; field definitions only carry the reference.
 */
export type ApplicabilityRuleId = string

export interface SatOption {
  id: string
  sectionId: TastingSectionId
  labelKey: string
}

export interface SatFieldDefinition {
  id: string
  sectionId: TastingSectionId
  order: number
  labelKey: string
  promptKey: string
  helpKey?: string
  control: SatControl
  required: boolean
  minSelections: number
  maxSelections: number
  optionIds?: string[]
  applicabilityRuleId?: ApplicabilityRuleId
}

export interface SatSectionDefinition {
  id: TastingSectionId
  order: number
  labelKey: string
  fields: SatFieldDefinition[]
}

export interface SatProvenance {
  schemaVersion: 1
  source: string
  sourceEdition: string
  attributionReference: string
  recordedAt: string
}

export type AromaNodeKind = 'family' | 'category' | 'descriptor'

/**
 * A node in the canonical aroma and flavour taxonomy (WT-014). The taxonomy is a
 * three-level tree — family, category, descriptor — shared by nose aromas and
 * palate flavours. Ids are stable and independent of their English labels;
 * families and categories are navigation-only, so only descriptors may be
 * selected (`selectable: true`).
 */
export interface AromaNode {
  id: string
  parentId: string | null
  kind: AromaNodeKind
  selectable: boolean
  labelKey: string
  order: number
  colourToken: string
}
