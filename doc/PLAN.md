# Wine Tasting Notes Generator - Project Plan

## Overview
A Nuxt 4 application that helps users generate wine tasting notes based on WSET Level 3 standards. Users complete a multi-step wizard to describe their wine observations, then the system generates tasting notes in various stylistic profiles (Professional, Casual, Bar Talk, Playful).

## Key Requirements
- **Mobile-first wizard interface** with great desktop experience
- **No data persistence** - all state held in memory during session
- **Template-based text generation** - no AI/LLM integration
- **Multiple output profiles** - Professional, Casual, Bar Talk, Playful
- **Optional inputs** - wizard works even with incomplete data
- **Step navigation** - users can move forward/backward through wizard

## Technical Stack
- **Framework**: Nuxt 4 with TypeScript
- **UI Components**: Nuxt UI (preferred) + Tailwind CSS v4
- **State Management**: Vue 3 Composition API (reactive state)
- **Routing**: Nuxt file-based routing
- **Testing**: Vitest with @nuxt/test-utils
- **Form Handling**: Native Vue reactivity

## Architecture
### Data Model
Based on WSET Level 3 Systematic Approach to Tasting Wine (2022, Issue 2), we need to capture:

#### Appearance
- `wineType`: 'white' | 'rosé' | 'red' | null (primary selector, impacts color options and other logic)
- `clarity`: 'clear' | 'hazy' | null (hazy may indicate fault)
- `intensity`: 'pale' | 'medium' | 'deep' | null
- `color`: 
  - White: 'lemon-green' | 'lemon' | 'gold' | 'amber' | 'brown'
  - Rosé: 'pink' | 'salmon' | 'orange'
  - Red: 'purple' | 'ruby' | 'garnet' | 'tawny' | 'brown'
- `otherObservations`: string[] - any combination of:
  - 'legs/tears'
  - 'deposit'
  - 'pétillance'
  - 'bubbles'

#### Nose
- `condition`: 'clean' | 'unclean' | null (unclean may indicate fault)
- `intensity`: 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'pronounced' | null
- `development`: 'youthful' | 'developing' | 'fully developed' | 'tired/past its best' | null
- `aromas`: object with three categories:

**Primary Aromas** (grape and fermentation):
- `floral[]`: acacia, honeysuckle, chamomile, elderflower, geranium, blossom, rose, violet
- `greenFruit[]`: apple, gooseberry, pear, pear drop, quince, grape
- `citrusFruit[]`: grapefruit, lemon, lime, orange peel, lemon peel
- `stoneFruit[]`: peach, apricot, nectarine
- `tropicalFruit[]`: banana, lychee, mango, melon, passion fruit, pineapple
- `redFruit[]`: redcurrant, cranberry, raspberry, strawberry, red cherry, red plum
- `blackFruit[]`: blackcurrant, blackberry, bramble, blueberry, black cherry, black plum
- `driedCookedFruit[]`: fig, prune, raisin, sultana, kirsch, jamminess, baked/stewed fruits, preserved fruits
- `herbaceous[]`: green bell pepper (capsicum), grass, tomato leaf, asparagus, blackcurrant leaf
- `herbal[]`: eucalyptus, mint, medicinal, lavender, fennel, dill
- `pungentSpice[]`: black/white pepper, liquorice
- `other[]`: flint, wet stones, wet wool

**Secondary Aromas** (post-fermentation winemaking):
- `yeast[]`: biscuit, bread, toast, pastry, brioche, bread dough, cheese
- `malolacticConversion[]`: butter, cheese, cream
- `oak[]`: vanilla, cloves, nutmeg, coconut, butterscotch, toast, cedar, charred wood, smoke, chocolate, coffee, resinous

**Tertiary Aromas** (maturation):
- `deliberateOxidation[]`: almond, marzipan, hazelnut, walnut, chocolate, coffee, toffee, caramel
- `fruitDevelopmentWhite[]`: dried apricot, marmalade, dried apple, dried banana
- `fruitDevelopmentRed[]`: fig, prune, tar, dried blackberry, dried cranberry, cooked blackberry, cooked red plum
- `bottleAgeWhite[]`: petrol, kerosene, cinnamon, ginger, nutmeg, toast, nutty, mushroom, hay, honey
- `bottleAgeRed[]`: leather, forest floor, earth, mushroom, game, tobacco, vegetal, wet leaves, savoury, meaty, farmyard

