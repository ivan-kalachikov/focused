# Orbital — Refined Design Specification

> Spatial Depth / Celestial. Aurora palette on deep space black.
> "You're floating above Earth at night, watching airport lights glow below."

---

## 1. Design System

### 1.1 Color Palette

| Token                  | Value                           | Usage                                      |
|------------------------|---------------------------------|---------------------------------------------|
| `--bg`                 | `#080812`                       | Page background, deepest layer              |
| `--bg-gradient-from`   | `#0D0B1A`                       | Aurora gradient start (deep purple)         |
| `--bg-gradient-to`     | `#0A1A1A`                       | Aurora gradient end (dark teal)             |
| `--surface`            | `rgba(255, 255, 255, 0.04)`     | Panel resting state background              |
| `--surface-active`     | `rgba(255, 255, 255, 0.10)`     | Panel active/interacted state               |
| `--glass-border`       | `rgba(255, 255, 255, 0.08)`     | Panel border resting                        |
| `--glass-border-active`| `rgba(255, 255, 255, 0.18)`     | Panel border active                         |
| `--text-primary`       | `#E8E8EC`                       | Primary text (light gray)                   |
| `--text-dim`           | `rgba(232, 232, 236, 0.5)`      | Secondary text, labels                      |
| `--text-muted`         | `rgba(232, 232, 236, 0.25)`     | Disabled, decorative, ghost text            |
| `--accent-warm`        | `#FFCC66`                       | Music particles, music-active elements      |
| `--accent-warm-glow`   | `rgba(255, 204, 102, 0.25)`     | Music glow/shadow                           |
| `--accent-cool`        | `#44FFBB`                       | Airport particles, airport-active elements  |
| `--accent-cool-glow`   | `rgba(68, 255, 187, 0.25)`      | Airport glow/shadow                         |
| `--accent-neutral`     | `#AA88FF`                       | Shared UI accents (sphere, app name)        |
| `--accent-neutral-glow`| `rgba(170, 136, 255, 0.3)`      | Sphere outer glow                           |
| `--error`              | `#FF6655`                       | Error states                                |
| `--warning`            | `#FFB844`                       | Buffering states                            |
| `--star-color`         | `rgba(255, 255, 255, 0.6)`      | Starfield base point color                  |

### 1.2 Typography

**Display font:** `'Space Grotesk', sans-serif` — weights 400, 500, 700.
Used for: app name, status text, ghost IATA codes, ghost station names.

**Body font:** `'Inter', sans-serif` — weights 300, 400, 500.
Used for: lists, labels, controls, footer.

Load both via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

| Element              | Font           | Size   | Weight | Tracking | Transform |
|----------------------|----------------|--------|--------|----------|-----------|
| App name             | Space Grotesk  | 18px   | 700    | 0.12em   | uppercase |
| Ghost IATA code      | Space Grotesk  | 120px  | 700    | 0.05em   | uppercase |
| Ghost station name   | Space Grotesk  | 80px   | 700    | 0.02em   | none      |
| Status text          | Space Grotesk  | 14px   | 500    | 0.08em   | uppercase |
| Station / city name  | Inter          | 14px   | 400    | 0.01em   | none      |
| IATA code in list    | Inter          | 14px   | 500    | 0.06em   | uppercase |
| Country code         | Inter          | 12px   | 400    | 0.04em   | uppercase |
| Data label           | Inter          | 11px   | 400    | 0.08em   | uppercase |
| Footer               | Inter          | 11px   | 300    | 0.04em   | none      |
| Volume readout       | Inter          | 11px   | 400    | 0        | none      |
| Search input         | Inter          | 13px   | 400    | 0        | none      |

### 1.3 Spacing Scale

Base unit: 4px. Multiples: 4, 8, 12, 16, 24, 32, 48, 64.

- Panel inner padding: `24px` (desktop), `16px` (tablet), `12px` (mobile)
- Gap between panels and sphere: `32px` (desktop), `24px` (mobile)
- List row height: `44px` (touch-friendly)
- List row padding: `12px 16px`
- Volume slider height (visible): `4px`, hit area `24px`
- Border radius on panels: `16px`
- Border radius on inputs/buttons: `8px`

### 1.4 Aurora Background

Applied to the root `.layout` as multiple layered radial gradients:

```css
.layout {
  background-color: var(--bg);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(13, 11, 26, 0.8) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 50%, rgba(10, 26, 26, 0.8) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 100%, rgba(68, 255, 187, 0.03) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 0%, rgba(170, 136, 255, 0.04) 0%, transparent 40%);
}
```

The gradient ellipse positions animate slowly via CSS `@keyframes aurora` (20s cycle, alternating) to create a living aurora. On `prefers-reduced-motion: reduce`, gradients are static.

