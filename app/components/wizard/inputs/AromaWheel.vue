<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import type { AromaObject, WineType } from '~/types/tasting'
import {
  useAromaWheel,
  isTextFlipped,
  type OuterRingSegment,
  type MiddleRingSegment
} from '~/composables/useAromaWheel'

const model = defineModel<AromaObject>({ required: true })

const props = withDefaults(defineProps<{
  wineType: WineType | null
  label?: string
}>(), {
  label: 'Aromas'
})

const wineTypeRef = toRef(props, 'wineType')

const {
  innerRingSegments,
  middleRingSegments,
  outerRingSegments,
  toggleAroma,
  viewBox,
  center
} = useAromaWheel({
  wineType: wineTypeRef,
  selectedAromas: model
})

// ─── Tooltip State ────────────────────────────────────────────────

const tooltip = ref<{
  visible: boolean
  x: number
  y: number
  text: string
  category: string
}>({
  visible: false,
  x: 0,
  y: 0,
  text: '',
  category: ''
})

let tooltipTimeout: ReturnType<typeof setTimeout> | null = null

function showTooltip(segment: OuterRingSegment | MiddleRingSegment, event: MouseEvent | TouchEvent) {
  if (tooltipTimeout) clearTimeout(tooltipTimeout)

  const svg = (event.currentTarget as Element).closest('svg')
  if (!svg) return

  const rect = svg.getBoundingClientRect()
  const svgWidth = rect.width
  const svgHeight = rect.height

  const isOuter = 'descriptor' in segment
  const label = isOuter ? segment.descriptor : segment.label
  const category = isOuter
    ? (middleRingSegments.value.find(m => m.categoryKey === segment.categoryKey)?.label ?? segment.categoryKey)
    : segment.aromaType

  const scaleX = svgWidth / 500
  const scaleY = svgHeight / 500
  const pixelX = segment.labelPosition.x * scaleX
  const pixelY = segment.labelPosition.y * scaleY

  tooltip.value = {
    visible: true,
    x: rect.left + pixelX,
    y: rect.top + pixelY - 10,
    text: label,
    category
  }
}

function hideTooltip() {
  tooltipTimeout = setTimeout(() => {
    tooltip.value.visible = false
  }, 100)
}

function handleSegmentClick(segment: OuterRingSegment) {
  if (!segment.isActive) return
  toggleAroma(segment.aromaType, segment.categoryKey, segment.descriptor)
}

// ─── Label Helpers ────────────────────────────────────────────────

