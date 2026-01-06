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
- `clarity`: 'clear' | 'hazy' | null
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
- `condition`: 'clean' | 'unclean' | null
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
- `other[]`: simple, flint, wet stones, wet wool, plus custom text field

**Secondary Aromas** (post-fermentation winemaking):
- `yeast[]`: biscuit, bread, toast, pastry, brioche, bread dough, cheese
- `malolacticConversion[]`: butter, cheese, cream
- `oak[]`: vanilla, cloves, nutmeg, coconut, butterscotch, toast, cedar, charred wood, smoke, chocolate, coffee, resinous

**Tertiary Aromas** (maturation):
- `deliberateOxidation[]`: almond, marzipan, hazelnut, walnut, chocolate, coffee, toffee, caramel
- `fruitDevelopmentWhite[]`: dried apricot, marmalade, dried apple, dried banana
- `fruitDevelopmentRed[]`: fig, prune, tar, dried blackberry, dried cranberry, cooked blackberry, cooked red plum
- `bottleAgeWhite[]`: petrol, kerosene, cinnamon, ginger, nutmeg, toast, nutty, mushroom, hay, honey
- `bottleAgeRed[]`: leather, forest floor, earth, mushroom, game, tobacco, vegetal, wet leaves, savoury, meaty, farm yard

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

## Wine Type Filtering System - Detailed Specification

### Wine Type Filtering Matrix

**Primary Aromas & Flavors Categories by Wine Type:**

| Category | White | Rosé | Red |
|----------|-------|------|-----|
| Floral | ✓ | ✓ | ✓ |
| Green Fruit | ✓ | ✓ | ✗ |
| Citrus Fruit | ✓ | ✓ | ✗ |
| Stone Fruit | ✓ | ✓ | ✗ |
| Tropical Fruit | ✓ | ✓ | ✗ |
| Red Fruit | ✗ | ✓ | ✓ |
| Black Fruit | ✗ | ✓ | ✓ |
| Dried/Cooked Fruit | ✗ | ✓ | ✓ |
| Herbaceous | ✓ | ✓ | ✓ |
| Herbal | ✓ | ✓ | ✓ |
| Pungent Spice | ✓ | ✓ | ✓ |
| Other | ✓ | ✓ | ✓ |

**Secondary Aromas & Flavors (All Wine Types):**
- Yeast - ✓ All types
- Malolactic Conversion - ✓ All types
- Oak - ✓ All types

**Tertiary Aromas & Flavors by Wine Type:**

| Category | White | Rosé | Red |
|----------|-------|------|-----|
| Deliberate Oxidation | ✓ | ✓ | ✓ |
| Fruit Development (White) | ✓ | ✓ | ✗ |
| Fruit Development (Red) | ✗ | ✓ | ✓ |
| Bottle Age (White) | ✓ | ✓ | ✗ |
| Bottle Age (Red) | ✗ | ✓ | ✓ |

### Component Architecture - Wine Type Filtering

#### Component: `WineTypeSelector.vue`
**Location:** `app/components/wizard/inputs/WineTypeSelector.vue`

**Props:**
```typescript
{
  modelValue: 'white' | 'rosé' | 'red' | null
}
```

**Emits:**
- `update:modelValue`: emitted when selection changes

**Features:**
- Large, visual radio buttons or cards (mobile-friendly)
- Wine glass icons for each type (from Iconify)
- Clear visual feedback for selected type
- Prominent placement at top of Appearance step
- Can't be easily missed or skipped

**Implementation Notes:**
- Use Nuxt UI Radio or custom card-based design
- Each option should be 44px+ touch target minimum
- Show color preview for each wine type (burgundy for red, light gold for white, rose pink for rosé)

---

#### Component: `AromaFlavorPicker.vue` (Updated)
**Location:** `app/components/wizard/inputs/AromaFlavorPicker.vue`

**Props:**
```typescript
{
  modelValue: Object with aroma/flavor selections,
  wineType: 'white' | 'rosé' | 'red' | null,  // NEW - required for filtering
  section: 'nose' | 'palate'  // differentiate aromas vs flavors
}
```

