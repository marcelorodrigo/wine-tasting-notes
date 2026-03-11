import { computed, type ComputedRef, type Ref } from 'vue'
import type {
  AromaObject,
  PrimaryAromaCategory,
  SecondaryAromaCategory,
  TertiaryAromaCategory,
  WineType
} from '../types/tasting'
import {
  AROMAS,
  isPrimaryCategoryVisibleForWineType,
  isSecondaryCategoryVisibleForWineType,
  isTertiaryCategoryVisibleForWineType
} from '../utils/wineTypeFilters'

// ─── Exported Types ───────────────────────────────────────────────

export type AromaRingType = 'primary' | 'secondary' | 'tertiary'

export type Point = {
  x: number
  y: number
}

export type InnerRingSegment = {
  aromaType: AromaRingType
  label: string
  startAngle: number
  endAngle: number
  midAngle: number
  path: string
  color: string
  labelPosition: Point
  labelRotation: number
}

export type MiddleRingSegment = {
  aromaType: AromaRingType
  categoryKey: string
  label: string
  startAngle: number
  endAngle: number
  midAngle: number
  path: string
  color: string
  isActive: boolean
  labelPosition: Point
  labelRotation: number
  descriptorCount: number
}

export type OuterRingSegment = {
  aromaType: AromaRingType
  categoryKey: string
  descriptor: string
  startAngle: number
  endAngle: number
  midAngle: number
  path: string
  color: string
  baseColor: string
  isActive: boolean
  isSelected: boolean
  labelPosition: Point
  labelRotation: number
}

export type RingRadii = {
  inner: { inner: number, outer: number }
  middle: { inner: number, outer: number }
  outer: { inner: number, outer: number }
}

export type UseAromaWheelOptions = {
  wineType: Ref<WineType | null>
  selectedAromas: Ref<AromaObject>
}

export type UseAromaWheelReturn = {
  innerRingSegments: ComputedRef<InnerRingSegment[]>
  middleRingSegments: ComputedRef<MiddleRingSegment[]>
  outerRingSegments: ComputedRef<OuterRingSegment[]>
  toggleAroma: (aromaType: AromaRingType, categoryKey: string, descriptor: string) => void
  viewBox: string
  center: Point
  radii: RingRadii
  totalDescriptors: number
}

// ─── Constants ────────────────────────────────────────────────────

export const VIEWBOX_SIZE = 500
export const CENTER: Point = { x: VIEWBOX_SIZE / 2, y: VIEWBOX_SIZE / 2 }

export const RADII: RingRadii = {
  inner: { inner: 60, outer: 110 },
  middle: { inner: 114, outer: 170 },
  outer: { inner: 174, outer: 240 }
}

export const PAD_ANGLES = {
  inner: 1.5,
  middle: 0.8,
  outer: 0.4
} as const

export const AROMA_TYPE_COLORS: Record<AromaRingType, string> = {
  primary: '#7B68AE',
  secondary: '#B08850',
  tertiary: '#9B7830'
}

export const AROMA_TYPE_LABELS: Record<AromaRingType, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary'
}

export const AROMA_RING_TYPES: readonly AromaRingType[] = ['primary', 'secondary', 'tertiary']

const OUTER_RING_LIGHTEN_AMOUNT = 0.45

// ─── Geometry Helpers ─────────────────────────────────────────────

function round(value: number, decimals: number = 3): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/**
 * Convert polar coordinates to Cartesian SVG coordinates.
 * 0° = 12 o'clock (top), angles increase clockwise.
 */
export function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number): Point {
  const angleRad = (angleDeg - 90) * Math.PI / 180
  return {
    x: round(cx + radius * Math.cos(angleRad)),
    y: round(cy + radius * Math.sin(angleRad))
  }
}

/**
 * Create an SVG path for an annular sector (donut slice).
 * Uses M (moveTo), A (arc), L (lineTo) commands.
 */
