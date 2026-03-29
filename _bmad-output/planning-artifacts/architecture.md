---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ["prd.md"]
workflowType: 'architecture'
project_name: 'wine-tasting-notes'
user_name: 'Senhor do Universo'
date: '2026-03-29'
lastStep: 8
status: 'complete'
completedAt: '2026-03-29'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- 43 total FRs spanning 11 categories
- Core feature: Interactive aroma wheel with wine-type filtering and three-tier aroma display
- Multi-step wizard (Appearance → Nose → Palate → Conclusions)
- Template-based note generation in 4 output styles
- Full responsive design (320px+)
- Dark/light theme support
- WCAG 2.1 AA accessibility compliance

**Non-Functional Requirements:**
- Initial load < 3s on 3G
- Time to interactive < 2s
- Wizard transitions < 500ms
- Aroma wheel interactions < 100ms
- Zero critical bugs on mobile Chrome/Safari

**Scale & Complexity:**
- Primary domain: Web Application (Nuxt 4 SPA)
- Complexity level: Low-Medium
- Estimated architectural components: 8-12 major components
- Team: Single developer
- Timeline: 2-4 weeks MVP

### Technical Constraints & Dependencies
- Nuxt 4 framework
- Client-side only (no backend for v1)
- No data persistence required
- No authentication required

### Cross-Cutting Concerns Identified
- Wizard state management across 4 steps
- Aroma wheel component architecture (filterable, accessible)
- Theme system (dark/light)
- Accessibility implementation across all interactive elements

## Starter Template Evaluation

### Primary Technology Domain

**Nuxt 4 SPA** based on PRD requirements

### Starter Options Considered

1. **Nuxt UI Starter** (Selected) - Already configured in project
2. **Nuxt 4 Starter Template** (taunoha/nuxt4-starter-template)
3. **Nuxtjs Starter** (matimortari/nuxtjs-boilerplate)

### Selected Starter: Nuxt UI (Already Configured)

**Rationale for Selection:**
The project already uses Nuxt UI, which is the official UI library for Nuxt. It provides:
- Mobile-first responsive components
- Built-in dark/light theme support
- Tailwind CSS 4 integration
- Accessibility compliance
- Rich component library for forms and wizards

**Current Configuration:**

**Language & Runtime:**
- Nuxt 4.4.2
- TypeScript 5.9.3

**Styling Solution:**
- Tailwind CSS 4.2.1 (via Nuxt UI)
- Custom CSS in `app/assets/css/main.css`

**Build Tooling:**
- Vite (default in Nuxt 4)
- Hot module replacement enabled

**Testing:**
- vue-tsc for type checking

**Code Organization:**
- `app/pages/` for routes
- `app/components/` for components
- `app/assets/` for styles

**Development Experience:**
- `npm run dev` for development
- `npm run lint` for ESLint
- `npm run typecheck` for TypeScript

**Note:** Project initialization already complete. This is the foundation for all implementation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State management: Pinia
- SEO: @nuxtjs/seo bundle
- Fonts: Self-hosted

**Important Decisions (Shape Architecture):**
- Routing: Nuxt file-based (default)

**Deferred Decisions (Post-MVP):**
- None identified for MVP

---

### State Management

**Decision:** Pinia via @pinia/nuxt

**Version:** v0.11.3

**Rationale:**
- Official Vue/Nuxt state management solution
- TypeScript support
- Lightweight and performant
- Persists wizard state across 4 steps (Appearance → Nose → Palate → Conclusions)

**Implementation:**
- Install: `npx nuxi@latest module add pinia`
- Store: `app/stores/tasting-store.ts` for wizard state

---

### SEO Strategy

**Decision:** @nuxtjs/seo bundle (full features)

**Version:** v4.0.2 (npm) / v5.0.2 (latest)

**Modules Included:**
- @nuxtjs/sitemap - XML sitemap generation
- @nuxtjs/robots - Robots.txt management
- nuxt-schema-org - Structured data (JSON-LD)
- @nuxtjs/opengraph - Social media cards
- @nuxtjs Canonical URL management

**Rationale:**
- Complete SEO solution for Nuxt
- TypeScript support
- Automatic meta tag handling
- Structured data for wine tasting notes (rich snippets)
- Social sharing optimization

**Implementation:**
- Install: `npx nuxi@latest module add seo`
- Configure in nuxt.config.ts with site metadata

