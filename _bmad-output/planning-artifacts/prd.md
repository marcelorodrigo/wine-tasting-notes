---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish", "step-12-complete"]
inputDocuments: ["product-brief-wine-tasting-notes.md", "session-2026-03-29.md"]
workflowType: 'prd'
classification:
  projectType: "Web Application (Nuxt 4 SPA)"
  domain: "Wine Education / Food & Beverage"
  complexity: "Low-Medium"
  projectContext: "greenfield"
vision:
  vision: "Make wine tasting accessible to everyone through guided, structured exploration — no wine knowledge required."
  differentiators:
    - "Aroma wheel — interactive, type-filtered"
    - "Template-based — no AI hallucination"
    - "WSET methodology — professional foundation"
    - "Guided wizard — step-by-step, not overwhelming"
    - "Free, no signup — accessible to anyone"
---

# Product Requirements Document - wine-tasting-notes

**Author:** Senhor do Universo  
**Date:** 2026-03-29

---

## Executive Summary

**Vision:** Make wine tasting accessible to everyone through guided, structured exploration — no wine knowledge required.

**Target Users:** WSET students, wine enthusiasts, casual drinkers, wine educators

**Problem:** Wine lovers struggle to articulate what they're tasting. Even trained individuals forget aroma categories. Current solutions are either too clinical (WSET worksheets), too basic (Vivino ratings), or unreliable (AI generators).

### What Makes This Special

1. **Interactive Aroma Wheel** — The key differentiator. Filters by wine type, helps beginners discover and select aromas they wouldn't remember otherwise.
2. **Template-Based Generation** — Reliable, consistent output with no AI hallucination risk.
3. **WSET Methodology** — Professional foundation that educates while users taste.
4. **Guided Wizard** — Step-by-step flow (Appearance → Nose → Palate → Conclusions) that's not overwhelming.
5. **Zero Friction** — Free, no signup, no account required. Accessible to anyone.

---

## Success Criteria

### User Success

- **Ease of Use:** Users can generate a wine tasting note with minimal friction — guided step-by-step through Appearance → Nose → Palate → Conclusions
- **Aroma Discovery:** Users can easily discover and select aromas from the interactive wheel filtered by wine type, without needing prior wine knowledge
- **Output Quality:** Users can copy or share the generated note in their preferred style (Professional, Casual, Bar Talk, Playful)
- **Understanding:** Users can understand what each step means through contextual guidance (Beginner mode)
- **Flow:** Users can complete one wine tasting, then easily start another — unlimited wines per session
- **"Aha!" Moment:** When a beginner successfully identifies an aroma they never noticed before and sees it reflected in their note

### Business Success

- **Primary Metrics:** Visits, social shares, wines tasted
- **3-Month Target:** At least **1,000 sessions in first 3 months**
- **Engagement:** Users complete the full wizard flow and generate a note
- **Virality:** Generated notes are shareable (via copy/paste to social platforms)

### Technical Success

- **Mobile-First:** Application loads and performs well on mobile devices
- **Responsive:** Adapts seamlessly from mobile phones to desktop screens
- **Theme Support:** Dark mode and light mode both beautifully rendered
- **Performance:** Fast initial load; smooth interactions during wizard flow

### Measurable Outcomes

- Wizard completion rate > 70%
- 1,000 tasting sessions in first 3 months
- Average session: user completes full flow in < 3 minutes
- Zero critical bugs on mobile Chrome/Safari

---

## Product Scope

### MVP (Phase 1)

**Core Features:**

1. **Homepage** — Stunning landing page with Playfair Display typography, wine-themed aesthetic, and clear CTA to start tasting
2. **Smart Aroma Wheel** — Interactive wheel filtered by wine type (white, red, rosé, sparkling, dessert)
3. Dual Progress Indicator — Wine glass fills + mini timeline showing current step
4. Style Switcher Preview — Toggle between 4 output styles (Professional, Casual, Bar Talk, Playful)
5. Flexible Completion — Allow skipping any field, generate note with partial data
6. Three-Tier Tabs — Clear sections for Primary / Secondary / Tertiary aromas
7. Template-Based Generation — No AI, reliable structured output
8. Guided Wizard Flow — Appearance → Nose → Palate → Conclusions steps
9. Responsive Design — Mobile-first, works on all screen sizes
10. Theme Support — Dark mode + light mode

