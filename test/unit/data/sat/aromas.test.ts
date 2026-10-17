import { describe, expect, it } from 'vitest'
import type { AromaNode, AromaNodeKind } from '../../../../app/domain/sat/types'
import { satV1Aromas } from '../../../../app/data/sat/v1/aromas'
import { hasLocaleKey } from './locale'

const DOT_ID = /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/
const COLOUR_TOKEN = /^--color-aroma-[a-z][a-z0-9-]*$/
const ID_PREFIX = 'aroma.'

const nodes = satV1Aromas
const byId = new Map(nodes.map((node) => [node.id, node]))

function nodesOfKind(kind: AromaNodeKind): AromaNode[] {
  return nodes.filter((node) => node.kind === kind)
}

describe('canonical SAT aroma taxonomy', () => {
  it('assigns every node a unique id', () => {
    expect(byId.size).toBe(nodes.length)
  })

  it('uses a canonical, aroma-prefixed, dot-separated id', () => {
    for (const node of nodes) {
      expect(node.id, node.id).toMatch(DOT_ID)
      expect(node.id.startsWith(ID_PREFIX), node.id).toBe(true)
    }
  })

  it('roots families and attaches every other node to an existing parent', () => {
    for (const node of nodes) {
      if (node.kind === 'family') {
        expect(node.parentId, node.id).toBeNull()
      } else {
        expect(node.parentId, node.id).not.toBeNull()
        expect(byId.has(node.parentId as string), node.id).toBe(true)
      }
    }
  })

  it('parents each category to a family and each descriptor to a category', () => {
    for (const node of nodes) {
      if (node.kind === 'category') {
        expect(byId.get(node.parentId as string)?.kind, node.id).toBe('family')
      }
      if (node.kind === 'descriptor') {
        expect(byId.get(node.parentId as string)?.kind, node.id).toBe('category')
      }
    }
  })

  it('contains no parent cycles', () => {
    for (const node of nodes) {
      const seen = new Set<string>()
      let current: AromaNode | undefined = node
      while (current) {
        expect(seen.has(current.id), `${node.id} cycles at ${current.id}`).toBe(false)
        seen.add(current.id)
        current = current.parentId ? byId.get(current.parentId) : undefined
      }
    }
  })

  it('keeps sibling order unique within each parent', () => {
    const siblings = new Map<string, number[]>()
    for (const node of nodes) {
      const key = node.parentId ?? '__root__'
      siblings.set(key, [...(siblings.get(key) ?? []), node.order])
    }
    for (const [key, orders] of siblings) {
      expect(new Set(orders).size, key).toBe(orders.length)
    }
  })

  it('marks only descriptors as selectable', () => {
    for (const node of nodes) {
      expect(node.selectable, node.id).toBe(node.kind === 'descriptor')
    }
  })

  it('provides a resolvable label key for every node', () => {
    const missing = nodes
      .filter((node) => !hasLocaleKey(node.labelKey))
      .map((node) => node.labelKey)
    expect(missing).toEqual([])
  })

  it('assigns every node a categorised colour token', () => {
    for (const node of nodes) {
      expect(node.colourToken, node.id).toMatch(COLOUR_TOKEN)
    }
    expect(new Set(nodesOfKind('family').map((node) => node.colourToken)).size).toBe(
      nodesOfKind('family').length,
    )
    expect(new Set(nodesOfKind('category').map((node) => node.colourToken)).size).toBe(
      nodesOfKind('category').length,
    )
  })

  it('gives every descriptor and category a shared category colour token', () => {
    for (const node of nodes) {
      if (node.kind === 'descriptor') {
        expect(node.colourToken, node.id).toBe(
          byId.get(node.parentId as string)?.colourToken,
        )
      }
    }
  })
})