```css
@keyframes aurora {
  0%, 100% {
    background-position: 20% 50%, 80% 50%, 50% 100%, 50% 0%;
  }
  50% {
    background-position: 30% 40%, 70% 60%, 40% 90%, 60% 10%;
  }
}
.layout {
  background-size: 100% 100%;
  animation: aurora 20s ease-in-out infinite alternate;
}
```

---

## 2. Layout

### 2.1 Desktop (>= 1024px)

Centered, vertically balanced composition. The sphere is the focal point.

```
+------------------------------------------------------------------+
|  HEADER BAR                                                       |
|  ORBITAL  [breathing dot]                        Now Playing: ... |
+------------------------------------------------------------------+
|                                                                    |
|                     * . *    .   *                                 |
|          .    *          .        .    *                           |
|  +------------------+           +------------------+              |
|  | AIRPORT PANEL    |           | MUSIC PANEL      |              |
|  | [ghost: JFK]     |    ( O )  | [ghost: Synpha]  |              |
|  |                  |    /   \  |                  |              |
|  |  > search_       |  particles|  > search_       |              |
|  |  * SVO Moscow RU |     |     |  * Synphaera     |              |
|  |    JFK New York  |     |     |    Space Station  |              |
|  |    NRT Tokyo     |           |    n5MD Radio     |              |
|  |                  |           |                  |              |
|  | VOL =========-   |           | VOL ==========   |              |
|  +------------------+           +------------------+              |
|          .    *         .   *           .                          |
|                     .          *    .                              |
|                                                                    |
+------------------------------------------------------------------+
|  Footer: Inspired by... | Frontend by... | v0.2.0                 |
+------------------------------------------------------------------+
```

```css
.orbital-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "main"
    "footer";
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

.main-area {
  grid-area: main;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 24px;
  position: relative; /* for starfield canvas */
}
```

The two panels flank the central sphere. Each panel has a subtle 3D tilt:

```css
.panel--left {
  transform: perspective(800px) rotateY(2deg);
}
.panel--right {
  transform: perspective(800px) rotateY(-2deg);
}
```

### 2.2 Tablet (768px - 1023px)

Same horizontal layout but panels narrow, sphere shrinks. The 3D tilt reduces to `1deg`. Panels max-width `280px`.

```css
@media (max-width: 1023px) {
  .main-area {
    gap: 24px;
    padding: 16px;
  }
  .panel--left {
    transform: perspective(800px) rotateY(1deg);
  }
  .panel--right {
    transform: perspective(800px) rotateY(-1deg);
  }
  .panel {
    max-width: 280px;
  }
}
```

### 2.3 Mobile (< 768px)

The panels collapse to a bottom drawer. The sphere and starfield take the full viewport.

```
+----------------------------------+
|  HEADER BAR                      |
|  ORBITAL              Now: SVO   |
+----------------------------------+
|                                  |
|        * .    *    .             |
|    .         .        *   .     |
|                                  |
|              ( O )               |
|             /     \              |
|          particles               |
|                                  |
|     .    *       .    *          |
|                                  |
+----------------------------------+
| [Airport tab] [Music tab]        |
|                                  |
|  > search_                       |
|  * SVO  Moscow       RU          |
|    JFK  New York     US          |
|    NRT  Tokyo        JP          |
|                                  |
|  VOL ===================-  85%   |
+----------------------------------+
|  Footer                          |
+----------------------------------+
```

Two tabs at the top of the drawer: "ATC" and "MUSIC". Tap to switch. The drawer has a drag handle and can be collapsed to show just the tab bar (~48px) or expanded to ~50vh.

```css
@media (max-width: 767px) {
  .main-area {
    flex-direction: column;
    padding-bottom: 0;
  }
  .sphere-container {
    flex: 1;
  }
  .panel--left,
  .panel--right {
    transform: none; /* no 3D tilt on mobile */
  }
  .drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 50vh;
    border-radius: 16px 16px 0 0;
    background: var(--surface-active);
    backdrop-filter: blur(20px);
    transition: transform 0.3s ease;
  }
  .drawer--collapsed {
    transform: translateY(calc(100% - 48px));
  }
}
```

### 2.4 Small Mobile (< 480px)

Same drawer layout. Additional adjustments:

- Sphere reduces from 160px to 100px diameter
- Ghost text disabled (too large for small screens)
- Panel padding reduces to 12px
- Font sizes scale down 1px across the board

---

## 3. Components — Detailed Specification

### 3.1 Header Bar

A slim horizontal bar, height `48px`, glassmorphic background.