**Computed Properties:**
- `visiblePrimaryCategories`: Filters primary categories based on wineType
- `visibleTertiaryCategories`: Filters tertiary categories based on wineType
- `allSecondaryCategories`: Always returns all secondary categories (no filtering)

**Template Structure:**
```
- No Wine Type Selected Warning
  └─ Message: "👆 Please select your wine type in the Appearance section above to continue"
  
- Primary Aromas (if wine type selected)
  ├─ [Only show categories valid for wine type]
  └─ Each category with checkbox list
  
- Secondary Aromas (always show)
  ├─ Yeast
  ├─ Malolactic Conversion
  └─ Oak
  
- Tertiary Aromas (if wine type selected)
  ├─ [Only show categories valid for wine type]
  └─ Each category with checkbox list
```

**Features:**
- Accordion/collapsible sections for Primary/Secondary/Tertiary (use Nuxt UI Accordion)
- Within each, sub-sections for categories
- Categories not applicable to current wine type are not rendered at all
- If wineType is null, show helpful message and disable interaction
- Smooth animations when categories appear/disappear

---

#### Composable: `useTastingData.ts` (Updated)

**New Responsibilities:**

1. **Wine Type Change Handler:**
```typescript
function handleWineTypeChange(newWineType: WineType | null, oldWineType: WineType | null) {
  if (!newWineType || !oldWineType) return;
  
  // Clean nose aromas
  if (tastingData.value.nose && tastingData.value.nose.aromas) {
    cleanAromasForWineType(tastingData.value.nose.aromas, newWineType);
  }
  
  // Clean palate flavors
  if (tastingData.value.palate && tastingData.value.palate.flavors) {
    cleanAromasForWineType(tastingData.value.palate.flavors, newWineType);
  }
}

function cleanAromasForWineType(aromaObj: AromaObject, wineType: WineType) {
  // Primary aromas cleanup
  const validPrimaryCategories = primaryCategoriesConfig[wineType];
  for (const category in aromaObj.primary) {
    if (!validPrimaryCategories.includes(category)) {
      aromaObj.primary[category] = []; // Clear invalid selections
    }
  }
  
  // Tertiary aromas cleanup
  const validTertiaryCategories = tertiaryCategoriesConfig[wineType];
  for (const category in aromaObj.tertiary) {
    if (!validTertiaryCategories.includes(category)) {
      aromaObj.tertiary[category] = []; // Clear invalid selections
    }
  }
  
  // Secondary: no cleanup needed (all types have access)
}
```

2. **Watch for Wine Type Changes:**
```typescript
watch(() => tastingData.value.appearance.wineType, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    handleWineTypeChange(newVal, oldVal);
  }
});
```

3. **Validation Function:**
```typescript
function validateDataConsistency(): boolean {
  const wineType = tastingData.value.appearance.wineType;
  if (!wineType) return true; // No validation needed if no wine type
  
  // Validate nose aromas
  const noseValid = validateAromasForWineType(
    tastingData.value.nose.aromas, 
    wineType
  );
  
  // Validate palate flavors
  const palateValid = validateAromasForWineType(
    tastingData.value.palate.flavors, 
    wineType
  );
  
  return noseValid && palateValid;
}

function validateAromasForWineType(aromas: AromaObject, wineType: WineType): boolean {
  const validPrimaryCategories = primaryCategoriesConfig[wineType];
  const validTertiaryCategories = tertiaryCategoriesConfig[wineType];
  
  for (const category in aromas.primary) {
    if (!validPrimaryCategories.includes(category) && aromas.primary[category]?.length > 0) {
      return false; // Invalid primary selection found
    }
  }
  
  for (const category in aromas.tertiary) {
    if (!validTertiaryCategories.includes(category) && aromas.tertiary[category]?.length > 0) {
      return false; // Invalid tertiary selection found
    }
  }
  
  return true;
}
```

4. **Expose Validation Methods:**
```typescript
return {
  // existing exports...
  validateDataConsistency,
  handleWineTypeChange
}
```

---

#### Utility: `wineTypeFilters.ts` (NEW)
**Location:** `app/utils/wineTypeFilters.ts`

**Purpose:** Centralized filtering configuration and logic - single source of truth for all wine type dependencies

