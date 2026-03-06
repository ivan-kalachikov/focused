# Orbital UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **For Claude:** REQUIRED SUB-SKILL: Use frontend-design:frontend-design for every visual component task.
> **For Claude:** REQUIRED: After each Phase, run a Quality Gate using chrome-devtools MCP — take screenshots, analyze them critically against the design spec, and fix ALL discrepancies before proceeding.

**Goal:** Replace the current Focused UI with the Orbital design — aurora background, glassmorphic panels, central sphere play/pause, particle + starfield canvas visualizations.

**Architecture:** Vue 3 + Vuex (unchanged). Replace all existing visual components with new Orbital-themed ones. Add Canvas-based visualizations. Keep store, data, i18n, utilities untouched. New composables for audio analysis and parallax.

**Tech Stack:** Vue 3, Vuex 4, Vue-i18n, Canvas 2D, CSS custom properties, Google Fonts (Space Grotesk + Inter), CSS backdrop-filter.

**Design Spec Reference:** `docs/design/2026-03-06-orbital-concept-refined.md` — ALL visual decisions come from this file. When in doubt, re-read the spec. Do not improvise colors, sizes, fonts, or spacing.

---

## Critical Rules

1. **Every color must use a CSS variable** from spec section 1.1. No hardcoded hex values in components.
2. **Every font-size, weight, tracking, transform** must match spec section 1.2 typography table exactly.
3. **Every spacing value** must be a multiple of 4px per spec section 1.3.
4. **Use `frontend-design:frontend-design` skill** when implementing any visual component.
5. **Quality Gates are mandatory.** Do NOT skip screenshot verification steps.
6. **Chrome DevTools MCP** is used for all visual verification — screenshots, DOM inspection, computed style checks.

---

## Phase 1: Design System Foundation

### Task 1.1: Add Google Fonts to index.html

**Files:**
- Modify: `index.html`

**Step 1: Add font link tags**

Add before `</head>` in `index.html`:

```html
<meta name="color-scheme" content="dark">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat(orbital): add Space Grotesk + Inter fonts to index.html"
```

### Task 1.2: Replace global CSS variables and reset in App.vue

**Files:**
- Modify: `src/App.vue`

**Step 1: Replace the entire `<style>` block**

Replace the existing global styles with Orbital design system. This is a full rewrite of the `<style>` section.

Key CSS variables to define (from spec 1.1):
```css
:root {
  --bg: #080812;
  --bg-gradient-from: #0D0B1A;
  --bg-gradient-to: #0A1A1A;
  --surface: rgba(255, 255, 255, 0.04);
  --surface-active: rgba(255, 255, 255, 0.10);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-active: rgba(255, 255, 255, 0.18);
  --text-primary: #E8E8EC;
  --text-dim: rgba(232, 232, 236, 0.5);
  --text-muted: rgba(232, 232, 236, 0.25);
  --accent-warm: #FFCC66;
  --accent-warm-glow: rgba(255, 204, 102, 0.25);
  --accent-cool: #44FFBB;
  --accent-cool-glow: rgba(68, 255, 187, 0.25);
  --accent-neutral: #AA88FF;
  --accent-neutral-glow: rgba(170, 136, 255, 0.3);
  --error: #FF6655;
  --warning: #FFB844;
  --star-color: rgba(255, 255, 255, 0.6);

  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

Global reset:
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background: var(--bg);
}

#app {
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  height: 100%;
}

a {
  color: var(--text-primary);
  text-decoration: none;
}
a:hover {
  color: #fff;
}
```

Layout with aurora background (spec 1.4):
```css
.layout {
  min-height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--bg);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(13, 11, 26, 0.8) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 50%, rgba(10, 26, 26, 0.8) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 100%, rgba(68, 255, 187, 0.03) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 0%, rgba(170, 136, 255, 0.04) 0%, transparent 40%);
  background-size: 200% 200%;
  animation: aurora 20s ease-in-out infinite alternate;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "main"
    "footer";
}

@keyframes aurora {
  0%, 100% { background-position: 40% 50%; }
  50% { background-position: 60% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .layout { animation: none; }
}
```

Toast styles (spec 3.8):
```css
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  padding: 12px 20px;
  border-radius: 12px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13px;
  z-index: 1000;
  background: var(--surface-active);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border-active);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.toast--error {
  border-color: var(--error);
  color: var(--error);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
.fade-enter-to,
.fade-leave-from {
  transform: translateX(-50%) translateY(0);
}
```

Focus states (spec 4.3):
```css
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-neutral), 0 0 12px var(--accent-neutral-glow);
}
```

Backdrop-filter fallback (spec 11):
```css
@supports not (backdrop-filter: blur(1px)) {
  .panel, .header, .footer, .toast, .drawer {
    background: rgba(15, 15, 25, 0.85) !important;
  }
}
```

**Remove all old shared styles** (.card, .card-col, .card-header, .text-secondary, .slider, .icon-wrapper, .spinner, old .layout, old .toast). These will be replaced by new component styles.

**Step 2: Update template to use grid areas**

The App.vue template stays the same structure for now — it still renders `<Main />` and `<Footer />`. But `.layout` now uses CSS grid.

**Step 3: Remove Roboto font import**

Delete the `@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');` line.

**Step 4: Verify — run dev server, open in browser**

```bash
npm run dev
```