---

### Custom Fonts (Playfair Display)

**Decision:** Self-hosted fonts

**Rationale:**
- Better performance (no Google Fonts CDN dependency)
- Improved privacy (no external requests)
- Consistent loading (no FOIT/FOUT)
- Font subsetting for smaller bundle

**Implementation:**
- Download Playfair Display from Google Fonts or use @fontsource
- Package: @fontsource/playfair-display
- Install: `npm install @fontsource/playfair-display`
- Import in main CSS

---

### Routing

**Decision:** Nuxt file-based routing (default)

**Rationale:**
- Works perfectly for your routes: Home (/), Tasting Generator (/tasting), About (/about), Educational (/educational)
- Automatic route generation from `app/pages/`
- No additional configuration needed

**Provided by Starter:** Yes

---

### Decision Impact Analysis

**Implementation Sequence:**

1. Install @pinia/nuxt and create tasting store
2. Install @nuxtjs/seo and configure site metadata
3. Install @fontsource/playfair-display and configure CSS
4. Verify all integrations work together

**Cross-Component Dependencies:**
- Pinia store will need to integrate with Nuxt UI components
- SEO module needs site URL configuration
- Font loading needs to work with Tailwind CSS

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 areas where AI agents could make different choices

---

### Naming Patterns

**Component Naming:**
- Use PascalCase: `WineTypeCard.vue` → `<WineTypeCard />`
- Nested directories: `components/base/Button.vue` → `<BaseButton />`
- Prefixes: `components/ui/` for generic components

**Composable Naming:**
- Prefix with `use`: `useTasting.ts` → auto-imports as `useTasting()`
- Use camelCase for file names

**Store Naming:**
- File: `stores/tasting.ts`
- Export: `useTastingStore()`
- Actions: `setWineType()`, `updateAppearance()`, etc.

**File Organization:**
- Pages: `app/pages/` (auto-routed)
- Components: `app/components/`
- Composables: `app/composables/`
- Stores: `app/stores/`

---

### Structure Patterns

**Project Structure:**
```
app/
├── assets/          # CSS, images
├── components/     # Vue components
│   └── ui/         # Reusable UI components
├── composables/    # Auto-imported composables
├── data/          # Static data (aromas, wine types)
├── layouts/       # Page layouts
├── pages/        # Routes (auto-generated)
├── plugins/      # Nuxt plugins
├── stores/      # Pinia stores
├── templates/   # Note generation templates
└── utils/       # Utility functions
```

---

### State Management Patterns (Pinia)

**Store Definition:**
```typescript
// stores/tasting.ts
export const useTastingStore = defineStore('tasting', {
  state: () => ({
    wineType: null,
    appearance: {},
    aromas: { primary: [], secondary: [], tertiary: [] },
    palate: {},
    conclusions: {},
  }),
  getters: {
    isComplete: (state) => /* check all steps */,
    selectedAromas: (state) => /* combine all tiers */,
  },
  actions: {
    setWineType(type) {
      this.wineType = type
    },
    reset() {
      this.$reset()
    },
  },
})
```

**Usage in Components:**
```vue
<script setup>
const tasting = useTastingStore()
</script>
```

---

### Error & Loading Patterns (Nuxt UI)

**Toast Notifications:**
```typescript
const toast = useToast()

// Success
toast.add({ title: 'Note copied!', color: 'success' })

// Error
toast.add({ title: 'Error', description: 'Failed to copy', color: 'error' })
```

**Loading States:**
- Use `<UButton loading>` for async operations
- Use `<USkeleton>` for loading content
- Use `pending` state from `useAsyncData()`

**Form Handling:**
```typescript
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', color: 'success' })
}

async function onError(event: FormErrorEvent) {
  toast.add({ title: 'Validation Error', color: 'error' })
}
```

---

### Accessibility Patterns

- Use Nuxt UI components (WCAG compliant by default)
- Add `aria-label` to icon-only buttons
- Ensure color contrast 4.5:1 minimum
- Keyboard navigation for aroma wheel
- Focus indicators on all interactive elements

---

### Enforcement Guidelines

**All AI Agents MUST:**

- Use Nuxt UI components from `@nuxt/ui` first before creating custom components
- Follow PascalCase for component names
- Use `use` prefix for composables
- Use Pinia for all wizard state (no ad-hoc state)
- Use `useToast()` for all notifications
- Follow the project structure above
- Use TypeScript for all new files