| Left                                       | Right                                        |
|--------------------------------------------|----------------------------------------------|
| App name `ORBITAL` in `--accent-neutral`, Space Grotesk 700, 18px, tracking 0.12em. A small breathing dot (6px circle) to the right of the name that pulses when playing, dims when paused. | Status text: `NOW PLAYING: SVO / SYNPHAERA` in `--text-dim`, Inter 11px. On mobile, truncated to `SVO / SYNPH...` |

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 48px;
  background: var(--surface);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
  z-index: 10;
}
```

### 3.2 Central Sphere (Play/Pause)

The centerpiece of the entire design. A luminous orb that acts as the global play/pause toggle.

**Dimensions:**
- Desktop: 160px diameter
- Tablet: 140px
- Mobile: 120px
- Small mobile: 100px

**Structure:** A `<button>` element with layered pseudo-elements and a CSS gradient sphere.

**Paused state (breathing):**
- Radial gradient sphere: center bright (`rgba(170, 136, 255, 0.3)`), edges transparent
- Subtle inner highlight to simulate 3D curvature
- Slow breathing animation: `scale(1) -> scale(1.04) -> scale(1)` over 4s, ease-in-out
- Dim outer glow: `box-shadow: 0 0 40px var(--accent-neutral-glow)`
- `cursor: pointer`

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
  box-shadow:
    0 0 40px var(--accent-neutral-glow),
    inset 0 0 30px rgba(170, 136, 255, 0.1);
  border: 1px solid rgba(170, 136, 255, 0.15);
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.6s ease, transform 0.6s ease;
}

.sphere--paused {
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
```

**Playing state:**
- Breathing stops, sphere holds at `scale(1.02)`
- Glow intensifies: `box-shadow: 0 0 60px var(--accent-neutral-glow), 0 0 120px rgba(170, 136, 255, 0.15)`
- Concentric light rings expand outward from the sphere (see section 5.1)
- Inner gradient brightens

```css
.sphere--playing {
  transform: scale(1.02);
  box-shadow:
    0 0 60px var(--accent-neutral-glow),
    0 0 120px rgba(170, 136, 255, 0.15);
}
```

**Buffering state:**
- Sphere pulses faster: `scale(1) -> scale(1.06)` over 1.5s
- Glow color shifts to `--warning` (amber)
- A thin ring orbits the sphere (loading indicator)

**Error state:**
- Glow shifts to `--error` (red-orange)
- Sphere dims, no pulse
- Single flash animation then static

**Accessibility:**
- `role="button"`
- `aria-label="Toggle playback. Currently playing"` / `"Currently paused"`
- `tabindex="0"`
- Focus ring: `outline: 2px solid var(--accent-neutral)` offset `4px`

### 3.3 Particle Visualization System

The primary audio visualization. Particles orbit the central sphere on a shared `<canvas>` element that sits behind the sphere (z-index layering).

**Canvas sizing:**
- Fills the `.main-area` container
- Sized via `ResizeObserver` + `devicePixelRatio` for sharp rendering
- Positioned `absolute`, `inset: 0`, behind panels (`z-index: 0`)

**Two particle systems on one canvas:**