### Growth (Phase 2)

- Expert Mode Toggle — Removes tips for experienced users
- Contextual WSET Tips — Educational tooltips in Beginner mode
- Aroma Cascade — Nose aromas pre-populate Palate step
- Gentle Auto-Advance — 300-500ms delay after selection

### Vision (Phase 3)

- Shareable URL State — Encode selections in URL for sharing
- Offline capability
- User accounts for saving notes
- Export to PDF
- Aroma wheel customization

### Internationalization (Future Phases)

**Phase 4: Internationalization**

The app will support multiple languages to serve global wine enthusiasts and WSET students worldwide.

**Supported Languages (WSET-Approved):**

| Phase | Language | Notes |
|-------|----------|-------|
| v1 | English | Default, broadest reach |
| v2 | Portuguese | User's native language |
| v3 | Spanish, French, Italian, German, Dutch, Chinese, Japanese, Korean, Greek, Turkish | Other WSET languages |

**Not Supported (No WSET Materials):**
- Russian, Polish, Persian

**Key Features:**
- Auto-detect browser language on first visit
- Manual language switcher in header/footer
- Language preference persisted in localStorage
- All UI text + wine terminology translated
- Localized date/number formatting

**WSET Terminology Sourcing:**
- Source from official WSET SAT PDFs
- Priority: Target language (if available) → Translate from English
- Never chain translate (EN→PT→ES forbidden)
- Native speaker review required for accuracy

**WSET Resources:**
- Level 2 SAT: https://www.wsetglobal.com/media/13156/wset_l2wines_sat_en_may2023_issue2.pdf
- Level 3 SAT: https://www.wsetglobal.com/media/11766/wset_l3wines_sat_en_may2022_issue2.pdf

---

## User Journey

### Primary User: The Wine Enthusiast

**Meet Sofia** — She's a 34-year-old marketing manager who recently completed WSET Level 2. She loves exploring new wines but always struggles to remember what she tasted. Tonight she's at a dinner party with a bottle of Pinot Noir and wants to take notes to remember it later.

**Opening Scene:** Sofia opens the app on her phone. She's never used it before. The screen shows a clean welcome with wine type selection — "What are you tasting?" with visual cards for White, Red, Rosé, Sparkling, Dessert.

**Rising Action:** She taps "Red." The progress indicator shows a wine glass, empty. Step 1: Appearance. She sees a color gradient slider — "What's the color?" She drags from pale purple to deep ruby. Next, she taps through intensity (light, medium, deep). Simple taps, no typing.

Step 2: Nose. The app shows the interactive aroma wheel. It's filtered — she only sees aromas typical for Pinot Noir. She's curious, taps "Primary" tab, sees fruit aromas. She recognizes "Cherry" and "Raspberry" — taps both. The wheel feels like a helpful guide, not a test.

Step 3: Palate. Similar flow. She selects tannins (low/medium/high), acidity, body. More aromas from the wheel, this time including "Secondary" (oak, vanilla) and "Tertiary" (earth, mushroom). She's surprised to find "Mushroom" — yes, she thinks, that's exactly what she's tasting!

Step 4: Conclusions. Quick taps: medium finish, drink now (not for aging). She names the wine "Dinner Party Pinot."

**Climax:** She hits "Generate Note." The screen shows her tasting note in Professional style. She taps "Casual" — the language changes instantly. "Bar Talk" makes her laugh. She copies the note, pastes it into the group chat.

**Resolution:** Her friends are impressed. "You sound like a sommelier!" She smiles, taps "Start New Tasting," and the app resets for the next wine. She'll use this again.

---

## Innovation & Novel Patterns

### Beginner-First Output Generation

Unlike any existing wine app, this product generates tasting notes specifically calibrated for people with zero wine knowledge. The "Playful" style translates technical descriptors into accessible language — explaining what "tannins" actually feel like rather than just naming them.

### No-Knowledge Required UX

Every interaction is designed for complete beginners. The aroma wheel filters out overwhelming options. Visual selectors (not text input) make choices obvious. The guided wizard assumes nothing.

### Validation Approach

