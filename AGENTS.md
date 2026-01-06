# Guide for AI Coding Agents: wine-tasting-notes

This is a **Wine Tasting Notes Generator** - a Nuxt 4 application that generates WSET Level 3-compliant wine tasting notes in multiple stylistic profiles. Understanding the wine domain and multi-step wizard architecture is essential for productivity.

## Big Picture: Wine Tasting Domain Architecture

### Project Scope
- **Purpose**: Generate professional wine tasting notes based on WSET Level 3 standards (2022, Issue 2)
- **Input**: 4-step wizard capturing wine observations (Appearance → Nose → Palate → Conclusions)
- **Output**: Tasting notes in 4 profiles (Professional, Casual, Bar Talk, Playful)
- **Key Constraint**: No data persistence, no backend, no AI/LLM - pure template-based text generation
- **Design**: Mobile-first, works with partial/incomplete data

### Wine Type is THE Critical Filter
The **wine type** (white/rosé/red) selected in Step 1 drives filtering throughout the entire application:
- **Color options** in Appearance (white shows lemon/gold, red shows ruby/garnet, etc.)
- **Aroma categories** visible in Nose (whites see Green Fruit/Citrus; reds see Red/Black Fruit)
- **Flavor categories** in Palate (same filtering as aromas)
- **Tertiary characteristics** (Fruit Development White, Bottle Age Red, etc. - rosé gets ALL)
- See `app/utils/wineTypeFilters.ts` for the filtering matrix - this is the single source of truth

### Critical Architectural Decisions
1. **Wine Type Selection First** - `WineTypeSelector.vue` must be the first control in AppearanceStep (cannot skip)
2. **Auto-Clean on Wine Type Change** - When wine type changes, invalid aroma/flavor selections are silently cleared with a toast notification (not a dialog)
3. **Rosé Wine Gets Full Access** - All aroma/flavor categories available for rosé (intentional design per requirements)
4. **No Mousse for Still Wines** - Mousse field (aggressive/creamy/delicate) only shows if 'bubbles' or 'pétillance' observed
5. **Template-Based Generation** - Text generation uses pure template strings + conditional logic, NOT AI (see `app/utils/templates/`)

## Directory Structure & Key Files

```
app/
├── components/wizard/             # 4-step wizard UI
│   ├── WizardContainer.vue         # Main wizard wrapper + state
│   ├── WizardProgress.vue          # Visual step indicator
│   ├── WizardNavigation.vue        # Prev/Next/Generate buttons
│   ├── steps/
│   │   ├── AppearanceStep.vue      # Step 1: Wine type + clarity/intensity/color/observations
│   │   ├── NoseStep.vue            # Step 2: Condition/intensity + aromas by category
│   │   ├── PalateStep.vue          # Step 3: Sweetness/acidity/tannin/body/mousse/flavors
│   │   └── ConclusionsStep.vue     # Step 4: Quality level + readiness
│   ├── inputs/
│   │   ├── WineTypeSelector.vue    # Radio cards: White/Rosé/Red (CRITICAL: must filter all)
│   │   ├── RadioGroup.vue          # Reusable radio inputs
│   │   ├── CheckboxGroup.vue       # Reusable checkbox inputs
│   │   └── AromaFlavorPicker.vue   # Complex nested accordion for 100+ aroma options
│   └── results/
│       ├── TastingNoteDisplay.vue  # Shows generated note with formatting
│       ├── ProfileSelector.vue     # Switch: Professional/Casual/Bar Talk/Playful
│       └── CopyToClipboard.vue     # Copy to clipboard button
├── composables/
│   ├── useTastingData.ts           # Core state: reactive tasting data + wine type handlers
│   ├── useWizardNavigation.ts      # Step management (currentStep, goNext, goPrevious)
│   └── useNoteGenerator.ts         # Generates notes from data + profile type
├── types/tasting.ts               # TypeScript interfaces: WineType, AromaObject, TastingData
├── utils/
│   ├── wineTypeFilters.ts          # CRITICAL: Filtering matrices + helper functions
│   ├── textGenerators.ts           # Text assembly per section (appearance/nose/palate/conclusions)
│   ├── aromaCategorizer.ts         # Format aroma lists with correct grammar
│   └── templates/
│       ├── professional.ts         # All-caps headers, formal language, technical
│       ├── casual.ts               # Sentence-case headers, conversational flow
│       ├── bartalk.ts              # No headers, punchy, direct engagement
│       └── playful.ts              # Creative metaphors, humorous while accurate
├── pages/index.vue                 # Main page: mounts WizardContainer
└── app.config.ts                   # Branding colors (burgundy/gold wine theme)
```