#### Music Particles (Inner Orbit)
- **Color:** `--accent-warm` (#FFCC66), varying opacity 0.4-1.0
- **Count:** 40-60 particles
- **Orbit radius:** sphere radius + 20px to sphere radius + 80px
- **Size:** 2-5px circles with soft edges (`shadowBlur: 4`)
- **Movement:** Smooth, continuous flow. Particles drift along elliptical paths at varying speeds (0.2-0.8 rad/s). Audio amplitude modulates orbit radius (louder = wider orbit, ±15px). Audio frequency bands modulate individual particle brightness.
- **Behavior:** Graceful, flowing. Like fireflies on a lazy orbit.

#### Airport Particles (Outer Orbit)
- **Color:** `--accent-cool` (#44FFBB), varying opacity 0.3-1.0
- **Count:** 30-50 particles
- **Orbit radius:** sphere radius + 90px to sphere radius + 160px
- **Size:** 1.5-4px circles
- **Movement:** Jittery, irregular. Particles follow rough orbital paths but with randomized acceleration bursts when voice activity is detected. Audio amplitude modulates particle speed (louder = faster, more erratic). Audio frequency bands modulate particle count (more high-frequency energy = more particles visible).
- **Behavior:** Twitchy, reactive. Like radio static visualized as light.

#### Shared Rendering Logic

```js
// Per frame (requestAnimationFrame):
// 1. Clear canvas with slight trail (fillRect with alpha 0.05 for motion blur)
// 2. Update music particle positions (smooth sine/cosine orbits + audio offset)
// 3. Update airport particle positions (orbits + audio jitter + voice burst detection)
// 4. Draw all particles with glow (shadowBlur + shadowColor per particle type)
// 5. Skip if document.hidden
```

**Trail effect:** Instead of fully clearing the canvas each frame, draw a semi-transparent rect over it (`rgba(8, 8, 18, 0.08)`). This creates comet-like trails behind fast-moving particles.

**When paused:** Particles slow to a lazy drift (10% normal speed). No audio modulation. Count reduces to 20 per system. Creates a serene idle state.

**When no audio connected:** Particles drift at minimal count (10 each), very dim. A text label appears on the canvas center: `NO SIGNAL` in `--text-muted`.

**Performance:**
- Use `requestAnimationFrame`, skip on `document.hidden`
- On mobile: reduce particle count by 50%
- Use object pooling (pre-allocate particle array, no GC pressure)
- Target 60fps; if frame budget exceeded, reduce particle count dynamically

### 3.4 Starfield Background

A separate `<canvas>` element behind everything, rendering a static starfield with parallax.

**Star generation (once on mount):**
- 200 stars (desktop), 100 (mobile)
- Random positions across the canvas
- Random sizes: 0.5px - 2px
- Random base brightness: 0.2 - 0.8
- Each star assigned a depth layer (1-3) for parallax multiplier

**Parallax — Mouse + Audio:**

Desktop: Mouse position relative to viewport center drives star offset. Each star shifts by `(mouseX - centerX) * depth * 0.02` px. Creates a subtle 3D depth effect.

Mobile: Falls back to slow auto-drift (gentle sine wave motion, 30s cycle).

Audio: Music amplitude modulates star brightness globally (louder = brighter stars, ±20% of base brightness). Airport audio modulates a subtle twinkle rate (voice activity makes stars flicker faster).

```js
// Parallax calculation per frame:
const offsetX = (mouseX - centerX) * star.depth * 0.02;
const offsetY = (mouseY - centerY) * star.depth * 0.015;
const brightness = star.baseBrightness + musicAmplitude * 0.2;
```

**Rendering:**
- Simple `fillRect` or `arc` per star
- No blur effects (performance)
- Stars that drift off-screen wrap to the opposite edge
- Drawn once per frame in the rAF loop shared with particles

### 3.5 Airport Panel

A glassmorphic panel floating to the left of the sphere (desktop) or in the bottom drawer (mobile).

**Visual:**

```css
.panel {
  background: var(--surface);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 24px;
  width: 320px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
}

/* Adaptive glassmorphism — more opaque on interaction */
.panel:hover,
.panel:focus-within {
  background: var(--surface-active);
  backdrop-filter: blur(20px);
  border-color: var(--glass-border-active);
}
```

**Ghost IATA code** behind the panel content:

```css
.panel__ghost {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 120px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted); /* rgba(232, 232, 236, 0.25) */
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  transition: opacity 0.4s ease;
}
```

The ghost text updates when the airport selection changes — crossfade transition (old fades out, new fades in over 400ms).

**Layout inside the panel:**

```
 ATC FEED
 +---------------------------------+
 | > search_                       |
 +---------------------------------+
 | * SVO  Moscow           RU      |  <- selected (accent-cool)
 |   JFK  New York         US      |  <- dim
 |   NRT  Tokyo            JP      |
 |   HKG  Hong Kong        HK      |
 |   ...                           |
 +---------------------------------+
 | VOL ===================-  85%   |
 +---------------------------------+
```

**Section label:** `ATC FEED` in Inter 11px, `--text-dim`, uppercase, tracking 0.08em. Margin-bottom 12px.

**Search input:**
- Full width, Inter 13px, `--text-primary`
- Background: `rgba(255, 255, 255, 0.04)`
- Border: `1px solid var(--glass-border)`
- Border-radius: `8px`
- Placeholder: `Search airports...` in `--text-muted`
- Height: `36px` (desktop), `44px` (touch devices via `@media (pointer: coarse)`)
- On focus: border-color transitions to `--accent-cool`
- Filters the list on each keypress (case-insensitive match against city, IATA, ICAO, country)

**Airport list:**
- Scrollable area, max-height: `300px` (desktop), `40vh` (mobile drawer)
- Custom scrollbar: thin (4px), thumb `rgba(255, 255, 255, 0.15)`, track transparent

Each row:

| Element | Style |
|---|---|
| Active indicator `*` | `--accent-cool`, only on selected row |
| IATA code | Inter 14px, weight 500, tracking 0.06em, uppercase |
| City name | Inter 14px, weight 400 |
| Country code | Inter 12px, `--text-dim`, right-aligned |

- Selected row: all text in `--accent-cool`, left border `2px solid var(--accent-cool)`, subtle `box-shadow: inset 4px 0 8px var(--accent-cool-glow)`
- Unselected rows: `--text-dim`
- Hover: text brightens to `--text-primary`, background `rgba(255, 255, 255, 0.03)`
- Row height: `44px`, full-width clickable
- No country flags (breaks glass aesthetic)

**Volume slider:**
- Label `VOL` in Inter 11px, `--text-dim`
- Percentage readout right-aligned: `85%` in Inter 11px
- Slider: `<input type="range">` restyled
- Track: `4px` height, background `rgba(255, 255, 255, 0.08)`, border-radius `2px`
- Fill: `var(--accent-cool)`, via CSS gradient or `linear-gradient` on the track
- Thumb: `12px` circle, `var(--accent-cool)`, `box-shadow: 0 0 8px var(--accent-cool-glow)`
- Hit area: `24px` tall (padding on the input)
- `transition: all 0.15s linear`

### 3.6 Music Panel

Same structure as Airport Panel, adapted for music data. Positioned to the right of the sphere (desktop) or second tab in drawer (mobile).

**Ghost station name** behind the panel — same technique as airport ghost IATA, but showing the station name in Space Grotesk 80px (truncated to fit, ~6 characters visible).

**Layout:**

```
 MUSIC FEED
 +---------------------------------+
 | > search_                       |
 +---------------------------------+
 | * Synphaera Radio               |  <- selected (accent-warm)
 |   Space Station Soma            |  <- dim
 |   n5MD Radio                    |
 |   Groove Salad Classic          |
 |   ...                           |
 +---------------------------------+
 | VOL ===================  100%   |
 +---------------------------------+
```

- Section label: `MUSIC FEED`
- Active accent: `--accent-warm` (#FFCC66) instead of `--accent-cool`
- Each row shows station name only (no images, no thumbnails — breaks glass aesthetic)
- Station description: appears as a second line below the name on hover/focus, in `--text-dim`, Inter 12px, max 1 line with ellipsis. On touch devices, shown on tap (toggle).
- Search filters on station name and description
- Volume slider uses `--accent-warm` for fill and thumb

### 3.7 Footer

A single-line footer, minimal, always visible.

```
Inspired by listentothe.cloud  |  Frontend by Kalachikov  |  Design by Emelyanova  |  v0.2.0
```

- Height: `36px`
- Background: `var(--surface)`, `backdrop-filter: blur(6px)`
- Border-top: `1px solid var(--glass-border)`
- Text: Inter 11px, weight 300, `--text-dim`
- Items separated by ` | ` (pipe with spaces)
- Links: `--text-primary` on hover, underline
- Padding: `0 24px`
- On mobile: horizontally scrollable if overflow, or wrap to 2 lines

### 3.8 Toast Notifications

Restyled to match Orbital aesthetic:

```css
.toast {
  background: var(--surface-active);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border-active);
  border-radius: 12px;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  padding: 12px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.toast--error {
  border-color: var(--error);
  color: var(--error);
}
.toast--warning {
  border-color: var(--warning);
  color: var(--warning);
}
```

Positioned top-center. Fade + slide-down transition (translate from -20px to 0). Auto-dismiss after 3s.

---

## 4. Interaction Patterns

### 4.1 Keyboard Navigation

| Key             | Action                                          |
|-----------------|-------------------------------------------------|
| `Space`         | Toggle play/pause (global, when no input focused)|
| `Tab`           | Navigate between sphere, airport panel, music panel |
| `Up` / `Down`   | Navigate list items (when panel is focused)      |
| `Enter`         | Select highlighted item                          |
| `/` or `Ctrl+K` | Focus search input in the last-focused panel     |
| `Esc`           | Clear search, blur input, collapse mobile drawer |
| `[` / `]`       | Decrease/increase music volume by 10%            |
| `{` / `}`       | Decrease/increase airport volume by 10%          |

### 4.2 Click/Touch Targets

- Central sphere: entire element is clickable, min 100px (smallest on small mobile)
- List rows: full-width, min `44px` height
- Volume sliders: visible track `4px` but hit area `24px` via padding; on `@media (pointer: coarse)` hit area increases to `44px`
- Search inputs: `44px` height on touch devices
- Tab bar (mobile drawer): each tab `48px` height, 50% width

### 4.3 Focus States

Glassmorphic focus — no hard outlines, use glow:

```css
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-neutral), 0 0 12px var(--accent-neutral-glow);
}

/* For text elements within panels, use accent color matching the panel */
.panel--airport *:focus-visible {
  box-shadow: 0 0 0 2px var(--accent-cool), 0 0 12px var(--accent-cool-glow);
}
.panel--music *:focus-visible {
  box-shadow: 0 0 0 2px var(--accent-warm), 0 0 12px var(--accent-warm-glow);
}
```

### 4.4 Panel 3D Tilt on Hover (Desktop)

Panels have a base tilt (`rotateY(±2deg)`). On mouse hover, a micro-parallax effect amplifies the tilt based on cursor position within the panel:

```js
// On mousemove over .panel--left:
const rect = panel.getBoundingClientRect();
const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
const y = (e.clientY - rect.top) / rect.height - 0.5;
panel.style.transform = `perspective(800px) rotateY(${2 + x * 3}deg) rotateX(${-y * 2}deg)`;
```

On mouse leave, spring back to base tilt with `transition: transform 0.4s ease-out`.

### 4.5 Mobile Drawer Interaction

- Drag handle: `40px x 4px` rounded bar, centered at top of drawer, `--text-muted`
- Swipe up to expand, swipe down to collapse
- Snap points: collapsed (`48px` visible — just the tab bar), expanded (`50vh`)
- Touch-driven via pointer events, no library needed
- Transition: `transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

---

## 5. Animations

### 5.1 Sphere Concentric Rings (Playing State)

When playing, rings of light expand outward from the sphere every 3s:

```css
@keyframes ring-expand {
  0% {
    transform: scale(1);
    opacity: 0.4;
    border-width: 2px;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    border-width: 0.5px;
  }
}

.sphere__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--accent-neutral);
  pointer-events: none;
  animation: ring-expand 3s ease-out infinite;
}

/* Stagger 3 rings */
.sphere__ring:nth-child(1) { animation-delay: 0s; }
.sphere__ring:nth-child(2) { animation-delay: 1s; }
.sphere__ring:nth-child(3) { animation-delay: 2s; }
```

Three `<span>` elements inside the sphere button, staggered by 1s. Creates a continuous radar-ping effect. Hidden when paused.

### 5.2 Breathing Animation (Paused Sphere)

```css
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 40px var(--accent-neutral-glow);
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 0 60px var(--accent-neutral-glow);
  }
}

