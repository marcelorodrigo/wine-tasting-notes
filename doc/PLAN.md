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

## Design Decisions

- **App entry**: Landing page with hero section + "Start Tasting" CTA → wizard lives on a separate `/tasting` route
- **Color theme**: Nuxt UI built-in palette — `primary: 'rose'`, `neutral: 'stone'` — for seamless dark mode integration across all components
- **Visual style**: Wine-label inspired — decorative borders, serif typography for headings (e.g. Playfair Display or similar Google Font), elegant card styling
- **Step transitions**: Minimal fade transitions between wizard steps (Vue `<Transition>` with opacity)
- **Progress indicator**: Horizontal stepper bar at the top of the wizard showing all 4 steps with labels and icons
- **Color mode**: System preference (auto-detect) as default, with manual toggle via `UColorModeButton`
- **Mobile-first**: All layouts start from 320px mobile, scale up to desktop. Touch targets ≥44px. Cards stack vertically on mobile, use grid on desktop

---

## Implementation Phases

### Phase 1: Theme, Branding & App Shell
> **Goal**: Transform the Nuxt starter template into a wine-themed app shell with proper branding, dark mode, and routing. After this phase, the app should look polished even with placeholder content.

#### Task 1.1: Configure Wine Color Theme & Typography
**What to do**:
- Update `app/app.config.ts` to set `primary: 'rose'` and `neutral: 'stone'` colors
- Add a serif Google Font (e.g. Playfair Display) for headings via `nuxt.config.ts` — use `@nuxtjs/google-fonts` module or a `<link>` in `app.vue` `useHead()`
- Create a global CSS utility class for the serif font (e.g. `.font-display`) in `app/assets/css/main.css`
- Verify the color theme renders correctly in both light and dark modes

**Expected result**: All Nuxt UI components (buttons, cards, inputs) render in rose/stone tones. Headings use serif font. Dark mode shows appropriate contrasts.

**Nuxt UI components used**: `UApp`, `UColorModeButton`

**Files to modify**: `app/app.config.ts`, `app/assets/css/main.css`, `nuxt.config.ts` or `app/app.vue`

#### Task 1.2: Redesign App Shell (Header & Footer)
**What to do**:
- Update `app/app.vue` to replace the Nuxt starter branding:
  - **Header**: Show app name "Wine Tasting Notes" with a wine glass icon (`i-lucide-wine`). Keep `UColorModeButton` toggle. Remove GitHub link and `TemplateMenu`. Add navigation link to `/tasting` if the user is on the landing page
  - **Footer**: Simple footer with "Built with Nuxt UI" or similar. Wine-themed, minimal
- Update `useSeoMeta()` with proper title/description for the wine app
- Replace or remove `AppLogo.vue` and `TemplateMenu.vue` with wine-themed branding

**Expected result**: Header shows "Wine Tasting Notes" with wine icon, color mode toggle. Footer is elegant and minimal. Works on mobile (hamburger if needed) and desktop.

**Nuxt UI components used**: `UHeader`, `UFooter`, `UButton`, `UColorModeButton`, `USeparator`

**Files to modify**: `app/app.vue`, `app/components/AppLogo.vue` (replace or remove), `app/components/TemplateMenu.vue` (remove)

#### Task 1.3: Create Landing Page with Hero Section
**What to do**:
- Redesign `app/pages/index.vue` as a wine-themed landing page:
  - **Hero section**: Large serif heading "Craft Professional Wine Tasting Notes", subtitle explaining the app, prominent "Start Tasting" `UButton` linking to `/tasting`
  - **Features section** (optional): 3-4 cards showing key features (WSET compliant, 4 profiles, mobile-friendly, no data stored)
  - **Visual**: Wine-related decorative elements or gradients. Consider a subtle gradient background (rose-to-stone tones)
- The page must look stunning in both light and dark modes
- Mobile: Hero stacks vertically, CTA is full-width button

**Expected result**: A beautiful, modern landing page that sets the wine aesthetic. Users immediately understand what the app does and can click through to start.

**Nuxt UI components used**: `UPageHero`, `UPageSection`, `UPageCTA`, `UButton`, `UCard`

**Files to modify**: `app/pages/index.vue`

#### Task 1.4: Create Tasting Page Route (Placeholder)
**What to do**:
- Create `app/pages/tasting.vue` as the wizard page
- For now, just show a centered heading "Tasting Wizard" with a "Back to Home" link
- This establishes the route and proves navigation works
- Add proper `useSeoMeta()` for this page

**Expected result**: Clicking "Start Tasting" on the landing page navigates to `/tasting`. Back navigation works. Page has proper meta tags.

**Files to create**: `app/pages/tasting.vue`

---

### Phase 2: Data Models & Wine Type Filters
> **Goal**: Build the canonical data layer — TypeScript types, wine type filtering logic, and the WSET spec validation. This is the foundation that every UI component depends on.

#### Task 2.1: Create TypeScript Interfaces for Tasting Data
**What to do**:
- Create `app/types/tasting.ts` with all TypeScript interfaces:
  - `WineType = 'white' | 'rosé' | 'red'`
  - `TastingData` — top-level object with `appearance`, `nose`, `palate`, `conclusions` sections
  - `AppearanceData` — `wineType`, `clarity`, `intensity`, `color`, `otherObservations`
  - `NoseData` — `condition`, `intensity`, `development`, `aromas`
  - `PalateData` — `sweetness`, `acidity`, `tannin`, `alcohol`, `fortified`, `body`, `mousse`, `flavorIntensity`, `flavors`, `finish`
  - `ConclusionsData` — `qualityLevel`, `readiness`
  - `AromaObject` — nested object with `primary`, `secondary`, `tertiary` keys, each containing arrays per category
  - All union types for each field (e.g. `type Clarity = 'clear' | 'hazy'`)
- Create `app/types/profiles.ts` with `ProfileType = 'professional' | 'casual' | 'bartalk' | 'playful'`
- All fields must be nullable (user can skip anything)

**Expected result**: Full type safety for the entire data model. Importing `TastingData` anywhere gives complete autocomplete and type checking.

**Files to create**: `app/types/tasting.ts`, `app/types/profiles.ts`