- User testing with 5-10 complete wine beginners
- Measure: Can someone with zero wine experience generate a note they feel confident sharing?
- A/B test: Does the beginner-calibrated output score higher in "shareability" than professional-style output?

---

## Technical Requirements

### Project Type

- **Framework:** Nuxt 4 SPA with multiple routes
- **Routes:** Home, Tasting Generator, About, Educational pages
- **Rendering:** Client-side SPA (SSR for SEO pages in v2)

### Browser Support

- Latest 2 versions of Chrome, Safari, Firefox, Edge

### Accessibility

- WCAG 2.1 Level A required, AA target
- Keyboard navigation for all interactions
- Screen reader compatibility with ARIA labels
- Color contrast minimum 4.5:1
- Aroma wheel keyboard navigable

---

## Functional Requirements

### Homepage & Navigation

- FR1: User can view a wine-themed landing page with clear value proposition
- FR2: User can navigate from homepage to tasting generator with single tap/click
- FR3: Homepage displays with Playfair Display typography
- FR4: Homepage is responsive and works on mobile devices

### Wine Selection

- FR5: User can select wine type from visual cards (White, Red, Rosé, Sparkling, Dessert)
- FR6: Selected wine type filters available aromas to relevant options only
- FR7: User can change wine type at any point before generating note

### Appearance Evaluation

- FR8: User can select wine color using gradient slider
- FR9: User can select appearance intensity (light, medium, deep)
- FR10: User can skip appearance step and proceed

### Nose/Aroma Assessment

- FR11: User can view interactive aroma wheel filtered by wine type
- FR12: User can switch between Primary, Secondary, and Tertiary aroma tabs
- FR13: User can select multiple aromas from each tier
- FR14: User can skip nose step and proceed

### Palate Assessment

- FR15: User can select tannins level (low, medium, high)
- FR16: User can select acidity level (low, medium, high)
- FR17: User can select body level (light, medium, full)
- FR18: User can select palate aromas (multi-select)
- FR19: User can skip palate step and proceed

### Conclusions

- FR20: User can select finish length (short, medium, long)
- FR21: User can indicate aging potential (drink now, hold 1-3 years, hold 5+ years)
- FR22: User can optionally name the wine
- FR23: User can skip conclusions step and proceed

### Note Generation & Output

- FR24: System generates tasting note from user selections using templates
- FR25: User can preview note in Professional style
- FR26: User can switch to Casual style and see updated preview instantly
- FR27: User can switch to Bar Talk style and see updated preview instantly
- FR28: User can switch to Playful style and see updated preview instantly
- FR29: User can copy generated note to clipboard with single tap

### Progress & Navigation

- FR30: User can see visual progress indicator showing current step
- FR31: User can navigate to previous step to modify selections
- FR32: User can start new tasting after completing current note
- FR33: System auto-advances to next step after selection (300-500ms delay)

### Responsive Design

- FR34: Application renders correctly on mobile devices (320px+)
- FR35: Application renders correctly on tablet devices
- FR36: Application renders correctly on desktop screens

### Theme Support

- FR37: User can view application in light mode
- FR38: User can view application in dark mode

### Accessibility

- FR39: All interactive elements are keyboard accessible
- FR40: Screen readers can navigate all content
- FR41: Color contrast meets WCAG 2.1 AA standards (4.5:1)
- FR42: Focus indicators visible on all interactive elements
- FR43: Aroma wheel is accessible via keyboard navigation

---

## Non-Functional Requirements

### Performance

- Initial page load under 1.5 seconds on 4G connection
- Time to interactive under 1 second
- Wizard step transitions complete within 500ms
- Aroma wheel interactions (tap, scroll) feel instant (< 100ms)

### Quality

- Zero critical bugs on supported browsers
- Mobile responsiveness tested on devices 360px - 768px width

---

## Project Scoping

### MVP Strategy

- **Approach:** Experience MVP — focus on delivering a seamless, guided wizard experience
- **Team:** Single developer with Nuxt 4 experience
- **Timeline:** 2-4 weeks for MVP

### Risk Mitigation

**Technical:** Build and test aroma wheel early on real mobile devices; document 3-5 example notes per style before implementation

**Market:** Focus on shareability of generated notes; validate beginner-calibrated output with user testing

**Resource:** Focus on MVP only; defer everything post-launch

---