.sphere--paused {
  animation: breathe 4s ease-in-out infinite;
}
```

### 5.3 Buffering Spinner Ring

A thin ring that orbits the sphere during buffering:

```css
@keyframes orbit-ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.sphere__loading-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--warning);
  animation: orbit-ring 1.2s linear infinite;
  pointer-events: none;
}
```

### 5.4 Ghost Text Crossfade

When airport or music selection changes, the ghost text behind the panel crossfades:

```css
.panel__ghost {
  transition: opacity 0.4s ease;
}
.panel__ghost--exiting {
  opacity: 0;
}
.panel__ghost--entering {
  opacity: 0;
  animation: ghost-fade-in 0.4s ease 0.2s forwards;
}
@keyframes ghost-fade-in {
  to { opacity: 1; }
}
```

Managed in JS: on selection change, add `--exiting` to old text, after 200ms swap text content, add `--entering`.

### 5.5 Row Selection

Soft transition. Selected row crossfades from dim to accent color over 200ms:

```css
.list-row {
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
```

No spring/bounce — clean and calm, matching the "floating" aesthetic.

### 5.6 Volume Slider Fill

```css
input[type="range"]::-webkit-slider-runnable-track {
  transition: background 0.15s linear;
}
```

Smooth tracking. Thumb has a subtle glow pulse on drag.

### 5.7 Panel Glassmorphism Transition

When hovering or interacting with a panel, the glass effect intensifies:

```css
.panel {
  transition:
    background 0.4s ease,
    backdrop-filter 0.4s ease,
    border-color 0.4s ease;
}
```

From `blur(8px)` resting to `blur(20px)` active. Background opacity increases. Border brightens. Creates a "coming into focus" effect.

### 5.8 Header Breathing Dot

```css
@keyframes dot-breathe {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

.header__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-neutral);
  margin-left: 8px;
}
.header__dot--playing {
  animation: dot-breathe 2s ease-in-out infinite;
}
.header__dot--paused {
  opacity: 0.3;
  transform: scale(0.8);
}
```

---

## 6. Responsiveness Details

### 6.1 Breakpoint Summary

| Breakpoint   | Layout       | Sphere  | Panels           | Ghost text | Parallax     |
|-------------|-------------|---------|-----------------|-----------|-------------|
| >= 1024px   | Horizontal  | 160px   | Side-by-side, 3D tilt | Yes, 120px/80px | Mouse + audio |
| 768-1023px  | Horizontal  | 140px   | Side-by-side, reduced tilt | Yes, 90px/60px | Mouse + audio |
| 480-767px   | Vertical    | 120px   | Bottom drawer, tabs | Hidden | Auto-drift + audio |
| < 480px     | Vertical    | 100px   | Bottom drawer, tabs | Hidden | Auto-drift + audio |

### 6.2 Touch Adaptations

```css
@media (pointer: coarse) {
  .list-row { min-height: 44px; }
  .search-input { height: 44px; }
  input[type="range"] { padding: 20px 0; /* 44px total hit area */ }
  .drawer__tab { height: 48px; }
}
```

### 6.3 Orientation

Landscape mobile (height < 500px and width > 568px): suppress the drawer expanded state max-height to `40vh` to leave room for the sphere. Sphere size clamps to `min(120px, 30vh)`.

### 6.4 Canvas Responsiveness

Both canvases (starfield + particles) resize via `ResizeObserver`:

```js
const observer = new ResizeObserver(([entry]) => {
  const { width, height } = entry.contentRect;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
});
observer.observe(canvas.parentElement);
```

### 6.5 Reduced Data / Low Power

On `prefers-reduced-motion: reduce`:
- Aurora gradient: static (no animation)
- Sphere: no breathing, no rings, static glow
- Particles: reduced to 10 per system, slow constant drift, no audio modulation
- Starfield: static, no parallax
- Ghost text: no crossfade, instant swap
- Panel tilt: disabled (`transform: none`)

---

## 7. Accessibility

### 7.1 Contrast

- `#E8E8EC` on `#080812` = contrast ratio **15.8:1** (passes AAA)
- `rgba(232, 232, 236, 0.5)` (dim) on `#080812` = effective ~`#7C7C7E` = **5.5:1** (passes AA)
- `#FFCC66` on `#080812` = **10.9:1** (passes AAA)
- `#44FFBB` on `#080812` = **13.2:1** (passes AAA)
- `#AA88FF` on `#080812` = **6.1:1** (passes AA)
- `#FF6655` on `#080812` = **5.4:1** (passes AA)