**Pattern Verification:**

- Run `npm run lint` before committing
- Run `npm run typecheck` for type safety
- Test keyboard navigation for accessibility

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
wine-tasting-notes/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css              # Global styles, font imports
│   │
│   ├── components/
│   │   ├── aroma/
│   │   │   ├── AromaWheel.vue        # Interactive aroma wheel
│   │   │   ├── AromaTabs.vue         # Primary/Secondary/Tertiary tabs
│   │   │   ├── AromaCategory.vue     # Single category in wheel
│   │   │   └── AromaItem.vue         # Individual aroma chip
│   │   │
│   │   ├── output/
│   │   │   ├── NotePreview.vue       # Generated note display
│   │   │   ├── StyleSwitcher.vue     # Professional/Casual/Bar Talk/Playful
│   │   │   └── CopyButton.vue        # Copy to clipboard
│   │   │
│   │   ├── wizard/
│   │   │   ├── WineTastingWizard.vue # Main wizard container
│   │   │   ├── WineTypeSelector.vue   # Wine type cards
│   │   │   ├── AppearanceStep.vue     # Color + intensity
│   │   │   ├── ColorSlider.vue        # Gradient color picker
│   │   │   ├── IntensitySelector.vue  # Light/Medium/Deep
│   │   │   ├── NoseStep.vue           # Aroma wheel step
│   │   │   ├── PalateStep.vue         # Tannins/Acidity/Body
│   │   │   ├── PalateAromas.vue       # Palate aroma selection
│   │   │   ├── ConclusionsStep.vue    # Finish/Aging/Wine name
│   │   │   ├── ProgressIndicator.vue  # Wine glass + timeline
│   │   │   └── StepNavigation.vue      # Back/Next buttons
│   │   │
│   │   └── ui/
│   │       ├── WineTypeCard.vue       # Individual wine type card
│   │       └── AromaChip.vue          # Selectable aroma tag
│   │
│   ├── composables/
│   │   ├── useAromas.ts               # Aroma data + filtering
│   │   ├── useWineTypes.ts            # Wine type definitions
│   │   └── useNoteGenerator.ts        # Template-based generation
│   │
│   ├── data/
│   │   ├── aromas/
│   │   │   ├── primary.ts             # Primary aroma lists by wine type
│   │   │   ├── secondary.ts           # Secondary aroma lists
│   │   │   └── tertiary.ts            # Tertiary aroma lists
│   │   └── wine-types.ts              # Wine type metadata
│   │
│   ├── layouts/
│   │   └── default.vue               # Main layout with header/footer
│   │
│   ├── pages/
│   │   ├── index.vue                  # Homepage
│   │   ├── tasting.vue                # Tasting wizard page
│   │   └── about.vue                  # About page (future)
│   │
│   ├── plugins/
│   │   └── fonts.client.ts            # Font loading (or use @fontsource)
│   │
│   ├── stores/
│   │   └── tasting.ts                 # Pinia store for wizard state
│   │
│   ├── templates/
│   │   ├── professional.ts           # Professional style template
│   │   ├── casual.ts                  # Casual style template
│   │   ├── bar-talk.ts                # Bar Talk style template
│   │   └── playful.ts                 # Playful style template
│   │
│   ├── app.vue                        # Root app component
│   ├── app.config.ts                  # Nuxt UI config
│   └── assets/css/main.css            # Global CSS
│
├── public/
│   └── fonts/                         # Self-hosted fonts (if needed)
│
├── nuxt.config.ts                     # Nuxt configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

### Requirements to Structure Mapping

| FR Category | Directory | Key Files |
|-------------|-----------|-----------|
| Homepage & Navigation | `pages/`, `components/` | `index.vue`, `HomeHero.vue` |
| Wine Selection | `components/wizard/` | `WineTypeSelector.vue` |
| Appearance Evaluation | `components/wizard/` | `AppearanceStep.vue`, `ColorSlider.vue` |
| Nose/Aroma Assessment | `components/aroma/` | `AromaWheel.vue`, `AromaTabs.vue` |
| Palate Assessment | `components/wizard/` | `PalateStep.vue`, `TanninSelector.vue` |
| Conclusions | `components/wizard/` | `ConclusionsStep.vue` |
| Note Generation | `templates/`, `stores/` | `tasting-store.ts`, `note-templates.ts` |
| Style Switcher | `components/output/` | `StyleSwitcher.vue`, `NotePreview.vue` |

