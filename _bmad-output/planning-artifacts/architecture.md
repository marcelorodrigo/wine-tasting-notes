---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ["prd.md"]
workflowType: 'architecture'
project_name: 'wine-tasting-notes'
user_name: 'Senhor do Universo'
date: '2026-03-29'
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
