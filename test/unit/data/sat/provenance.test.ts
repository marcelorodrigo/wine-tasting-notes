import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { satV1Provenance } from '../../../../app/data/sat/v1/provenance'

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..')

describe('canonical SAT provenance', () => {
  it('records the schema version', () => {
    expect(satV1Provenance.schemaVersion).toBe(1)
  })

  it('records a non-empty source and source version', () => {
    expect(satV1Provenance.source.trim().length).toBeGreaterThan(0)
    expect(satV1Provenance.sourceEdition.trim().length).toBeGreaterThan(0)
  })

  it('references an existing attribution record', () => {
    expect(satV1Provenance.attributionReference).toBe(
      'docs/legal/wset-attribution.md',
    )
    expect(existsSync(join(ROOT, satV1Provenance.attributionReference))).toBe(true)
  })

  it('records an ISO review date', () => {
    expect(satV1Provenance.recordedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
