import type { AromaNode, AromaNodeKind } from './types'

const ID_PATTERN = /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/
const COLOUR_TOKEN_PATTERN = /^--[a-z][a-z0-9-]*$/

export type AromaTaxonomyErrorCode =
  | 'empty-taxonomy'
  | 'duplicate-id'
  | 'invalid-id'
  | 'invalid-root'
  | 'unknown-parent'
  | 'invalid-parent-kind'
  | 'cyclic-parent'
  | 'duplicate-sibling-order'
  | 'invalid-selectable'
  | 'missing-label-key'
  | 'invalid-colour-token'

export interface AromaTaxonomyError {
  code: AromaTaxonomyErrorCode
  nodeId?: string
  message: string
}

export interface AromaTaxonomyValidationResult {
  valid: boolean
  errors: AromaTaxonomyError[]
}

const ROOT_KEY = '__root__'

const EXPECTED_PARENT_KIND: Partial<Record<AromaNodeKind, AromaNodeKind>> = {
  category: 'family',
  descriptor: 'category',
}

/**
 * Reports every structural problem in an aroma taxonomy without throwing, so
 * callers can surface all violations at once. A taxonomy is valid only when it
 * has at least one node and every node has a unique canonical id, a resolvable
 * parent of the expected kind, a unique sibling order, an explicit selectable
 * state (descriptors only), a label key and a colour token.
 */
export function validateAromaTaxonomy(
  nodes: readonly AromaNode[],
): AromaTaxonomyValidationResult {
  const errors: AromaTaxonomyError[] = []
  const byId = indexById(nodes, errors)
  const uniqueNodes = [...byId.values()]

  if (nodes.length === 0) {
    errors.push({
      code: 'empty-taxonomy',
      message: 'The aroma taxonomy must contain at least one node.',
    })
  }

  for (const node of uniqueNodes) {
    validateNodeShape(node, errors)
    validateNodePlacement(node, byId, errors)
  }

  validateSiblingOrder(uniqueNodes, errors)
  validateNoCycles(uniqueNodes, byId, errors)

  return { valid: errors.length === 0, errors }
}

/**
 * Indexes nodes by id, reporting each repeated id once and keeping the first
 * occurrence so every downstream check runs over unique nodes only.
 */
function indexById(
  nodes: readonly AromaNode[],
  errors: AromaTaxonomyError[],
): Map<string, AromaNode> {
  const byId = new Map<string, AromaNode>()
  for (const node of nodes) {
    if (byId.has(node.id)) {
      errors.push({
        code: 'duplicate-id',
        nodeId: node.id,
        message: `Duplicate aroma node id "${node.id}".`,
      })
      continue
    }
    byId.set(node.id, node)
  }
  return byId
}

function validateNodeShape(node: AromaNode, errors: AromaTaxonomyError[]): void {
  if (!ID_PATTERN.test(node.id)) {
    errors.push({
      code: 'invalid-id',
      nodeId: node.id,
      message: `Aroma node id "${node.id}" is not a canonical dot-separated id.`,
    })
  }

  if (node.labelKey.trim() === '') {
    errors.push({
      code: 'missing-label-key',
      nodeId: node.id,
      message: `Aroma node "${node.id}" has no label key.`,
    })
  }

  if (!COLOUR_TOKEN_PATTERN.test(node.colourToken)) {
    errors.push({
      code: 'invalid-colour-token',
      nodeId: node.id,
      message: `Aroma node "${node.id}" has an invalid colour token "${node.colourToken}".`,
    })
  }

  const shouldBeSelectable = node.kind === 'descriptor'
  if (node.selectable !== shouldBeSelectable) {
    errors.push({
      code: 'invalid-selectable',
      nodeId: node.id,
      message: `${node.kind} "${node.id}" must be ${
        shouldBeSelectable ? 'selectable' : 'navigation-only'
      }.`,
    })
  }
}

function validateNodePlacement(
  node: AromaNode,
  byId: ReadonlyMap<string, AromaNode>,
  errors: AromaTaxonomyError[],
): void {
  if (node.kind === 'family') {
    if (node.parentId !== null) {
      errors.push({
        code: 'invalid-root',
        nodeId: node.id,
        message: `Aroma family "${node.id}" must not have a parent.`,
      })
    }
  } else if (node.parentId === null) {
    errors.push({
      code: 'invalid-root',
      nodeId: node.id,
      message: `Aroma ${node.kind} "${node.id}" must reference a parent.`,
    })
  }

  if (node.parentId === null) {
    return
  }

  const parent = byId.get(node.parentId)
  if (!parent) {
    errors.push({
      code: 'unknown-parent',
      nodeId: node.id,
      message: `Aroma node "${node.id}" references unknown parent "${node.parentId}".`,
    })
    return
  }

  const expectedKind = EXPECTED_PARENT_KIND[node.kind]
  if (expectedKind && parent.kind !== expectedKind) {
    errors.push({
      code: 'invalid-parent-kind',
      nodeId: node.id,
      message: `Aroma ${node.kind} "${node.id}" must have a ${expectedKind} parent, found ${parent.kind} "${parent.id}".`,
    })
  }
}

function validateSiblingOrder(
  uniqueNodes: readonly AromaNode[],
  errors: AromaTaxonomyError[],
): void {
  const siblingOrders = new Map<string, Set<number>>()
  for (const node of uniqueNodes) {
    const siblingKey = node.parentId ?? ROOT_KEY
    const orders = siblingOrders.get(siblingKey) ?? new Set<number>()
    if (orders.has(node.order)) {
      errors.push({
        code: 'duplicate-sibling-order',
        nodeId: node.id,
        message: `Siblings under "${siblingKey}" repeat order ${node.order}.`,
      })
    }
    orders.add(node.order)
    siblingOrders.set(siblingKey, orders)
  }
}

function validateNoCycles(
  uniqueNodes: readonly AromaNode[],
  byId: ReadonlyMap<string, AromaNode>,
  errors: AromaTaxonomyError[],
): void {
  for (const node of uniqueNodes) {
    const seen = new Set<string>([node.id])
    let current: AromaNode = node
    while (current.parentId !== null) {
      const parent = byId.get(current.parentId)
      if (!parent) {
        break
      }
      if (seen.has(parent.id)) {
        errors.push({
          code: 'cyclic-parent',
          nodeId: node.id,
          message: `Aroma node "${node.id}" participates in a parent cycle.`,
        })
        break
      }
      seen.add(parent.id)
      current = parent
    }
  }
}

/**
 * The single shared predicate for whether an aroma node may enter a tasting
 * selection. Families and categories are navigation-only; consumers must use
 * this rather than reading `selectable` directly.
 */
export function isSelectableAroma(node: AromaNode): boolean {
  return node.kind === 'descriptor' && node.selectable
}