**Full Implementation:**
```typescript
export type WineType = 'white' | 'rosé' | 'red';

export const PRIMARY_CATEGORIES_BY_WINE_TYPE: Record<WineType, string[]> = {
  white: [
    'floral',
    'greenFruit',
    'citrusFruit',
    'stoneFruit',
    'tropicalFruit',
    'herbaceous',
    'herbal',
    'pungentSpice',
    'other'
  ],
  red: [
    'floral',
    'redFruit',
    'blackFruit',
    'driedCookedFruit',
    'herbaceous',
    'herbal',
    'pungentSpice',
    'other'
  ],
  rosé: [
    'floral',
    'greenFruit',
    'citrusFruit',
    'stoneFruit',
    'tropicalFruit',
    'redFruit',
    'blackFruit',
    'driedCookedFruit',
    'herbaceous',
    'herbal',
    'pungentSpice',
    'other'
  ]
};

export const TERTIARY_CATEGORIES_BY_WINE_TYPE: Record<WineType, string[]> = {
  white: [
    'deliberateOxidation',
    'fruitDevelopmentWhite',
    'bottleAgeWhite'
  ],
  red: [
    'deliberateOxidation',
    'fruitDevelopmentRed',
    'bottleAgeRed'
  ],
  rosé: [
    'deliberateOxidation',
    'fruitDevelopmentWhite',
    'fruitDevelopmentRed',
    'bottleAgeWhite',
    'bottleAgeRed'
  ]
};

export const SECONDARY_CATEGORIES = [
  'yeast',
  'malolacticConversion',
  'oak'
]; // All wine types have access to all secondary categories

/**
 * Check if a primary aroma category should be visible for the given wine type
 */
export function isPrimaryCategoryVisibleForWineType(
  category: string,
  wineType: WineType | null
): boolean {
  if (!wineType) return false;
  return PRIMARY_CATEGORIES_BY_WINE_TYPE[wineType].includes(category);
}

/**
 * Check if a tertiary aroma category should be visible for the given wine type
 */
export function isTertiaryCategoryVisibleForWineType(
  category: string,
  wineType: WineType | null
): boolean {
  if (!wineType) return false;
  return TERTIARY_CATEGORIES_BY_WINE_TYPE[wineType].includes(category);
}

/**
 * Get all visible categories for a wine type (primary + secondary + tertiary)
 */
export function getVisibleCategoriesForWineType(wineType: WineType | null) {
  if (!wineType) {
    return {
      primary: [],
      secondary: SECONDARY_CATEGORIES,
      tertiary: []
    };
  }

  return {
    primary: PRIMARY_CATEGORIES_BY_WINE_TYPE[wineType],
    secondary: SECONDARY_CATEGORIES,
    tertiary: TERTIARY_CATEGORIES_BY_WINE_TYPE[wineType]
  };
}

/**
 * Validate that an aroma/flavor selection is valid for a wine type
 */
export function isAromaValidForWineType(
  category: string,
  wineType: WineType | null,
  categoryType: 'primary' | 'secondary' | 'tertiary'
): boolean {
  if (!wineType) return false;

  switch (categoryType) {
    case 'primary':
      return isPrimaryCategoryVisibleForWineType(category, wineType);
    case 'tertiary':
      return isTertiaryCategoryVisibleForWineType(category, wineType);
    case 'secondary':
      return true; // All secondary categories valid for all wine types
    default:
      return false;
  }
}
```

---

#### TypeScript Type Updates

**Add to `app/types/tasting.ts`:**