#### Task 2.2: Create Wine Type Filters Utility (Canonical Source of Truth)
**What to do**:
- Create `app/utils/wineTypeFilters.ts` with:
  - **Aroma definitions constant** (`AROMAS`): Complete taxonomy — all 20 categories, 126 descriptors, organized as `{ primary: { floral: { label, color, descriptors }, ... }, secondary: {...}, tertiary: {...} }`
  - **Wine type filter matrices**: Which categories are visible for white/rosé/red (see filtering table in plan)
  - **Helper functions**:
    - `isPrimaryCategoryVisibleForWineType(category, wineType)` → boolean
    - `isSecondaryCategoryVisibleForWineType(category, wineType)` → boolean (always true for all)
    - `isTertiaryCategoryVisibleForWineType(category, wineType)` → boolean
    - `getVisibleCategoriesForWineType(wineType)` → `{ primary: string[], secondary: string[], tertiary: string[] }`
    - `isAromaValidForWineType(aromaCategory, wineType, aromaType)` → boolean
    - `getColorOptionsForWineType(wineType)` → color option array
  - **Color options per wine type**: white→[lemon-green, lemon, gold, amber, brown], rosé→[pink, salmon, orange], red→[purple, ruby, garnet, tawny, brown]
- Ensure rosé returns `true` for ALL categories (it gets everything)

**Expected result**: Single importable file that any component or utility can use to check what's valid for a given wine type. This is the SINGLE SOURCE OF TRUTH.

**Files to create**: `app/utils/wineTypeFilters.ts`

#### Task 2.3: Validate WSET Spec JSON Against TypeScript Types
**What to do**:
- Review existing `app/data/wset-sat-spec.json` and ensure it matches the TypeScript types from Task 2.1
- If the JSON has data that doesn't match the types or filter definitions, update either the JSON or the types to align
- Consider creating a simple build-time validation script or unit test that imports the JSON and type-checks it
- The JSON is consumed by the Aroma Wheel, templates, and wizard UI — it must be consistent

**Expected result**: JSON spec and TypeScript types are in perfect alignment. A test proves they match.

**Files to modify**: `app/data/wset-sat-spec.json` (if needed), new test file

#### Task 2.4: Unit Tests for Wine Type Filters
**What to do**:
- Create `test/unit/wineTypeFilters.test.ts` with tests for:
  - Each filter function returns correct results for white, rosé, red
  - Rosé gets ALL categories (primary + secondary + tertiary)
  - White does NOT get redFruit, blackFruit, driedCookedFruit, fruitDevelopmentRed, bottleAgeRed
  - Red does NOT get greenFruit, citrusFruit, stoneFruit, tropicalFruit, fruitDevelopmentWhite, bottleAgeWhite
  - `getColorOptionsForWineType()` returns correct options per wine type
  - Edge case: null/undefined wine type returns empty or all-disabled

**Expected result**: Full coverage of the filtering logic. All tests pass.

**Files to create**: `test/unit/wineTypeFilters.test.ts`

---

### Phase 3: Core State Management (Composables)
> **Goal**: Create the reactive state layer that connects the data model to the UI. Composables manage wizard state, tasting data, and wine type change handling.

#### Task 3.1: Create `useTastingData` Composable
**What to do**:
- Create `app/composables/useTastingData.ts`:
  - Expose reactive `tastingData` ref with the full `TastingData` structure, all fields initialized to `null` / empty arrays
  - Expose `resetTastingData()` — clears everything back to initial state
  - Expose `handleWineTypeChange(newType, oldType)` — when wine type changes:
    1. Clear `color` selection (since color options change)
    2. Iterate through `aromas` and `flavors`, remove any selections in categories that are now invalid for the new wine type (use `isAromaValidForWineType` from wineTypeFilters)
    3. Return a list of removed items (for toast notification)
  - Expose `validateDataConsistency()` — checks all current selections against current wine type, returns list of inconsistencies
  - Use `provide/inject` or `useState` (Nuxt) pattern so all wizard step components share the same state instance

**Expected result**: Any component calling `useTastingData()` gets the same reactive state. Changing wine type auto-cleans invalid selections.

**Nuxt patterns**: Use `useState()` for SSR-safe shared state, or a module-level `ref` for client-only state (since we have no backend).

**Files to create**: `app/composables/useTastingData.ts`

#### Task 3.2: Create `useWizardNavigation` Composable
**What to do**:
- Create `app/composables/useWizardNavigation.ts`:
  - Expose `currentStep` ref (1-4)
  - Expose `totalSteps` (4)
  - Expose `goNext()` — increments step (max 4)
  - Expose `goPrevious()` — decrements step (min 1)
  - Expose `goToStep(n)` — jump to specific step
  - Expose `isFirstStep`, `isLastStep` computed booleans
  - Expose `stepLabels` — `['Appearance', 'Nose', 'Palate', 'Conclusions']`
  - Expose `stepIcons` — Lucide icons for each step (e.g. `i-lucide-eye`, `i-lucide-wind`, `i-lucide-grape`, `i-lucide-check-circle`)

**Expected result**: Wizard navigation is fully decoupled from UI. Can be tested independently.

**Files to create**: `app/composables/useWizardNavigation.ts`

#### Task 3.3: Unit Tests for Composables
**What to do**:
- Create `test/unit/useTastingData.test.ts`:
  - Test initial state is all null/empty
  - Test `resetTastingData()` clears all fields
  - Test `handleWineTypeChange()` correctly removes invalid aromas when switching white→red, red→white, any→rosé
  - Test that rosé→white removes red-specific aromas but keeps shared ones
  - Test `validateDataConsistency()` catches mismatched selections
