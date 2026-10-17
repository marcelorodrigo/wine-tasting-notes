import { describe, expect, it } from 'vitest'
import { satV1Sections } from '../../../../app/data/sat/v1/sections'
import { satV1Options } from '../../../../app/data/sat/v1/options'
import { hasLocaleKey } from './locale'

const DOT_ID = /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/

const allFields = satV1Sections.flatMap((section) => section.fields)

describe('canonical SAT sections', () => {
  it('defines the four sections in tasting order', () => {
    expect(satV1Sections.map((section) => section.id)).toEqual([
      'appearance',
      'nose',
      'palate',
      'conclusions',
    ])
    expect(satV1Sections.map((section) => section.order)).toEqual([1, 2, 3, 4])
  })

  it('assigns each section a resolvable label key', () => {
    const missing = satV1Sections
      .filter((section) => !hasLocaleKey(section.labelKey))
      .map((section) => section.labelKey)
    expect(missing).toEqual([])
  })

  it('assigns every field a unique id scoped to its section', () => {
    const ids = allFields.map((field) => field.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const field of allFields) {
      expect(field.id, field.id).toMatch(DOT_ID)
      expect(field.id.startsWith(`${field.sectionId}.`), field.id).toBe(true)
    }
  })

  it('scopes every field to its containing section', () => {
    for (const section of satV1Sections) {
      for (const field of section.fields) {
        expect(field.sectionId, field.id).toBe(section.id)
      }
    }
  })

  it('gives every field a unique non-negative integer order within its section', () => {
    for (const section of satV1Sections) {
      const orders = section.fields.map((field) => field.order)
      for (const order of orders) {
        expect(Number.isInteger(order) && order >= 0, `${section.id}#${order}`).toBe(true)
      }
      expect(new Set(orders).size, section.id).toBe(orders.length)
    }
  })

  it('keeps selection bounds valid for every field', () => {
    for (const field of allFields) {
      expect(Number.isInteger(field.minSelections), field.id).toBe(true)
      expect(Number.isInteger(field.maxSelections), field.id).toBe(true)
      expect(field.minSelections, field.id).toBeGreaterThanOrEqual(0)
      expect(field.maxSelections, field.id).toBeGreaterThanOrEqual(field.minSelections)
    }
  })

  it('agrees required with a positive minimum', () => {
    for (const field of allFields) {
      expect(field.required, field.id).toBe(field.minSelections > 0)
    }
  })

  it('gives single fields a maximum of one selection', () => {
    for (const field of allFields.filter((field) => field.control === 'single')) {
      expect(field.maxSelections, field.id).toBe(1)
    }
  })

  it('references only existing options within the same section', () => {
    const known = new Map(satV1Options.map((option) => [option.id, option]))
    for (const field of allFields) {
      const optionIds = field.optionIds
      if (!optionIds) continue
      expect(optionIds.length, field.id).toBeGreaterThan(0)
      for (const optionId of optionIds) {
        const option = known.get(optionId)
        expect(option, `${field.id} -> ${optionId}`).toBeDefined()
        expect(option?.sectionId, `${field.id} -> ${optionId}`).toBe(field.sectionId)
      }
    }
  })

  it('requires option ids for single and multi fields', () => {
    for (const field of allFields.filter((field) => field.control !== 'text-list')) {
      expect(field.optionIds, field.id).toBeDefined()
    }
  })

  it('bounds multi fields by the options they offer', () => {
    for (const field of allFields.filter((field) => field.control === 'multi')) {
      expect(field.optionIds, field.id).toBeDefined()
      expect(field.maxSelections, field.id).toBeLessThanOrEqual(
        field.optionIds?.length ?? 0,
      )
    }
  })

  it('does not bind option ids to text-list fields', () => {
    for (const field of allFields.filter((field) => field.control === 'text-list')) {
      expect(field.optionIds, field.id).toBeUndefined()
    }
  })

  it('provides resolvable label, prompt, and optional help keys for every field', () => {
    const missing: string[] = []
    for (const field of allFields) {
      if (!hasLocaleKey(field.labelKey)) missing.push(field.labelKey)
      if (!hasLocaleKey(field.promptKey)) missing.push(field.promptKey)
      if (field.helpKey && !hasLocaleKey(field.helpKey)) missing.push(field.helpKey)
    }
    expect(missing).toEqual([])
  })
})
