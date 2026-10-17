import type { SatProvenance } from '../../../domain/sat/types'

/**
 * Provenance for the canonical SAT v1 data set. The source edition is still
 * "undocumented" per docs/legal/wset-attribution.md, so the official wording
 * here is a project draft pending a recorded edition; the reference keeps the
 * data traceable to the attribution record.
 */
export const satV1Provenance: SatProvenance = {
  schemaVersion: 1,
  source: 'WSET Level 3 Systematic Approach to Tasting',
  sourceEdition: 'undocumented',
  attributionReference: 'docs/legal/wset-attribution.md',
  recordedAt: '2026-10-17',
}