- Create `test/unit/useWizardNavigation.test.ts`:
  - Test step boundaries (can't go below 1 or above 4)
  - Test `goNext`, `goPrevious`, `goToStep`
  - Test `isFirstStep`, `isLastStep` computed values

**Expected result**: Full coverage of state management logic. All tests pass.

**Files to create**: `test/unit/useTastingData.test.ts`, `test/unit/useWizardNavigation.test.ts`

---

### Phase 4: Wizard Shell & Navigation UI
> **Goal**: Build the visual wizard container with progress stepper, navigation buttons, and fade transitions. After this phase, you can click through 4 empty steps.

#### Task 4.1: Create `WizardProgress` Component (Horizontal Stepper)
**What to do**:
- Create `app/components/wizard/WizardProgress.vue`:
  - Horizontal stepper bar showing 4 steps with labels and icons
  - Each step shows: icon + label (e.g. "👁 Appearance", "👃 Nose", "👅 Palate", "✓ Conclusions")
  - Current step is highlighted with primary color (rose)
  - Completed steps show a checkmark or filled state
  - Future steps are dimmed/neutral
  - **Mobile**: Icons only (labels hidden below `sm:` breakpoint), step number shown
  - **Desktop**: Full labels visible
  - Consider using Nuxt UI `UStepper` if available, or build a custom stepper with Tailwind
  - Steps should be clickable to jump to that step (use `goToStep()` from composable)
- Must work perfectly in dark mode (use Nuxt UI color tokens, not hardcoded colors)

**Expected result**: A beautiful horizontal stepper that adapts from mobile to desktop, with clear visual indication of current/completed/future steps.

**Nuxt UI components**: `UStepper` (if available in v4) or custom with `UButton` / `UBadge`

**Files to create**: `app/components/wizard/WizardProgress.vue`

#### Task 4.2: Create `WizardNavigation` Component (Prev/Next/Generate Buttons)
**What to do**:
- Create `app/components/wizard/WizardNavigation.vue`:
  - Bottom-fixed or bottom-sticky navigation bar with:
    - "Previous" button (hidden on step 1)
    - "Next" button (steps 1-3)
    - "Generate Notes" button (step 4 only, primary color, prominent)
  - **Mobile**: Full-width buttons, stacked or side-by-side
  - **Desktop**: Buttons aligned right, comfortable size
  - Use `UButton` with appropriate variants:
    - Previous: `variant="outline"` or `variant="ghost"`, neutral color
    - Next: `variant="solid"`, primary color
    - Generate: `variant="solid"`, primary color, larger, with icon (`i-lucide-sparkles` or `i-lucide-file-text`)
  - Emit events: `@previous`, `@next`, `@generate`

**Expected result**: Clean navigation bar that's always accessible. Generate button feels special/prominent on the final step.

**Nuxt UI components**: `UButton`

**Files to create**: `app/components/wizard/WizardNavigation.vue`

#### Task 4.3: Create `WizardContainer` Component (Orchestrator)
**What to do**:
- Create `app/components/wizard/WizardContainer.vue`:
  - Imports and uses `useWizardNavigation()` and `useTastingData()`
  - Renders `WizardProgress` at the top
  - Renders the current step component based on `currentStep` (dynamic component or v-if)
  - Wraps step content in a Vue `<Transition name="fade">` for minimal fade between steps
  - Renders `WizardNavigation` at the bottom
  - Step content area is inside a `UCard` with wine-label styling (decorative border, optional serif heading for the step title)
  - Handles the `@generate` event (for now, just logs or shows an alert)
  - Responsive layout:
    - **Mobile**: Full-width card, comfortable padding
    - **Desktop**: Centered container, max-width ~768px, generous padding

**Expected result**: A complete wizard shell. Steps show placeholder content. Clicking Next/Previous navigates. Stepper updates. Fade transition between steps.

**Nuxt UI components**: `UCard`, `UButton`

**Files to create**: `app/components/wizard/WizardContainer.vue`

#### Task 4.4: Wire Up Tasting Page with Wizard
**What to do**:
- Update `app/pages/tasting.vue` to mount `WizardContainer`
- Add proper page title and meta tags
- Ensure the wizard is centered and respects the app shell (header/footer)
- Add a "Start Over" or "Reset" option (small link/button) that calls `resetTastingData()`

**Expected result**: Navigating to `/tasting` shows the full wizard with 4 clickable steps, navigation buttons, and placeholder step content.

**Files to modify**: `app/pages/tasting.vue`

#### Task 4.5: Create Placeholder Step Components
**What to do**:
- Create 4 placeholder step components:
  - `app/components/wizard/steps/AppearanceStep.vue` — shows "Step 1: Appearance" heading + description of what will be here
  - `app/components/wizard/steps/NoseStep.vue` — shows "Step 2: Nose"
  - `app/components/wizard/steps/PalateStep.vue` — shows "Step 3: Palate"
  - `app/components/wizard/steps/ConclusionsStep.vue` — shows "Step 4: Conclusions"
- Each should use serif font for the heading, explain what fields will appear in this step
- These are temporary — will be replaced with real forms in Phase 5

**Expected result**: The wizard is fully navigable with placeholder content. User experience of moving through steps is testable.

**Files to create**: `app/components/wizard/steps/AppearanceStep.vue`, `app/components/wizard/steps/NoseStep.vue`, `app/components/wizard/steps/PalateStep.vue`, `app/components/wizard/steps/ConclusionsStep.vue`

---

### Phase 5: Form Input Components
> **Goal**: Build the reusable input components that the wizard steps will use. These are independent, testable building blocks.

#### Task 5.1: Create `WineTypeSelector` Component
**What to do**:
- Create `app/components/wizard/inputs/WineTypeSelector.vue`:
  - Three large, tappable cards for White, Rosé, Red wine selection
  - Use `URadioGroup` with `variant="card"` from Nuxt UI, or custom card-based radio buttons
  - Each card shows: wine type name (serif font), a colored circle/swatch or icon representing the wine color, and a brief subtitle (e.g. "Chardonnay, Sauvignon Blanc..." or just the color range)
  - Selected card has a highlighted border in primary color + checkmark
  - Unselected cards are neutral with hover effect
  - `v-model` binding to wine type value
  - **Mobile**: Cards stack vertically, full-width, large touch targets (min 56px height)
  - **Desktop**: Cards in a horizontal row, equal width
  - Must look great in dark mode (card backgrounds use Nuxt UI neutral tones)

**Expected result**: A beautiful, intuitive wine type picker that feels premium. Selection is immediately obvious.

**Nuxt UI components**: `URadioGroup` with `variant="card"`, or custom with `UCard`

**Files to create**: `app/components/wizard/inputs/WineTypeSelector.vue`

#### Task 5.2: Create `RadioGroup` Wrapper Component
**What to do**:
- Create `app/components/wizard/inputs/RadioGroup.vue`:
  - Wraps Nuxt UI `URadioGroup` with wine-themed styling
  - Props: `label` (section heading), `items` (array of options), `modelValue`, `description` (optional help text)
  - Uses `UFormField` wrapper for label + description
  - Options can be simple strings or objects with `{ label, value, description }`
  - **Mobile**: Options stack vertically, generous spacing
  - **Desktop**: Options can be in a grid (2-3 columns) for shorter lists, or vertical for longer lists
  - Support for `variant="card"` for prominent selections, `variant="list"` for compact lists
  - Null/deselected state supported (no option selected by default)

**Expected result**: A reusable, styled radio group that any wizard step can use for single-choice fields like clarity, intensity, sweetness, etc.

**Nuxt UI components**: `URadioGroup`, `UFormField`

**Files to create**: `app/components/wizard/inputs/RadioGroup.vue`

#### Task 5.3: Create `CheckboxGroup` Wrapper Component
**What to do**:
- Create `app/components/wizard/inputs/CheckboxGroup.vue`:
  - Wraps Nuxt UI `UCheckbox` components for multi-select fields
  - Props: `label`, `items` (array of options), `modelValue` (array of selected values), `description`
  - Uses `UFormField` wrapper for label + description
  - **Mobile**: Checkboxes stack vertically, large touch targets
  - **Desktop**: Can use 2-column grid for compact layout
  - Supports select/deselect all

**Expected result**: A reusable, styled checkbox group for fields like Other Observations (legs/tears, deposit, etc.).

**Nuxt UI components**: `UCheckbox`, `UFormField`

**Files to create**: `app/components/wizard/inputs/CheckboxGroup.vue`

#### Task 5.4: Unit/Component Tests for Input Components
**What to do**:
- Create `test/nuxt/WineTypeSelector.test.ts`:
  - Renders 3 wine type options
  - Clicking a card updates v-model
  - Selected card is visually highlighted
- Create `test/nuxt/RadioGroup.test.ts`:
  - Renders correct number of options
  - Selection updates v-model
  - Null state works (nothing selected)
- Create `test/nuxt/CheckboxGroup.test.ts`:
  - Renders correct options
  - Toggling updates v-model array
  - Multiple selections work

**Expected result**: All input components have passing tests proving they work correctly.

**Files to create**: `test/nuxt/WineTypeSelector.test.ts`, `test/nuxt/RadioGroup.test.ts`, `test/nuxt/CheckboxGroup.test.ts`

---

### Phase 6: Wizard Step Forms (Appearance & Nose)
> **Goal**: Build the first two wizard steps with real form bindings. After this, the user can select wine type, describe appearance, and fill in nose observations.

#### Task 6.1: Implement `AppearanceStep` (Step 1)
**What to do**:
- Update `app/components/wizard/steps/AppearanceStep.vue`:
  - **Wine Type Selector** (FIRST control — must appear before all other fields):
    - Use `WineTypeSelector` component
    - When wine type changes, call `handleWineTypeChange()` from `useTastingData`
    - Show a toast notification if aromas/flavors were auto-cleaned (use Nuxt UI `useToast()`)
  - **Clarity** field: `RadioGroup` with options `['clear', 'hazy']`. Add a subtle "(faulty?)" indicator next to "hazy"
  - **Intensity** field: `RadioGroup` with options `['pale', 'medium', 'deep']`
  - **Color** field: `RadioGroup` with dynamically filtered options based on selected wine type (use `getColorOptionsForWineType()`)
    - If no wine type selected, show disabled state with message "Select a wine type first"
    - Color options should show a small color swatch next to each label (visual hint)
  - **Other Observations** field: `CheckboxGroup` with options `['legs/tears', 'deposit', 'pétillance', 'bubbles']`
  - All fields are optional — no validation required to proceed
  - Layout: Stack all fields vertically, with section dividers between groups
  - Wrap in a wine-label styled card with serif step heading "Appearance"

**Expected result**: A complete, functional appearance form. Wine type selection drives color options. All values bind to `useTastingData()`.

**Nuxt UI components**: `UFormField`, `URadioGroup`, `UCheckbox`, `useToast()`

**Files to modify**: `app/components/wizard/steps/AppearanceStep.vue`

#### Task 6.2: Implement `NoseStep` (Step 2) — Basic Fields Only
**What to do**:
- Update `app/components/wizard/steps/NoseStep.vue`:
  - **Condition** field: `RadioGroup` with options `['clean', 'unclean']`. Add "(faulty?)" indicator next to "unclean"
  - **Intensity** field: `RadioGroup` with options `['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced']`
  - **Development** field: `RadioGroup` with options `['youthful', 'developing', 'fully developed', 'tired/past its best']`
  - **Aromas placeholder**: Show a message "Aroma Wheel coming in a future update" with an outlined card area
  - All fields are optional
  - Layout: Same wine-label card styling as AppearanceStep

**Expected result**: Nose step has all basic radio fields working. Aroma wheel is placeholdered for later.

**Files to modify**: `app/components/wizard/steps/NoseStep.vue`

#### Task 6.3: Tests for Appearance & Nose Steps
**What to do**:
- Create `test/nuxt/AppearanceStep.test.ts`:
  - Renders wine type selector
  - Selecting wine type updates state
  - Color options change when wine type changes
  - All fields bind correctly to tasting data
- Create `test/nuxt/NoseStep.test.ts`:
  - All radio fields render with correct options
  - Selections bind to tasting data

**Expected result**: Step components have tests proving data binding works.

**Files to create**: `test/nuxt/AppearanceStep.test.ts`, `test/nuxt/NoseStep.test.ts`

---

### Phase 7: Wizard Step Forms (Palate & Conclusions)
> **Goal**: Complete the remaining two wizard steps with real form bindings.

#### Task 7.1: Implement `PalateStep` (Step 3) — Basic Fields
**What to do**:
- Update `app/components/wizard/steps/PalateStep.vue`:
  - **Sweetness**: `RadioGroup` — `['dry', 'off-dry', 'medium-dry', 'medium-sweet', 'sweet', 'luscious']`
  - **Acidity**: `RadioGroup` — `['low', 'medium(-)', 'medium', 'medium(+)', 'high']`
  - **Tannin**: `RadioGroup` — `['low', 'medium(-)', 'medium', 'medium(+)', 'high']`
  - **Alcohol**: `RadioGroup` — `['low', 'medium', 'high']`
  - **Fortified**: Single `UCheckbox` — "This wine is fortified"
  - **Body**: `RadioGroup` — `['light', 'medium(-)', 'medium', 'medium(+)', 'full']`
  - **Mousse**: `RadioGroup` — `['delicate', 'creamy', 'aggressive']`
    - **CONDITIONAL**: Only visible if `otherObservations` includes `'bubbles'` or `'pétillance'` (read from tasting data)
    - When hidden, mousse value should be `null`
  - **Flavor Intensity**: `RadioGroup` — `['light', 'medium(-)', 'medium', 'medium(+)', 'pronounced']`
  - **Finish**: `RadioGroup` — `['short', 'medium(-)', 'medium', 'medium(+)', 'long']`
  - **Flavors placeholder**: Show "Flavor Wheel coming in a future update" (same as aromas)
  - Group related fields with subtle section dividers (e.g. "Structure" for sweetness/acidity/tannin/alcohol, "Body & Texture" for body/mousse, "Flavor" for intensity/finish/flavors)

**Expected result**: A well-organized palate step with all structural fields. Mousse field appears/disappears based on observations.

**Files to modify**: `app/components/wizard/steps/PalateStep.vue`

#### Task 7.2: Implement `ConclusionsStep` (Step 4)
**What to do**:
- Update `app/components/wizard/steps/ConclusionsStep.vue`:
  - **Quality Level**: `RadioGroup` with `variant="card"` — `['faulty', 'poor', 'acceptable', 'good', 'very good', 'outstanding']`
    - Cards should feel special since this is the final assessment
    - Consider color-coding: faulty=red/warning, poor=orange, acceptable=neutral, good=green, very good=primary, outstanding=gold
  - **Readiness**: `RadioGroup` — `['too young', 'can drink now, but has potential for ageing', 'drink now: not suitable for ageing or further ageing', 'too old']`
    - Long labels — use `variant="card"` with label + description for each option
  - Add a summary section below showing a brief preview of what data has been captured (optional enhancement)
  - Strong "Generate Tasting Notes" CTA at the bottom (duplicating the wizard nav button for emphasis)

**Expected result**: An elegant final step that makes the quality assessment feel important. User is ready to generate.

**Files to modify**: `app/components/wizard/steps/ConclusionsStep.vue`

#### Task 7.3: Tests for Palate & Conclusions Steps
**What to do**:
- Create `test/nuxt/PalateStep.test.ts`:
  - All radio fields render with correct options
  - Mousse field is hidden when no sparkling observations
  - Mousse field appears when `otherObservations` includes 'bubbles'
  - Fortified checkbox works
- Create `test/nuxt/ConclusionsStep.test.ts`:
  - Quality level and readiness render with correct options
  - Selections bind to tasting data

**Expected result**: Steps have tests proving conditional logic and data binding work.

**Files to create**: `test/nuxt/PalateStep.test.ts`, `test/nuxt/ConclusionsStep.test.ts`

---

### Phase 8: Aroma Wheel — SVG Component
> **Goal**: Build the interactive SVG aroma wheel used in both Nose (aromas) and Palate (flavors) steps. This is the most complex UI component in the app.

#### Task 8.1: Create `useAromaWheel` Composable (Geometry Engine)
**What to do**:
- Create `app/composables/useAromaWheel.ts`:
  - **Input**: Aroma definitions (from `wineTypeFilters.ts`), current wine type, selected aromas
  - **Compute segment geometry**:
    - Calculate angle for each segment proportional to the number of items it contains
    - Inner ring: 3 segments (Primary, Secondary, Tertiary)
    - Middle ring: Categories within each type (20 categories total)
    - Outer ring: Individual aromas within each category (126 total)
  - **Generate SVG path data** for each segment:
    - Use `M` (moveTo), `A` (arc), `L` (lineTo) SVG commands
    - Accept inner/outer radius for each ring
  - **Wine type filtering**: Return `isActive` boolean for each category segment
  - **Selection state**: Toggle individual aromas, return which are selected
  - **Responsive sizing**: Accept container width, compute optimal radii

**Expected result**: A pure-logic composable that computes all the math for the wheel. No DOM/SVG rendering — just data.

**Files to create**: `app/composables/useAromaWheel.ts`

#### Task 8.2: Unit Tests for `useAromaWheel`
**What to do**:
- Create `test/unit/useAromaWheel.test.ts`:
  - Segment angles sum to 360°
  - Primary ring spans more angle than Secondary/Tertiary (has more categories)
  - Category arc lengths are proportional to descriptor count
  - SVG path data is valid (contains M, A, L commands)
  - Wine type filtering correctly marks categories as active/inactive
  - Toggle selection adds/removes aromas from selection object
  - Filtered aromas are auto-removed on wine type change

**Expected result**: Geometry calculations are correct and thoroughly tested.

**Files to create**: `test/unit/useAromaWheel.test.ts`

#### Task 8.3: Create `AromaWheel.vue` Component (SVG Rendering)
**What to do**:
- Create `app/components/wizard/inputs/AromaWheel.vue`:
  - Renders a single `<svg>` element with `viewBox` for responsive scaling
  - **Inner ring** (3 segments): Primary / Secondary / Tertiary labels
    - Colored with category family base colors
    - Text rotated along the arc
  - **Middle ring** (20 segments): Category labels (Floral, Green Fruit, etc.)
    - Each colored per the color scheme table in the plan
    - Text rotated along arc, font sized to fit
  - **Outer ring** (126 segments): Individual aroma labels
    - Lighter tint of parent category color
    - **Clickable** — toggles selection state
    - Selected: solid fill + slight glow/border
    - Unselected: light tint
    - Filtered (invalid for wine type): `opacity: 0.25`, no pointer events, greyed out
  - **Tooltip**: On hover/touch, show aroma name + category in a tooltip (use Nuxt UI `UTooltip` or a custom SVG-based tooltip)
  - **Responsive**:
    - Desktop (≥768px): ~500px diameter
    - Tablet (≥640px): scales to fit
    - Mobile (<640px): ~300px minimum, outer ring text may be hidden (tooltip fallback)
  - **Accessibility**: Each outer segment has `role="checkbox"`, `aria-checked`, `aria-label`
  - Props: `v-model` (AromaObject), `wineType` (WineType), `aromaDefinitions`, `label`
  - Works in both dark and light mode (adjust tints for dark backgrounds)

**Expected result**: A stunning, interactive SVG aroma wheel that looks like a professional wine aroma chart. Animations are smooth, touch targets work on mobile.

**Files to create**: `app/components/wizard/inputs/AromaWheel.vue`

#### Task 8.4: Create `AromaWheelChips.vue` Component
**What to do**:
- Create `app/components/wizard/inputs/AromaWheelChips.vue`:
  - Shows selected aromas as removable chips/badges below the wheel
  - Each chip is colored by its category color (from the aroma color scheme)
  - Chip shows: aroma name + small ✕ button to deselect
  - Grouped by aroma type (Primary / Secondary / Tertiary) with subtle labels
  - Clicking ✕ removes the aroma from the `v-model` AromaObject
  - If no aromas selected, show a subtle "No aromas selected" message
  - If no wine type selected, show a warning "Select a wine type first"
  - **Mobile**: Chips wrap horizontally, scrollable area if many selected
  - **Desktop**: Chips flow naturally in a flex-wrap container

**Expected result**: A clean summary of selected aromas with easy removal. Acts as a complement to the wheel.

**Nuxt UI components**: `UBadge` or `UChip`, `UButton` (for remove)

**Files to create**: `app/components/wizard/inputs/AromaWheelChips.vue`

#### Task 8.5: Integrate Aroma Wheel into Nose & Palate Steps
**What to do**:
- Update `NoseStep.vue`: Replace the aroma placeholder with `AromaWheel` + `AromaWheelChips`
  - Wire `v-model` to `tastingData.nose.aromas`
  - Pass `wineType` from `tastingData.appearance.wineType`
  - Pass aroma definitions from `wineTypeFilters.ts`
- Update `PalateStep.vue`: Replace the flavor placeholder with `AromaWheel` + `AromaWheelChips`
  - Wire `v-model` to `tastingData.palate.flavors`
  - Same wine type and definitions
- Ensure the wheel is labelled differently: "Aromas" on Nose step, "Flavors" on Palate step

**Expected result**: Both Nose and Palate steps have a fully interactive aroma/flavor wheel with category filtering based on wine type.

**Files to modify**: `app/components/wizard/steps/NoseStep.vue`, `app/components/wizard/steps/PalateStep.vue`

#### Task 8.6: Component Tests for Aroma Wheel
**What to do**:
- Create `test/nuxt/AromaWheel.test.ts`:
  - Renders SVG with correct number of segments
  - Clicking an outer segment toggles selection
  - Filtered categories (based on wine type) are non-interactive
  - v-model updates correctly
  - Changing wine type disables/enables correct categories
- Create `test/nuxt/AromaWheelChips.test.ts`:
  - Shows chips for selected aromas
  - Clicking remove button deselects aroma
  - Shows warning when no wine type selected

**Expected result**: The most complex component is well-tested.

**Files to create**: `test/nuxt/AromaWheel.test.ts`, `test/nuxt/AromaWheelChips.test.ts`

---

### Phase 9: Text Generation Engine
> **Goal**: Build the template-based text generators that convert tasting data into formatted notes in 4 different profiles.

#### Task 9.1: Create `aromaCategorizer.ts` Utility
**What to do**:
- Create `app/utils/aromaCategorizer.ts`:
  - `formatAromaList(aromas: AromaObject, definitions: AromaDefinitions)` → formatted string
  - Groups aromas by category with proper English grammar:
    - Single: `"floral (acacia)"`
    - Multiple in category: `"floral (acacia, violet)"`
    - Multiple categories: `"floral (acacia), green fruit (gooseberry) and yeast (bread)"`
    - Note the Oxford-comma-free "and" before the last category
  - Handles empty input (returns empty string)
  - Handles single aroma (no parentheses needed if only one in one category)
  - Separates by aroma type if needed (Primary, Secondary, Tertiary grouping for professional profile)

**Expected result**: A utility that correctly formats any combination of aromas into readable, grammatical text.

**Files to create**: `app/utils/aromaCategorizer.ts`

#### Task 9.2: Create `textGenerators.ts` Utility (Section Generators)
**What to do**:
- Create `app/utils/textGenerators.ts`:
  - `generateAppearanceText(data: AppearanceData, profile: ProfileType)` → string
  - `generateNoseText(data: NoseData, profile: ProfileType)` → string
  - `generatePalateText(data: PalateData, profile: ProfileType)` → string
  - `generateConclusionsText(data: ConclusionsData, profile: ProfileType)` → string
  - Each function delegates to the appropriate profile template
  - Each function returns `''` if the section has no data at all
  - Each function handles partial data (e.g. only clarity set, no color)

**Expected result**: Clean dispatcher functions that route to the correct profile template.

**Files to create**: `app/utils/textGenerators.ts`

#### Task 9.3: Create Professional Profile Template
**What to do**:
- Create `app/utils/templates/professional.ts`:
  - **Appearance**: `"APPEARANCE: Clear and pale lemon in color."` — all caps header, formal language
  - **Nose**: `"NOSE: Clean, with medium(+) intensity. Detected floral (acacia), green fruit (gooseberry) aromas. Developing."` — technical, precise
  - **Palate**: `"PALATE: Dry, with high acidity and medium tannin. Medium alcohol. Body is medium, with medium(+) flavor intensity. Detected [flavors]. Medium(+) finish."` — structured, analytical
  - **Conclusions**: `"CONCLUSIONS: This wine is of very good quality. Can drink now, but has potential for ageing."`
  - Handle every possible null/missing field gracefully — skip that phrase, never show "null" or "undefined"
  - Follow WSET Level 3 note-writing conventions exactly

**Expected result**: Professional notes that would pass WSET Level 3 standards.

**Files to create**: `app/utils/templates/professional.ts`

#### Task 9.4: Create Casual Profile Template
**What to do**:
- Create `app/utils/templates/casual.ts`:
  - Sentence-case headers ("Appearance:", "On the nose:", "On the palate:", "Overall:")
  - Conversational, accessible language
  - Flows naturally — "This wine shows a clear, pale lemon color..."
  - Aromas described with dashes and natural grouping: "think acacia and violet, with notes of gooseberry"
  - Less technical but still accurate

**Expected result**: Notes that a wine enthusiast would write in a blog post.

**Files to create**: `app/utils/templates/casual.ts`

#### Task 9.5: Create Bar Talk Profile Template
**What to do**:
- Create `app/utils/templates/bartalk.ts`:
  - No section headers — just flowing text
  - Short, punchy sentences: "Looks clear and lemony."
  - Direct: "Smells floral and fresh — acacia, gooseberry, a bit of bread."
  - Engaging, like telling a friend about a wine: "Solid wine, but past its best."

**Expected result**: Notes that sound like a sommelier chatting at a bar.

**Files to create**: `app/utils/templates/bartalk.ts`

#### Task 9.6: Create Playful Profile Template
**What to do**:
- Create `app/utils/templates/playful.ts`:
  - Creative metaphors: "Clear, lemony — like a citrus flashlight"
  - Humor while staying accurate: "a sneaky kerosene whiff"
  - Fun descriptive language: "zippy acid", "marzipan wink", "tired old-timer vibes"
  - Still covers all the technical content, just in a fun wrapper

**Expected result**: Notes that make wine fun and approachable.

**Files to create**: `app/utils/templates/playful.ts`

#### Task 9.7: Create `useNoteGenerator` Composable
**What to do**:
- Create `app/composables/useNoteGenerator.ts`:
  - Takes `tastingData` (reactive) and `selectedProfile` (reactive ref)
  - Exposes `generatedNote` computed property that auto-updates when data or profile changes
  - Uses `textGenerators.ts` to assemble the full note from all 4 sections
  - Exposes `generateNote()` method for explicit generation
  - Handles empty data: returns a friendly "No tasting data provided. Complete the wizard to generate a note."

**Expected result**: Composable that any result component can use to get the generated text.

**Files to create**: `app/composables/useNoteGenerator.ts`

#### Task 9.8: Unit Tests for Text Generation
**What to do**:
- Create `test/unit/aromaCategorizer.test.ts`:
  - Test empty input, single aroma, multiple aromas in one category, multiple categories
  - Test correct grammar (Oxford-comma-free "and" before last)
  - Test all aroma types (primary, secondary, tertiary)
- Create `test/unit/textGenerators.test.ts`:
  - Test each section generator with full data, partial data, empty data
  - Test each profile produces different output for the same input
  - Test null handling — no crashes, no "null" in output
- Create `test/unit/templates/professional.test.ts`:
  - Test with the example data from the plan
  - Test each section individually
  - Test with all fields empty → returns ''
- Similarly for `casual.test.ts`, `bartalk.test.ts`, `playful.test.ts`

**Expected result**: Comprehensive test coverage for all text generation logic. No profile crashes on any input combination.

**Files to create**: `test/unit/aromaCategorizer.test.ts`, `test/unit/textGenerators.test.ts`, `test/unit/templates/professional.test.ts`, `test/unit/templates/casual.test.ts`, `test/unit/templates/bartalk.test.ts`, `test/unit/templates/playful.test.ts`

---

### Phase 10: Results Display
> **Goal**: Build the results page shown after generation — profile switcher, formatted note display, and copy to clipboard.

#### Task 10.1: Create `ProfileSelector` Component
**What to do**:
- Create `app/components/results/ProfileSelector.vue`:
  - 4 selectable profile options: Professional, Casual, Bar Talk, Playful
  - Use Nuxt UI `URadioGroup` with `variant="card"` or a `UTabs`-like switcher
  - Each profile has: name, short description, icon
    - Professional: `i-lucide-graduation-cap` — "Formal WSET-style notes"
    - Casual: `i-lucide-message-circle` — "Friendly and accessible"
    - Bar Talk: `i-lucide-beer` — "Quick and punchy"
    - Playful: `i-lucide-sparkles` — "Fun and creative"
  - Selected profile highlighted with primary color
  - Switching profiles immediately updates the displayed note
  - `v-model` binding to profile type
  - **Mobile**: Horizontal scrollable tabs or stacked cards
  - **Desktop**: Horizontal tab bar

**Expected result**: An elegant profile switcher that makes it easy to compare different note styles.

**Nuxt UI components**: `URadioGroup` variant card, or custom tabs

**Files to create**: `app/components/results/ProfileSelector.vue`

#### Task 10.2: Create `TastingNoteDisplay` Component
**What to do**:
- Create `app/components/results/TastingNoteDisplay.vue`:
  - Displays the generated tasting note text with nice formatting
  - Section headers (for Professional/Casual profiles) rendered as bold serif headings
  - Body text in readable font, comfortable line height
  - Wrap in a `UCard` with wine-label styling (decorative border, parchment-like background in light mode, dark card in dark mode)
  - If no note generated, show empty state: "Complete the wizard and click Generate to see your tasting note"
  - Text should be selectable for manual copying
  - Consider subtle typography: slightly larger font than default, letter-spacing

**Expected result**: The generated note looks like it was printed on a wine label or in a wine guide. Beautiful typography.

**Nuxt UI components**: `UCard`

**Files to create**: `app/components/results/TastingNoteDisplay.vue`

#### Task 10.3: Create `CopyToClipboard` Component
**What to do**:
- Create `app/components/results/CopyToClipboard.vue`:
  - A `UButton` that copies the generated note text to clipboard
  - Uses `navigator.clipboard.writeText()` with fallback
  - Shows visual feedback: icon changes from copy to checkmark for 2 seconds after clicking
  - Use Nuxt UI `useToast()` to show "Copied to clipboard!" success toast
  - Props: `text` (the text to copy)

**Expected result**: One-click copy with clear visual feedback.

**Nuxt UI components**: `UButton`, `useToast()`

**Files to create**: `app/components/results/CopyToClipboard.vue`

#### Task 10.4: Integrate Results into Wizard Flow
**What to do**:
- Update `WizardContainer.vue` to handle the `@generate` event:
  - When Generate is clicked, show a results view (could be a 5th "step" or a modal/overlay)
  - Results view contains: `ProfileSelector` + `TastingNoteDisplay` + `CopyToClipboard`
  - Add a "Back to Editing" button that returns to the wizard (preserving all data)
  - Add a "Start New Tasting" button that calls `resetTastingData()` and goes to step 1
- The results should feel like a reward — consider a brief entrance animation

**Expected result**: Complete wizard flow: fill 4 steps → Generate → see beautiful note → copy or switch profiles → edit or start over.

**Files to modify**: `app/components/wizard/WizardContainer.vue`

#### Task 10.5: Tests for Results Components
**What to do**:
- Create `test/nuxt/ProfileSelector.test.ts`:
  - Renders 4 profile options
  - Selection updates v-model
  - Default selection works
- Create `test/nuxt/TastingNoteDisplay.test.ts`:
  - Renders note text when provided
  - Shows empty state when no text
- Create `test/nuxt/CopyToClipboard.test.ts`:
  - Calls clipboard API on click
  - Shows success feedback

**Expected result**: Results components are tested and reliable.

**Files to create**: `test/nuxt/ProfileSelector.test.ts`, `test/nuxt/TastingNoteDisplay.test.ts`, `test/nuxt/CopyToClipboard.test.ts`

---

### Phase 11: Polish, Accessibility & Responsive Review
> **Goal**: Final pass to ensure the app is production-quality — responsive on all breakpoints, accessible, and visually stunning.

#### Task 11.1: Responsive Audit (Mobile / Tablet / Desktop)
**What to do**:
- Test all pages at breakpoints: 320px, 375px, 640px, 768px, 1024px, 1280px
- Fix any layout issues:
  - Cards not stacking properly on mobile
  - Touch targets smaller than 44px
  - Text overflow or truncation issues
  - Aroma wheel too small on mobile
  - Navigation buttons not reachable
- Ensure landing page hero looks great on all sizes
- Ensure wizard card is centered and padded properly

**Expected result**: Every screen works perfectly from 320px to 1440px+.

#### Task 11.2: Dark Mode Audit
**What to do**:
- Review every component in dark mode:
  - Cards have appropriate dark backgrounds
  - Text contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
  - Aroma wheel colors are visible on dark backgrounds (adjust tints if needed)
  - Selected states are clearly visible in dark mode
  - Wine type selector cards look good in dark mode
  - Landing page gradients/decorative elements work in dark mode
- Use Nuxt UI color tokens everywhere — never hardcode colors like `text-gray-700` (use `text-muted` or Nuxt UI classes)

**Expected result**: Dark mode is as polished as light mode. No components look broken or invisible.

#### Task 11.3: Accessibility Audit
**What to do**:
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works:
  - Tab through wizard steps
  - Enter/Space to select radio options
  - Tab through aroma wheel segments
  - Keyboard-accessible copy button
- Focus indicators visible on all focusable elements
- Screen reader announces step changes
- Color is never the ONLY indicator of state (always pair with icons/text)
- Test with `axe-core` or similar tool

**Expected result**: App is WCAG AA compliant. Usable with keyboard and screen readers.

#### Task 11.4: Transition & Animation Polish
**What to do**:
- Ensure fade transitions between wizard steps are smooth (150-200ms)
- Add subtle hover animations on:
  - Wine type selector cards (slight scale/shadow)
  - Aroma wheel segments (glow on hover)
  - Buttons (standard Nuxt UI hover)
- Profile selector transition when switching profiles
- Toast notifications use Nuxt UI's built-in animation
- No janky layout shifts during transitions

**Expected result**: The app feels alive and premium without being distracting.

#### Task 11.5: Wine-Label Visual Polish
**What to do**:
- Ensure serif typography (Playfair Display or similar) is used consistently:
  - Page titles, card headings, step names, generated note headers
  - NOT used for body text, labels, or UI elements (those stay system/sans-serif)
- Decorative borders on:
  - Wizard step cards (subtle line border or wine-label-style border)
  - Generated note display card (feel like a printed label)
- Landing page hero has wine-themed visual elements
- Color consistency: rose/stone tones throughout
- Consider a subtle texture or grain overlay on hero sections (light mode only)

**Expected result**: The app has a distinctive, premium wine aesthetic that sets it apart from generic web apps.

---

### Phase 12: Integration Testing & QA
> **Goal**: Comprehensive end-to-end testing of the complete wizard flow.

#### Task 12.1: Integration Tests — Complete Wizard Flows
**What to do**:
- Create `test/nuxt/wizardIntegration.test.ts`:
  - Complete white wine flow: select white → fill appearance → fill nose with white-valid aromas → fill palate → conclusions → generate → verify professional note
  - Complete red wine flow: same but with red-specific aromas
  - Complete rosé flow: verify ALL categories available
  - Partial data flow: only fill appearance + conclusions → generate → verify note handles missing sections
  - Wine type switch flow: select white → add green fruit aromas → switch to red → verify green fruit aromas removed → toast shown
  - Profile switching: generate note → switch between all 4 profiles → verify different output each time
  - Reset flow: complete wizard → reset → verify all data cleared

**Expected result**: Core user journeys are automated and pass.

**Files to create**: `test/nuxt/wizardIntegration.test.ts`

#### Task 12.2: Edge Case Tests
**What to do**:
- Create `test/unit/edgeCases.test.ts`:
  - Generate note with ALL fields filled (maximum data)
  - Generate note with ZERO fields filled (complete empty)
  - Generate note with only wine type selected (minimal data)
  - Very long aroma selections (20+ aromas) — note still readable
  - All templates handle fortified wine flag
  - All templates handle mousse (sparkling wine)
  - Unicode characters in generated text (e.g. "rosé", "pétillance")

**Expected result**: No crashes, no "undefined" in output, graceful handling of all edge cases.

**Files to create**: `test/unit/edgeCases.test.ts`

#### Task 12.3: Run Full Test Suite & Coverage
**What to do**:
- Run `pnpm test:coverage`
- Verify coverage is ≥80% overall
- Identify and fill any coverage gaps
- Run `pnpm lint` and `pnpm typecheck` — fix any issues
- Run `pnpm build` — verify production build succeeds

**Expected result**: All tests pass. Coverage ≥80%. No lint or type errors. Clean production build.

---

### Phase 13: Documentation
> **Goal**: Update project documentation to reflect the completed application.

#### Task 13.1: Update README.md
**What to do**:
- Rewrite `README.md` with:
  - Project overview and purpose
  - Screenshot or GIF of the app
  - Tech stack summary
  - How to run locally (`pnpm install`, `pnpm dev`)
  - How to run tests (`pnpm test`)
  - Brief architecture overview (wizard → composables → text generators)
  - WSET compliance note

**Files to modify**: `README.md`

#### Task 13.2: Add JSDoc Comments to Key Utilities
**What to do**:
- Add JSDoc comments to all exported functions in:
  - `app/utils/wineTypeFilters.ts` — explain filter logic
  - `app/utils/textGenerators.ts` — explain what each generator does
  - `app/utils/aromaCategorizer.ts` — explain grammar rules
  - `app/composables/useTastingData.ts` — explain state management
- Focus on "why" comments, not "what" (the code should be self-documenting for the "what")

**Files to modify**: Various utility and composable files

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
- **Primary color**: `rose` (Nuxt UI built-in) — burgundy/wine tones that work in light and dark mode
- **Neutral color**: `stone` — warm, parchment-like neutrals
- **Typography**: Serif font (Playfair Display or similar) for headings and display text; system/sans-serif for body and UI
- **Visual style**: Wine-label inspired — decorative borders on cards, elegant spacing, premium feel
- **Dark mode**: System preference auto-detect + manual toggle via `UColorModeButton`. All components must look great in both modes
- **Mobile-first**: Every layout designed for 320px first, enhanced at `sm:` (640px), `md:` (768px), `lg:` (1024px)
- **Touch targets**: Minimum 44px for all interactive elements
- **Transitions**: Minimal fade (150-200ms) between wizard steps. Subtle hover animations on cards and buttons
- Use wine-related icons from Lucide (wine glass, grape, sparkles)
- Consistent spacing/typography via Nuxt UI + Tailwind utility classes
- No custom CSS except for the serif font utility class — everything else via Tailwind
- Focus on comfort and clarity for beginners; wine terminology is already intimidating enough

## Key Considerations
- Every generator function must allow incomplete data/sections
- No session or long-term storage
- 100% client-side, instant/fast
- Accessible (WCAG AA min.)
- Tests for empty, partial, full wizard completion

## Success Criteria
- Multi-step wizard, all WSET fields, forward/back navigation
- Mobile-first design (320px to desktop), responsive at all breakpoints
- Wine-label inspired aesthetic with serif typography, decorative borders
- Dark mode with system preference detection + manual toggle
- 4 selectable output profiles (Professional, Casual, Bar Talk, Playful)
- Works with partial data or skipped sections
- Copy to clipboard with visual feedback
- No data persistence — 100% client-side, instant
- Interactive SVG aroma wheel for nose and palate
- 80%+ test coverage (unit + component + integration)
- Nuxt UI components + Tailwind CSS v4 + TypeScript strict
- WCAG AA accessible (keyboard, screen readers, contrast)
- Landing page with hero → separate wizard route
- Production build passes cleanly (lint, typecheck, build)

---

**Review this plan before starting implementation. All full aroma/flavor sets from `inspiration.html` are in scope as per current requirements.**

If you have feedback on branding palette or profile names, include it before phase 1 begins.
