---
title: "Product Brief: wine-tasting-notes"
status: "draft"
created: "2026-03-29"
updated: "2026-03-29"
brainstorming_session: "session-2026-03-29"
inputs: []
---

# Product Brief: Wine Tasting Notes Generator

## Executive Summary

A mobile-first Nuxt 4 web application that guides users through the WSET Level 3 Systematic Approach to Tasting Wine, generating polished tasting notes in multiple stylistic voices. Users complete a multi-step wizard covering Appearance, Nose, Palate, and Conclusions, then receive professionally written notes adapted for their audience — whether wine enthusiasts, casual Vivino users, friends at the bar, or family with no wine knowledge.

The app's key differentiators are (1) an interactive aroma chart wheel that helps users discover and select aromas during tasting, and (2) a template-based generation system that produces contextually appropriate notes without AI hallucination risk. MVP ships with the aroma wheel and one output style; additional styles follow in subsequent releases.

## The Problem

Wine lovers struggle to articulate what they're tasting. Even WSET-trained individuals forget aroma categories during a tasting session. Current alternatives are unsatisfactory:

- **Vivino and similar apps** focus on label scanning and community ratings — not structured sensory evaluation
- **Paper WSET worksheets** are rigid, hard to use in social settings, and produce clinical output
- **AI tasting note generators** hallucinate, produce inconsistent quality, and require API costs

The result: people either don't record their impressions, or they produce notes that aren't useful for their intended audience.

## The Solution

A frictionless wizard that makes wine tasting structured, memorable, and shareable:

1. **Multi-step wizard** — Appearance → Nose → Palate → Conclusions (WSET order)
2. **Visual components** — Cards for wine type, sliders for intensity, color pickers for appearance
3. **Interactive aroma wheel** — Filters by wine type, three-tier tabs (Primary/Secondary/Tertiary), readable labels
4. **Progress indicators** — Wine glass fills as steps complete + mini timeline
5. **Gentle auto-advance** — 300-500ms delay after selection before next step
6. **Beginner/Expert modes** — Tips for beginners, streamlined for experts
7. **Flexible completion** — Skip any field, generate partial note
8. **Style switcher** — Instant preview switching between output styles
9. **Shareable URL** — State encoded in URL for sharing (no account required)
10. **Aroma cascade** — Nose aromas pre-populate Palate step (WSET pattern)

### Output Styles (v1: Professional; v1.x: all four)
- **Professional**: Technical, WSET-aligned for sommeliers and enthusiasts
- **Casual**: Vivino-style, approachable for everyday wine drinkers
- **Bar Talk**: Conversational, perfect for WhatsApp friends
- **Playful**: Fun, accessible language for family and beginners

## What Makes This Different

| Feature | Our Approach | Competitors |
|---------|--------------|-------------|
| Methodology | WSET Level 3 systematic | Ad-hoc or non-existent |
| Output voice | 4 distinct styles | Single generic output |
| Aroma selection | Interactive wheel | Dropdowns / text fields |
| Generation | Template-based (no AI) | AI hallucination risk |
| Session model | No login required | Account required |
| Platform | Mobile-first web | Native apps / desktop |

**The unfair advantage:** The WSET-aligned data model combined with style templates creates a defensible niche. Competitors would need to either license WSET methodology or rebuild our template engine — neither is trivial.

## Who This Serves

**Primary users:**
- WSET Level 2/3 students practicing for exams
- Wine enthusiasts wanting structured tasting records
- Casual drinkers who want to sound knowledgeable

**Secondary users:**
- Wine educators demonstrating systematic tasting
- Retail staff needing quick reference notes

**Use cases:**
- Tasting room visits
- Wine club pickups
- Restaurant wine drinking
- Social media tasting notes

## Success Criteria

- **Primary metric**: Monthly active sessions (usage tracking)
- **Secondary**: Notes generated per session, average session duration
- **Target**: Grow usage month-over-month; aim for 1,000 sessions in first 3 months

## Scope

### MVP (v1.0)
- Full 4-step wizard (Appearance, Nose, Palate, Conclusions)
- Interactive aroma chart wheel (key differentiator)
- One output style (Professional)
- In-memory state only (no persistence)
- Mobile-first responsive design

### v1.x (Near-term)
- Additional output styles (Casual, Bar Talk, Playful)
- Usage analytics integration

### v2.0 (Next phase)
- Additional output styles (Casual, Bar Talk, Playful)
- User accounts (optional save)
- Export options (PDF, image)

### Explicitly Out of Scope
- Wine label scanning
- Wine database / catalog
- AI-powered recommendations
- Social sharing features
- Offline mode (PWA)
- Data persistence (v1)

## Vision

If successful, this product becomes the **standard tool for structured wine tasting** — the "Grammarly for wine notes." Potential expansion:

- **Education**: WSET practice mode with feedback
- **Community**: Shareable tasting sessions
- **Commerce**: Partner with wineries for tasting cards
- **Platform**: API for wine apps to generate notes

The long-term moat is the template library and WSET methodology — harder to replicate than any single feature.