---

### Architectural Boundaries

**Component Boundaries:**
- Wizard Container (`WineTastingWizard.vue`) manages step transitions and overall flow
- Pinia Store (`stores/tasting.ts`) holds all wizard state - single source of truth
- Aroma Wheel components receive wine type from store, filter aromas accordingly
- Template functions receive store state, return formatted note strings

**State Flow:**
1. User selects wine type → Store updates `wineType`
2. Aroma wheel filters based on `wineType` 
3. User progresses through steps → Store accumulates state
4. At completion → Templates read store state → Generate formatted note

**Integration Points:**
- `@nuxt/ui` components used throughout (buttons, cards, forms)
- `@pinia/nuxt` for state management
- `@nuxtjs/seo` configured in nuxt.config.ts
- `@fontsource/playfair-display` for typography

---

## Internationalization (i18n) Architecture

### Decision: Nuxt i18n Module

**Package:** `@nuxtjs/i18n`

**Rationale:**
- Official Nuxt module, well-maintained
- Auto-detect browser language
- Manual language switching with localStorage persistence
- SSR support for SEO benefits
- Lazy loading of locale files

---

### Supported Languages

**WSET-Approved Languages (12):**

| Phase | Language | Code | Notes |
|-------|----------|------|-------|
| v1 | English | `en` | Default, broadest reach |
| v2 | Portuguese | `pt` | User's native language |
| v3 | Spanish | `es` | |
| v3 | French | `fr` | |
| v3 | Italian | `it` | |
| v3 | German | `de` | +20-30% text expansion |
| v3 | Dutch | `nl` | |
| v3 | Chinese (Traditional) | `zh` | CJK characters |
| v3 | Japanese | `ja` | CJK characters |
| v3 | Korean | `ko` | CJK characters |
| v3 | Greek | `el` | |
| v3 | Turkish | `tr` | |

**Explicitly Not Supported:**
- Russian, Polish, Persian — Not available in WSET materials

---

### WSET Terminology Sourcing Strategy

**Core Principle:** Always source terminology from WSET official materials

**Sourcing Hierarchy:**

```
For each language:
1. Check WSET website for SAT PDF in target language
   → If exists: Use official WSET terminology directly
   
2. If not available: Translate from English only
   → Use official EN terms as source of truth
   → Human review by native speaker required
   
3. Quality gate: Native speaker with wine knowledge verifies
```

**Key Rules:**
- ✅ Always use English as source of truth
- ✅ Source from target language if available on WSET website
- ✅ Translate from English if target not available
- ❌ NEVER chain translate (EN→PT→ES forbidden)
- ❌ NEVER use machine translation without human review

**WSET Resources:**
- Level 2 SAT: https://www.wsetglobal.com/media/13156/wset_l2wines_sat_en_may2023_issue2.pdf
- Level 3 SAT: https://www.wsetglobal.com/media/11766/wset_l3wines_sat_en_may2022_issue2.pdf

---

### Implementation Structure

**Locale Files:**
```
app/
├── locales/
│   ├── en.json           # English (default)
│   ├── pt.json           # Portuguese
│   ├── es.json           # Spanish
│   ├── fr.json           # French
│   └── ...
├── data/
│   └── wine-terminology/ # WSET terms per language
│       ├── en.json
│       ├── pt.json
│       └── ...
```

**Locale File Structure:**
```json
{
  "ui": {
    "startTasting": "Start Tasting",
    "next": "Next",
    "back": "Back"
  },
  "wizard": {
    "appearance": "Appearance",
    "nose": "Nose",
    "palate": "Palate",
    "conclusions": "Conclusions"
  },
  "aromas": {
    "primary": "Primary",
    "secondary": "Secondary",
    "tertiary": "Tertiary"
  },
  "terminology": {
    "tannin": "Tannin",
    "acidity": "Acidity",
    "body": "Body"
  }
}
```

---

### Language Detection Strategy

**Auto-Detection (First Visit):**
- Use `navigator.language` to detect browser language
- Match to supported locale (e.g., `pt-BR` → `pt`)
- Fall back to English if unsupported

**Manual Override:**
- Language switcher in header/footer
- Persist selection in `localStorage`
- On return visit, use saved preference