All pass WCAG AA minimum. Primary text and both accent colors pass AAA.

### 7.2 Screen Readers

| Element | ARIA |
|---|---|
| Central sphere | `role="button"`, `aria-label="Toggle playback. Currently: playing"` / `"paused"` |
| Airport list | `role="listbox"`, `aria-label="Airport selection"` |
| Airport row | `role="option"`, `aria-selected="true/false"` |
| Music list | `role="listbox"`, `aria-label="Music station selection"` |
| Music row | `role="option"`, `aria-selected="true/false"` |
| Volume sliders | `aria-label="Airport volume"` / `"Music volume"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow` |
| Search inputs | `aria-label="Search airports"` / `"Search music stations"` |
| Particle canvas | `role="img"`, `aria-label="Audio visualization"` |
| Starfield canvas | `aria-hidden="true"` (decorative) |
| Mobile drawer | `role="region"`, `aria-label="Audio controls"` |
| Drawer tabs | `role="tablist"`, each tab `role="tab"`, `aria-selected`, panel `role="tabpanel"` |
| Header dot | `aria-hidden="true"` (decorative) |
| Ghost text | `aria-hidden="true"` (decorative) |
| Footer | `role="contentinfo"` |

### 7.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Particle and starfield canvases check `matchMedia('(prefers-reduced-motion: reduce)')` and fall back to a static render (single frame, no rAF loop).

