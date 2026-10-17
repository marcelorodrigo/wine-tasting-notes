import { describe, expect, it } from 'vitest'
import {
  isSelectableAroma,
  validateAromaTaxonomy,
} from '../../../../app/domain/sat/definition-validation'
import type { AromaTaxonomyErrorCode } from '../../../../app/domain/sat/definition-validation'
import type { AromaNode } from '../../../../app/domain/sat/types'
import { satV1Aromas } from '../../../../app/data/sat/v1/aromas'

type NodeSeed = Partial<AromaNode> & Pick<AromaNode, 'id' | 'kind' | 'parentId'>

function node(seed: NodeSeed): AromaNode {
  return {
    selectable: seed.kind === 'descriptor',
    labelKey: `sat.test.${seed.id}`,
    order: 1,
    colourToken: '--color-aroma-test',
    ...seed,
  }
}

const family = node({ id: 'aroma.family', kind: 'family', parentId: null })
const category = node({ id: 'aroma.family.category', kind: 'category', parentId: family.id })
const descriptor = node({
  id: 'aroma.family.category.descriptor',
  kind: 'descriptor',
  parentId: category.id,
})

const validTaxonomy: AromaNode[] = [family, category, descriptor]

function errorCodes(nodes: readonly AromaNode[]): AromaTaxonomyErrorCode[] {
  return validateAromaTaxonomy(nodes).errors.map((error) => error.code)
}

describe('validateAromaTaxonomy', () => {
  it('accepts the canonical aroma taxonomy', () => {
    expect(validateAromaTaxonomy(satV1Aromas)).toEqual({ valid: true, errors: [] })
  })

  it('accepts a minimal valid taxonomy', () => {
    expect(validateAromaTaxonomy(validTaxonomy).valid).toBe(true)
  })

  it('rejects an empty taxonomy', () => {
    expect(errorCodes([])).toContain('empty-taxonomy')
  })

  it('rejects duplicate node ids', () => {
    const duplicate = node({ id: family.id, kind: 'family', parentId: null })
    expect(errorCodes([family, duplicate])).toContain('duplicate-id')
  })

  it('rejects a malformed id', () => {
    const malformed = node({ id: 'aroma', kind: 'family', parentId: null })
    expect(errorCodes([malformed])).toContain('invalid-id')
  })

  it('rejects a non-family node without a parent', () => {
    const orphan = node({ id: 'aroma.family.orphan', kind: 'category', parentId: null })
    expect(errorCodes([orphan])).toContain('invalid-root')
  })

  it('rejects a family that declares a parent', () => {
    const nested = node({ id: 'aroma.nested', kind: 'family', parentId: family.id })
    expect(errorCodes([family, nested])).toContain('invalid-root')
  })

  it('rejects a node whose parent does not exist', () => {
    const dangling = node({
      id: 'aroma.family.dangling',
      kind: 'category',
      parentId: 'aroma.missing',
    })
    expect(errorCodes([family, dangling])).toContain('unknown-parent')
  })

  it('rejects a descriptor parented to a family rather than a category', () => {
    const misplaced = node({
      id: 'aroma.family.misplaced',
      kind: 'descriptor',
      parentId: family.id,
    })
    expect(errorCodes([family, misplaced])).toContain('invalid-parent-kind')
  })

  it('rejects a parent cycle', () => {
    const first = node({ id: 'aroma.cycle-a', kind: 'category', parentId: 'aroma.cycle-b' })
    const second = node({ id: 'aroma.cycle-b', kind: 'category', parentId: 'aroma.cycle-a' })
    expect(errorCodes([first, second])).toContain('cyclic-parent')
  })

  it('rejects siblings that repeat an order', () => {
    const first = node({ id: 'aroma.family.first', kind: 'category', parentId: family.id })
    const second = node({ id: 'aroma.family.second', kind: 'category', parentId: family.id })
    expect(errorCodes([family, first, second])).toContain('duplicate-sibling-order')
  })

  it('rejects a selectable navigation node', () => {
    const selectableFamily = node({
      id: 'aroma.selectable-family',
      kind: 'family',
      parentId: null,
      selectable: true,
    })
    expect(errorCodes([selectableFamily])).toContain('invalid-selectable')
  })

  it('rejects a non-selectable descriptor', () => {
    const lockedDescriptor = node({
      id: 'aroma.family.category.locked',
      kind: 'descriptor',
      parentId: category.id,
      selectable: false,
    })
    expect(errorCodes([category, lockedDescriptor])).toContain('invalid-selectable')
  })

  it('rejects a node without a label key', () => {
    const unlabelled = node({
      id: 'aroma.unlabelled',
      kind: 'family',
      parentId: null,
      labelKey: '  ',
    })
    expect(errorCodes([unlabelled])).toContain('missing-label-key')
  })

  it('rejects a node without a colour token', () => {
    const uncoloured = node({
      id: 'aroma.uncoloured',
      kind: 'family',
      parentId: null,
      colourToken: 'aroma-blue',
    })
    expect(errorCodes([uncoloured])).toContain('invalid-colour-token')
  })
})

describe('isSelectableAroma', () => {
  it('is true for a selectable descriptor', () => {
    expect(isSelectableAroma(descriptor)).toBe(true)
  })

  it('is false for families and categories', () => {
    expect(isSelectableAroma(family)).toBe(false)
    expect(isSelectableAroma(category)).toBe(false)
  })

  it('is false for a descriptor that is not marked selectable', () => {
    expect(isSelectableAroma({ ...descriptor, selectable: false })).toBe(false)
  })
})