Open in browser. The page should show a dark background (#080812) with subtle aurora gradients. Existing components will look broken (expected — old shared styles removed).

**Step 5: Commit**

```bash
git add src/App.vue
git commit -m "feat(orbital): replace global CSS with Orbital design system variables and aurora background"
```

---

## Phase 2: Header Bar

### Task 2.1: Create HeaderBar.vue

**Files:**
- Create: `src/components/HeaderBar.vue`
- Modify: `src/App.vue` (import and render)

**Step 1: Create the component**

Spec reference: section 3.1

```vue
<template>
  <header class="header">
    <div class="header__left">
      <span class="header__name">ORBITAL</span>
      <span :class="['header__dot', appStatus === 'playing' && 'header__dot--playing']" aria-hidden="true"></span>
    </div>
    <div class="header__right">
      <span class="header__status">{{ statusText }}</span>
    </div>
  </header>
</template>
```

Script: mapState for `appStatus`, `airports.currentCode`, `music.currentId`. Compute `statusText` as `NOW PLAYING: ${currentCode} / ${currentStationName}` when playing, empty when paused.

Style — per spec:
- Height: 48px
- Background: `var(--surface)`
- `backdrop-filter: blur(10px)`
- Border-bottom: `1px solid var(--glass-border)`
- App name: Space Grotesk 18px 700 0.12em uppercase, `var(--accent-neutral)`
- Dot: 6px circle, `var(--accent-neutral)`, breathing animation when playing
- Status text: Inter 11px, `var(--text-dim)`
- `z-index: 10`

**Step 2: Wire into App.vue**

Replace the `<Main />` import tree. Add `<HeaderBar />` inside `.layout` before `<Main />`.

Update App.vue template:
```vue
<template>
  <div class="layout">
    <HeaderBar />
    <Main />
    <Footer />
    <transition name="fade">
      <div v-if="toast" :class="['toast', `toast--${toast.type}`]">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>
```

**Step 3: Commit**

```bash
git add src/components/HeaderBar.vue src/App.vue
git commit -m "feat(orbital): add HeaderBar with app name, breathing dot, and status text"
```

---

## Phase 3: Central Sphere

### Task 3.1: Create Sphere.vue

**Files:**
- Create: `src/components/Sphere.vue`

**Step 1: Create the component**

Spec reference: section 3.2

This is the centerpiece. Must match spec exactly:
- 160px diameter (desktop), responsive sizes via CSS
- Radial gradient for 3D curvature illusion (spec gives exact gradient stops)
- Breathing animation when paused (scale 1 → 1.04, 4s, ease-in-out)
- Expanded glow + concentric rings when playing
- Buffering: fast pulse + amber glow + orbiting ring
- Error: red glow, dim, no pulse
- Three `<span>` ring elements for radar-ping effect (staggered 1s, 3s cycle)
- `role="button"`, `aria-label`, `tabindex="0"`

Key CSS from spec:
```css
.sphere {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 35%,
    rgba(200, 180, 255, 0.25) 0%,
    rgba(170, 136, 255, 0.15) 30%,
    rgba(170, 136, 255, 0.05) 60%,
    transparent 80%
  );
  box-shadow: 0 0 40px var(--accent-neutral-glow),
              inset 0 0 30px rgba(170, 136, 255, 0.1);
  border: 1px solid rgba(170, 136, 255, 0.15);
  cursor: pointer;
  position: relative;
}
```

Animations from spec section 5.1, 5.2, 5.3:
- `@keyframes breathe` — scale(1) → scale(1.04), 4s
- `@keyframes ring-expand` — scale(1) → scale(2.5), opacity 0.4 → 0, 3s
- `@keyframes orbit-ring` — rotate 360deg, 1.2s (buffering)

**Step 2: Commit**

```bash
git add src/components/Sphere.vue
git commit -m "feat(orbital): add Sphere play/pause component with breathing, rings, and state animations"
```

---

## Phase 4: DataList Shared Component

### Task 4.1: Create DataList.vue

**Files:**
- Create: `src/components/DataList.vue`

**Step 1: Create the component**

Spec reference: sections 3.5, 3.6

Reusable searchable scrollable list with volume slider. Used by both Airport and Music panels.

**Props:**
- `items: Array` (required)
- `valueKey: String` (required) — unique key field
- `labelKey: String` (required) — primary display field
- `secondaryKeys: Array` (default: `[]`) — array of `{ key, label }` for extra columns
- `filterKeys: Array` (required) — fields to search against
- `modelValue` (required) — currently selected value (v-model)
- `volume: Number` (required) — current volume 0-1 (v-model)
- `label: String` (required) — section header ("ATC FEED" / "MUSIC FEED")
- `accentColor: String` (default: `'--accent-cool'`) — CSS var name for accent

**Emits:** `update:modelValue`, `update:volume`

**Template structure:**
```
div.data-list
  span.data-list__label          — "ATC FEED"
  div.data-list__search-wrapper
    input.data-list__search      — placeholder "Search..."
  div.data-list__items           — scrollable
    div.data-list__row (v-for)   — click to select
      span.data-list__indicator  — "*" on selected
      span.data-list__primary    — main label
      span.data-list__secondary  — extra columns (IATA, country code)
  div.data-list__volume
    span.data-list__vol-label    — "VOL"
    input[type=range]            — styled slider
    span.data-list__vol-value    — "85%"
```

**Styles — per spec:**
- Search input: Inter 13px, `rgba(255,255,255,0.04)` bg, `1px solid var(--glass-border)`, border-radius 8px, height 36px (44px on touch)
- On focus: border-color transitions to accent color
- List: max-height 300px, overflow-y auto
- Custom scrollbar: 4px width, thumb `rgba(255,255,255,0.15)`
- Row height: 44px, padding 12px 16px
- Selected row: accent color text, left border `2px solid`, inset box-shadow glow
- Unselected: `var(--text-dim)`
- Hover: text brightens to `var(--text-primary)`, bg `rgba(255,255,255,0.03)`
- Volume track: 4px height, bg `rgba(255,255,255,0.08)`, border-radius 2px
- Volume fill: accent color
- Volume thumb: 12px circle, accent color, glow shadow
- Transition: color 0.2s ease, background 0.2s ease (spec 5.5)

**ARIA roles:** `role="listbox"` on list, `role="option"` + `aria-selected` on rows. Search: `aria-label` prop.

**Step 2: Commit**

```bash
git add src/components/DataList.vue
git commit -m "feat(orbital): add DataList reusable component with search, scroll, and volume slider"
```

---

## Phase 5: GlassPanel Container

### Task 5.1: Create GlassPanel.vue

**Files:**
- Create: `src/components/GlassPanel.vue`

**Step 1: Create the component**

Spec reference: section 3.5 (panel CSS), section 4.4 (tilt), section 5.4 (ghost text), section 5.7 (glass transition)

**Props:**
- `tilt: String` — `'left'`, `'right'`, or `'none'` (default: `'none'`)
- `ghostText: String` — large text behind panel content (default: `''`)
- `accentColor: String` — CSS var name (default: `'--accent-neutral'`)

**Slots:** `default`

**Template:**
```
div.panel(:class="[tiltClass]" @mousemove="onMouseMove" @mouseleave="onMouseLeave")
  span.panel__ghost(aria-hidden="true") {{ ghostText }}
  slot
```

**Styles — per spec:**
- `background: var(--surface)`
- `backdrop-filter: blur(8px)`
- `border: 1px solid var(--glass-border)`
- `border-radius: 16px`
- `padding: 24px`
- `width: 320px`
- `max-height: 60vh`
- `position: relative`, `overflow: hidden`
- Transition: `background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease`
- On hover/focus-within: `background: var(--surface-active)`, `backdrop-filter: blur(20px)`, `border-color: var(--glass-border-active)`

Base tilt (spec 2.1):
```css
.panel--left { transform: perspective(800px) rotateY(2deg); }
.panel--right { transform: perspective(800px) rotateY(-2deg); }
```

Ghost text (spec 3.5):
```css
.panel__ghost {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: 120px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  transition: opacity 0.4s ease;
}
```

Micro-parallax on mousemove (spec 4.4):
```js
onMouseMove(e) {
  if (window.innerWidth < 768) return; // disabled on mobile
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  const baseY = this.tilt === 'left' ? 2 : this.tilt === 'right' ? -2 : 0;
  e.currentTarget.style.transform =
    `perspective(800px) rotateY(${baseY + x * 3}deg) rotateX(${-y * 2}deg)`;
}
onMouseLeave(e) {
  const baseY = this.tilt === 'left' ? 2 : this.tilt === 'right' ? -2 : 0;
  e.currentTarget.style.transform = `perspective(800px) rotateY(${baseY}deg) rotateX(0deg)`;
}
```

**Step 2: Commit**

```bash
git add src/components/GlassPanel.vue
git commit -m "feat(orbital): add GlassPanel with adaptive glassmorphism, 3D tilt, ghost text"
```

---

## Phase 6: Assemble Desktop Layout

### Task 6.1: Rewrite Main.vue as layout orchestrator

**Files:**
- Modify: `src/components/Main.vue`

**Step 1: Rewrite template and script**

Replace the entire Main.vue. Keep the `<audio>` elements and the Vuex wiring (watchers for appStatus, URLs, errors). Remove `<av-line>`, Logo SVG, christmas hat, old play button, old card layout.

New template structure (spec 2.1):
```
<audio ref="musicPlayer" ... />
<audio ref="airportPlayer" ... />
<main class="main-area">
  <GlassPanel tilt="left" :ghostText="currentAirportCode" accentColor="--accent-cool">
    <DataList
      :items="airports"
      valueKey="codeIATA"
      labelKey="city"
      :secondaryKeys="[{ key: 'codeIATA' }, { key: 'countryCode' }]"
      :filterKeys="['city', 'codeIATA', 'codeICAO', 'country']"
      :modelValue="currentAirportCode"
      @update:modelValue="setCurrentAirportCode"
      :volume="airportVolume"
      @update:volume="setAirportVolume"
      label="ATC FEED"
      accentColor="--accent-cool"
    />
  </GlassPanel>

  <Sphere />

  <GlassPanel tilt="right" :ghostText="currentMusicName" accentColor="--accent-warm">
    <DataList
      :items="music"
      valueKey="id"
      labelKey="name"
      :filterKeys="['name', 'description']"
      :modelValue="currentMusicId"
      @update:modelValue="setCurrentMusicId"
      :volume="musicVolume"
      @update:volume="setMusicVolume"
      label="MUSIC FEED"
      accentColor="--accent-warm"
    />
  </GlassPanel>
</main>
```

Style for `.main-area` (spec 2.1):
```css
.main-area {
  grid-area: main;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 24px;
  position: relative;
}
```

Audio element wiring stays identical to current Main.vue (watchers, play/pause methods, error handlers).

Computed: add `currentMusicName` derived from `music.currentId` to feed into ghost text.

**Step 2: Remove old component imports**

Remove: `import Logo from '../assets/logo.svg'`, christmas hat references, `<av-line>` usage.

Add: `import Sphere`, `import GlassPanel`, `import DataList`.

Remove `Airports.vue` and `Music.vue` imports — their functionality is now inline via DataList.

**Step 3: Commit**

```bash
git add src/components/Main.vue
git commit -m "feat(orbital): rewrite Main.vue with sphere + glass panels desktop layout"
```

### Task 6.2: Restyle Footer.vue

**Files:**
- Modify: `src/components/Footer.vue`

**Step 1: Rewrite to minimal footer**

Spec reference: section 3.7

Single-line glassmorphic footer:
```
Inspired by listentothe.cloud | Frontend by Kalachikov | Design by Emelyanova | v0.2.0
```

Template: single `<footer>` with inline items separated by ` | `.

Style:
- Height: 36px, padding 0 24px
- Background: `var(--surface)`, `backdrop-filter: blur(6px)`
- Border-top: `1px solid var(--glass-border)`
- Text: Inter 11px weight 300, `var(--text-dim)`
- Links: `var(--text-primary)` on hover
- `grid-area: footer`

**Step 2: Commit**

```bash
git add src/components/Footer.vue
git commit -m "feat(orbital): restyle Footer to minimal single-line glassmorphic bar"
```

---

## QUALITY GATE 1: Layout & Visual Foundation

**This is mandatory. Do not skip.**

> Use `frontend-design:frontend-design` skill for visual assessment context.

### QG1 Step 1: Start dev server

```bash
npm run dev
```

### QG1 Step 2: Take desktop screenshot (1280x800)

Use chrome-devtools MCP:
1. Navigate to `http://localhost:5173`
2. Resize to 1280x800
3. Take full-page screenshot

### QG1 Step 3: Critical analysis against spec

Check ALL of the following against the design spec (`docs/design/2026-03-06-orbital-concept-refined.md`):

**Background:**
- [ ] Background color is #080812 (not #191921 or any other old color)
- [ ] Aurora gradient visible — subtle purple and teal radial gradients
- [ ] Aurora animation running (gradient position shifting slowly)

**Header Bar (spec 3.1):**
- [ ] Height is exactly 48px
- [ ] Background is glassmorphic (semi-transparent with blur)
- [ ] "ORBITAL" text: Space Grotesk, 18px, weight 700, uppercase, letter-spacing 0.12em, color #AA88FF
- [ ] Breathing dot: 6px circle, #AA88FF, present next to app name
- [ ] Status text on right: Inter 11px, dim color
- [ ] Bottom border: 1px solid var(--glass-border)

**Central Sphere (spec 3.2):**
- [ ] Centered in the main area
- [ ] 160px diameter
- [ ] Radial gradient creating 3D illusion (highlight at 40% 35%)
- [ ] Outer glow visible (box-shadow with accent-neutral-glow)
- [ ] Border: 1px solid rgba(170, 136, 255, 0.15)
- [ ] Breathing animation when paused (scale 1 → 1.04, 4s cycle)
- [ ] On click: switches to playing state, concentric rings appear
- [ ] Rings: 3 rings expanding outward, staggered 1s, 3s cycle

**Glass Panels (spec 3.5):**
- [ ] Two panels flanking the sphere
- [ ] Width: 320px each
- [ ] Background: rgba(255,255,255,0.04) at rest
- [ ] Backdrop-filter: blur(8px) at rest
- [ ] Border: 1px solid rgba(255,255,255,0.08)
- [ ] Border-radius: 16px
- [ ] Padding: 24px
- [ ] Left panel: perspective tilt rotateY(2deg)
- [ ] Right panel: perspective tilt rotateY(-2deg)
- [ ] On hover: background brightens, blur increases to 20px, border brightens
- [ ] Ghost text visible behind content (IATA code on left, station name on right)
- [ ] Ghost text: Space Grotesk 120px/80px, rgba(232,232,236,0.25)

**DataList — Airport (spec 3.5):**
- [ ] Section label "ATC FEED": Inter 11px uppercase tracking 0.08em, dim color
- [ ] Search input: full width, Inter 13px, 36px height, rounded 8px, subtle border
- [ ] Search focus: border transitions to --accent-cool (#44FFBB)
- [ ] List rows: 44px height, showing IATA + city + country code
- [ ] Selected row: --accent-cool color, left border 2px, inset glow
- [ ] Unselected rows: --text-dim color
- [ ] Hover: text brightens, subtle bg change
- [ ] Volume slider: accent-cool colored fill and thumb, 4px track, 12px thumb with glow
- [ ] Volume label "VOL" and percentage readout

**DataList — Music (spec 3.6):**
- [ ] Same structure as Airport but with --accent-warm (#FFCC66)
- [ ] Section label "MUSIC FEED"
- [ ] Station names only, no images
- [ ] Volume slider: accent-warm colored

**Footer (spec 3.7):**
- [ ] Single line, 36px height
- [ ] Glassmorphic background
- [ ] Inter 11px weight 300, dim text
- [ ] Items separated by " | "

**Toast (spec 3.8):**
- [ ] Trigger an error to verify: glassmorphic, rounded 12px, Inter 13px

### QG1 Step 4: DOM property verification

Use chrome-devtools MCP `evaluate_script` to check computed styles:

```js
// Verify header height
getComputedStyle(document.querySelector('.header')).height
// Expected: "48px"

// Verify sphere dimensions
const sphere = document.querySelector('.sphere');
getComputedStyle(sphere).width
// Expected: "160px"

// Verify font family on app name
getComputedStyle(document.querySelector('.header__name')).fontFamily
// Expected: contains "Space Grotesk"

// Verify panel border-radius
getComputedStyle(document.querySelector('.panel')).borderRadius
// Expected: "16px"

// Verify body font
getComputedStyle(document.querySelector('.data-list__search')).fontFamily
// Expected: contains "Inter"

// Verify CSS variables are applied
getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
// Expected: "#080812"

getComputedStyle(document.documentElement).getPropertyValue('--accent-neutral').trim()
// Expected: "#AA88FF"
```

### QG1 Step 5: Fix all discrepancies

If ANY check fails, fix it before proceeding. Re-screenshot and re-verify after fixes.

### QG1 Step 6: Commit fixes if any

```bash
git add -A
git commit -m "fix(orbital): quality gate 1 — visual corrections for layout foundation"
```

---

## Phase 7: Starfield Background

### Task 7.1: Create Starfield.vue

**Files:**
- Create: `src/components/Starfield.vue`

**Step 1: Create the component**

Spec reference: section 3.4

Canvas-based starfield background. Renders behind everything.

**Props:**
- `musicAmplitude: Number` (default: 0) — modulates star brightness
- `airportAmplitude: Number` (default: 0) — modulates twinkle rate

**Template:**
```vue
<canvas ref="canvas" class="starfield" aria-hidden="true"></canvas>
```

**Style:**
```css
.starfield {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
```

**Logic (from spec 3.4):**

Star generation on mount:
- Desktop: 200 stars, Mobile (< 768px): 100 stars
- Each star: random x, y, size (0.5-2px), baseBrightness (0.2-0.8), depth (1-3)

Parallax:
- Desktop: track mouse position via `mousemove` on window
- `offsetX = (mouseX - centerX) * star.depth * 0.02`
- `offsetY = (mouseY - centerY) * star.depth * 0.015`
- Mobile: auto-drift `offset = Math.sin(time * 0.0001) * 20`

Audio modulation:
- `brightness = star.baseBrightness + musicAmplitude * 0.2`
- Airport amplitude modulates a twinkle factor

Rendering:
- `requestAnimationFrame` loop
- Skip if `document.hidden`
- Draw each star as a small filled arc
- Wrap stars that drift off-screen

`ResizeObserver` for canvas sizing with `devicePixelRatio`.

Reduced motion: render single static frame, no rAF loop.

**Step 2: Add to Main.vue**

Place `<Starfield>` inside `.main-area` as the first child.

**Step 3: Commit**

```bash
git add src/components/Starfield.vue src/components/Main.vue
git commit -m "feat(orbital): add Starfield canvas with parallax and audio reactivity"
```

---

## Phase 8: Audio Analysis

### Task 8.1: Create useAudioAnalyser composable

**Files:**
- Create: `src/composables/useAudioAnalyser.js`

**Step 1: Create the composable**

Spec reference: section 8.3, 12 (data flow)

```js
// Returns: { analyser, frequencyData, connect, disconnect }
// - Lazy AudioContext creation (respects autoplay policy)
// - Shared AudioContext singleton across instances
// - MediaElementSource per audio element (cached to avoid re-creation)
// - AnalyserNode with fftSize: 256 (enough for particle modulation)
// - frequencyData: reactive Uint8Array updated externally by consumer
```

Key implementation details:
- Single shared `AudioContext` (browsers limit to ~6)
- Cache `MediaElementSource` per audio element (calling `createMediaElementSource` twice on same element throws)
- `connect(audioElement)` → creates source if needed → connects to analyser → connects to destination
- `disconnect()` → disconnects analyser, does NOT close AudioContext
- Expose raw `AnalyserNode` for consumers to call `getByteFrequencyData()`

**Step 2: Commit**

```bash
git add src/composables/useAudioAnalyser.js
git commit -m "feat(orbital): add useAudioAnalyser composable for Web Audio API"
```

---

## Phase 9: Particle Canvas

### Task 9.1: Create ParticleCanvas.vue

**Files:**
- Create: `src/components/ParticleCanvas.vue`

**Step 1: Create the component**

Spec reference: section 3.3

Dual-system particle visualization orbiting the central sphere.

**Props:**
- `musicAnalyser: Object` — AnalyserNode for music
- `airportAnalyser: Object` — AnalyserNode for airport
- `sphereRect: Object` — `{ x, y, width, height }` of the sphere for orbit center
- `isPlaying: Boolean`

**Template:**
```vue
<canvas ref="canvas" class="particles" role="img" aria-label="Audio visualization"></canvas>
```

**Style:**
```css
.particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
```

**Particle systems (spec 3.3):**

Music particles (inner orbit):
- Color: #FFCC66, opacity 0.4-1.0
- Count: 40-60 (desktop), 20-30 (mobile)
- Orbit radius: sphere radius + 20px to + 80px
- Size: 2-5px with shadowBlur 4
- Movement: smooth elliptical, 0.2-0.8 rad/s
- Audio: amplitude modulates orbit radius ±15px, frequency bands modulate brightness

Airport particles (outer orbit):
- Color: #44FFBB, opacity 0.3-1.0
- Count: 30-50 (desktop), 15-25 (mobile)
- Orbit radius: sphere radius + 90px to + 160px
- Size: 1.5-4px
- Movement: jittery, burst acceleration on voice activity
- Audio: amplitude modulates speed, frequency bands modulate visible count

Trail effect: `ctx.fillStyle = 'rgba(8, 8, 18, 0.08)'; ctx.fillRect(0, 0, w, h);` instead of clearRect.

When paused: 10% speed, 20 particles total per system, no audio modulation.

Performance: object pooling, `requestAnimationFrame`, skip on `document.hidden`, reduce count on mobile via `matchMedia`.

Reduced motion: static render, 10 particles each, no animation loop.

**Step 2: Wire into Main.vue**

Connect useAudioAnalyser to both audio elements. Pass analysers to ParticleCanvas. Place canvas in `.main-area`.

**Step 3: Commit**

```bash
git add src/components/ParticleCanvas.vue src/components/Main.vue
git commit -m "feat(orbital): add ParticleCanvas with dual orbit system and audio reactivity"
```

---

## QUALITY GATE 2: Full Desktop Experience

**This is mandatory. Do not skip.**

> Use `frontend-design:frontend-design` skill for visual assessment context.

### QG2 Step 1: Take desktop screenshot (1280x800)

Use chrome-devtools MCP. Navigate, resize to 1280x800, screenshot.

### QG2 Step 2: Critical analysis — Starfield

- [ ] Stars visible on dark background (faint white dots of varying sizes)
- [ ] Mouse movement causes stars to shift (parallax effect)
- [ ] Stars at different depths move at different rates
- [ ] No stars visible over panels or header (z-index layering correct)

### QG2 Step 3: Critical analysis — Particles

- [ ] When playing: two distinct orbit systems visible around the sphere
- [ ] Inner orbit (music): warm gold/amber particles (#FFCC66), smooth movement
- [ ] Outer orbit (airport): cool cyan/green particles (#44FFBB), jittery movement
- [ ] Particles have soft glow (shadowBlur)
- [ ] Trail effect visible (particles leave brief comet trails)
- [ ] When paused: particles slow to lazy drift, reduced count
- [ ] Particles orbit around the sphere center (not offset)
- [ ] On music change: particle behavior shifts
- [ ] Particle canvas doesn't block mouse events on panels (pointer-events: none)

### QG2 Step 4: Critical analysis — Interactions

- [ ] Click sphere: toggles play/pause, sphere state changes (breathing ↔ rings)
- [ ] Select airport in list: ghost text behind panel updates, audio source changes
- [ ] Select music station: ghost text updates, audio source changes
- [ ] Volume sliders: drag to adjust, fill color matches accent
- [ ] Search input: type to filter list, results update in real time
- [ ] Panel hover: glassmorphism intensifies (blur + bg + border transition)
- [ ] Panel mousemove: subtle 3D micro-parallax tilt

### QG2 Step 5: DOM verification

```js
// Starfield canvas is behind panels
getComputedStyle(document.querySelector('.starfield')).zIndex
// Expected: "0"

// Particles canvas is z-index 1
getComputedStyle(document.querySelector('.particles')).zIndex
// Expected: "1"

// Panels are above canvases
getComputedStyle(document.querySelector('.panel')).position
// Expected: "relative" (stacking context above z-index 0/1)

// Sphere is interactive
document.querySelector('.sphere').getAttribute('role')
// Expected: "button"

// DataList has listbox role
document.querySelector('.data-list__items').getAttribute('role')
// Expected: "listbox"
```

### QG2 Step 6: Performance check

Use chrome-devtools MCP `evaluate_script`:
```js
// Check FPS — run for 2 seconds
let frames = 0;
const start = performance.now();
function count() {
  frames++;
  if (performance.now() - start < 2000) requestAnimationFrame(count);
  else console.log(`FPS: ${frames / 2}`);
}
requestAnimationFrame(count);
```

Expected: >= 55 FPS on desktop.

### QG2 Step 7: Fix all discrepancies, re-verify, commit

```bash
git add -A
git commit -m "fix(orbital): quality gate 2 — visual corrections for desktop experience"
```

---

## Phase 10: Mobile Layout

### Task 10.1: Create MobileDrawer.vue

**Files:**
- Create: `src/components/MobileDrawer.vue`

**Step 1: Create the component**

Spec reference: section 2.3, 4.5

Bottom drawer with two tabs (ATC / MUSIC) for mobile.

**Props:**
- Receives all the same data/volume/selection props as the panels
- `airportItems`, `musicItems`, `currentAirportCode`, `currentMusicId`, etc.
- `airportVolume`, `musicVolume`

**Emits:** Same update events as DataList

**Template:**
```
div.drawer(:class="{ 'drawer--collapsed': collapsed }")
  div.drawer__handle(@touchstart, @touchmove, @touchend for swipe)
    div.drawer__handle-bar
  div.drawer__tabs(role="tablist")
    button.drawer__tab(role="tab" :aria-selected="activeTab === 'atc'") ATC
    button.drawer__tab(role="tab" :aria-selected="activeTab === 'music'") MUSIC
  div.drawer__content(role="tabpanel")
    DataList(v-if="activeTab === 'atc'" ... accentColor="--accent-cool")
    DataList(v-if="activeTab === 'music'" ... accentColor="--accent-warm")
```

**Styles:**
- `position: fixed; bottom: 0; left: 0; right: 0;`
- `max-height: 50vh`
- `border-radius: 16px 16px 0 0`
- `background: var(--surface-active)`
- `backdrop-filter: blur(20px)`
- `transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Collapsed: `transform: translateY(calc(100% - 48px))` — just tab bar visible
- Handle bar: 40px x 4px, centered, `var(--text-muted)`, border-radius 2px
- Tab: 48px height, 50% width, Inter 12px uppercase, `var(--text-dim)`, active = `var(--text-primary)` + bottom border accent
- `z-index: 20`

Swipe logic: track touch start/move/end Y coordinates. If delta > 50px down → collapse. If delta > 50px up → expand.

### Task 10.2: Add responsive layout to Main.vue

**Files:**
- Modify: `src/components/Main.vue`

**Step 1: Add mobile conditional rendering**

Use a reactive `isMobile` computed (via `matchMedia('(max-width: 767px)')` with listener).

Desktop (>= 768px): render GlassPanel + Sphere + GlassPanel as current.
Mobile (< 768px): render Sphere only in `.main-area`, plus `<MobileDrawer>` component.

**Step 2: Add responsive CSS**

```css
@media (max-width: 767px) {
  .main-area {
    flex-direction: column;
    padding-bottom: 60px; /* space for collapsed drawer */
  }
  .sphere {
    width: 120px;
    height: 120px;
  }
}
@media (max-width: 479px) {
  .sphere {
    width: 100px;
    height: 100px;
  }
}
```

**Step 3: Commit**

```bash
git add src/components/MobileDrawer.vue src/components/Main.vue
git commit -m "feat(orbital): add MobileDrawer and responsive layout for mobile/tablet"
```

---

## QUALITY GATE 3: Mobile Experience

**This is mandatory. Do not skip.**

### QG3 Step 1: Take mobile screenshots

Use chrome-devtools MCP:
1. Resize to 375x812 (iPhone), screenshot
2. Resize to 768x1024 (iPad), screenshot
3. Resize to 480x800 (small tablet), screenshot

### QG3 Step 2: Critical analysis — Mobile (375px)

- [ ] Sphere centered in viewport, 100px diameter
- [ ] No glass panels visible in main area (they're in the drawer)
- [ ] Starfield visible behind sphere
- [ ] Particles visible around sphere
- [ ] Bottom drawer: tab bar visible at bottom (48px, "ATC" and "MUSIC" tabs)
- [ ] Drawer collapsed by default — only tab bar shows
- [ ] Tap to expand drawer — slides up to 50vh
- [ ] Active tab: text is bright, inactive is dim
- [ ] DataList inside drawer: search input, scrollable list, volume slider
- [ ] No ghost text on mobile (disabled per spec 10, decision #10)
- [ ] No 3D panel tilt on mobile (disabled per spec 10, decision #11)
- [ ] Header: "ORBITAL" left, status text truncated/shortened on right
- [ ] Footer: visible below drawer when drawer is collapsed, or scrolls away

### QG3 Step 3: Critical analysis — Tablet (768px)

- [ ] Two-column layout with panels flanking sphere (per spec 2.2)
- [ ] Panels narrower (max-width 280px)
- [ ] Tilt reduced to 1deg
- [ ] Sphere: 140px diameter
- [ ] Everything functional: search, selection, volume

### QG3 Step 4: Touch interaction check

Use chrome-devtools MCP to simulate touch:
- [ ] Swipe up on drawer: expands
- [ ] Swipe down on drawer: collapses
- [ ] Tap sphere: toggles play/pause
- [ ] Tap list row: selects item
- [ ] Volume slider: draggable on touch

### QG3 Step 5: Fix all discrepancies, re-verify, commit

```bash
git add -A
git commit -m "fix(orbital): quality gate 3 — mobile/tablet visual corrections"
```

---

## Phase 11: Keyboard Shortcuts

### Task 11.1: Add global keyboard shortcuts

**Files:**
- Modify: `src/components/Main.vue`

**Step 1: Add keydown listener**

Spec reference: section 4.1

In `mounted()`, add `window.addEventListener('keydown', this.handleKeydown)`.
In `beforeUnmount()`, remove it.

```js
handleKeydown(e) {
  // Don't capture when typing in search inputs
  if (e.target.tagName === 'INPUT') {
    if (e.key === 'Escape') {
      e.target.blur();
      e.target.value = '';
    }
    return;
  }

  switch(e.key) {
    case ' ':
      e.preventDefault();
      this.toggleAppStatus();
      break;
    case '[':
      this.setMusicVolume(Math.max(0, this.musicVolume - 0.1));
      break;
    case ']':
      this.setMusicVolume(Math.min(1, this.musicVolume + 0.1));
      break;
    case '{':
      this.setAirportVolume(Math.max(0, this.airportVolume - 0.1));
      break;
    case '}':
      this.setAirportVolume(Math.min(1, this.airportVolume + 0.1));
      break;
  }
}
```

**Step 2: Commit**

```bash
git add src/components/Main.vue
git commit -m "feat(orbital): add global keyboard shortcuts for playback and volume"
```

---

## Phase 12: Cleanup

### Task 12.1: Remove old components and dependencies

**Files:**
- Delete: `src/components/CustomSelect.vue`
- Delete: `src/components/Airports.vue`
- Delete: `src/components/Music.vue`
- Modify: `package.json` — remove `vue-audio-visual`
- Delete: `src/assets/christmas-hat.png` (christmas easter egg dropped)

**Step 1: Delete files**

```bash
rm src/components/CustomSelect.vue
rm src/components/Airports.vue
rm src/components/Music.vue
rm src/assets/christmas-hat.png
```

**Step 2: Remove vue-audio-visual**

```bash
npm uninstall vue-audio-visual
```

**Step 3: Remove AudioVisual plugin from main.js**

In `src/main.js`, remove:
```js
import AudioVisual from 'vue-audio-visual';
// ...
app.use(AudioVisual);
```

**Step 4: Verify build**

```bash
npm run build
```

Should succeed with no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore(orbital): remove old components, vue-audio-visual, and christmas easter egg"
```

---

## Phase 13: Accessibility Pass

### Task 13.1: Verify and fix ARIA roles

**Files:**
- Modify: various components as needed

**Step 1: Audit against spec section 7.2**

Use chrome-devtools MCP `evaluate_script` to verify every ARIA attribute listed in spec section 7.2:

```js
// Sphere
document.querySelector('.sphere').getAttribute('role') // "button"
document.querySelector('.sphere').getAttribute('aria-label') // contains "playback"
document.querySelector('.sphere').getAttribute('tabindex') // "0"

// Airport list
document.querySelector('.panel--airport .data-list__items').getAttribute('role') // "listbox"
document.querySelector('.panel--airport .data-list__items').getAttribute('aria-label') // "Airport selection"

// Music list
document.querySelector('.panel--music .data-list__items').getAttribute('role') // "listbox"

// List rows
document.querySelectorAll('.data-list__row')[0].getAttribute('role') // "option"
document.querySelectorAll('.data-list__row')[0].hasAttribute('aria-selected') // true

// Volume
document.querySelector('.panel--airport input[type=range]').getAttribute('aria-label') // "Airport volume"
document.querySelector('.panel--music input[type=range]').getAttribute('aria-label') // "Music volume"

// Canvases
document.querySelector('.particles').getAttribute('role') // "img"
document.querySelector('.starfield').getAttribute('aria-hidden') // "true"

// Ghost text
document.querySelector('.panel__ghost').getAttribute('aria-hidden') // "true"
```

**Step 2: Add prefers-reduced-motion handling**

Verify CSS media query is in place (from App.vue global styles). Verify canvas components check `matchMedia('(prefers-reduced-motion: reduce)')`.

**Step 3: Commit**

```bash
git add -A
git commit -m "fix(orbital): accessibility pass — ARIA roles, reduced motion, focus management"
```

---

## QUALITY GATE 4: Final Verification

**This is the final gate. Be extremely thorough.**

> Use `frontend-design:frontend-design` skill for final visual assessment.

### QG4 Step 1: Full screenshot suite

Use chrome-devtools MCP:
1. Desktop 1280x800 — paused state
2. Desktop 1280x800 — playing state (click sphere first)
3. Tablet 768x1024
4. Mobile 375x812 — drawer collapsed
5. Mobile 375x812 — drawer expanded (ATC tab)
6. Mobile 375x812 — drawer expanded (Music tab)

### QG4 Step 2: Pixel-level design audit

For EACH screenshot, verify against the spec:

**Colors (check ALL of these):**
- [ ] Background: #080812 with aurora gradients
- [ ] Header bg: semi-transparent with blur
- [ ] Panel bg: rgba(255,255,255,0.04) at rest
- [ ] Primary text: #E8E8EC
- [ ] Dim text: rgba(232,232,236,0.5)
- [ ] Airport accent: #44FFBB
- [ ] Music accent: #FFCC66
- [ ] Sphere accent: #AA88FF
- [ ] No old colors remaining (#191921, #23242B, #3949D3, #dadada)

**Typography:**
- [ ] App name: Space Grotesk, visually distinct from body text
- [ ] List items: Inter font
- [ ] Ghost text: Space Grotesk, large, very faint
- [ ] All labels: uppercase where spec says uppercase
- [ ] Letter-spacing matches (visually verify wide tracking on labels)

**Spacing:**
- [ ] Panel padding: 24px (desktop)
- [ ] Gap between panels and sphere: ~32px
- [ ] List row height: ~44px
- [ ] Panel border-radius: 16px (visually rounded)
- [ ] No elements touching edges or overlapping incorrectly

**Animations:**
- [ ] Sphere breathes when paused
- [ ] Sphere rings pulse when playing
- [ ] Aurora background shifts slowly
- [ ] Stars twinkle/shift subtly
- [ ] Particles orbit smoothly (music) and jitter (airport)
- [ ] Panel glass effect transitions on hover

**Functionality:**
- [ ] Play/pause works via sphere click
- [ ] Play/pause works via spacebar
- [ ] Airport selection changes audio source
- [ ] Music selection changes audio source
- [ ] Volume sliders work for both channels independently
- [ ] Search filters both lists
- [ ] Toast notifications appear on error (styled correctly)
- [ ] `[`/`]` keys change music volume
- [ ] `{`/`}` keys change airport volume

### QG4 Step 3: Computed style full audit

```js
// Run comprehensive style checks
const checks = [];
const assert = (name, actual, expected) => {
  const pass = actual.trim() === expected;
  checks.push({ name, actual: actual.trim(), expected, pass });
};

// Header
const header = document.querySelector('.header');
assert('header height', getComputedStyle(header).height, '48px');

// Sphere
const sphere = document.querySelector('.sphere');
assert('sphere width', getComputedStyle(sphere).width, '160px');
assert('sphere height', getComputedStyle(sphere).height, '160px');
assert('sphere border-radius', getComputedStyle(sphere).borderRadius, '50%');
assert('sphere cursor', getComputedStyle(sphere).cursor, 'pointer');

// Panels
const panel = document.querySelector('.panel');
assert('panel border-radius', getComputedStyle(panel).borderRadius, '16px');
assert('panel padding', getComputedStyle(panel).padding, '24px');
assert('panel width', getComputedStyle(panel).width, '320px');

// DataList search
const search = document.querySelector('.data-list__search');
assert('search border-radius', getComputedStyle(search).borderRadius, '8px');
assert('search height', getComputedStyle(search).height, '36px');

// Footer
const footer = document.querySelector('.footer');
assert('footer height', getComputedStyle(footer).height, '36px');

// CSS variables
const root = getComputedStyle(document.documentElement);
assert('--bg', root.getPropertyValue('--bg'), '#080812');
assert('--accent-cool', root.getPropertyValue('--accent-cool'), '#44FFBB');
assert('--accent-warm', root.getPropertyValue('--accent-warm'), '#FFCC66');
assert('--accent-neutral', root.getPropertyValue('--accent-neutral'), '#AA88FF');

// Report
const failures = checks.filter(c => !c.pass);
console.log(`${checks.length - failures.length}/${checks.length} passed`);
if (failures.length) console.table(failures);
```

ALL checks must pass.

### QG4 Step 4: Lighthouse quick audit

Use chrome-devtools MCP `lighthouse_audit` for:
- Performance score (target: >= 80)
- Accessibility score (target: >= 90)

### QG4 Step 5: Build verification

```bash
npm run build
```

Must complete without errors or warnings.

### QG4 Step 6: Final commit

```bash
git add -A
git commit -m "fix(orbital): quality gate 4 — final visual and accessibility polish"
```

---

## Summary: Task Count

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 2 | Design system foundation (fonts, CSS vars, aurora) |
| 2 | 1 | Header bar |
| 3 | 1 | Central sphere |
| 4 | 1 | DataList shared component |
| 5 | 1 | GlassPanel container |
| 6 | 2 | Desktop layout assembly + footer restyle |
| QG1 | — | Quality gate: layout & visual foundation |
| 7 | 1 | Starfield canvas |
| 8 | 1 | useAudioAnalyser composable |
| 9 | 1 | Particle canvas |
| QG2 | — | Quality gate: full desktop experience |
| 10 | 2 | Mobile drawer + responsive layout |
| QG3 | — | Quality gate: mobile experience |
| 11 | 1 | Keyboard shortcuts |
| 12 | 1 | Cleanup (remove old code + deps) |
| 13 | 1 | Accessibility pass |
| QG4 | — | Quality gate: final verification |

**Total: 16 implementation tasks + 4 quality gates**