```typescript
export type WineType = 'white' | 'rosé' | 'red';

export interface AromaObject {
  primary: {
    floral?: string[];
    greenFruit?: string[];
    citrusFruit?: string[];
    stoneFruit?: string[];
    tropicalFruit?: string[];
    redFruit?: string[];
    blackFruit?: string[];
    driedCookedFruit?: string[];
    herbaceous?: string[];
    herbal?: string[];
    pungentSpice?: string[];
    other?: string[];
  };
  secondary: {
    yeast?: string[];
    malolacticConversion?: string[];
    oak?: string[];
  };
  tertiary: {
    deliberateOxidation?: string[];
    fruitDevelopmentWhite?: string[];
    fruitDevelopmentRed?: string[];
    bottleAgeWhite?: string[];
    bottleAgeRed?: string[];
  };
}

export interface AppearanceData {
  wineType: WineType | null;
  clarity: 'clear' | 'hazy' | null;
  intensity: 'pale' | 'medium' | 'deep' | null;
  color: string | null;
  otherObservations: string[];
}

export interface NoseData {
  condition: 'clean' | 'unclean' | null;
  intensity: 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'pronounced' | null;
  aromas: AromaObject;
  development: 'youthful' | 'developing' | 'fully developed' | 'tired/past its best' | null;
}

export interface PalateData {
  sweetness: 'dry' | 'off-dry' | 'medium-dry' | 'medium-sweet' | 'sweet' | 'luscious' | null;
  acidity: 'low' | 'medium(-)' | 'medium' | 'medium(+)' | 'high' | null;
  tannin: 'low' | 'medium(-)' | 'medium' | 'medium(+)' | 'high' | null;
  alcohol: 'low' | 'medium' | 'high' | null;
  fortified: boolean;
  body: 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'full' | null;
  mousse: 'delicate' | 'creamy' | 'aggressive' | null;
  flavorIntensity: 'light' | 'medium(-)' | 'medium' | 'medium(+)' | 'pronounced' | null;
  flavors: AromaObject;
  finish: 'short' | 'medium(-)' | 'medium' | 'medium(+)' | 'long' | null;
}

export interface ConclusionsData {
  qualityLevel: 'faulty' | 'poor' | 'acceptable' | 'good' | 'very good' | 'outstanding' | null;
  readiness: 'too young' | 'can drink now, but has potential for ageing' | 'drink now: not suitable for ageing or further ageing' | 'too old' | null;
}

export interface TastingData {
  appearance: AppearanceData;
  nose: NoseData;
  palate: PalateData;
  conclusions: ConclusionsData;
}
```

---

### Validation & Error Handling

**User Experience Considerations:**

1. **Wine Type Not Selected:**
   - When user tries to view aroma/flavor picker without selecting wine type
   - Show friendly message: "👆 Please select your wine type in the Appearance section above to continue"
   - Disable/grey out aroma picker until wine type is selected
   - Use Nuxt UI Alert component

2. **Wine Type Changed:**
   - Auto-clean invalid selections silently (best UX, less interruption)
   - Show toast notification: "✓ Selection updated for your wine type"
   - Optional: Use Nuxt UI Toast component from @nuxt/ui
   - No confirmation dialog needed - let users undo if they change wine type again

3. **Data Consistency Before Generation:**
   - Before generating notes, validate all selections against current wine type
   - In dev mode, log warnings if inconsistencies found
   - In production, silently filter out invalid selections before generation
   - This ensures note generation always has valid data

4. **Mousse Field (Sparkling Wines):**
   - Show Mousse field in Palate step ONLY if 'bubbles' or 'pétillance' observed in Appearance
   - Otherwise hide or grey out
   - This prevents confusion for non-sparkling wines

---

### Testing Requirements

**Unit Tests - `wineTypeFilters.ts`:**
- Test all filter functions with each wine type combination
- Test edge cases: null wine type, invalid categories
- Test getVisibleCategoriesForWineType for each type
- Test isAromaValidForWineType comprehensively

**Unit Tests - `useTastingData.ts`:**
- Test wine type change handler for all transitions (white→red, red→rosé, etc.)
- Test cleanup logic: verify invalid selections are cleared
- Test validation function returns correct boolean
- Test watch triggers on wine type change

**Component Tests - `AromaFlavorPicker.vue`:**
- Test category visibility for each wine type
- Test that invalid categories don't render
- Test that changing wine type updates visible categories
- Test v-model binding works correctly with filtered data
- Test "no wine type selected" message shows when needed

**Component Tests - `WineTypeSelector.vue`:**
- Test selection and emission of wine type
- Test visual feedback for selected type
- Test three options render correctly

**Integration Tests:**
- Full wizard flow: Select white, add white-specific aromas, change to red, verify cleanup
- Verify rosé shows all categories
- Test selecting aromas for white, changing to red, verify Red aromas only remain
- Verify generation works with filtered/cleaned data
- Test all transitions: white→red, white→rosé, red→white, red→rosé, rosé→white, rosé→red