function formatCategoryLabel(label: string): string[] {
  if (label.length <= 10) return [label]
  const words = label.split(/[\s/]+/)
  if (words.length === 1) return [label]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function outerLabelFontSize(segment: OuterRingSegment): number {
  const arcSpan = segment.endAngle - segment.startAngle
  const charCount = segment.descriptor.length
  const baseSize = Math.min(8, arcSpan * 1.2)
  return charCount > 14 ? Math.max(4, baseSize * 0.75) : Math.max(4.5, baseSize)
}

// ─── Selection glow filter id ─────────────────────────────────────

const selectedSegmentIds = computed(() => {
  const ids = new Set<string>()
  for (const seg of outerRingSegments.value) {
    if (seg.isSelected) {
      ids.add(`${seg.aromaType}-${seg.categoryKey}-${seg.descriptor}`)
    }
  }
  return ids
})

function segmentId(seg: OuterRingSegment): string {
  return `${seg.aromaType}-${seg.categoryKey}-${seg.descriptor}`
}
</script>

<template>
  <div
    data-testid="aroma-wheel"
    class="relative w-full"
  >
    <fieldset>
      <legend class="font-display text-lg font-bold text-highlighted">
        {{ label }}
      </legend>

      <div class="relative mx-auto mt-3 w-full max-w-[500px]">
        <svg
          :viewBox="viewBox"
          class="h-auto w-full"
          role="img"
          :aria-label="`${label} wheel with ${outerRingSegments.length} aromas`"
        >
          <defs>
            <filter
              id="glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur
                stdDeviation="2"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Center label -->
          <text
            :x="center.x"
            :y="center.y"
            text-anchor="middle"
            dominant-baseline="central"
            class="fill-current text-neutral-500 dark:text-neutral-400"
            font-size="14"
            font-weight="600"
          >
            {{ label }}
          </text>

          <!-- Inner Ring: Primary / Secondary / Tertiary -->
          <g data-testid="inner-ring">
            <template
              v-for="seg in innerRingSegments"
              :key="seg.aromaType"
            >
              <path
                :d="seg.path"
                :fill="seg.color"
                stroke="white"
                stroke-width="1"
                class="dark:stroke-neutral-800"
                opacity="0.85"
              />
              <text
                :x="seg.labelPosition.x"
                :y="seg.labelPosition.y"
                :transform="`rotate(${seg.labelRotation}, ${seg.labelPosition.x}, ${seg.labelPosition.y})`"
                :text-anchor="isTextFlipped(seg.midAngle) ? 'end' : 'start'"
                dominant-baseline="central"
                fill="white"
                font-size="10"
                font-weight="700"
                letter-spacing="0.5"
                class="pointer-events-none select-none uppercase"
              >
                {{ seg.label }}
              </text>
            </template>
          </g>

          <!-- Middle Ring: Categories -->
          <g data-testid="middle-ring">
            <template
              v-for="seg in middleRingSegments"
              :key="`${seg.aromaType}-${seg.categoryKey}`"
            >
              <path
                :d="seg.path"
                :fill="seg.color"
                stroke="white"
                stroke-width="0.5"
                class="dark:stroke-neutral-800"
                :opacity="seg.isActive ? 0.9 : 0.2"
                @mouseenter="showTooltip(seg, $event)"
                @mouseleave="hideTooltip"
                @touchstart.passive="showTooltip(seg, $event)"
              />
              <text
                v-if="seg.isActive"
                :x="seg.labelPosition.x"
                :y="seg.labelPosition.y - (formatCategoryLabel(seg.label).length > 1 ? 4 : 0)"
                :transform="`rotate(${seg.labelRotation}, ${seg.labelPosition.x}, ${seg.labelPosition.y})`"
                :text-anchor="isTextFlipped(seg.midAngle) ? 'end' : 'start'"
                dominant-baseline="central"
                fill="white"
                font-size="7"
                font-weight="600"
                class="pointer-events-none select-none"
              >
                <template v-if="formatCategoryLabel(seg.label).length === 1">
                  {{ formatCategoryLabel(seg.label)[0] }}
                </template>
                <template v-else>
                  <tspan
                    :x="seg.labelPosition.x"
                    dy="-3"
                  >
                    {{ formatCategoryLabel(seg.label)[0] }}
                  </tspan>
                  <tspan
                    :x="seg.labelPosition.x"
                    dy="8"
                  >
                    {{ formatCategoryLabel(seg.label)[1] }}
                  </tspan>
                </template>
              </text>
            </template>
          </g>

          <!-- Outer Ring: Individual Aromas (Clickable) -->
          <g data-testid="outer-ring">
            <template
              v-for="seg in outerRingSegments"
              :key="segmentId(seg)"
            >
              <path
                :d="seg.path"
                :fill="seg.isSelected ? seg.baseColor : seg.color"
                stroke="white"
                :stroke-width="seg.isSelected ? 1.5 : 0.3"
                class="dark:stroke-neutral-800"
                :class="{
                  'cursor-pointer': seg.isActive,
                  'cursor-not-allowed': !seg.isActive
                }"
                :opacity="seg.isActive ? (seg.isSelected ? 1 : 0.75) : 0.15"
                :filter="seg.isSelected ? 'url(#glow)' : undefined"
                :role="seg.isActive ? 'checkbox' : undefined"
                :aria-checked="seg.isActive ? seg.isSelected : undefined"
                :aria-label="seg.isActive ? `${seg.descriptor} (${seg.categoryKey})` : undefined"
                :aria-disabled="!seg.isActive ? true : undefined"
                :tabindex="seg.isActive ? 0 : -1"
                :data-testid="`aroma-${seg.descriptor.replace(/[\s/]+/g, '-')}`"
                @click="handleSegmentClick(seg)"
                @keydown.enter.prevent="handleSegmentClick(seg)"
                @keydown.space.prevent="handleSegmentClick(seg)"
                @mouseenter="seg.isActive ? showTooltip(seg, $event) : undefined"
                @mouseleave="hideTooltip"
                @touchstart.passive="seg.isActive ? showTooltip(seg, $event) : undefined"
              />
              <!-- Outer ring labels: hidden on small screens -->
              <text
                v-if="seg.isActive"
                :x="seg.labelPosition.x"
                :y="seg.labelPosition.y"
                :transform="`rotate(${seg.labelRotation}, ${seg.labelPosition.x}, ${seg.labelPosition.y})`"
                :text-anchor="isTextFlipped(seg.midAngle) ? 'end' : 'start'"
                dominant-baseline="central"
                :fill="seg.isSelected ? 'white' : '#333'"
                :font-size="outerLabelFontSize(seg)"
                font-weight="500"
                class="pointer-events-none select-none sm:block hidden"
                :class="{ 'dark:fill-neutral-200': !seg.isSelected, 'dark:fill-white': seg.isSelected }"
              >
                {{ seg.descriptor }}
              </text>
            </template>
          </g>
        </svg>

        <!-- Tooltip overlay (positioned absolute over the SVG) -->
        <Teleport to="body">
          <Transition name="fade">
            <div
              v-if="tooltip.visible"
              class="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900"
              :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
              role="tooltip"
            >
              <div class="font-semibold capitalize">
                {{ tooltip.text }}
              </div>
              <div class="text-neutral-400 dark:text-neutral-500">
                {{ tooltip.category }}
              </div>
            </div>
          </Transition>
        </Teleport>
      </div>

      <!-- Screen-reader summary of selected aromas -->
      <div
        class="sr-only"
        aria-live="polite"
      >
        {{ selectedSegmentIds.size }} aromas selected
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* SVG text inside the wheel should not be selectable */
svg text {
  user-select: none;
  -webkit-user-select: none;
}

/* Ensure dark mode SVG text uses correct fill via CSS class */
:deep(.dark\:fill-neutral-200) {
  @media (prefers-color-scheme: dark) {
    fill: #e5e5e5;
  }
}

:deep(.dark\:fill-white) {
  @media (prefers-color-scheme: dark) {
    fill: #ffffff;
  }
}
</style>