### 7.4 Color Scheme

```html
<meta name="color-scheme" content="dark">
```

No light mode. The design is inherently dark — the glassmorphism, particle effects, and aurora background require a dark canvas.

---

## 8. Component Mapping

How existing Vue components change:

| Current Component     | Action   | New Role                                               |
|-----------------------|----------|--------------------------------------------------------|
| `App.vue`             | Restyle  | Root `.orbital-layout` grid, font imports, CSS vars, aurora background |
| `Main.vue`            | Rewrite  | Becomes layout orchestrator: sphere, panels, canvases. Removes `<av-line>`, removes Christmas easter egg |
| `Airports.vue`        | Rewrite  | Glass panel with search, scrollable list, volume slider. No CustomSelect dropdown |
| `Music.vue`           | Rewrite  | Glass panel with search, scrollable list, volume slider. No CustomSelect dropdown |
| `CustomSelect.vue`    | Remove   | Replaced by inline searchable lists in each panel      |
| `Footer.vue`          | Restyle  | Minimal single-line glassmorphic footer                |
| *(new)* `Sphere.vue`         | Create | Central play/pause orb with rings and states    |
| *(new)* `ParticleCanvas.vue` | Create | Dual-system particle visualization              |
| *(new)* `Starfield.vue`      | Create | Background starfield with parallax              |
| *(new)* `GlassPanel.vue`     | Create | Reusable glassmorphic panel container           |
| *(new)* `DataList.vue`       | Create | Reusable searchable scrollable list with volume |
| *(new)* `HeaderBar.vue`      | Create | Top bar with app name, breathing dot, status text |
| *(new)* `MobileDrawer.vue`   | Create | Bottom drawer with tabs for mobile layout       |

### 8.1 New Shared Component: GlassPanel

Wrapper component providing the glassmorphic container with adaptive blur.

**Props:**
- `tilt: 'left' | 'right' | 'none'` — 3D perspective direction
- `ghostText: String` — text shown as large ghost behind content

**Slots:**
- `default` — panel content

**Behavior:**
- Manages hover/focus-within state for adaptive glassmorphism
- Manages ghost text crossfade on prop change
- Applies 3D tilt with micro-parallax on mousemove
- Disabled on mobile (`< 768px`)

### 8.2 New Shared Component: DataList

Since Airport and Music lists share identical behavior, extract `DataList.vue`:

**Props:**
- `items: Array` — the data
- `valueKey: String` — unique key field
- `labelKey: String` — display field
- `secondaryKeys?: Array<{ key: String, label: String }>` — additional columns (IATA, country code for airports)
- `filterKeys: Array<String>` — fields to search against
- `modelValue` — currently selected value
- `volume: Number` — current volume 0-1
- `label: String` — section header text (`ATC FEED` / `MUSIC FEED`)
- `accentColor: String` — CSS variable name (`--accent-cool` or `--accent-warm`)

