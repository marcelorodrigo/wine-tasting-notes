import { beforeEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'
import type { AromaObject, WineType } from '../../app/types/tasting'
import {
  AROMA_RING_TYPES,
  AROMA_TYPE_COLORS,
  AROMA_TYPE_LABELS,
  CENTER,
  PAD_ANGLES,
  RADII,
  VIEWBOX_SIZE,
  computeLabelRotation,
  createArcPath,
  isTextFlipped,
  lightenColor,
  polarToCartesian,
  useAromaWheel
} from '../../app/composables/useAromaWheel'
import { AROMAS } from '../../app/utils/wineTypeFilters'

function createEmptyAromaObject(): AromaObject {
  return {
    primary: {
      floral: [],
      greenFruit: [],
      citrusFruit: [],
      stoneFruit: [],
      tropicalFruit: [],
      redFruit: [],
      blackFruit: [],
      driedCookedFruit: [],
      herbaceous: [],
      herbal: [],
      pungentSpice: [],
      other: []
    },
    secondary: {
      yeast: [],
      malolacticConversion: [],
      oak: []
    },
    tertiary: {
      deliberateOxidation: [],
      fruitDevelopmentWhite: [],
      fruitDevelopmentRed: [],
      bottleAgeWhite: [],
      bottleAgeRed: []
    }
  }
}

describe('useAromaWheel', () => {
  // ─── Geometry Helpers ─────────────────────────────────────────

  describe('polarToCartesian', () => {
    it('places 0° at 12 o\'clock (top center)', () => {
      const point = polarToCartesian(250, 250, 100, 0)
      expect(point.x).toBeCloseTo(250, 1)
      expect(point.y).toBeCloseTo(150, 1)
    })

    it('places 90° at 3 o\'clock (right center)', () => {
      const point = polarToCartesian(250, 250, 100, 90)
      expect(point.x).toBeCloseTo(350, 1)
      expect(point.y).toBeCloseTo(250, 1)
    })

    it('places 180° at 6 o\'clock (bottom center)', () => {
      const point = polarToCartesian(250, 250, 100, 180)
      expect(point.x).toBeCloseTo(250, 1)
      expect(point.y).toBeCloseTo(350, 1)
    })

    it('places 270° at 9 o\'clock (left center)', () => {
      const point = polarToCartesian(250, 250, 100, 270)
      expect(point.x).toBeCloseTo(150, 1)
      expect(point.y).toBeCloseTo(250, 1)
    })

    it('returns the center when radius is 0', () => {
      const point = polarToCartesian(250, 250, 0, 45)
      expect(point.x).toBeCloseTo(250, 1)
      expect(point.y).toBeCloseTo(250, 1)
    })
  })

  describe('createArcPath', () => {
    it('returns a valid SVG path with M, A, L, Z commands', () => {
      const path = createArcPath(250, 250, 50, 100, 0, 90)
      expect(path).toContain('M ')
      expect(path).toContain('A ')
      expect(path).toContain('L ')
      expect(path).toContain('Z')
    })

    it('sets large-arc-flag to 0 for arcs ≤ 180°', () => {
      const path = createArcPath(250, 250, 50, 100, 0, 90)
      // Both arcs should have large-arc-flag = 0
      const arcCommands = path.match(/A \d+ \d+ 0 (\d) [01]/g) ?? []
      for (const arc of arcCommands) {
        expect(arc).toContain('0 0') // flag = 0
      }
    })

    it('sets large-arc-flag to 1 for arcs > 180°', () => {
      const path = createArcPath(250, 250, 50, 100, 0, 200)
      expect(path).toMatch(/A \d+ \d+ 0 1 1/) // outer arc, large-arc=1, sweep=1
      expect(path).toMatch(/A \d+ \d+ 0 1 0/) // inner arc, large-arc=1, sweep=0
    })

    it('returns empty string for degenerate (near-zero) angle', () => {
      expect(createArcPath(250, 250, 50, 100, 10, 10.005)).toBe('')
    })

    it('produces a closed path (ends with Z)', () => {
      const path = createArcPath(250, 250, 50, 100, 30, 60)
      expect(path.trim().endsWith('Z')).toBe(true)
    })
  })

  describe('lightenColor', () => {
    it('returns the original color when amount is 0', () => {
      expect(lightenColor('#9B59B6', 0)).toBe('#9b59b6')
    })

    it('returns white when amount is 1', () => {
      expect(lightenColor('#000000', 1)).toBe('#ffffff')
    })

    it('returns a lighter shade for intermediate amounts', () => {
      const lightened = lightenColor('#9B59B6', 0.5)
      // Each channel should be pulled halfway towards 255
      // R: 155 + (255-155)*0.5 = 205 → cd
      // G: 89 + (255-89)*0.5 = 172 → ac
      // B: 182 + (255-182)*0.5 = 219 → db (rounded)
      expect(lightened).toBe('#cdacdb')
    })

    it('preserves white channels', () => {
      expect(lightenColor('#ffffff', 0.5)).toBe('#ffffff')
    })
  })

  describe('computeLabelRotation', () => {
    it('returns -90 at 0° (text is vertical, reading downward)', () => {
      expect(computeLabelRotation(0)).toBe(-90)
    })

    it('returns 0 at 90° (text is horizontal, reading right)', () => {
      expect(computeLabelRotation(90)).toBe(0)
    })

    it('returns rotation between -90 and 90 for right side (0–180°)', () => {
      for (const angle of [0, 45, 90, 135, 180]) {
        const rot = computeLabelRotation(angle)
        expect(rot).toBeGreaterThanOrEqual(-90)
        expect(rot).toBeLessThanOrEqual(90)
      }
    })

    it('returns rotation between -90 and 90 for left side (180–360°)', () => {
      for (const angle of [181, 225, 270, 315, 359]) {
        const rot = computeLabelRotation(angle)
        expect(rot).toBeGreaterThanOrEqual(-90)
        expect(rot).toBeLessThanOrEqual(90)
      }
    })

    it('handles angles > 360° via normalization', () => {
      expect(computeLabelRotation(450)).toBe(computeLabelRotation(90))
    })

    it('handles negative angles via normalization', () => {
      expect(computeLabelRotation(-90)).toBe(computeLabelRotation(270))
    })
  })

  describe('isTextFlipped', () => {
    it('returns false for right side (0–180°)', () => {
      expect(isTextFlipped(0)).toBe(false)
      expect(isTextFlipped(90)).toBe(false)
      expect(isTextFlipped(180)).toBe(false)
    })

    it('returns true for left side (> 180°)', () => {
      expect(isTextFlipped(181)).toBe(true)
      expect(isTextFlipped(270)).toBe(true)
      expect(isTextFlipped(359)).toBe(true)
    })
  })

  // ─── Composable ───────────────────────────────────────────────

  describe('composable', () => {
    let wineType: ReturnType<typeof ref<WineType | null>>
    let selectedAromas: ReturnType<typeof ref<AromaObject>>
    let wheel: ReturnType<typeof useAromaWheel>

    beforeEach(() => {
      wineType = ref<WineType | null>('white')
      selectedAromas = ref<AromaObject>(createEmptyAromaObject())
      wheel = useAromaWheel({ wineType, selectedAromas })
    })

    // ── Segment Structure ─────────────────────────────────────

    describe('segment structure', () => {
      it('produces exactly 3 inner ring segments', () => {
        expect(wheel.innerRingSegments.value).toHaveLength(3)
      })

      it('inner ring segments are Primary, Secondary, Tertiary', () => {
        const types = wheel.innerRingSegments.value.map(s => s.aromaType)
        expect(types).toEqual(['primary', 'secondary', 'tertiary'])
      })

      it('inner ring segment labels match AROMA_TYPE_LABELS', () => {
        for (const seg of wheel.innerRingSegments.value) {
          expect(seg.label).toBe(AROMA_TYPE_LABELS[seg.aromaType])
        }
      })

      it('inner ring segment colors match AROMA_TYPE_COLORS', () => {
        for (const seg of wheel.innerRingSegments.value) {
          expect(seg.color).toBe(AROMA_TYPE_COLORS[seg.aromaType])
        }
      })

      it('produces exactly 20 middle ring segments', () => {
        expect(wheel.middleRingSegments.value).toHaveLength(20)
      })

      it('middle ring segments contain all expected category keys', () => {
        const keys = wheel.middleRingSegments.value.map(s => s.categoryKey)
        for (const aromaType of AROMA_RING_TYPES) {
          for (const key of Object.keys(AROMAS[aromaType])) {
            expect(keys).toContain(key)
          }
        }
      })

      it('middle ring descriptorCount matches AROMAS definition', () => {
        for (const seg of wheel.middleRingSegments.value) {
          const group = AROMAS[seg.aromaType] as Record<string, { descriptors: readonly string[] }>
          expect(seg.descriptorCount).toBe(group[seg.categoryKey].descriptors.length)
        }
      })

      it('produces exactly 126 outer ring segments', () => {
        expect(wheel.outerRingSegments.value).toHaveLength(126)
      })

      it('outer ring segments cover all descriptors from AROMAS', () => {
        const descriptors = wheel.outerRingSegments.value.map(s => `${s.categoryKey}:${s.descriptor}`)
        for (const aromaType of AROMA_RING_TYPES) {
          const group = AROMAS[aromaType] as Record<string, { descriptors: readonly string[] }>
          for (const [key, def] of Object.entries(group)) {
            for (const d of def.descriptors) {
              expect(descriptors).toContain(`${key}:${d}`)
            }
          }
        }
      })

      it('totalDescriptors equals 126', () => {
        expect(wheel.totalDescriptors).toBe(126)
      })
    })

    // ── Segment Angles ────────────────────────────────────────

    describe('segment angles', () => {
      it('outer ring padded angles + gaps sum to 360°', () => {
        const outer = wheel.outerRingSegments.value
        const totalVisibleArc = outer.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0)
        const totalGaps = outer.length * PAD_ANGLES.outer
        expect(totalVisibleArc + totalGaps).toBeCloseTo(360, 1)
      })

      it('middle ring padded angles + gaps sum to 360°', () => {
        const middle = wheel.middleRingSegments.value
        const totalVisibleArc = middle.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0)
        const totalGaps = middle.length * PAD_ANGLES.middle
        expect(totalVisibleArc + totalGaps).toBeCloseTo(360, 1)
      })

      it('inner ring padded angles + gaps sum to 360°', () => {
        const inner = wheel.innerRingSegments.value
        const totalVisibleArc = inner.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0)
        const totalGaps = inner.length * PAD_ANGLES.inner
        expect(totalVisibleArc + totalGaps).toBeCloseTo(360, 1)
      })

      it('primary ring spans more angle than secondary and tertiary', () => {
        const [primary, secondary, tertiary] = wheel.innerRingSegments.value
        const primarySpan = primary.endAngle - primary.startAngle
        const secondarySpan = secondary.endAngle - secondary.startAngle
        const tertiarySpan = tertiary.endAngle - tertiary.startAngle
        expect(primarySpan).toBeGreaterThan(secondarySpan)
        expect(primarySpan).toBeGreaterThan(tertiarySpan)
      })

      it('category arc lengths are proportional to descriptor count', () => {
        const middle = wheel.middleRingSegments.value
        // Find two categories with different descriptor counts
        const floral = middle.find(s => s.categoryKey === 'floral')!
        const pungentSpice = middle.find(s => s.categoryKey === 'pungentSpice')!

        // Floral has 8 descriptors, pungentSpice has 2
        expect(floral.descriptorCount).toBe(8)
        expect(pungentSpice.descriptorCount).toBe(2)

        const floralSpan = floral.endAngle - floral.startAngle + PAD_ANGLES.middle
        const spiceSpan = pungentSpice.endAngle - pungentSpice.startAngle + PAD_ANGLES.middle
        expect(floralSpan / spiceSpan).toBeCloseTo(8 / 2, 1)
      })

      it('first outer segment starts near 0° and last ends near 360°', () => {
        const outer = wheel.outerRingSegments.value
        expect(outer[0].startAngle).toBeCloseTo(PAD_ANGLES.outer / 2, 1)
        expect(outer[outer.length - 1].endAngle).toBeCloseTo(360 - PAD_ANGLES.outer / 2, 1)
      })

      it('midAngle is the average of startAngle and endAngle', () => {
        for (const seg of wheel.outerRingSegments.value.slice(0, 10)) {
          expect(seg.midAngle).toBeCloseTo((seg.startAngle + seg.endAngle) / 2, 2)
        }
      })

      it('segments within a category are contiguous (no gaps except pad)', () => {
        const outer = wheel.outerRingSegments.value
        for (let i = 1; i < outer.length; i++) {
          if (outer[i].categoryKey === outer[i - 1].categoryKey) {
            // Gap between consecutive segments in the same category = PAD_ANGLES.outer
            const gap = outer[i].startAngle - outer[i - 1].endAngle
            expect(gap).toBeCloseTo(PAD_ANGLES.outer, 2)
          }
        }
      })

      it('inner ring segments share the same raw angular range as their children', () => {
        const inner = wheel.innerRingSegments.value
        const middle = wheel.middleRingSegments.value

        for (const innerSeg of inner) {
          const children = middle.filter(m => m.aromaType === innerSeg.aromaType)
          expect(children.length).toBeGreaterThan(0)

          // Compare unpadded (raw) start/end angles — each ring has different padding
          const innerRawStart = innerSeg.startAngle - PAD_ANGLES.inner / 2
          const innerRawEnd = innerSeg.endAngle + PAD_ANGLES.inner / 2
          const firstChildRawStart = children[0].startAngle - PAD_ANGLES.middle / 2
          const lastChildRawEnd = children[children.length - 1].endAngle + PAD_ANGLES.middle / 2

          expect(innerRawStart).toBeCloseTo(firstChildRawStart, 1)
          expect(innerRawEnd).toBeCloseTo(lastChildRawEnd, 1)
        }
      })
    })

    // ── SVG Paths ─────────────────────────────────────────────

    describe('SVG paths', () => {
      it('all inner ring segments have valid SVG path data', () => {
        for (const seg of wheel.innerRingSegments.value) {
          expect(seg.path).toMatch(/^M /)
          expect(seg.path).toContain('A ')
          expect(seg.path).toContain('L ')
          expect(seg.path).toMatch(/Z$/)
        }
      })

      it('all middle ring segments have valid SVG path data', () => {
        for (const seg of wheel.middleRingSegments.value) {
          expect(seg.path).toMatch(/^M /)
          expect(seg.path).toContain('A ')
          expect(seg.path).toContain('L ')
          expect(seg.path).toMatch(/Z$/)
        }
      })

      it('all outer ring segments have valid SVG path data', () => {
        for (const seg of wheel.outerRingSegments.value) {
          expect(seg.path).toMatch(/^M /)
          expect(seg.path).toContain('A ')
          expect(seg.path).toContain('L ')
          expect(seg.path).toMatch(/Z$/)
        }
      })

      it('label positions are within the SVG viewBox', () => {
        const allSegments = [
          ...wheel.innerRingSegments.value,
          ...wheel.middleRingSegments.value,
          ...wheel.outerRingSegments.value
        ]
        for (const seg of allSegments) {
          expect(seg.labelPosition.x).toBeGreaterThanOrEqual(0)
          expect(seg.labelPosition.x).toBeLessThanOrEqual(VIEWBOX_SIZE)
          expect(seg.labelPosition.y).toBeGreaterThanOrEqual(0)
          expect(seg.labelPosition.y).toBeLessThanOrEqual(VIEWBOX_SIZE)
        }
      })
    })

    // ── Wine Type Filtering ───────────────────────────────────

    describe('wine type filtering', () => {
      it('marks all middle ring categories inactive when wine type is null', () => {
        wineType.value = null
        for (const seg of wheel.middleRingSegments.value) {
          expect(seg.isActive).toBe(false)
        }
      })

      it('marks all outer ring segments inactive when wine type is null', () => {
        wineType.value = null
        for (const seg of wheel.outerRingSegments.value) {
          expect(seg.isActive).toBe(false)
        }
      })

      it('marks white-only categories as active for white wine', () => {
        wineType.value = 'white'
        const middle = wheel.middleRingSegments.value
        expect(middle.find(s => s.categoryKey === 'greenFruit')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'citrusFruit')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'stoneFruit')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'tropicalFruit')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'fruitDevelopmentWhite')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'bottleAgeWhite')!.isActive).toBe(true)
      })

      it('marks red-only categories as inactive for white wine', () => {
        wineType.value = 'white'
        const middle = wheel.middleRingSegments.value
        expect(middle.find(s => s.categoryKey === 'redFruit')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'blackFruit')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'driedCookedFruit')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'fruitDevelopmentRed')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'bottleAgeRed')!.isActive).toBe(false)
      })

      it('marks red-only categories as active for red wine', () => {
        wineType.value = 'red'
        const middle = wheel.middleRingSegments.value
        expect(middle.find(s => s.categoryKey === 'redFruit')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'blackFruit')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'driedCookedFruit')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'fruitDevelopmentRed')!.isActive).toBe(true)
        expect(middle.find(s => s.categoryKey === 'bottleAgeRed')!.isActive).toBe(true)
      })

      it('marks white-only categories as inactive for red wine', () => {
        wineType.value = 'red'
        const middle = wheel.middleRingSegments.value
        expect(middle.find(s => s.categoryKey === 'greenFruit')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'citrusFruit')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'stoneFruit')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'tropicalFruit')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'fruitDevelopmentWhite')!.isActive).toBe(false)
        expect(middle.find(s => s.categoryKey === 'bottleAgeWhite')!.isActive).toBe(false)
      })

      it('marks ALL categories as active for rosé wine', () => {
        wineType.value = 'rosé'
        for (const seg of wheel.middleRingSegments.value) {
          expect(seg.isActive).toBe(true)
        }
      })

      it('universal categories (floral, herbal, oak, etc.) are active for all wine types', () => {
        const universalCategories = ['floral', 'herbaceous', 'herbal', 'pungentSpice', 'other', 'yeast', 'malolacticConversion', 'oak', 'deliberateOxidation']
        for (const wt of ['white', 'rosé', 'red'] as WineType[]) {
          wineType.value = wt
          const middle = wheel.middleRingSegments.value
          for (const key of universalCategories) {
            expect(middle.find(s => s.categoryKey === key)!.isActive).toBe(true)
          }
        }
      })

      it('outer ring isActive matches its parent category', () => {
        wineType.value = 'white'
        const middleMap = new Map(wheel.middleRingSegments.value.map(s => [s.categoryKey, s.isActive]))
        for (const seg of wheel.outerRingSegments.value) {
          expect(seg.isActive).toBe(middleMap.get(seg.categoryKey))
        }
      })

      it('reactively updates isActive when wine type changes', () => {
        wineType.value = 'white'
        const greenFruitBefore = wheel.middleRingSegments.value.find(s => s.categoryKey === 'greenFruit')!
        expect(greenFruitBefore.isActive).toBe(true)

        wineType.value = 'red'
        const greenFruitAfter = wheel.middleRingSegments.value.find(s => s.categoryKey === 'greenFruit')!
        expect(greenFruitAfter.isActive).toBe(false)
      })
    })

    // ── Selection State ───────────────────────────────────────

    describe('selection state', () => {
      it('all outer segments are initially unselected', () => {
        for (const seg of wheel.outerRingSegments.value) {
          expect(seg.isSelected).toBe(false)
        }
      })

      it('toggleAroma adds an aroma to the selection', () => {
        wheel.toggleAroma('primary', 'floral', 'acacia')
        expect(selectedAromas.value.primary.floral).toContain('acacia')
      })

      it('toggleAroma removes a previously selected aroma', () => {
        wheel.toggleAroma('primary', 'floral', 'acacia')
        wheel.toggleAroma('primary', 'floral', 'acacia')
        expect(selectedAromas.value.primary.floral).not.toContain('acacia')
      })

      it('toggleAroma does not add duplicates', () => {
        wheel.toggleAroma('primary', 'floral', 'acacia')
        // Manually push to simulate — toggle should remove, not double-add
        expect(selectedAromas.value.primary.floral.filter(d => d === 'acacia')).toHaveLength(1)
      })

      it('isSelected reflects the current selection in outer ring', () => {
        wheel.toggleAroma('primary', 'floral', 'rose')
        const roseSeg = wheel.outerRingSegments.value.find(
          s => s.categoryKey === 'floral' && s.descriptor === 'rose'
        )!
        expect(roseSeg.isSelected).toBe(true)

        const acaciaSeg = wheel.outerRingSegments.value.find(
          s => s.categoryKey === 'floral' && s.descriptor === 'acacia'
        )!
        expect(acaciaSeg.isSelected).toBe(false)
      })

      it('toggleAroma ignores inactive categories', () => {
        wineType.value = 'white'
        wheel.toggleAroma('primary', 'redFruit', 'raspberry')
        expect(selectedAromas.value.primary.redFruit).toEqual([])
      })

      it('toggleAroma ignores all categories when wine type is null', () => {
        wineType.value = null
        wheel.toggleAroma('primary', 'floral', 'acacia')
        expect(selectedAromas.value.primary.floral).toEqual([])
      })

      it('toggleAroma works across all three aroma types', () => {
        wineType.value = 'rosé' // all categories active
        wheel.toggleAroma('primary', 'floral', 'violet')
        wheel.toggleAroma('secondary', 'oak', 'vanilla')
        wheel.toggleAroma('tertiary', 'deliberateOxidation', 'almond')

        expect(selectedAromas.value.primary.floral).toContain('violet')
        expect(selectedAromas.value.secondary.oak).toContain('vanilla')
        expect(selectedAromas.value.tertiary.deliberateOxidation).toContain('almond')
      })

      it('reactively updates isSelected when selectedAromas changes externally', () => {
        selectedAromas.value.primary.floral.push('acacia' as never)

        const seg = wheel.outerRingSegments.value.find(
          s => s.categoryKey === 'floral' && s.descriptor === 'acacia'
        )!
        expect(seg.isSelected).toBe(true)
      })

      it('toggling inactive category via wine type change does not modify selection', () => {
        wineType.value = 'white'
        wheel.toggleAroma('primary', 'greenFruit', 'apple')
        expect(selectedAromas.value.primary.greenFruit).toContain('apple')

        // Switch to red — greenFruit becomes inactive
        wineType.value = 'red'
        // Attempting to toggle an inactive category is a no-op
        wheel.toggleAroma('primary', 'greenFruit', 'pear')
        expect(selectedAromas.value.primary.greenFruit).not.toContain('pear')
        // Existing selection persists (cleanup is handled by useTastingData)
        expect(selectedAromas.value.primary.greenFruit).toContain('apple')
      })
    })

    // ── Colors ────────────────────────────────────────────────

    describe('colors', () => {
      it('outer ring color is a lightened version of its category base color', () => {
        const seg = wheel.outerRingSegments.value.find(s => s.categoryKey === 'floral')!
        expect(seg.baseColor).toBe('#9B59B6')
        // Lightened by 0.45 — the color should differ from the base
        expect(seg.color).not.toBe(seg.baseColor)
        expect(seg.color).toBe(lightenColor('#9B59B6', 0.45))
      })

      it('middle ring color matches the AROMAS definition', () => {
        for (const seg of wheel.middleRingSegments.value) {
          const group = AROMAS[seg.aromaType] as Record<string, { color: string }>
          expect(seg.color).toBe(group[seg.categoryKey].color)
        }
      })
    })

    // ── Constants & Metadata ──────────────────────────────────

    describe('constants and metadata', () => {
      it('viewBox is correct', () => {
        expect(wheel.viewBox).toBe('0 0 500 500')
      })

      it('center is at the middle of the viewBox', () => {
        expect(wheel.center).toEqual(CENTER)
        expect(wheel.center.x).toBe(VIEWBOX_SIZE / 2)
        expect(wheel.center.y).toBe(VIEWBOX_SIZE / 2)
      })

      it('radii are properly nested and increasing', () => {
        expect(wheel.radii.inner.outer).toBeLessThan(wheel.radii.middle.inner)
        expect(wheel.radii.middle.outer).toBeLessThan(wheel.radii.outer.inner)
        expect(wheel.radii.outer.outer).toBeLessThan(VIEWBOX_SIZE / 2)
      })

      it('radii match the exported RADII constant', () => {
        expect(wheel.radii).toEqual(RADII)
      })
    })
  })
})
