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

### Component Structure
```
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
│   │       ├── WineTypeSelector.vue       # NEW: Initial wine type picker
│   │       └── AromaFlavorPicker.vue
│   └── results/
│       ├── TastingNoteDisplay.vue
│       ├── ProfileSelector.vue
│       └── CopyToClipboard.vue
├── composables/
│   ├── useTastingData.ts
│   ├── useWizardNavigation.ts
│   └── useNoteGenerator.ts
├── types/
│   ├── tasting.ts
│   └── profiles.ts
└── utils/
    ├── templates/
    │   ├── professional.ts
    │   ├── casual.ts
    │   ├── bartalk.ts
    │   └── playful.ts
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
