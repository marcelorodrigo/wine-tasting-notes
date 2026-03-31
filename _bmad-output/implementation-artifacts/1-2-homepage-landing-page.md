# Story 1.2: Homepage - Landing Page

Status: done

## 🚨 Development Checklist

- [x] Run `pnpm run lint` before committing - fix any issues
- [x] Run `pnpm run typecheck` before committing - fix any type errors

## Story

As a user,
I want a wine-themed landing page with clear value proposition,
so that I can understand the app purpose and start tasting easily.

## Acceptance Criteria

1. **Given** a user visits the homepage, **When** the page loads, **Then** they see Playfair Display typography, wine-themed aesthetic, and clear CTA to start tasting.

## Tasks / Subtasks

- [x] Create wine-themed landing page with hero section (AC: #1)
  - [x] Design hero with wine-themed imagery/gradient
  - [x] Add headline and value proposition copy
  - [x] Add prominent "Start Tasting" CTA button
- [x] Implement Playfair Display typography (AC: #1)
  - [x] Use @fontsource/playfair-display already installed
  - [x] Apply to headings and key UI elements
- [x] Ensure responsive design on mobile (AC: #1)
  - [x] Test at 360px width (mobile)
  - [x] Test at 768px width (tablet)
  - [x] Test at 1024px+ (desktop)
- [x] Add navigation to tasting wizard (linked to Story 1.3)

## Dev Notes

### Technical Requirements

**Project Foundation (from architecture.md):**
- Nuxt 4.4.2 with TypeScript 5.9.3
- Nuxt UI 4.5.1 with Tailwind CSS 4.2.1
- Pinia 0.11.3 for state management
- @fontsource/playfair-display for typography (already installed in Story 1.1)

**UI Framework Requirements (from architecture.md:347-362):**
- Use Nuxt UI components from `@nuxt/ui` first before creating custom components
- Use Pinia for all wizard state (no ad-hoc state)
- Use `useToast()` for all notifications

**State Management Pattern (from architecture.md:299-301):**
- The tasting store is already configured at `app/stores/tasting.ts`
- Homepage should initialize the store with defaults if needed

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

**Page Routes (from architecture.md:186-194):**
- Homepage: `/` (app/pages/index.vue)
- Tasting Wizard: `/tasting` (to be created)
- About: `/about` (to be created)
- Educational: `/educational` (to be created)

**Theme Support (from Story 1.4):**
- Dark/light mode should already work via Nuxt UI
- Ensure landing page respects theme settings

**Accessibility Requirements (from Story 1.5):**
- All interactive elements must be keyboard accessible
- Focus indicators visible on all interactive elements
- Color contrast meets WCAG 2.1 AA standards (4.5:1)

**Naming Conventions (from architecture.md:224-237):**
- Components: PascalCase (e.g., `WineTypeCard.vue` → `<WineTypeCard />`)
- Composables: `use` prefix (e.g., `useTasting.ts` → `useTasting()`)

### Previous Story Intelligence

**From Story 1.1 (Project Setup):**
- Pinia store created at `app/stores/tasting.ts` with wizard state structure
- @fontsource/playfair-display installed and configured in `app/assets/css/main.css`
- Nuxt UI configured with Tailwind CSS 4
- Site metadata configured in `nuxt.config.ts`

### Implementation Notes

1. **Hero Section Design:**
   - Use wine-themed gradient (deep burgundy to purple)
   - Include wine glass icon or illustration
   - Clear headline: "Discover Your Palate"
   - Subheadline: "Professional wine tasting notes in seconds"
   - Large CTA button: "Start Tasting" → navigates to `/tasting`

2. **Typography:**
   - Headlines: Playfair Display (already installed)
   - Body: Default sans-serif from Nuxt UI

3. **Responsive Behavior:**
   - Mobile: Stacked layout, full-width CTA
   - Tablet/Desktop: Centered content, comfortable spacing

### References

- Architecture Decision Document: `_bmad-output/planning-artifacts/architecture.md`
  - Routing: lines 186-194
  - Custom Fonts: lines 168-183
  - Project Structure: lines 249-263
  - Naming Patterns: lines 223-237
  - Enforcement Guidelines: lines 347-363

- Epics & Stories: `_bmad-output/planning-artifacts/epics.md`
  - Epic 1 Overview: lines 122-128
  - Story 1.2 Details: lines 173-188

- Previous Story: `_bmad-output/implementation-artifacts/1-1-project-setup-configuration.md`
  - Story 1.1 completion notes show what's already installed

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

**Story 1.2 Implementation Complete (2026-03-31)**

- Created wine-themed landing page with hero section in `app/pages/index.vue`
- Implemented wine gradient from burgundy (#722F37) to purple (#4A1942)
- Added Playfair Display typography for headlines via `.font-serif` class
- Created prominent "Start Tasting" CTA button linking to `/tasting`
- Responsive design with Tailwind breakpoints (mobile/tablet/desktop)
- Features section showcasing the app's value
- Call-to-action section at bottom
- All lint and typecheck passed

### File List

- `app/pages/index.vue` - Modified: Wine-themed landing page

## Change Log

- 2026-03-31: Implemented wine-themed landing page with hero section, Playfair Display typography, and CTA button
- 2026-03-31: Code review fixes - added main landmark, aria-label, emoji fallback for wine icon

## Review Findings

### Patches Applied
- [x] [Review][Patch] Icon fallback for i-lucide-wine [app/pages/index.vue:11] — Replaced with emoji fallback 🍷
- [x] [Review][Patch] Missing aria-label on scroll indicator [app/pages/index.vue:37] — Added aria-label="Scroll down"
- [x] [Review][Patch] No main landmark for screen readers [app/pages/index.vue:3,73] — Added <main> wrapper

### Deferred Items
- [x] [Review][Defer] Hardcoded colors in styles [app/pages/index.vue:86-103] — deferred, pre-existing style preference
- [x] [Review][Defer] 80vh min-height on very short viewports [app/pages/index.vue:87] — deferred, edge case for <500px viewports