## Data Model & State Management

### Core Data Structure (useTastingData.ts)
```typescript
TastingData {
  appearance: { wineType, clarity, intensity, color, otherObservations }
  nose: { condition, intensity, aromas, development }
  palate: { sweetness, acidity, tannin, alcohol, fortified, body, mousse, flavorIntensity, flavors, finish }
  conclusions: { qualityLevel, readiness }
}

AromaObject { primary: {...}, secondary: {...}, tertiary: {...} }
// Primary categories: floral, greenFruit, citrusFruit, stoneFruit, tropicalFruit, redFruit, blackFruit, driedCookedFruit, herbaceous, herbal, pungentSpice, other
// Secondary: yeast, malolacticConversion, oak (same for all wine types)
// Tertiary: deliberateOxidation, fruitDevelopmentWhite, fruitDevelopmentRed, bottleAgeWhite, bottleAgeRed
```

### State Management Pattern
- **Single composable source of truth**: `useTastingData()` holds all wizard data as reactive refs
- **Wine type watchers**: Auto-clean aromas/flavors when wine type changes via `handleWineTypeChange()`
- **Validation**: `validateDataConsistency()` ensures all selections match current wine type
- **Reset**: `resetTastingData()` clears everything for new tasting

## Wine Type Filtering System (wineTypeFilters.ts)

**This is the MOST important utility file** - it defines which categories are visible for each wine type.

### Filtering Rules
| Aroma Category | White | Rosé | Red |
|---|---|---|---|
| Floral, Herbal, Pungent Spice, Other | ✓ | ✓ | ✓ |
| Green Fruit, Citrus, Stone, Tropical | ✓ | ✓ | ✗ |
| Red Fruit, Black Fruit, Dried/Cooked | ✗ | ✓ | ✓ |
| Secondary (Yeast, MLF, Oak) | ✓ | ✓ | ✓ |
| Deliberate Oxidation | ✓ | ✓ | ✓ |
| Fruit Dev White, Bottle Age White | ✓ | ✓ | ✗ |
| Fruit Dev Red, Bottle Age Red | ✗ | ✓ | ✓ |

### Key Functions (use these everywhere!)
```typescript
isPrimaryCategoryVisibleForWineType(category, wineType) // Check if category shows
isTertiaryCategoryVisibleForWineType(category, wineType) // Check if category shows
getVisibleCategoriesForWineType(wineType) // Get all {primary, secondary, tertiary}
isAromaValidForWineType(category, wineType, type) // Validate selection
```

## Developer Workflows

