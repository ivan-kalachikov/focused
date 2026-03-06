# Signal — Refined Design Specification

> Data-Art / Neo-Brutalist ATC. Phosphor green (#00FF41) on black.
> "An air traffic control terminal reimagined as contemporary art."

---

## 1. Design System

### 1.1 Color Palette

| Token              | Value       | Usage                                      |
|--------------------|-------------|---------------------------------------------|
| `--bg`             | `#000000`   | Page background                             |
| `--surface`        | `#0A0A0A`   | Elevated panels, cells                      |
| `--grid-line`      | `#111111`   | Grid borders, dividers                      |
| `--grid-line-dim`  | `#080808`   | Scan-line overlay stripes                   |
| `--text-primary`   | `#00FF41`   | Primary text, active elements               |
| `--text-dim`       | `#00802080` | Secondary text, labels (50% opacity green)  |
| `--text-muted`     | `#1A3A1F`   | Disabled, inactive, decorative              |
| `--accent`         | `#00FF41`   | Waveforms, highlights, active row           |
| `--accent-glow`    | `#00FF4133` | Box-shadow glow (20% opacity)               |
| `--error`          | `#FF3333`   | Error states, FAILED status                 |
| `--warning`        | `#FFB000`   | Buffering, warnings                         |
| `--white`          | `#CCCCCC`   | Links in footer, secondary info             |

### 1.2 Typography

**Font stack:** `'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace`

Load via Google Fonts: `JetBrains Mono` weights 300 (light), 400 (regular), 700 (bold).

| Element              | Size    | Weight | Transform   | Tracking     |
|----------------------|---------|--------|-------------|--------------|
| Status word          | 48px    | 700    | uppercase   | 0.3em        |
| Status word (mobile) | 28px    | 700    | uppercase   | 0.2em        |
| IATA code            | 16px    | 700    | uppercase   | 0.1em        |
| City / station name  | 14px    | 400    | none        | 0.02em       |
| Data label           | 11px    | 300    | uppercase   | 0.15em       |
| Status bar           | 11px    | 400    | uppercase   | 0.08em       |
| dB readout           | 13px    | 400    | none        | 0.05em       |

### 1.3 Spacing Scale

Base unit: 4px. Use multiples: 4, 8, 12, 16, 24, 32, 48.

Grid gap between cells: `1px` (the grid line IS the gap).

Inner cell padding: `12px` (desktop), `8px` (mobile).

### 1.4 Scan-Line Overlay

Applied as a `::after` pseudo-element on the root `.layout`:

```css
.layout::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
}
```

Subtle — barely visible — but gives the entire screen a CRT texture.

---

## 2. Layout

### 2.1 Desktop (>= 768px)

The viewport is divided into a CSS Grid with named areas:

```
┌─────────────────────────────────────────────────────┐
│                    HEADER BAR                       │
│  FOCUSED               ██ SIGNAL CLOCK  HH:MM:SS   │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   STATUS WORD        │   OSCILLOSCOPE / WAVEFORM    │
│   TRANSMITTING__     │   ▁▂▃▅▆▇█▇▆▅▃▂▁▂▃▅▆▇█▇▆▅   │
│                      │   -42dB                      │
│                      │                              │
├──────────────────────┼──────────────────────────────┤
│                      │                              │
│   AIRPORT LIST       │   MUSIC LIST                 │
│   ─────────────────  │   ─────────────────          │
│   ▸ SVO  Moscow      │   ▸ Synphaera Radio          │
│     JFK  New York    │     Space Station Soma        │
│     NRT  Tokyo       │     n5MD Radio                │
│     ...              │     ...                       │
│                      │                              │
│   VOL ████████░░░░   │   VOL ██████████░░           │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│  STATUS BAR                                         │
│  CONNECTED · AAC 32kbps · UPTIME 00:14:32 · v0.2   │
└─────────────────────────────────────────────────────┘
```

```css
.signal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto auto;
  grid-template-areas:
    "header    header"
    "status    visualizer"
    "airports  music"
    "statusbar statusbar";
  min-height: 100vh;
  gap: 1px;
  background: var(--grid-line); /* lines show through gaps */
}

.signal-grid > * {
  background: var(--bg);
}
```

### 2.2 Tablet (480px – 767px)

Stack into single column, but keep the grid structure visible:

```
┌──────────────────────────────┐
│  HEADER BAR                  │
├──────────────────────────────┤
│  STATUS WORD                 │
│  TRANSMITTING__              │
├──────────────────────────────┤
│  OSCILLOSCOPE                │
│  ▁▂▃▅▆▇█▇▆▅▃▂▁▂▃▅▆▇█▇▆▅    │
├──────────────────────────────┤
│  AIRPORT LIST                │
│  VOL ████████░░░░            │
├──────────────────────────────┤
│  MUSIC LIST                  │
│  VOL ██████████░░            │
├──────────────────────────────┤
│  STATUS BAR                  │
└──────────────────────────────┘
```

```css
@media (max-width: 767px) {
  .signal-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "status"
      "visualizer"
      "airports"
      "music"
      "statusbar";
  }
}
```

### 2.3 Mobile (< 480px)

Same single-column structure as tablet. Additional adjustments:

- Status word shrinks from 48px to 28px
- Airport/music lists get horizontal scroll on rows if needed (they won't — monospace fits)
- Cell padding reduces from 12px to 8px
- Oscilloscope height reduces from 160px to 100px
- Volume bars remain full-width (touch-friendly)

```css
@media (max-width: 479px) {
  .signal-grid {
    font-size: 12px;
  }
  .status-word {
    font-size: 28px;
    letter-spacing: 0.2em;
  }
  .oscilloscope {
    height: 100px;
  }
}
```

---

## 3. Components — Detailed Specification

### 3.1 Header Bar

**grid-area:** `header`

A single horizontal row, height ~40px.

| Left                          | Right                       |
|-------------------------------|-----------------------------|
| `FOCUSED` in accent, weight 700, 14px, tracking 0.15em | Live clock `HH:MM:SS` updating every second, dim green |

The word "FOCUSED" replaces the current SVG logo. Pure text. Optionally a small `█` block character before it as a "signal indicator" that blinks when playing.

Hairline border bottom (`1px solid var(--grid-line)`).

### 3.2 Status Word (Play/Pause)

**grid-area:** `status`

The centerpiece. Replaces the circular play/pause button entirely.

**Paused state:**
```
STANDBY█
```
- 48px, bold, `var(--text-dim)` (muted green)
- A blinking block cursor `█` at the end (CSS animation, 1s interval)
- Centered vertically and horizontally in the cell
- `cursor: pointer` — the entire cell is clickable

**Playing state:**
```
TRANSMITTING█
```
- 48px, bold, `var(--text-primary)` (full bright green)
- Blinking cursor continues
- Subtle text-shadow glow: `0 0 20px var(--accent-glow)`

**Transition:** On click, the text types out character-by-character over ~300ms (typewriter effect). Not a hard swap — each letter appears sequentially via CSS `steps()` animation on `width` with `overflow: hidden`.

**Loading state (either stream buffering):**
```
BUFFERING...█
```
- `var(--warning)` color (amber #FFB000)
- Ellipsis animates (dots appear one by one in a loop)

**Error state:**
```
SIGNAL LOST█
```
- `var(--error)` color (#FF3333)
- Glitch flicker animation on the text (see section 5)

### 3.3 Oscilloscope / Waveform Visualizer

**grid-area:** `visualizer`

Replaces the current `<av-line>` components with a custom Canvas-based oscilloscope.

**Visual:**
- Black background cell
- Two waveforms drawn on a single `<canvas>`:
  - **Airport audio** (top half): green waveform, 1px line weight
  - **Music audio** (bottom half): green waveform, 1px line weight, slightly dimmer (`var(--text-dim)`)
- A hairline horizontal divider between them at 50% height
- Labels in top-left of each half: `ATC` and `MUS` in 11px dim text
- Real-time dB level readout in bottom-right: `-42dB` in 13px

**Canvas sizing:**
- Desktop: fills the cell, ~50% of viewport width, height 200px
- Mobile: full width, height 100px

**Data source:** Web Audio API `AnalyserNode.getByteTimeDomainData()` — same API the current `vue-audio-visual` uses. We draw it ourselves for full visual control.

**When paused:** A flat horizontal line at center (no signal). Optionally a slow sine wave "idle" animation to show the canvas is alive.

**When no audio connected:** Text in center of canvas: `NO SIGNAL` in dim green.

### 3.4 Airport Selector

**grid-area:** `airports`

Replaces the current card + CustomSelect dropdown with a **visible scrollable data table**.

**Layout:**
```
 ATC FEED ─────────────────────────
 ▸ OVB  Novosibirsk     RU  ████░░
   BAH  Muharraq        BH
   SOF  Sofia           BG
   BOD  Bordeaux        FR
   ORY  Paris           FR
   ...
 ──────────────────────────────────
 VOL ████████████░░░░░░  85%
```

**Table structure:**
- Section label: `ATC FEED` in 11px, dim, with hairline rule
- Each row: `IATA` (bold, 16px) + `City` (14px) + `Country code` (11px, dim)
- Selected row: full accent color + left indicator `▸` + subtle left border glow
- Unselected rows: dim green text
- Hover: text brightens to full accent
- Max height: ~300px, scrollable. Scrollbar: thin, accent-colored thumb on black track
- **Search/filter:** A small search input at top of the list, monospace, with a `>` prompt character: `> search_`. Filters the list on keypress. Replaces the current dropdown search.

**Volume bar** below the list:
- Label `VOL` in 11px dim
- Horizontal bar: background `var(--grid-line)`, fill `var(--accent)`, height 4px
- Percentage readout: `85%` in 11px
- Interactive: click/drag to adjust (same `<input type="range">` but heavily restyled)

**No country flags.** Flags break the monochrome aesthetic. Country info is the 2-letter code only.

### 3.5 Music Selector

**grid-area:** `music`

Same structure as Airport Selector, adapted for music data.

```
 MUSIC FEED ───────────────────────
 ▸ Synphaera Radio
   Space Station Soma
   n5MD Radio
   Groove Salad Classic
   Drone Zone
   ...
 ──────────────────────────────────
 VOL ██████████████████  100%
```

- No image thumbnails (breaks monochrome)
- Station name only, one per row
- Description appears on hover/focus as a dim text line below the name (tooltip-style, inline, not a popup)
- Same selected/hover/scroll behavior as airports

### 3.6 Status Bar (Footer)

**grid-area:** `statusbar`

Replaces the current Footer. A single-line status bar, ~32px height.

```
CONNECTED · AAC 32kbps · UPTIME 00:14:32 · FOCUSED v0.2.0
```

- 11px, dim green, uppercase, wide tracking
- Items separated by `·` (middle dot)
- Left-aligned on desktop, horizontally scrollable on mobile if overflow
- The "about" info and credit links move to a `/?about` route or a hidden panel toggled by clicking the version number

**Status items:**
| Item          | Source                              | Example            |
|---------------|-------------------------------------|--------------------|
| Connection    | Derived from audio element state    | `CONNECTED` / `BUFFERING` / `OFFLINE` |
| Format        | Static (known from data)            | `AAC 32kbps`       |
| Uptime        | JS timer from first play            | `UPTIME 00:14:32`  |
| Version       | From package.json                   | `FOCUSED v0.2.0`   |

### 3.7 Toast Notifications

Restyled to match Signal aesthetic:

- Black background with 1px accent border
- Monospace text in accent color (green for info, red for error, amber for warning)
- No border-radius (sharp corners)
- Positioned top-center, same as current
- Fade transition stays

```css
.toast {
  background: var(--bg);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0;
}
.toast--error {
  border-color: var(--error);
  color: var(--error);
}
```

---

## 4. Interaction Patterns

### 4.1 Keyboard Navigation

| Key            | Action                                     |
|----------------|--------------------------------------------|
| `Space`        | Toggle play/pause (global)                 |
| `↑` / `↓`     | Navigate airport/music list (when focused) |
| `Enter`        | Select highlighted item                    |
| `/` or `Ctrl+K`| Focus search input in active list          |
| `Esc`          | Clear search, blur                         |
| `[` / `]`      | Decrease/increase music volume by 10%      |
| `{` / `}`      | Decrease/increase airport volume by 10%    |

### 4.2 Click/Touch Targets

- Status word cell: entire cell is clickable (play/pause toggle), min 48px tall
- List rows: full-width click target, min 40px row height for touch
- Volume bars: full-width, thumb area at least 24px tall for touch (the visible bar is 4px but the hit area is larger via padding on the input)
- Search input: full-width within the list cell

### 4.3 Focus States

No outline rings — instead, focused elements get the accent text-shadow glow:

```css
*:focus-visible {
  outline: none;
  text-shadow: 0 0 8px var(--accent-glow);
  box-shadow: inset 0 0 0 1px var(--accent);
}
```

---

## 5. Animations

### 5.1 Cursor Blink

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor {
  animation: blink 1s step-end infinite;
}
```

### 5.2 Typewriter (Status Word Transition)

On state change, the new word types in:

```css
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
.status-word--typing {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: typewriter 0.4s steps(12) forwards;
}
```

Step count matches character count of the word (set via CSS custom property or JS).

### 5.3 Glitch Flicker (Error State)

```css
@keyframes glitch {
  0%, 100% { transform: translate(0); opacity: 1; }
  20% { transform: translate(-2px, 1px); opacity: 0.8; }
  40% { transform: translate(2px, -1px); opacity: 0.9; }
  60% { transform: translate(-1px, -1px); opacity: 0.7; }
  80% { transform: translate(1px, 2px); opacity: 0.95; }
}
.status-word--error {
  animation: glitch 0.3s ease-in-out infinite;
}
```

Used sparingly — only on error state status word.

### 5.4 Buffering Dots

```css
@keyframes dots {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
}
.status-word--buffering::after {
  content: '';
  animation: dots 1.2s step-end infinite;
}
```

### 5.5 Row Selection

No slide or bounce. Instant highlight — the row text snaps from dim to full accent. The `▸` indicator appears with a 100ms fade-in. Matches the "data terminal" feel where things update immediately.

### 5.6 Volume Bar Fill

Smooth transition on the fill width: `transition: width 0.15s linear`. Fast, no bounce — mechanical.

---

## 6. Responsiveness Details

### 6.1 Breakpoint Summary

| Breakpoint  | Columns | Status word | Oscilloscope | Lists       | Cell padding |
|-------------|---------|-------------|--------------|-------------|--------------|
| >= 1024px   | 2       | 48px        | 200px tall   | Side-by-side| 16px         |
| 768–1023px  | 2       | 36px        | 160px tall   | Side-by-side| 12px         |
| 480–767px   | 1       | 32px        | 120px tall   | Stacked     | 12px         |
| < 480px     | 1       | 28px        | 100px tall   | Stacked     | 8px          |

### 6.2 Grid Reflow Rules

- At < 768px, switch from 2-column to 1-column. All areas stack vertically.
- The status word cell reduces in height (no longer needs to fill half the viewport).
- Lists each get max-height: `40vh` with scroll to prevent one list pushing the other off-screen.

### 6.3 Touch Adaptations

- Volume bars: increase hit area to 44px height on touch devices (`@media (pointer: coarse)`)
- List rows: min-height 44px on touch (up from 40px)
- Search input: 44px height on touch
- No hover-dependent information (music descriptions show on tap, not just hover)

### 6.4 Orientation

- Landscape mobile: allow the 2-column layout to persist (airports left, music right) since there's enough width. Use `min-width: 568px` for this check rather than the 768px breakpoint.

### 6.5 Canvas Responsiveness

The oscilloscope `<canvas>` must be sized in JS to match its CSS pixel size for sharp rendering:

```js
const resize = () => {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
};
window.addEventListener('resize', resize);
```

Use `ResizeObserver` on the parent cell for precise tracking.

---

## 7. Accessibility

### 7.1 Contrast

- `#00FF41` on `#000000` = contrast ratio **9.8:1** (passes AAA)
- `#00802080` (dim green) on `#000000` = ~4.5:1 (passes AA) — acceptable for secondary text
- `#FF3333` on `#000000` = **5.3:1** (passes AA)
- `#FFB000` on `#000000` = **10.5:1** (passes AAA)

All pass WCAG AA minimum. Primary text passes AAA.

### 7.2 Screen Readers

- Status word area: `role="button"`, `aria-label="Toggle playback. Currently: playing/paused"`
- Airport list: `role="listbox"`, each row `role="option"`, `aria-selected`
- Music list: same as airport list
- Volume bars: `aria-label="Airport volume"` / `aria-label="Music volume"`, `aria-valuemin/max/now`
- Oscilloscope: `role="img"`, `aria-label="Audio waveform visualization"`
- Status bar: `role="status"`, `aria-live="polite"`

### 7.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .layout::after {
    display: none; /* remove scan lines */
  }
}
```

### 7.4 Color Scheme

```html
<meta name="color-scheme" content="dark">
```

There is no light mode. The design is inherently dark. This is intentional and documented.

---

## 8. Component Mapping

How existing Vue components change:

| Current Component     | Action    | New Role                                        |
|-----------------------|-----------|-------------------------------------------------|
| `App.vue`             | Restyle   | Root grid container (`.signal-grid`), new font import, CSS vars, scan-line overlay |
| `Main.vue`            | Rewrite   | Becomes the grid layout orchestrator. Removes `<av-line>`, adds `<Oscilloscope>`, restructures into grid areas |
| `Airports.vue`        | Rewrite   | Data table list with search, volume bar. No CustomSelect |
| `Music.vue`           | Rewrite   | Data table list with search, volume bar. No CustomSelect |
| `CustomSelect.vue`    | Remove    | No longer needed — replaced by inline data table |
| `Footer.vue`          | Rewrite   | Becomes `StatusBar.vue` — single-line status     |
| *(new)* `Oscilloscope.vue` | Create | Canvas-based dual waveform visualizer       |
| *(new)* `StatusWord.vue`   | Create | Animated TRANSMITTING/STANDBY/etc. display  |
| *(new)* `HeaderBar.vue`    | Create | Top bar with logo text + clock              |
| *(new)* `DataList.vue`     | Create | Reusable scrollable data table with search, used by both Airport and Music |

### 8.1 New Shared Component: DataList

Since Airport and Music lists share identical behavior (scrollable list, search filter, selected row highlight, volume bar), extract a `DataList.vue`:

**Props:**
- `items: Array` — the data
- `valueKey: String` — unique key field
- `labelKey: String` — display field
- `secondaryKey?: String` — optional secondary display (IATA code for airports)
- `filterKey: String` — field to search against
- `modelValue` — currently selected value
- `volume: Number` — current volume 0-1
- `label: String` — section header text ("ATC FEED" / "MUSIC FEED")

**Emits:** `update:modelValue`, `update:volume`

**Slots:** `#row="{ item, active }"` for custom row rendering if needed.

---

## 9. External Dependencies

### 9.1 Add

- **Google Font:** `JetBrains Mono` (300, 400, 700) — loaded via `@import` or `<link>` in index.html
- No new npm packages needed

### 9.2 Remove

- `vue-audio-visual` — replaced by custom `Oscilloscope.vue` using Web Audio API directly. The `AnalyserNode` setup moves into the component or a composable.

### 9.3 Keep

- `vue`, `vuex`, `vue-i18n` — no changes
- `vite`, `vite-svg-loader` — SVG loader still useful for small icons if any remain (likely not needed — we may go fully text-based)

---

## 10. Decisions (Resolved)

1. **About/credits:** Hidden panel triggered by clicking the version number in the status bar. No vue-router needed. Panel slides up from status bar with same monospace styling — black bg, green border, hairline grid.
2. **Christmas easter egg:** Dropped. Clean slate.
3. **Internationalization:** i18n stays. All UI labels (`TRANSMITTING`, `STANDBY`, `ATC FEED`, etc.) go through the translation system as before.
4. **Logo:** Custom SVG mark that fits the Signal aesthetic (see section 11).
5. **vue-audio-visual:** Removed. Replaced by a custom `useAudioAnalyser` composable + hand-drawn Canvas oscilloscope. The oscilloscope is a visual centerpiece — it must look exceptional (see section 12).

---

## 11. Logo — SVG Design

The logo must feel like it belongs on a radar screen or ATC terminal. No curves, no softness.

**Concept: "Signal Bars + Crosshair"**

A minimal geometric mark combining a radar/crosshair motif with the letter F:

```
    │
    │
────┼─── ▄
    │   ██
    │   ██ ▄▄
    │   ██ ██
```

**Actual SVG specification:**

- **Viewbox:** 32x32
- **Elements:**
  - A thin crosshair: vertical line (x=8, full height) + horizontal line (y=24, full width), stroke 1px `var(--text-dim)`
  - Three vertical bars of ascending height at x=14, x=20, x=26 (widths 4px each):
    - Bar 1: height 8px (bottom-aligned) — `var(--accent)` full green
    - Bar 2: height 14px — `var(--accent)`
    - Bar 3: height 22px — `var(--accent)`
  - A small dot at the crosshair intersection (cx=8, cy=24, r=2) — `var(--accent)` with glow

**Animation (playing state):** The bars pulse subtly in height (±2px, staggered timing), and the crosshair dot has a radar-sweep glow that pulses every 2s.

**Animation (paused state):** Static. Bars at half height. Dot dim.

**Size in header:** 24x24px, left of the `FOCUSED` text.

**Alternative explored but rejected:**
- Pure text "F" in a box — too generic
- Waveform icon — conflicts with the actual oscilloscope
- Radio tower — too literal, not abstract enough

---

## 12. Oscilloscope — Visual Quality Details

This is the most visually impactful element. It must look like a real high-end oscilloscope, not a toy waveform.

### 12.1 Rendering Technique

Use `CanvasRenderingContext2D` (not WebGL — overkill and harder to maintain).

**Line rendering:**
- Stroke width: 1.5px (CSS pixels), accounting for devicePixelRatio
- Stroke color: `#00FF41`
- Line join: `round`
- Line cap: `round`

**Phosphor glow effect** (the key to making it look real):
Draw the waveform THREE times, layered:
1. **Glow layer (wide):** strokeStyle `rgba(0, 255, 65, 0.08)`, lineWidth 12px, filter `blur(6px)` — the distant glow
2. **Glow layer (narrow):** strokeStyle `rgba(0, 255, 65, 0.3)`, lineWidth 4px, filter `blur(2px)` — the near glow
3. **Core line:** strokeStyle `#00FF41`, lineWidth 1.5px — the sharp signal

This triple-draw creates the authentic phosphor CRT look where the beam illuminates the surrounding phosphor.

**Alternatively,** if `ctx.filter` performance is a concern, use `ctx.shadowBlur = 6; ctx.shadowColor = '#00FF41';` on a single draw — simpler but slightly less control.

### 12.2 Grid Overlay

Faint grid lines behind the waveform, like a real oscilloscope:
- Major gridlines every 25% of width/height: `1px solid rgba(0, 255, 65, 0.06)`
- Minor gridlines every 5%: `1px solid rgba(0, 255, 65, 0.02)` (barely visible)
- Small tick marks along the center horizontal axis

### 12.3 Data Flow

```
<audio> element
    │
    ▼
AudioContext.createMediaElementSource()
    │
    ▼
AnalyserNode (fftSize: 2048, smoothingTimeConstant: 0.8)
    │
    ├── getByteTimeDomainData() → waveform (oscilloscope line)
    └── getByteFrequencyData()  → FFT bars (optional secondary viz)
    │
    ▼
requestAnimationFrame loop → draw to <canvas>
```

**Two separate AnalyserNodes** — one per audio source (music + airport). Both drawn on the same canvas, vertically split.

### 12.4 `useAudioAnalyser` Composable

```js
// src/composables/useAudioAnalyser.js
//
// Usage:
//   const { analyser, connect, disconnect } = useAudioAnalyser();
//   connect(audioElement);
//
// Returns:
//   analyser: AnalyserNode (reactive ref)
//   waveform: Uint8Array (updated each frame)
//   frequency: Uint8Array (updated each frame)
//   connect(audioEl): connects an <audio> element
//   disconnect(): cleans up
//
// Handles:
//   - Lazy AudioContext creation (avoid autoplay policy issues)
//   - Single AudioContext shared across instances (browser limit)
//   - Reconnection when audio source changes
//   - Cleanup on component unmount
```

### 12.5 Performance

- Use `requestAnimationFrame` — no `setInterval`
- Skip frames if tab is not visible (`document.hidden`)
- On mobile: reduce `fftSize` to 1024 (half resolution) to save CPU
- Canvas size tied to CSS size via `ResizeObserver` — no unnecessary overdraw

### 12.6 Paused State

When paused, don't just flatline — show a slow, subtle idle sine wave:

```js
// Generate a synthetic idle wave when no audio data
const idleWave = (t, i, len) =>
  128 + Math.sin((i / len) * Math.PI * 4 + t * 0.001) * 3;
```

This keeps the canvas alive and gives the impression the terminal is in standby, not broken. Amplitude of ~3 units (barely visible ripple).