#### Palate
- `sweetness`: 'dry' | 'off-dry' | 'medium-dry' | 'medium-sweet' | 'sweet' | 'luscious' | null
- `acidity`: 'low' | 'medium(-)' | 'medium' | 'medium(+)' | 'high' | null
- `tannin`: 'low' | 'medium(-)' | 'medium' | 'medium(+)' | 'high' | null
- `alcohol`: 'low' | 'medium' | 'high' | null (or mark as 'fortified': true)
- `fortified`: boolean
- `body`: 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'full' | null
- `mousse`: 'delicate' | 'creamy' | 'aggressive' | null (only for sparkling wines)
- `flavorIntensity`: 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'pronounced' | null
- `finish`: 'short' | 'medium(-)' | 'medium' | 'medium(+)' | 'long' | null
- `flavors`: object with same structure as aromas (Primary, Secondary, Tertiary)
  - Same categories and options as nose aromas

#### Conclusions
- `qualityLevel`: 'faulty' | 'poor' | 'acceptable' | 'good' | 'very good' | 'outstanding' | null
- `readiness`: 'too young' | 'can drink now, but has potential for ageing' | 'drink now: not suitable for ageing or further ageing' | 'too old' | null

### Component Structure
```text
app/
├── components/
│   ├── wizard/
│   │   ├── WizardContainer.vue
│   │   ├── WizardProgress.vue
│   │   ├── WizardNavigation.vue
│   │   ├── steps/
│   │   │   ├── AppearanceStep.vue         # Includes wine type selector first
│   │   │   ├── NoseStep.vue
│   │   │   ├── PalateStep.vue
│   │   │   └── ConclusionsStep.vue
│   │   └── inputs/
│   │       ├── RadioGroup.vue
│   │       ├── CheckboxGroup.vue
│   │       ├── WineTypeSelector.vue       # Initial wine type picker
│   │       ├── AromaWheel.vue             # SVG radial aroma chart (Wine Folly-style)
│   │       └── AromaWheelChips.vue        # Selected aromas summary chips
│   └── results/
│       ├── TastingNoteDisplay.vue
│       ├── ProfileSelector.vue
│       └── CopyToClipboard.vue
├── composables/
│   ├── useTastingData.ts
│   ├── useWizardNavigation.ts
│   └── useNoteGenerator.ts
├── data/
│   └── wset-sat-spec.json          # Generated from wineTypeFilters.ts — WSET fields, aromas, colors
├── types/
│   ├── tasting.ts                   # Generated from wineTypeFilters.ts — TypeScript interfaces
│   └── profiles.ts
└── utils/
    ├── wineTypeFilters.ts            # CANONICAL SOURCE OF TRUTH: filtering, aromas, field definitions
    ├── templates/
    │   ├── professional.ts
    │   ├── casual.ts
    │   ├── bartalk.ts
    │   └── playful.ts
    ├── textGenerators.ts
    └── aromaCategorizer.ts
```

## WSET SAT JSON Specification

### Overview
The canonical source of truth for wine-type filtering, aroma definitions, and WSET field structures lives in `app/utils/wineTypeFilters.ts`. From that file, two artifacts are generated:

- `app/data/wset-sat-spec.json` — a JSON representation of the full WSET data model consumed by the Aroma Wheel, text templates, and wizard UI
- `app/types/tasting.ts` — TypeScript interfaces auto-generated from the spec

**Changes to fields, aromas, or filter rules must be made in `wineTypeFilters.ts`**, not directly in the JSON or type files. A generation step (build-time script or Nuxt module) produces the JSON spec and TypeScript types from that canonical source.

### Purpose
The JSON spec is consumed by:
1. **TypeScript type generation** — auto-generate `tasting.ts` interfaces from the spec
2. **Aroma Wheel component** — reads categories, descriptors, colors, and wine type filters
3. **Text generation templates** — templates reference the spec to know what fields/options exist
4. **Wizard UI** — field definitions, option lists, and conditional visibility rules
5. **Validation logic** — `wineTypeFilters` section drives all category filtering

