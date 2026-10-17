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