---

### Quality Assurance

**Risk Mitigation:**

| Risk | Mitigation |
|------|------------|
| Wrong translation/terminology | Native speaker review panel |
| No human review capability | Crowdsourced corrections |
| Maintenance burden | Prioritize high-value languages (PT first) |
| Machine translation errors | Human review mandatory for all translations |

**Review Process:**
1. Initial translation by human (not machine)
2. Native speaker with wine knowledge reviews
3. Community can flag incorrect terms
4. Quarterly terminology audits

---

### UI/UX Considerations

**Text Expansion:**
- German/French text 20-30% longer than English
- Use flexible containers, avoid fixed widths
- Test with longest translated strings

**Font Support:**
- `@fontsource/playfair-display` for English/Latin
- Additional fonts needed for: Chinese, Japanese, Korean, Greek
- Consider system fonts as fallback for CJK

**RTL Support:**
- Not required for v1-v3 (no RTL languages)
-预留 for future: Persian if added later

**Date/Number Formatting:**
- Use `Intl.NumberFormat` and `Intl.DateTimeFormat`
- Locale-aware formatting per language

---

### Integration Points

**Components Using i18n:**
- All UI components via `$t()` or `useI18n()`
- Aroma wheel labels
- Template output text
- Error messages and tooltips

**State Management:**
- Language preference stored in localStorage
- Sync with Pinia store for reactive updates

---

### Future Considerations (Post-v3)

- **Gamified translations** — Users earn badges for contributions
- **Wine vocabulary learning** — App teaches wine terms in multiple languages
- **Audio pronunciation** — Audio clips for correct term pronunciation
- **Regional variants** — Regional wine terminology (e.g., "espumante" vs "mousseux")

---

### Implementation Priority

**Post-MVP (After v1.0):**

1. **Install:** `npx nuxi@latest module add i18n`
2. **Configure:** Set up locales, detection, fallback
3. **Create:** English locale file (default)
4. **Test:** Language switcher component
5. **Launch:** v1 with English only
6. **Phase 2:** Add Portuguese locale + terminology
7. **Phase 3:** Expand to remaining 10 languages

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- Nuxt 4.4.2 + Nuxt UI 4.5.1 + Tailwind 4.2.1 are fully compatible
- Pinia 0.11.3 integrates seamlessly with Nuxt 4
- @nuxtjs/seo bundle modules work together
- @fontsource/playfair-display integrates with Tailwind CSS

**Pattern Consistency:**
- PascalCase naming for components ✅
- `use` prefix for composables ✅
- Pinia store pattern defined for wizard state ✅
- Nuxt UI for all error/loading/toast patterns ✅

**Structure Alignment:**
- Complete directory structure defined
- Component boundaries properly mapped
- Integration points clearly specified

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
- All 43 FRs architecturally supported
- All 11 FR categories mapped to components/directories
- Cross-cutting concerns (wizard state, aroma wheel, theme, accessibility) addressed

**Non-Functional Requirements Coverage:**
- Performance: Client-side only, minimal bundle, fast initial load
- Accessibility: Nuxt UI components WCAG compliant by default
- Mobile-first: Responsive design built into component patterns
- Theme: Dark/light mode support via Nuxt UI

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical decisions documented with versions
- Implementation patterns comprehensive with examples
- Consistency rules clear and enforceable

**Structure Completeness:**
- Complete directory structure with all files defined
- Component boundaries well-defined
- Integration points clearly mapped

**Pattern Completeness:**
- All conflict points addressed
- Naming conventions comprehensive
- Process patterns (error handling, loading) documented

### Gap Analysis Results

No critical gaps identified. The architecture is complete and ready for implementation.

### Validation Issues Addressed

All PRD inconsistencies were resolved prior to validation:
- Metrics target unified to "1,000 sessions in first 3 months"
- Smart Aroma Wheel bold formatting added
- Workflow prompts removed from PRD
- Duplicate output styles removed from v2.0

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Complete technology stack validated and compatible
- Comprehensive implementation patterns with code examples
- Full requirements coverage with clear component mapping
- Strong consistency rules for AI agent implementation

**Areas for Future Enhancement:**
- Performance testing tools could be added post-MVP
- E2E testing framework consideration for later

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**

Run `npx nuxi@latest module add pinia` to install Pinia and configure the tasting store as the foundation for wizard state management.