### File Location
```text
app/data/wset-sat-spec.json
```

### Structure

```text
wset-sat-spec.json
├── standard          # WSET reference metadata (name, issue, copyright)
├── wineTypes         # ["white", "rosé", "red"]
├── appearance        # Fields: clarity, intensity, color, otherObservations
├── nose              # Fields: condition, intensity, development, aromas (→ ref)
├── palate            # Fields: sweetness, acidity, tannin, alcohol, body, mousse, etc.
├── conclusions       # Fields: qualityLevel, readiness
├── aromas            # Full aroma taxonomy (primary/secondary/tertiary)
│   ├── primary       # 12 categories, 64 descriptors
│   ├── secondary     # 3 categories, 22 descriptors
│   └── tertiary      # 5 categories, 40 descriptors
└── wineTypeFilters   # Which wine types can see each category
```

### Field Definitions
Each field follows this schema:
```json
{
  "inputType": "single" | "multi" | "aromaWheel" | "boolean",
  "options": [...],                          // for simple fields
  "optionsByWineType": { ... },              // for wine-type-dependent fields (e.g. color)
  "ref": "#/aromas",                         // for aroma/flavor wheel fields
  "visibleWhen": { "field": "/...", "includes": [...] }  // conditional visibility (JSON Pointer)
}
```

Options can be strings or objects with metadata:
```json
{ "value": "hazy", "faultyIndicator": true }   // WSET "faulty?" annotation
```

### Aroma Taxonomy
Each aroma type (primary/secondary/tertiary) contains categories, each with:
- `label` — display name (e.g., "Citrus Fruit")
- `color` — hex color for the Aroma Wheel segment
- `descriptors` — array of individual aroma strings

**Totals: 20 categories, 126 individual descriptors** matching the official WSET Level 3 Wine-Lexicon exactly.

### Wine Type Filters
The `wineTypeFilters` section maps each category to the wine types that can access it:
```json
{
  "primary": {
    "floral": ["white", "rosé", "red"],
    "greenFruit": ["white", "rosé"],
    "redFruit": ["rosé", "red"],
    ...
  }
}
```
- **Rosé always appears in every category** (gets both white and red characteristics)
- If a wine type is NOT listed, the category is visually muted on the Aroma Wheel and non-interactive
- When wine type changes, any selected aromas in now-filtered categories are silently removed

### Type Generation
TypeScript types in `app/types/tasting.ts` are auto-generated from `wineTypeFilters.ts` via the JSON spec:
- Union types derived from `options` arrays (e.g., `type Clarity = 'clear' | 'hazy'`)
- `AromaObject` interface derived from category keys
- `TastingData` interface derived from section structure
- A build-time script or Nuxt module reads `wineTypeFilters.ts`, emits the JSON spec, then emits `.ts` types

### WSET Compliance Notes
- All field scales, options, and descriptors match **WSET Level 3 SAT Issue 2, 2022** exactly
- `faultyIndicator: true` on `hazy` (clarity) and `unclean` (condition) reflects the WSET "(faulty?)" annotation
- Tertiary categories use "(white)" and "(red)" suffixes per the official lexicon
- Mousse field is conditionally visible only when sparkling observations are present

## Implementation Phases
### Phase 1: Foundation & Data Models
- Create `app/utils/wineTypeFilters.ts` — canonical source of truth for all WSET fields, aromas, and filter rules
- Generate `app/data/wset-sat-spec.json` from wineTypeFilters.ts
- Auto-generate TypeScript interfaces (`app/types/tasting.ts`) from the spec
- Composable for reactive state and setters/reset
- Unit tests for models and type generation

### Phase 2: Wizard UI Foundation
- Wizard container and navigation logic
- Progress indicator (Nuxt UI Steps)
- Forward/back, mobile-first
- SEO/meta tags and branding