**Emits:** `update:modelValue`, `update:volume`

**Slots:** `#row="{ item, active }"` for custom row rendering if needed.

### 8.3 useAudioAnalyser Composable

Same as described in the Signal spec — shared between Orbital and Signal concepts:

```js
// src/composables/useAudioAnalyser.js
// Returns: { analyser, waveform, frequency, connect, disconnect }
// Handles: lazy AudioContext, shared context, reconnection, cleanup
```

The particle system reads `frequency` data (getByteFrequencyData) rather than time-domain data, since it needs amplitude and frequency band info for particle modulation.

### 8.4 useParallax Composable

```js
// src/composables/useParallax.js
// Usage: const { offsetX, offsetY } = useParallax(depthMultiplier)
// Desktop: tracks mouse position relative to viewport center
// Mobile: slow auto-drift (sine wave, 30s cycle)
// Returns reactive offset values for CSS transforms or canvas rendering
```

---

## 9. External Dependencies

### 9.1 Add

- **Google Fonts:** `Space Grotesk` (400, 500, 700) + `Inter` (300, 400, 500) via `<link>` in index.html
- No new npm packages needed

### 9.2 Remove

- `vue-audio-visual` — replaced by custom `ParticleCanvas.vue` + `useAudioAnalyser` composable

### 9.3 Keep

- `vue`, `vuex`, `vue-i18n` — no changes
- `vite`, `vite-svg-loader` — keep for potential icon SVGs (though Orbital may be mostly CSS/canvas)

---

## 10. Decisions (Resolved)

1. **Visualization approach:** Canvas 2D for both starfield and particles. No WebGL, no Three.js. Keeps bundle small and maintainable. Performance is achievable with careful particle counts and rAF management.
2. **Glassmorphism intensity:** Adaptive — panels become more frosted on interaction, more transparent at rest. Keeps the background visible while ensuring readability when actively using controls.
3. **Mobile layout:** Bottom drawer with tabs, not stacked panels. Maximizes the sphere and particle canvas viewport on small screens.
4. **Volume controls:** Linear sliders (not dials/arcs). Styled with glass aesthetic and accent glows. Most accessible and familiar.
5. **Country flags:** Removed. Country code (2-letter) only. Flags break the translucent monochrome glass aesthetic.
6. **Station images:** Removed. Text-only music list. Images break the glass aesthetic.
7. **Christmas easter egg:** Dropped. Clean slate.
8. **About/credits:** Minimal footer line, always visible but unobtrusive.
9. **i18n:** Stays. All UI labels go through the translation system.
10. **Ghost text on mobile:** Disabled. Too large for small screens, and the drawer panels are narrower.
11. **3D tilt on mobile:** Disabled. Touch interaction makes tilt feel glitchy.

---

## 11. Performance Budget

| Metric | Target |
|---|---|
| Canvas FPS | 60fps desktop, 30fps mobile minimum |
| Particle count | 100 desktop, 50 mobile (both systems combined) |
| Star count | 200 desktop, 100 mobile |
| JS bundle increase | < 8KB gzipped (canvas rendering + composables) |
| Font load | ~60KB (2 fonts, subset Latin) |
| First meaningful paint | < 1.5s on 3G |
| `backdrop-filter` support | Graceful degradation: solid semi-transparent bg on unsupported browsers |

### Graceful Degradation

If `backdrop-filter` is not supported (checked via `@supports`):

```css
@supports not (backdrop-filter: blur(1px)) {
  .panel {
    background: rgba(15, 15, 25, 0.85); /* opaque fallback */
  }
  .header, .footer {
    background: rgba(15, 15, 25, 0.9);
  }
}
```

---

## 12. Data Flow

```
User clicks Sphere
    |
    v
Vuex: setAppStatus('playing')
    |
    +---> <audio> elements: play()
    |         |
    |         v
    |     AudioContext.createMediaElementSource()
    |         |
    |         v
    |     AnalyserNode x2 (music + airport)
    |         |
    |         +---> getByteFrequencyData() ---> ParticleCanvas (modulates particles)
    |         +---> getByteFrequencyData() ---> Starfield (modulates brightness)
    |
    +---> Sphere: switch to playing state (rings, glow)
    +---> Header: dot starts breathing
    +---> Particles: speed up, full count, audio-reactive
    +---> Starfield: audio brightness modulation active

User clicks Sphere again
    |
    v
Vuex: setAppStatus('paused')
    |
    +---> <audio> elements: pause()
    +---> Sphere: switch to breathing state
    +---> Particles: slow to idle drift, reduced count
    +---> Starfield: static brightness
```
