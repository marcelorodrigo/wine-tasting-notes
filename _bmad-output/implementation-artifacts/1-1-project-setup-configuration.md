# Story 1.1: Project Setup & Configuration

Status: ready-for-dev

## Story

As a developer,
I want a fully configured Nuxt 4 project with all required dependencies,
so that I can start implementing features without setup delays.

## Acceptance Criteria

1. **Given** a fresh Nuxt 4 project, **When** I install and configure Pinia, SEO, and fonts, **Then** the project runs without errors and all integrations work together.

## Tasks / Subtasks

- [ ] Install @pinia/nuxt and configure tasting store (AC: #1)
  - [ ] Run `npx nuxi@latest module add pinia`
  - [ ] Create `app/stores/tasting.ts` with wizard state structure
  - [ ] Verify store integrates with Nuxt UI components
- [ ] Install @nuxtjs/seo and configure site metadata (AC: #1)
  - [ ] Run `npx nuxi@latest module add seo`
  - [ ] Configure nuxt.config.ts with site metadata
  - [ ] Verify sitemap, robots, schema-org, opengraph work
- [ ] Install @fontsource/playfair-display and configure CSS (AC: #1)
  - [ ] Run `npm install @fontsource/playfair-display`
  - [ ] Import in `app/assets/css/main.css`
  - [ ] Configure Tailwind CSS to use Playfair Display
- [ ] Verify all integrations work together (AC: #1)
  - [ ] Run `npm run dev` and verify no errors
  - [ ] Run `npm run lint` - fix any issues
  - [ ] Run `npm run typecheck` - fix any type errors
  - [ ] Test dark/light mode toggle works

## Dev Notes

### Technical Requirements

**Project Foundation (from architecture.md):**
- Nuxt 4.4.2 with TypeScript 5.9.3
- Nuxt UI 4.5.1 with Tailwind CSS 4.2.1
- Pinia 0.11.3 for state management
- @nuxtjs/seo bundle (sitemap, robots, schema-org, opengraph)
- @fontsource/playfair-display for typography

**State Management Pattern (from architecture.md:299-301):**
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
    setWineType(type) { this.wineType = type },
    reset() { this.$reset() },
  },
})
```

**Naming Conventions (from architecture.md:224-237):**
- Components: PascalCase (e.g., `WineTypeCard.vue` → `<WineTypeCard />`)
- Composables: `use` prefix (e.g., `useTasting.ts` → `useTasting()`)
- Stores: `stores/tasting.ts` → `useTastingStore()`

**Project Structure (from architecture.md:250-263):**
```
app/
├── assets/css/main.css      # Global styles, font imports
├── components/              # Vue components
├── composables/             # Auto-imported composables
├── data/                    # Static data (aromas, wine types)
├── layouts/                 # Page layouts
├── pages/                   # Routes (auto-generated)
├── plugins/                 # Nuxt plugins
├── stores/                  # Pinia stores
├── templates/               # Note generation templates
└── utils/                   # Utility functions
```

**Enforcement Guidelines (from architecture.md:349-362):**
- Use Nuxt UI components from `@nuxt/ui` first before creating custom components
- Use Pinia for all wizard state (no ad-hoc state)
- Use `useToast()` for all notifications
- Follow TypeScript for all new files

**Pattern Verification:**
- Run `npm run lint` before committing
- Run `npm run typecheck` for type safety

### References

- Architecture Decision Document: `_bmad-output/planning-artifacts/architecture.md`
  - State Management: lines 124-139
  - SEO Strategy: lines 142-165
  - Custom Fonts: lines 168-183
  - Naming Patterns: lines 223-237
  - Project Structure: lines 249-263
  - Pinia Store Pattern: lines 269-301
  - Accessibility Patterns: lines 337-344
  - Enforcement Guidelines: lines 347-363

- Epics & Stories: `_bmad-output/planning-artifacts/epics.md`
  - Epic 1 Overview: lines 122-128
  - Story 1.1 Details: lines 156-171

- Product Requirements: `_bmad-output/planning-artifacts/prd.md`
  - Technical Requirements: lines 187-206
  - Starter Template: lines 82-95

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