### Essential Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Build for production
pnpm lint             # Check ESLint + stylistic rules (commaDangle:never, braceStyle:1tbs)
pnpm typecheck        # TypeScript strict mode validation
pnpm test             # Run all tests (unit + Nuxt component tests)
pnpm test:unit        # Unit tests only (utils, composables, templates)
pnpm test:nuxt        # Component tests only (with happy-dom)
pnpm test:coverage    # Coverage report
```

### Pre-Implementation Checklist
1. Review `doc/PLAN.md` for full specifications (816 lines - references WSET standards)
2. Check `app/utils/wineTypeFilters.ts` before working with aromas/flavors
3. Understand wine type filtering impacts: appears in filters, no persistence means watchers must be explicit
4. Mobile-first: Test at 320px width minimum, 44px+ touch targets

## Testing Strategy

### Unit Tests (test/unit/)
- **wineTypeFilters.ts**: All filter functions for each wine type + transitions
- **textGenerators.ts**: Generate appearance/nose/palate/conclusions text - test with complete, partial, empty data
- **templates/*.ts**: Each profile generates differently - test all 4 on same data
- **aromaCategorizer.ts**: Correct grammar: "apple, pear and grape" not "apple, pear, grape"

### Component Tests (test/nuxt/)
- **AromaFlavorPicker.vue**: Renders only categories valid for wine type, responds to wine type changes
- **WineTypeSelector.vue**: Selection works, emits correctly
- **Step components**: Data binding works, optional fields don't block generation

### Integration Tests
- Complete wizard flows (white→add aromas→switch to red→verify cleanup)
- Rosé shows all categories
- Generation works with partial data
- Profile switching produces different output styles

## Coding Conventions

### Nuxt UI First, Always
- Use `<UButton>`, `<URadio>`, `<UCheckbox>`, `<UAccordion>` from Nuxt UI
- No custom CSS - use Tailwind v4 utility classes only
- Component auto-imports work for UI components + custom components in `app/components/`

### Template Generation Pattern
Each profile generator is similar:
```typescript
// app/utils/templates/professional.ts
export function generateAppearanceText(data: AppearanceData): string {
  if (!data.clarity && !data.intensity && !data.color) return ''
  const parts = []
  if (data.clarity) parts.push(data.clarity)
  if (data.color) parts.push(`${data.color} in color`)
  return `APPEARANCE: ${parts.join(' and ')}.`
}
```
- **Return empty string** if section has no data
- **Test with null/undefined/empty array** inputs - must not crash
- **Different wording per profile** - Professional is formal, Casual is conversational, Bar Talk is punchy

### Aroma/Flavor Formatting
Aromas must be grouped by category with proper grammar:
```
"Detected floral (acacia, violet), green fruit (gooseberry), and yeast (bread) aromas."
NOT: "Detected acacia, violet, gooseberry, bread"
```
Use `app/utils/aromaCategorizer.ts` to format lists correctly.

### Wine Type Safety
Every component that shows aromas/flavors MUST:
1. Accept `wineType` as a prop
2. Check `isPrimaryCategoryVisibleForWineType()` before rendering
3. Show warning message if `wineType` is null

## Common Pitfalls & Solutions

| Issue | Solution |
|---|---|
| Aromas showing for wrong wine type | Check that component receives `wineType` prop + uses filter function |
| Mousse field always visible | Should only show if otherObservations includes 'bubbles' or 'pétillance' |
| Wine type change doesn't clear aromas | Ensure watch in useTastingData is active, handleWineTypeChange is called |
| Generator crashes on empty input | All text functions must return '' if no data, never crash on null |
| Rosé not showing all categories | Check isTertiaryCategoryVisibleForWineType - rosé should get both White and Red |
| ESLint failing on build | Check commaDangle:never, braceStyle:1tbs in nuxt.config.ts |

## Linting & Style
- We use ESLint with stylistic rules:
  - `pnpm lint` runs ESLint without auto-fix (`eslint .`)
  - `pnpm lint:fix` runs ESLint with auto-fix (`eslint --fix .`)
- ESLint configuration lives in `nuxt.config.ts` under the `eslint` block for stylistic choices
- If you add/modify code, always run `pnpm lint` and `pnpm typecheck` before committing. Optionally, use `pnpm lint:fix` to auto-fix stylistic issues before commit.
- See package.json for the scripts


## Integration Points & External Dependencies

- **Nuxt UI**: All UI components come from here (buttons, radios, accordions, cards)
- **Tailwind CSS v4**: All styling - customize colors in `app.config.ts` under `ui.colors`
- **Iconify**: Wine glass icons, fruit icons from `@iconify-json/lucide` and `@iconify-json/simple-icons`
- **No Backend**: Everything runs client-side, state is session-only
- **No AI/LLM**: All text is deterministic template-based, not generated by external services

## Wine Domain Knowledge

### WSET Level 3 Systematic Approach (what we follow)
1. **Appearance**: Observe clarity, color, intensity, observations (legs, bubbles, etc.)
2. **Nose**: Assess condition, intensity, identify aromas (Primary/Secondary/Tertiary), gauge development
3. **Palate**: Rate sweetness, acidity, tannin, alcohol, body, mousse (if sparkling), identify flavors, assess finish
4. **Conclusions**: Quality level (faulty to outstanding), readiness (too young to too old)

### Wine Type Differences (crucial for filtering!)
- **White wines**: Show green/citrus fruits, white bottle age (petrol/kerosene), white fruit development (dried apricot)
- **Red wines**: Show red/black fruits, red bottle age (leather/earth/tobacco), red fruit development (fig/prune)
- **Rosé wines**: Light colored, from red grapes - gets BOTH white and red characteristics

---

**Refer to `doc/PLAN.md` for the complete 816-line specification including all WSET field definitions, component templates, and implementation phases. This AGENTS.md is a quick reference for the critical concepts and architecture decisions.**

When in doubt about wine domain specifics, check the inspiration source: the official WSET Level 3 standards document structure reflected in our data model and templates.
