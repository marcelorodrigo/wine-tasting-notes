import { describe, expect, it } from 'vitest'
import { satV1Sections } from '../../../../app/data/sat/v1/sections'
import { satV1Options } from '../../../../app/data/sat/v1/options'
import { satV1Aromas } from '../../../../app/data/sat/v1/aromas'
import { SAT_SOURCE_EXPECTATIONS } from '../../../fixtures/sat-source-expectations'

describe('SAT source expectations', () => {
  it('covers every canonical section once, in order', () => {
    expect(satV1Sections.map((section) => section.id)).toEqual(
      SAT_SOURCE_EXPECTATIONS.sections.map((section) => section.id),
    )
  })

  it('matches each section order and its field key paths', () => {
    for (const expected of SAT_SOURCE_EXPECTATIONS.sections) {
      const section = satV1Sections.find((candidate) => candidate.id === expected.id)
      expect(section, expected.id).toBeDefined()
      expect(section?.order, expected.id).toBe(expected.order)
      expect(section?.fields.map((field) => field.id), expected.id).toEqual(
        expected.fields.map((field) => field.id),
      )
    }
  })

  it('maps exactly the expected options to each field', () => {
    for (const expected of SAT_SOURCE_EXPECTATIONS.sections) {
      const section = satV1Sections.find((candidate) => candidate.id === expected.id)
      for (const expectedField of expected.fields) {
        const field = section?.fields.find(
          (candidate) => candidate.id === expectedField.id,
        )
        expect(field, expectedField.id).toBeDefined()
        expect(field?.optionIds ?? [], expectedField.id).toEqual(expectedField.optionIds)
      }
    }
  })

  it('claims every option exactly once across the expected fields', () => {
    const claimed = SAT_SOURCE_EXPECTATIONS.sections.flatMap((section) =>
      section.fields.flatMap((field) => field.optionIds),
    )
    const actual = satV1Options.map((option) => option.id)
    expect(claimed.slice().sort()).toEqual(actual.slice().sort())
    expect(new Set(claimed).size, 'duplicate option claims').toBe(claimed.length)
  })

  it('matches the expected total option count', () => {
    expect(satV1Options.length).toBe(SAT_SOURCE_EXPECTATIONS.totalOptionCount)
  })

  it('covers every canonical aroma family once, in order', () => {
    expect(satV1Aromas.filter((node) => node.kind === 'family').map((node) => node.id)).toEqual(
      SAT_SOURCE_EXPECTATIONS.aromas.families.map((family) => family.id),
    )
  })

  it('matches each aroma family order and its category key paths', () => {
    for (const expectedFamily of SAT_SOURCE_EXPECTATIONS.aromas.families) {
      const categories = satV1Aromas
        .filter((node) => node.kind === 'category' && node.parentId === expectedFamily.id)
        .sort((first, second) => first.order - second.order)
      expect(categories.map((node) => node.id), expectedFamily.id).toEqual(
        expectedFamily.categories.map((category) => category.id),
      )
    }
  })

  it('maps exactly the expected descriptors to each aroma category', () => {
    for (const expectedFamily of SAT_SOURCE_EXPECTATIONS.aromas.families) {
      for (const expectedCategory of expectedFamily.categories) {
        const descriptors = satV1Aromas
          .filter(
            (node) => node.kind === 'descriptor' && node.parentId === expectedCategory.id,
          )
          .sort((first, second) => first.order - second.order)
        expect(descriptors.map((node) => node.id), expectedCategory.id).toEqual(
          expectedCategory.descriptors,
        )
      }
    }
  })

  it('claims every aroma descriptor exactly once across the expected tree', () => {
    const expected = SAT_SOURCE_EXPECTATIONS.aromas.families.flatMap((family) =>
      family.categories.flatMap((category) => category.descriptors),
    )
    const actual = satV1Aromas
      .filter((node) => node.kind === 'descriptor')
      .map((node) => node.id)
    expect(actual.slice().sort()).toEqual(expected.slice().sort())
    expect(new Set(expected).size, 'duplicate descriptor claims').toBe(expected.length)
  })

  it('matches the expected aroma family, category and descriptor counts', () => {
    expect(satV1Aromas.filter((node) => node.kind === 'family')).toHaveLength(
      SAT_SOURCE_EXPECTATIONS.aromas.totalFamilyCount,
    )
    expect(satV1Aromas.filter((node) => node.kind === 'category')).toHaveLength(
      SAT_SOURCE_EXPECTATIONS.aromas.totalCategoryCount,
    )
    expect(satV1Aromas.filter((node) => node.kind === 'descriptor')).toHaveLength(
      SAT_SOURCE_EXPECTATIONS.aromas.totalDescriptorCount,
    )
  })
})