### Phase 3: Form Input Components
- RadioGroup, CheckboxGroup, WineTypeSelector (all with full options)
- **AromaWheel**: SVG radial aroma chart (Wine Folly-style) — see [Aroma Wheel Component](#aroma-wheel-component)
- **AromaWheelChips**: Selected aromas summary chips with removal
- v-model support, accessibility, touch targets
- Tests for input components

### Phase 4: Wizard Step Components
- Four step components with section forms
- Bind to state, handle optionality/skip
- Layout for mobile/desktop
- Tests for binding/interaction

### Phase 5: Text Generation Engine
- Utility functions for each note section
- Aroma/flavor categorizer/formatter
- Four template files: professional, casual, bartalk, playful
- Handle missing data gracefully
- Unit tests (full/partial/none)

### Phase 6: Results Display
- ProfileSelector (Professional, Casual, Bar Talk, Playful)
- TastingNoteDisplay, CopyToClipboard
- Integration in wizard after Generate
- Tests for switching, rendering, copy

### Phase 7: Polish & UX
- Branding: Elegant wine theme (burgundy/dark reds/gold accents)
- Responsive review all breakpoints
- Accessibility: ARIA/contrast/focus
- Transitions, loading, friendly errors

### Phase 8: Testing & QA
- Unit/component/integration tests (target 80%+)
- Manual testing: devices/browsers
- Edge cases: partial/empty/maximal inputs

### Phase 9: Documentation
- README/project overview
- JSDoc/code documentation
- Type hints, component props

## Template Generation Strategy
- Conditional sentences/templates per profile
- List handling: grammatical joins, category/grouping
- Section omitted if all data missing
- Empty state: "No data provided" message

### Profile Examples

Based on the same input data (champagne-like sparkling white wine):

#### Professional Profile
```text
APPEARANCE: Clear and lemon in color, with medium intensity.

NOSE: Clean, with medium intensity. Detected floral (acacia, violet), green fruit (gooseberry), tropical fruit (lychee), yeast (bread) and bottle age (kerosene) aromas.

PALATE: Off-dry, with medium acidity and medium(-) tannin. High alcohol. Body is medium(-), with aggressive mousse and medium(-) flavor intensity. Detected green fruit (gooseberry), yeast (bread), deliberate oxidation (marzipan) and bottle age (savory) flavors.

CONCLUSIONS: This wine is of good quality. It's too old.
```

#### Casual Profile
```text
Appearance: Clear, lemon-colored, medium intensity.

Nose: Clean and floral — think acacia and violet — with notes of gooseberry, lychee, a bready/yeasty touch and a hint of kerosene from bottle age.

Palate: Slightly off-dry, zippy acidity, light tannin and noticeable alcohol. Lively bubbles, modest body and flavors of gooseberry, bread/yeast, marzipan from gentle oxidation, and savory aged notes.

Conclusion: A good wine, but past its prime.
```

#### Bar Talk Profile
```text
Smells floral and fresh — acacia/violet, gooseberry and a touch of lychee, with bready yeast and a faint kerosene edge from age.

Tastes slightly off-dry, bright acid, light tannins and pretty warm from the alcohol. Fizzy, fairly light-bodied, with gooseberry, bread, a bit of marzipan from oxidation and savory aged notes.

Solid wine, but past its best.
```

#### Playful Profile
```text
Clear, lemony — like a citrus flashlight.

Smells floral and bakery-fresh: acacia, violet, gooseberry, a hint of lychee and a sneaky kerosene whiff.

Tastes slightly sweet, zippy acid, light tannins, fizzy and warm. Gooseberry, bread, a marzipan wink, plus tired old-timer vibes.

Good bottle, but past its prime.
```

### Profile Characteristics
- **Professional**: Technical, formal, WSET-compliant, all-caps section headers, scientific phrasing
- **Casual**: Natural, readable, conversational flow, sentence-case headers, accessible language
- **Bar Talk**: Casual conversation, punchy sentences, no headers, direct and engaging
- **Playful**: Creative, metaphorical, humorous while maintaining accuracy, fun descriptions

## Wizard Steps Detail

### Step 1: Appearance
**Initial Selection - Wine Type:**
- Wine Type (radio, required before continuing):
  - White
  - Rosé
  - Red

**Form Fields (dynamically filtered based on wine type):**
- Clarity (radio): clear / hazy
- Intensity (radio): pale / medium / deep
- Color (radio, dynamically filtered):
  - If White selected: lemon-green / lemon / gold / amber / brown
  - If Rosé selected: pink / salmon / orange
  - If Red selected: purple / ruby / garnet / tawny / brown
- Other Observations (checkboxes): legs/tears, deposit, pétillance, bubbles

**Implementation Notes:**
- Wine type selection is stored in data model (prevents confusion, enables other conditional logic)
- Color options are filtered client-side based on selected wine type
- If user changes wine type, previously selected color is cleared (for data consistency)
- Mousse field in Palate step could also be conditionally shown based on wine observations (bubbles/pétillance)

### Step 2: Nose
**Form Fields:**
- Condition (radio): clean / unclean
- Intensity (radio): light / medium(-) / medium / medium(+) / pronounced
- Development (radio): youthful / developing / fully developed / tired/past its best
- Aromas (interactive AromaWheel — see [Aroma Wheel Component](#aroma-wheel-component) below):
  - SVG radial chart with 3 concentric rings: Aroma Type → Category → Individual Aromas
  - Click outer ring segments to toggle aroma selection
  - Selected aromas highlighted on wheel + shown as removable chips below
  - Categories filtered/muted by wine type

### Step 3: Palate
**Form Fields:**
- Sweetness (radio): dry / off-dry / medium-dry / medium-sweet / sweet / luscious
- Acidity (radio): low / medium(-) / medium / medium(+) / high
- Tannin (radio): low / medium(-) / medium / medium(+) / high
- Alcohol (radio): low / medium / high
- Fortified (checkbox): marks wine as fortified
- Body (radio): light / medium(-) / medium / medium(+) / full
- Mousse (radio, conditional for sparkling): delicate / creamy / aggressive
- Flavor Intensity (radio): light / medium(-) / medium / medium(+) / pronounced
- Finish (radio): short / medium(-) / medium / medium(+) / long
- Flavors (interactive AromaWheel — same component reused, see [Aroma Wheel Component](#aroma-wheel-component) below)

### Step 4: Conclusions
**Form Fields:**
- Quality Level (radio): faulty / poor / acceptable / good / very good / outstanding
- Readiness/Aging (radio): too young / can drink now but has potential for ageing / drink now: not suitable for ageing or further ageing / too old

## Aroma Wheel Component

### Overview
Replaces the accordion-based AromaFlavorPicker with an interactive SVG radial chart inspired by the [Wine Folly Aroma Chart](https://media.winefolly.com/aroma-flavor-chart-wine-front-excerpt.jpg). The same component is reused for both **Nose aromas** (Step 2) and **Palate flavors** (Step 3).

### Visual Structure — 3 Concentric Rings

```text
┌──────────────────────────────────────────────────────────┐
│                    OUTER RING                            │
│    Individual aromas (clickable to toggle selection)     │
│    e.g. "lemon", "lime", "apple", "violet"              │
│  ┌────────────────────────────────────────────────────┐  │
│  │               MIDDLE RING                          │  │
│  │    Categories within each aroma type               │  │
│  │    e.g. "Floral", "Citrus Fruit", "Oak"            │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │            INNER RING                        │  │  │
│  │  │    Aroma type (3 segments)                   │  │  │
│  │  │    Primary / Secondary / Tertiary            │  │  │
│  │  │                                              │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- **Inner ring (3 segments)**: Primary Aromas, Secondary Aromas, Tertiary Aromas
- **Middle ring**: Categories within each type (e.g., Primary → Floral, Green Fruit, Citrus Fruit, Stone Fruit, Tropical Fruit, Red Fruit, Black Fruit, Dried/Cooked Fruit, Herbaceous, Herbal, Pungent Spice, Other)
- **Outer ring**: Individual aromas within each category (e.g., Floral → acacia, honeysuckle, chamomile, elderflower, geranium, blossom, rose, violet)

### Ring Segment Layout

Each segment spans an angular arc proportional to the number of items it contains. Inner ring segments span the full arc of all their child middle-ring segments, and middle ring segments span the full arc of all their child outer-ring segments.

```text
Inner ring segment sizes (by sub-category count):
  Primary:   12 categories → largest arc
  Secondary:  3 categories → medium arc
  Tertiary:   5 categories → medium arc

Middle ring segments (by individual aroma count):
  Floral:           8 aromas
  Green Fruit:      6 aromas
  Citrus Fruit:     5 aromas
  Stone Fruit:      3 aromas
  Tropical Fruit:   6 aromas
  Red Fruit:        6 aromas
  Black Fruit:      6 aromas
  Dried/Cooked:     8 aromas
  Herbaceous:       5 aromas
  Herbal:           6 aromas
  Pungent Spice:    2 aromas
  Other:            3 aromas
  Yeast:            7 aromas
  MLF:              3 aromas
  Oak:             12 aromas
  Deliberate Ox.:   8 aromas
  Fruit Dev White:  4 aromas
  Fruit Dev Red:    7 aromas
  Bottle Age White: 10 aromas
  Bottle Age Red:   11 aromas
```

### Color Scheme (Wine Folly-inspired, by category family)

Each category family has a distinct color. Inner and middle ring segments use the base color; outer ring segments use lighter tints.

| Category Family | Base Color | Hex (approx) | Categories |
|---|---|---|---|
| Floral | Purple/Lavender | `#9B59B6` | floral |
| Green/Tree Fruit | Green | `#27AE60` | greenFruit |
| Citrus Fruit | Yellow | `#F1C40F` | citrusFruit |
| Stone Fruit | Peach/Orange | `#E67E22` | stoneFruit |
| Tropical Fruit | Bright Yellow-Green | `#2ECC71` | tropicalFruit |
| Red Fruit | Red | `#E74C3C` | redFruit |
| Black Fruit | Dark Red/Purple | `#8E44AD` | blackFruit |
| Dried/Cooked Fruit | Brown-Red | `#D35400` | driedCookedFruit |
| Herbaceous | Olive Green | `#6B8E23` | herbaceous |
| Herbal | Teal | `#1ABC9C` | herbal |
| Pungent Spice | Dark Brown | `#795548` | pungentSpice |
| Other/Mineral | Grey-Blue | `#7F8C8D` | other |
| Yeast | Warm Beige | `#D4A574` | yeast |
| MLF | Cream | `#FDEBD0` | malolacticConversion |
| Oak | Warm Brown | `#8B4513` | oak |
| Deliberate Oxidation | Amber | `#D4A017` | deliberateOxidation |
| Fruit Dev (White) | Light Gold | `#DAA520` | fruitDevelopmentWhite |
| Fruit Dev (Red) | Dark Plum | `#6A0D47` | fruitDevelopmentRed |
| Bottle Age (White) | Dusty Gold | `#B8860B` | bottleAgeWhite |
| Bottle Age (Red) | Dark Earth | `#5D4037` | bottleAgeRed |

### Interaction Model

1. **Click outer ring segment** → toggles individual aroma selection (highlighted with a solid fill + slight scale/glow; unselected returns to default tint)
2. **Hover/touch on any ring** → tooltip shows the aroma/category name (important for small segments)
3. **Selected aromas** → highlighted on wheel with solid category color + shown as **removable chips** below the wheel
4. **Chips area** → each chip shows the aroma name, colored by its category; clicking the chip's ✕ deselects it from the wheel
5. **Inner/middle ring segments** → not directly selectable, but clicking them could optionally scroll/zoom to that section on mobile

### Wine Type Filtering on the Wheel

When a wine type is selected (white/rosé/red), categories that are not valid for that wine type are **visually muted but still visible**:

- **Valid categories**: Full color, interactive (clickable outer ring segments)
- **Filtered categories**: Reduced opacity (e.g., `opacity: 0.25`), no pointer events, grey-tinted
- **Rosé**: All categories remain active (per design — rosé gets everything)
- **No wine type selected**: All categories muted and non-interactive (same disabled state as filtered categories); a warning message prompts the user to select a wine type first

If a user changes wine type and has previously selected aromas in now-filtered categories, those selections are **silently cleared** (consistent with the existing auto-clean behavior + toast notification).

### Mobile Responsiveness

- **Desktop (≥768px)**: Full wheel displayed at comfortable size (~500px diameter), chips below
- **Tablet (≥640px)**: Wheel scaled to fit, still fully interactive
- **Mobile (<640px)**: Wheel scales down but remains usable at ~300px diameter minimum
  - Outer ring text may be hidden at small sizes; rely on tooltips/touch for aroma names
  - Consider a **pinch-to-zoom** or **tap-to-expand** gesture for category sections on very small screens
  - Touch targets must be ≥44px where possible; for very small outer segments, a tap could open a small popover listing the aromas in that category
- **Summary chips**: Always visible below the wheel, horizontally scrollable on mobile

### SVG Implementation Notes

- Render as a single `<svg>` element with `viewBox` for responsive scaling
- Each ring segment is an SVG `<path>` (arc) computed from polar coordinates
- Use a Vue composable (`useAromaWheel.ts`) to compute:
  - Segment angles based on aroma counts
  - Arc paths using standard SVG arc commands (`M`, `A`, `L`)
  - Hit testing for click/touch interactions
- Text labels:
  - Inner ring: rotated text along the arc or centered in segment
  - Middle ring: rotated text along the arc
  - Outer ring: rotated text, may be truncated/hidden on small segments (tooltip fallback)
- Transitions: smooth CSS transitions for selection state changes (color, opacity, scale)
- Accessibility:
  - Each outer ring segment has `role="checkbox"`, `aria-checked`, `aria-label`
  - Category groups use `role="group"` with `aria-label`
  - Keyboard navigation: Tab between segments, Enter/Space to toggle
  - Screen reader announces: "Lemon, Citrus Fruit, Primary Aromas — selected/not selected"

### Component API

```vue
<!-- AromaWheel.vue -->
<AromaWheel
  v-model="selectedAromas"      <!-- AromaObject: the selected aromas -->
  :wine-type="wineType"          <!-- WineType: filters visible categories -->
  :aroma-definitions="AROMAS"   <!-- Full aroma definitions constant -->
  label="Aromas"                 <!-- Accessibility label -->
/>

<!-- AromaWheelChips.vue -->
<AromaWheelChips
  v-model="selectedAromas"      <!-- Same AromaObject, for removal -->
  :wine-type="wineType"          <!-- WineType: filters chip visibility + null-state warning -->
  :aroma-definitions="AROMAS"
/>
```

### Key Composable: `useAromaWheel.ts`

Responsibilities:
- Compute segment geometry (angles, arcs, positions) from aroma definitions
- Handle wine type filtering (which segments are active/muted)
- Manage selection state (toggle aroma, clear filtered aromas)
- Provide computed SVG path data for each segment
- Handle responsive sizing

### Testing Strategy for AromaWheel

- **Unit tests** (`useAromaWheel.ts`):
  - Segment angle computation is correct and sums to 360°
  - Wine type filtering mutes correct categories
  - Selection toggle works (add/remove individual aromas)
  - Auto-cleanup on wine type change removes invalid selections
- **Component tests** (`AromaWheel.vue`):
  - Renders correct number of SVG segments
  - Click on outer segment toggles selection
  - Filtered segments are non-interactive
  - v-model updates correctly
  - Chips appear/disappear with selections
- **Accessibility tests**:
  - ARIA roles and labels present
  - Keyboard navigation works
  - Color contrast meets WCAG AA

## UX/Design Notes
- Burgundy/dark red as primary brand color
- Rich gold or sand for accents/highlights
- Tailwind config to set colors accordingly
- Use wine-related icons/graphics (bottle, glass)
- Consistent spacing/typography, Nuxt UI cards
- Focus on comfort and clarity for beginners

## Key Considerations
- Every generator function must allow incomplete data/sections
- No session or long-term storage
- 100% client-side, instant/fast
- Accessible (WCAG AA min.)
- Tests for empty, partial, full wizard completion

## Success Criteria
- multi-step wizard, all WSET fields, forward/back
- Mobile-first
- 4 selectable output profiles (Professional, Casual, Bar Talk, Playful)
- Works with partial data or skipped sections
- Copy to clipboard
- No persistence
- 80%+ test coverage
- Nuxt UI + Tailwind + TypeScript strict
- Branded, accessible, easy to use

---

**Review this plan before starting implementation. All full aroma/flavor sets from `inspiration.html` are in scope as per current requirements.**

If you have feedback on branding palette or profile names, include it before phase 1 begins.
