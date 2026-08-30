---
title: CSS Classes, rem Units, and Framework Styling
impact: MEDIUM
impactDescription: Keeps UI consistent, accessible to user font scaling, and maintainable across Vuetify apps
tags: css, scss, vuetify, tailwind, rem, styling, vue
---

## CSS Classes, rem Units, and Framework Styling

**Impact: MEDIUM (avoids brittle inline styles and inconsistent sizing across apps)**

Prefer **CSS classes** and **framework utilities** over hardcoded inline styles. Prefer **`rem`** over **`px`** for typography, spacing, radii, and component dimensions so UI scales with the document root and stays consistent across breakpoints.

### Class names and framework utilities first

Use the styling surface the app already ships with:

- **Vuetify** (ADRA default via `ui-layer`): `variant`, `color`, `density`, `rounded`, and utility classes (`text-caption`, `font-weight-bold`, `pa-*`, `mt-*`, etc.) on components such as `v-btn`, `v-text-field`, `v-card`.
- **Tailwind** (only where the app or layer enables it): utility classes instead of duplicating the same rules in inline `style`.
- **Component / BEM / shared SCSS**: scoped styles in the component that owns the element, or a shared partial imported by every consumer (not parent classes passed into a child that cannot receive scoped selectors).

**Incorrect (hardcoded inline design tokens):**

```vue
<v-btn
  :style="{
    fontSize: '17px',
    fontWeight: '600',
    textTransform: 'none',
    borderRadius: '12px',
    borderColor: '#eae9ee',
    boxShadow: '0 2px 5px -2px rgba(0, 0, 0, 0.1)',
  }">
  Send Introduction
</v-btn>
```

**Correct (framework + classes; tokens in SCSS):**

```vue
<v-btn
  variant="outlined"
  color="primary"
  class="profile-action-btn profile-action-btn--outline"
  block>
  Send Introduction
</v-btn>
```

```scss
// In the same component (or shared _profile-action-btn.scss)
.profile-action-btn {
  text-transform: none;
  font-size: 1.0625rem; // ~17px at 16px root
  font-weight: 600;
  min-height: 3rem;
  border-radius: 0.75rem;

  &--outline {
    border-color: #eae9ee !important;
    color: #1c7b60 !important;
    background: #fff !important;
    box-shadow: 0 0.125rem 0.3125rem -0.125rem rgba(0, 0, 0, 0.1);
  }
}
```

**Incorrect (parent scoped BEM on a child root — styles often do not apply):**

```vue
<!-- ProfileActiveRedesign.vue (scoped) -->
<SendIntroductionButton
  button-class="profile-redesign__btn profile-redesign__btn--outline" />
```

**Correct (style from the component that renders the `v-btn`, or parent `:deep()` on a wrapper):**

```vue
<div class="profile-redesign__intro-btn">
  <SendIntroductionButton />
</div>
```

```scss
.profile-redesign__intro-btn :deep(.v-btn) {
  /* same tokens as sibling outline buttons */
}
```

Or extract a shared `ProfileActionButton.vue` / SCSS partial used by both parent and dialog.

### Prefer `rem` over `px`

| Use `rem` for | `px` acceptable when |
|---------------|----------------------|
| `font-size`, `line-height`, padding, margin, gap | 1px hairline borders (`border-width: 1px`) |
| `border-radius`, `min-height` / `min-width` of controls | Values mandated by a third-party API (e.g. canvas, chart) |
| max-widths expressed as layout intent | Converting from design specs before commit (convert to `rem` at default root) |

Base conversion at 16px root: `17px` → `1.0625rem`, `12px` → `0.75rem`, `48px` → `3rem`, `8px` → `0.5rem`.

**Incorrect:**

```scss
.introduction-dialog-body__title {
  font-size: 22px;
  margin: 0 0 20px;
}
```

**Correct:**

```scss
.introduction-dialog-body__title {
  font-size: 1.375rem;
  margin: 0 0 1.25rem;
}
```

Use existing design tokens or CSS variables from the app/theme when available; do not introduce one-off `px` literals if the codebase already exposes spacing/type scale.

### When inline `:style` is acceptable

Reserve inline styles for **truly dynamic** values computed at runtime (e.g. drag offset, progress width, QR sheet `--qr-drag-y`). Do not use `:style` for static Figma tokens (typography, colors, shadows) that belong in classes or SCSS.

### Review checklist

- [ ] No duplicated `buttonStyle` / `primaryBtnStyle` objects across sibling components — extract shared classes or a small presentational component.
- [ ] Vuetify props and utilities used before custom CSS where they match design.
- [ ] New SCSS uses `rem` for spatial and type scale; `px` only for hairlines or documented exceptions.
- [ ] Child components do not rely on parent scoped class names without `:deep()` or shared styles owned by the child.

Reference: [MDN rem](https://developer.mozilla.org/en-US/docs/Web/CSS/length#rem), [Vuetify utility classes](https://vuetifyjs.com/en/styles/display/), ADRA UI via [`nuxt-ui-layer-usage.md`](nuxt-ui-layer-usage.md)