---

### Component Structure
```
app/
├── components/
│   ├── wizard/
│   │   ├── WizardContainer.vue
│   │   ├── WizardProgress.vue
│   │   ├── WizardNavigation.vue
│   │   ├── steps/
│   │   │   ├── AppearanceStep.vue         # Includes WineTypeSelector first
│   │   │   ├── NoseStep.vue
│   │   │   ├── PalateStep.vue
│   │   │   └── ConclusionsStep.vue
│   │   └── inputs/
│   │       ├── RadioGroup.vue
│   │       ├── CheckboxGroup.vue
│   │       ├── WineTypeSelector.vue       # NEW: Initial wine type picker
│   │       └── AromaFlavorPicker.vue      # UPDATED: Wine type filtering
│   └── results/
│       ├── TastingNoteDisplay.vue
│       ├── ProfileSelector.vue
│       └── CopyToClipboard.vue
├── composables/
│   ├── useTastingData.ts                  # UPDATED: Wine type change handling
│   ├── useWizardNavigation.ts
│   └── useNoteGenerator.ts
├── types/
│   ├── tasting.ts                         # UPDATED: Wine type interfaces
│   └── profiles.ts
└── utils/
    ├── templates/
    │   ├── professional.ts
    │   ├── casual.ts
    │   ├── bartalk.ts
    │   └── playful.ts
    ├── wineTypeFilters.ts                 # NEW: Centralized filtering logic
    ├── textGenerators.ts
    └── aromaCategorizer.ts
```

## Implementation Phases
### Phase 1: Foundation & Data Models
- Create TypeScript interfaces for all WSET structures
- Provide types for full aroma/flavor list
- Composable for reactive state and setters/reset
- Unit tests for models

### Phase 2: Wizard UI Foundation
- Wizard container and navigation logic
- Progress indicator (Nuxt UI Steps)
- Forward/back, mobile-first
- SEO/meta tags and branding

### Phase 3: Form Input Components
- RadioGroup, CheckboxGroup, AromaFlavorPicker (all with full options)
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
```
APPEARANCE: Clear and lemon in color, with medium intensity.

NOSE: Clean, with medium intensity. Detected floral (acacia, violet), green fruit (gooseberry), tropical fruit (lychee), yeast (bread) and bottle age (kerosene) aromas.

PALATE: Off-dry, with medium acidity and medium(-) tannin. High alcohol. Body is medium(-), with aggressive mousse and medium(-) flavor intensity. Detected green fruit (gooseberry), yeast (bread), deliberate oxidation (marzipan) and bottle age (savory) flavors.

CONCLUSIONS: This wine is of good quality. It's too old.
```

#### Casual Profile
```
Appearance: Clear, lemon-colored, medium intensity.

Nose: Clean and floral — think acacia and violet — with notes of gooseberry, lychee, a bready/yeasty touch and a hint of kerosene from bottle age.

Palate: Slightly off-dry, zippy acidity, light tannin and noticeable alcohol. Lively bubbles, modest body and flavors of gooseberry, bread/yeast, marzipan from gentle oxidation, and savory aged notes.

Conclusion: A good wine, but past its prime.
```

#### Bar Talk Profile
```
Smells floral and fresh — acacia/violet, gooseberry and a touch of lychee, with bready yeast and a faint kerosene edge from age.

Tastes slightly off-dry, bright acid, light tannins and pretty warm from the alcohol. Fizzy, fairly light-bodied, with gooseberry, bread, a bit of marzipan from oxidation and savory aged notes.

Solid wine, but past its best.
```

#### Playful Profile
```
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
- Aromas (expandable sections with checkboxes):
  - Primary Aromas (with 11 categories and 50+ options)
  - Secondary Aromas (3 categories with 20+ options)
  - Tertiary Aromas (5 categories with 35+ options)

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
- Flavors (expandable sections, same structure as aromas)

### Step 4: Conclusions
**Form Fields:**
- Quality Level (radio): faulty / poor / acceptable / good / very good / outstanding
- Readiness/Aging (radio): too young / can drink now but has potential for ageing / drink now: not suitable for ageing or further ageing / too old

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
- 4-step wizard, all WSET fields, forward/back
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