export function createArcPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  if (Math.abs(endAngle - startAngle) < 0.01) return ''

  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle)
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle)
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle)

  const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z'
  ].join(' ')
}

/**
 * Lighten a hex color by blending towards white.
 * @param amount 0 = original, 1 = pure white
 */
export function lightenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const lr = Math.round(r + (255 - r) * amount)
  const lg = Math.round(g + (255 - g) * amount)
  const lb = Math.round(b + (255 - b) * amount)

  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`
}

/**
 * Compute SVG text rotation so labels are never upside-down.
 * Right side (0–180°): text reads outward from center.
 * Left side (180–360°): text is flipped to remain readable.
 */
export function computeLabelRotation(midAngle: number): number {
  const normalized = ((midAngle % 360) + 360) % 360
  if (normalized > 180) {
    return normalized - 270
  }
  return normalized - 90
}

/**
 * True when the label at the given angle is on the left side of the wheel
 * and needs a flipped text-anchor (end instead of start).
 */
export function isTextFlipped(midAngle: number): boolean {
  const normalized = ((midAngle % 360) + 360) % 360
  return normalized > 180
}

// ─── Internal Helpers ─────────────────────────────────────────────

function isCategoryActive(
  aromaType: AromaRingType,
  categoryKey: string,
  wineType: WineType | null
): boolean {
  if (!wineType) return false
  switch (aromaType) {
    case 'primary':
      return isPrimaryCategoryVisibleForWineType(categoryKey as PrimaryAromaCategory, wineType)
    case 'secondary':
      return isSecondaryCategoryVisibleForWineType(categoryKey as SecondaryAromaCategory, wineType)
    case 'tertiary':
      return isTertiaryCategoryVisibleForWineType(categoryKey as TertiaryAromaCategory, wineType)
  }
}

function countDescriptorsInGroup(group: Record<string, { descriptors: readonly string[] }>): number {
  let count = 0
  for (const category of Object.values(group)) {
    count += category.descriptors.length
  }
  return count
}

function computeTotalDescriptors(): number {
  let total = 0
  for (const aromaType of AROMA_RING_TYPES) {
    total += countDescriptorsInGroup(
      AROMAS[aromaType] as Record<string, { descriptors: readonly string[] }>
    )
  }
  return total
}

// ─── Composable ───────────────────────────────────────────────────

export function useAromaWheel(options: UseAromaWheelOptions): UseAromaWheelReturn {
  const { wineType, selectedAromas } = options

  const totalDescriptors = computeTotalDescriptors()
  const anglePerDescriptor = 360 / totalDescriptors

  const innerRingSegments = computed<InnerRingSegment[]>(() => {
    const segments: InnerRingSegment[] = []
    let currentAngle = 0

    for (const aromaType of AROMA_RING_TYPES) {
      const group = AROMAS[aromaType] as Record<string, { descriptors: readonly string[] }>
      const typeDescriptorCount = countDescriptorsInGroup(group)
      const typeAngle = typeDescriptorCount * anglePerDescriptor
      const startAngle = currentAngle + PAD_ANGLES.inner / 2
      const endAngle = currentAngle + typeAngle - PAD_ANGLES.inner / 2
      const midAngle = (startAngle + endAngle) / 2
      const midRadius = (RADII.inner.inner + RADII.inner.outer) / 2

      segments.push({
        aromaType,
        label: AROMA_TYPE_LABELS[aromaType],
        startAngle: round(startAngle),
        endAngle: round(endAngle),
        midAngle: round(midAngle),
        path: createArcPath(CENTER.x, CENTER.y, RADII.inner.inner, RADII.inner.outer, startAngle, endAngle),
        color: AROMA_TYPE_COLORS[aromaType],
        labelPosition: polarToCartesian(CENTER.x, CENTER.y, midRadius, midAngle),
        labelRotation: round(computeLabelRotation(midAngle))
      })

      currentAngle += typeAngle
    }

    return segments
  })

  const middleRingSegments = computed<MiddleRingSegment[]>(() => {
    const segments: MiddleRingSegment[] = []
    let currentAngle = 0
    const wt = wineType.value

    for (const aromaType of AROMA_RING_TYPES) {
      const group = AROMAS[aromaType] as Record<string, { label: string, color: string, descriptors: readonly string[] }>

      for (const [categoryKey, categoryDef] of Object.entries(group)) {
        const descriptorCount = categoryDef.descriptors.length
        const categoryAngle = descriptorCount * anglePerDescriptor
        const startAngle = currentAngle + PAD_ANGLES.middle / 2
        const endAngle = currentAngle + categoryAngle - PAD_ANGLES.middle / 2
        const midAngle = (startAngle + endAngle) / 2
        const midRadius = (RADII.middle.inner + RADII.middle.outer) / 2

        segments.push({
          aromaType,
          categoryKey,
          label: categoryDef.label,
          startAngle: round(startAngle),
          endAngle: round(endAngle),
          midAngle: round(midAngle),
          path: createArcPath(CENTER.x, CENTER.y, RADII.middle.inner, RADII.middle.outer, startAngle, endAngle),
          color: categoryDef.color,
          isActive: isCategoryActive(aromaType, categoryKey, wt),
          labelPosition: polarToCartesian(CENTER.x, CENTER.y, midRadius, midAngle),
          labelRotation: round(computeLabelRotation(midAngle)),
          descriptorCount
        })

        currentAngle += categoryAngle
      }
    }

    return segments
  })

  const outerRingSegments = computed<OuterRingSegment[]>(() => {
    const segments: OuterRingSegment[] = []
    let currentAngle = 0
    const wt = wineType.value
    const selected = selectedAromas.value

    for (const aromaType of AROMA_RING_TYPES) {
      const group = AROMAS[aromaType] as Record<string, { label: string, color: string, descriptors: readonly string[] }>

      for (const [categoryKey, categoryDef] of Object.entries(group)) {
        const active = isCategoryActive(aromaType, categoryKey, wt)
        const selectedArr: string[] = (selected[aromaType] as unknown as Record<string, string[]>)[categoryKey] ?? []

        for (const descriptor of categoryDef.descriptors) {
          const startAngle = currentAngle + PAD_ANGLES.outer / 2
          const endAngle = currentAngle + anglePerDescriptor - PAD_ANGLES.outer / 2
          const midAngle = (startAngle + endAngle) / 2
          const midRadius = (RADII.outer.inner + RADII.outer.outer) / 2

          segments.push({
            aromaType,
            categoryKey,
            descriptor,
            startAngle: round(startAngle),
            endAngle: round(endAngle),
            midAngle: round(midAngle),
            path: createArcPath(CENTER.x, CENTER.y, RADII.outer.inner, RADII.outer.outer, startAngle, endAngle),
            color: lightenColor(categoryDef.color, OUTER_RING_LIGHTEN_AMOUNT),
            baseColor: categoryDef.color,
            isActive: active,
            isSelected: selectedArr.includes(descriptor),
            labelPosition: polarToCartesian(CENTER.x, CENTER.y, midRadius, midAngle),
            labelRotation: round(computeLabelRotation(midAngle))
          })

          currentAngle += anglePerDescriptor
        }
      }
    }

    return segments
  })

  function toggleAroma(aromaType: AromaRingType, categoryKey: string, descriptor: string): void {
    if (!isCategoryActive(aromaType, categoryKey, wineType.value)) return

    const categoryArr = (selectedAromas.value[aromaType] as unknown as Record<string, string[]>)[categoryKey]
    if (!categoryArr) return

    const index = categoryArr.indexOf(descriptor)
    if (index >= 0) {
      categoryArr.splice(index, 1)
    } else {
      categoryArr.push(descriptor)
    }
  }

  return {
    innerRingSegments,
    middleRingSegments,
    outerRingSegments,
    toggleAroma,
    viewBox: `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`,
    center: CENTER,
    radii: RADII,
    totalDescriptors
  }
}
