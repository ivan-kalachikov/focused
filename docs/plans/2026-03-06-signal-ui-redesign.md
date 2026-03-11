# Signal UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **REQUIRED DESIGN SKILL:** Use frontend-design:frontend-design when implementing any visual component.
> **REQUIRED AFTER EACH VISUAL TASK:** Take a Chrome DevTools screenshot and perform thorough pixel-level analysis against the design spec at `docs/design/2026-03-06-signal-concept-refined.md`. Be EXTREMELY critical. Any drift from spec = fix before moving on.

**Goal:** Replace the current minimal dark UI with the "Signal" neo-brutalist ATC design — phosphor green on black, monospace, grid-based, with a custom Canvas oscilloscope.

**Architecture:** CSS Grid layout with named areas, all new leaf components (HeaderBar, StatusWord, DataList, Oscilloscope, StatusBar), shared `useAudioAnalyser` composable for Web Audio API, `vue-audio-visual` removed.

**Tech Stack:** Vue 3, Vuex, vue-i18n, Vite, Canvas 2D, Web Audio API, JetBrains Mono font, CSS custom properties. No new npm deps.

**Design spec:** `docs/design/2026-03-06-signal-concept-refined.md` — THIS IS THE SOURCE OF TRUTH. When in doubt, re-read the spec. Do not improvise.

---

## Quality Gate Protocol

**Every task that produces visual output MUST end with these steps:**

### QG-1: DOM Structure Check
Run a Chrome DevTools `evaluate_script` to verify:
- Correct CSS custom properties are applied on `:root`
- Expected elements exist with correct classes
- Grid areas are assigned correctly
- ARIA attributes present

### QG-2: Computed Style Check
Run Chrome DevTools `evaluate_script` to sample computed styles:
- `font-family` contains `JetBrains Mono`
- `color` values match spec tokens (convert hex to rgb for comparison)
- `font-size`, `letter-spacing`, `text-transform` match the typography table
- `background-color` is `rgb(0, 0, 0)` on body/layout

### QG-3: Screenshot Analysis
Take a Chrome DevTools screenshot and analyze it CRITICALLY against the design spec:
- Is the background pure black? Any unintended grays?
- Are grid lines visible as 1px #111 borders?
- Is ALL text monospace? Any Roboto leaking through?
- Are colors correct phosphor green? Not blue, not teal, not lime?
- Is spacing consistent with 4px base unit?
- Are there any rounded corners? (There should be ZERO)
- Is the scan-line overlay barely visible?

### QG-4: Responsive Check (when applicable)
Resize to each breakpoint and screenshot:
- 1280px (desktop)
- 768px (tablet landscape)
- 480px (mobile portrait)
- 375px (small mobile)

Verify grid reflows correctly at each size.

**If ANY check fails: fix immediately. Do not proceed to next task.**

---

## Phase 0: Setup

### Task 0.1: Start Dev Server

**Step 1: Install deps and start dev server**

Run: `cd /home/ivan/projects/focused && npm install && npm run dev`

Keep running in background. Note the local URL (likely `http://localhost:5173`).

**Step 2: Open in Chrome DevTools**

Use `mcp__chrome-devtools__navigate_page` to open the dev server URL.
Use `mcp__chrome-devtools__take_screenshot` to capture the CURRENT state as a baseline.

**Step 3: Commit baseline**

No code changes yet — just confirm everything works.

---

## Phase 1: Design System Foundation

### Task 1.1: CSS Custom Properties + Font

**Files:**
- Modify: `src/App.vue` (style section)
- Modify: `index.html` (add font link)

**Step 1: Add JetBrains Mono font to index.html**

Add to `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap" rel="stylesheet">
<meta name="color-scheme" content="dark">
```

**Step 2: Replace ALL styles in App.vue**

Replace the entire `<style>` block. Define CSS custom properties on `:root`:

```css
:root {
  --bg: #000000;
  --surface: #0A0A0A;
  --grid-line: #111111;
  --grid-line-dim: #080808;
  --text-primary: #00FF41;
  --text-dim: #00802080;
  --text-muted: #1A3A1F;
  --accent: #00FF41;
  --accent-glow: #00FF4133;
  --error: #FF3333;
  --warning: #FFB000;
  --white: #CCCCCC;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace;
  --cell-padding: 12px;
}
```

Global resets — note ALL text must be monospace, background MUST be #000:

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
  font-family: var(--font-mono);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  font-size: 14px;
  letter-spacing: 0.02em;
  height: 100%;
}

a {
  color: var(--white);
  text-decoration: none;
}
a:hover, a:active {
  color: var(--text-primary);
}
```

Layout grid — this is the core structural element:

```css
.layout {
  min-height: 100vh;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto auto;
  grid-template-areas:
    "header    header"
    "status    visualizer"
    "airports  music"
    "statusbar statusbar";
  gap: 1px;
  background: var(--grid-line);
}

.layout > * {
  background: var(--bg);
}
```

Scan-line overlay:

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

Focus states:

```css
*:focus-visible {
  outline: none;
  text-shadow: 0 0 8px var(--accent-glow);
  box-shadow: inset 0 0 0 1px var(--accent);
}
```

Reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .layout::after {
    display: none;
  }
}
```

Responsive breakpoints:

```css
@media (max-width: 767px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "status"
      "visualizer"
      "airports"
      "music"
      "statusbar";
  }
  :root {
    --cell-padding: 8px;
  }
}

@media (pointer: coarse) {
  .layout {
    --touch-min-height: 44px;
  }
}
```

Toast restyle (keep in App.vue):

```css
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  background: var(--bg);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0;
  z-index: 10000;
}

.toast--error {
  border-color: var(--error);
  color: var(--error);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

**Step 3: Update App.vue template**

Change `.layout` div — remove `<Main />` and `<Footer />` temporarily, replace with placeholder grid areas so we can verify the grid:

```html
<template>
  <div class="layout">
    <div style="grid-area: header; padding: var(--cell-padding);">HEADER</div>
    <div style="grid-area: status; padding: var(--cell-padding);">STATUS</div>
    <div style="grid-area: visualizer; padding: var(--cell-padding);">VISUALIZER</div>
    <div style="grid-area: airports; padding: var(--cell-padding);">AIRPORTS</div>
    <div style="grid-area: music; padding: var(--cell-padding);">MUSIC</div>
    <div style="grid-area: statusbar; padding: var(--cell-padding);">STATUSBAR</div>
    <transition name="fade">
      <div v-if="toast" :class="['toast', `toast--${toast.type}`]">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>
```

Remove the `<Main />` and `<Footer />` component imports from `<script>` temporarily (keep the vuex mapState/mapMutations for toast).

**Step 4: Remove old font import**

Delete the line `@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');` from App.vue styles.

**Step 5: Verify**

Run: `npm run dev` (should already be running)

**QUALITY GATE 1.1:**

QG-1 — DOM check via `evaluate_script`:
```js
(() => {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  return {
    bg: cs.getPropertyValue('--bg').trim(),
    accent: cs.getPropertyValue('--accent').trim(),
    fontMono: cs.getPropertyValue('--font-mono').trim(),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    appFont: getComputedStyle(document.getElementById('app')).fontFamily,
    gridAreas: getComputedStyle(document.querySelector('.layout')).gridTemplateAreas,
    gridCols: getComputedStyle(document.querySelector('.layout')).gridTemplateColumns,
  };
})()
```

**Expected results:**
- `bg` = `#000000`
- `accent` = `#00FF41`
- `bodyBg` = `rgb(0, 0, 0)`
- `appFont` contains `JetBrains Mono`
- `gridAreas` contains `header`, `status`, `visualizer`, `airports`, `music`, `statusbar`
- `gridCols` shows two equal columns

QG-3 — Screenshot:
- Pure black background
- Green monospace text in 6 grid cells
- 1px #111 grid lines visible between cells
- Header spans full width
- Statusbar spans full width
- Status + Visualizer side by side
- Airports + Music side by side
- Scan-line overlay barely visible (zoom to check)

**Step 6: Commit**

```bash
git add index.html src/App.vue
git commit -m "feat(signal): design system foundation — CSS vars, grid layout, JetBrains Mono"
```

---

## Phase 2: Shell Components

### Task 2.1: HeaderBar Component

**Files:**
- Create: `src/components/HeaderBar.vue`

**@frontend-design:frontend-design** — invoke this skill for the implementation.

**Step 1: Create HeaderBar.vue**

```vue
<template>
  <header class="header-bar">
    <div class="header-bar__left">
      <SignalLogo :playing="appStatus === 'playing'" />
      <span class="header-bar__title">FOCUSED</span>
    </div>
    <div class="header-bar__right">
      <span class="header-bar__clock">{{ clock }}</span>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
// SignalLogo will be created in Task 6.1. Use placeholder for now:
const SignalLogo = { template: '<span class="logo-placeholder">█</span>', props: ['playing'] };

export default {
  name: 'HeaderBar',
  components: { SignalLogo },
  data() {
    return { clock: '' };
  },
  computed: mapState(['appStatus']),
  mounted() {
    this.updateClock();
    this.clockInterval = setInterval(this.updateClock, 1000);
  },
  beforeUnmount() {
    clearInterval(this.clockInterval);
  },
  methods: {
    updateClock() {
      const now = new Date();
      this.clock = now.toTimeString().slice(0, 8); // HH:MM:SS
    },
  },
};
</script>

<style>
.header-bar {
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px var(--cell-padding);
  height: 40px;
}

.header-bar__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-bar__title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent);
}

.header-bar__right {
  display: flex;
  align-items: center;
}

.header-bar__clock {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}

.logo-placeholder {
  color: var(--accent);
  font-size: 16px;
}
</style>
```

**Step 2: Wire into App.vue**

Replace the header placeholder div with `<HeaderBar />`. Import and register the component.

**QUALITY GATE 2.1:**

QG-2 — Computed style check:
```js
(() => {
  const title = document.querySelector('.header-bar__title');
  const clock = document.querySelector('.header-bar__clock');
  if (!title || !clock) return 'ELEMENTS MISSING';
  const ts = getComputedStyle(title);
  const cs = getComputedStyle(clock);
  return {
    titleFont: ts.fontFamily,
    titleSize: ts.fontSize,
    titleWeight: ts.fontWeight,
    titleColor: ts.color,
    titleTransform: ts.textTransform,
    titleSpacing: ts.letterSpacing,
    clockColor: cs.color,
    clockSize: cs.fontSize,
    headerHeight: getComputedStyle(document.querySelector('.header-bar')).height,
  };
})()
```

**Expected:**
- `titleFont` contains `JetBrains Mono`
- `titleSize` = `14px`
- `titleWeight` = `700`
- `titleColor` = `rgb(0, 255, 65)` (that's #00FF41)
- `titleTransform` = `uppercase`
- `titleSpacing` approximately `2.1px` (0.15em of 14px)
- `clockColor` has reduced opacity green
- `headerHeight` = `40px`

QG-3 — Screenshot: Header bar at top, "FOCUSED" left in bright green, clock right in dim green, monospace, no rounded corners, no Roboto.

**Step 3: Commit**

```bash
git add src/components/HeaderBar.vue src/App.vue
git commit -m "feat(signal): add HeaderBar with live clock"
```

---

### Task 2.2: StatusWord Component

**Files:**
- Create: `src/components/StatusWord.vue`

**@frontend-design:frontend-design** — invoke for implementation.

**Step 1: Create StatusWord.vue**

Spec reference: Section 3.2, Section 5.1-5.4

This component displays the large clickable status text with cursor blink, typewriter transition, and state-dependent colors.

```vue
<template>
  <div
    class="status-word"
    :class="statusClass"
    role="button"
    tabindex="0"
    :aria-label="ariaLabel"
    @click="$emit('toggle')"
    @keydown.space.prevent="$emit('toggle')"
    @keydown.enter.prevent="$emit('toggle')"
  >
    <span class="status-word__text" :key="displayText">{{ displayText }}</span>
    <span class="status-word__cursor">█</span>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'StatusWord',
  props: {
    appStatus: { type: String, required: true },   // 'playing' | 'paused'
    musicStatus: { type: String, default: 'idle' },
    airportStatus: { type: String, default: 'idle' },
  },
  emits: ['toggle'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: {
    effectiveState() {
      if (this.musicStatus === 'failed' && this.airportStatus === 'failed') return 'error';
      if (this.appStatus === 'playing' && (this.musicStatus === 'pending' || this.airportStatus === 'pending')) return 'buffering';
      if (this.appStatus === 'playing') return 'playing';
      return 'paused';
    },
    displayText() {
      switch (this.effectiveState) {
        case 'playing': return this.t('ui.statusTransmitting');
        case 'buffering': return this.t('ui.statusBuffering');
        case 'error': return this.t('ui.statusSignalLost');
        default: return this.t('ui.statusStandby');
      }
    },
    statusClass() {
      return `status-word--${this.effectiveState}`;
    },
    ariaLabel() {
      const state = this.appStatus === 'playing' ? this.t('ui.pause') : this.t('ui.play');
      return `${state}`;
    },
  },
};
</script>

<style>
.status-word {
  grid-area: status;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--cell-padding);
  cursor: pointer;
  user-select: none;
  min-height: 120px;
}

.status-word__text {
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}

.status-word__cursor {
  font-size: 48px;
  font-weight: 700;
  animation: blink 1s step-end infinite;
}

/* State colors */
.status-word--paused .status-word__text,
.status-word--paused .status-word__cursor {
  color: var(--text-dim);
}

.status-word--playing .status-word__text,
.status-word--playing .status-word__cursor {
  color: var(--text-primary);
  text-shadow: 0 0 20px var(--accent-glow);
}

.status-word--buffering .status-word__text,
.status-word--buffering .status-word__cursor {
  color: var(--warning);
}

.status-word--error .status-word__text,
.status-word--error .status-word__cursor {
  color: var(--error);
}

/* Animations */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Typewriter — triggered by :key change re-mounting the span */
.status-word__text {
  animation: typewriter 0.4s steps(12) forwards;
}

@keyframes typewriter {
  from { max-width: 0; }
  to { max-width: 100vw; }
}

/* Glitch for error */
.status-word--error .status-word__text {
  animation: glitch 0.3s ease-in-out infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); opacity: 1; }
  20% { transform: translate(-2px, 1px); opacity: 0.8; }
  40% { transform: translate(2px, -1px); opacity: 0.9; }
  60% { transform: translate(-1px, -1px); opacity: 0.7; }
  80% { transform: translate(1px, 2px); opacity: 0.95; }
}

/* Responsive */
@media (max-width: 1023px) {
  .status-word__text,
  .status-word__cursor {
    font-size: 36px;
  }
}

@media (max-width: 767px) {
  .status-word__text,
  .status-word__cursor {
    font-size: 32px;
  }
  .status-word {
    min-height: 80px;
  }
}

@media (max-width: 479px) {
  .status-word__text,
  .status-word__cursor {
    font-size: 28px;
    letter-spacing: 0.2em;
  }
  .status-word {
    min-height: 64px;
  }
}
</style>
```

**Step 2: Wire into App.vue**

Replace the status placeholder div with `<StatusWord>`. Pass props from Vuex state.

**Step 3: Add i18n keys**

Add to ALL language objects in `src/locales/messages.js`:

```js
// English:
statusTransmitting: 'TRANSMITTING',
statusStandby: 'STANDBY',
statusBuffering: 'BUFFERING',
statusSignalLost: 'SIGNAL LOST',

// Russian:
statusTransmitting: 'ПЕРЕДАЧА',
statusStandby: 'ОЖИДАНИЕ',
statusBuffering: 'ЗАГРУЗКА',
statusSignalLost: 'НЕТ СИГНАЛА',

// Spanish:
statusTransmitting: 'TRANSMITIENDO',
statusStandby: 'EN ESPERA',
statusBuffering: 'CARGANDO',
statusSignalLost: 'SEÑAL PERDIDA',

// French:
statusTransmitting: 'TRANSMISSION',
statusStandby: 'EN ATTENTE',
statusBuffering: 'CHARGEMENT',
statusSignalLost: 'SIGNAL PERDU',

// German:
statusTransmitting: 'ÜBERTRAGUNG',
statusStandby: 'BEREIT',
statusBuffering: 'LADEN',
statusSignalLost: 'KEIN SIGNAL',

// Portuguese:
statusTransmitting: 'TRANSMITINDO',
statusStandby: 'EM ESPERA',
statusBuffering: 'CARREGANDO',
statusSignalLost: 'SINAL PERDIDO',

// Chinese:
statusTransmitting: '传输中',
statusStandby: '待机',
statusBuffering: '缓冲中',
statusSignalLost: '信号丢失',

// Japanese:
statusTransmitting: '送信中',
statusStandby: 'スタンバイ',
statusBuffering: '読込中',
statusSignalLost: '信号喪失',

// Korean:
statusTransmitting: '송신 중',
statusStandby: '대기',
statusBuffering: '버퍼링',
statusSignalLost: '신호 없음',
```

**QUALITY GATE 2.2:**

QG-2 — Computed style check:
```js
(() => {
  const word = document.querySelector('.status-word__text');
  const cursor = document.querySelector('.status-word__cursor');
  const cell = document.querySelector('.status-word');
  if (!word) return 'STATUS WORD MISSING';
  const ws = getComputedStyle(word);
  return {
    fontSize: ws.fontSize,
    fontWeight: ws.fontWeight,
    textTransform: ws.textTransform,
    letterSpacing: ws.letterSpacing,
    color: ws.color,
    cellDisplay: getComputedStyle(cell).display,
    cellAlignItems: getComputedStyle(cell).alignItems,
    cellJustifyContent: getComputedStyle(cell).justifyContent,
    cellGridArea: getComputedStyle(cell).gridArea,
    cursorExists: !!cursor,
    role: cell.getAttribute('role'),
    ariaLabel: cell.getAttribute('aria-label'),
    tabindex: cell.getAttribute('tabindex'),
  };
})()
```

**Expected:**
- `fontSize` = `48px`
- `fontWeight` = `700`
- `textTransform` = `uppercase`
- `letterSpacing` approx `14.4px` (0.3em of 48px)
- `color` = dim green (paused) or bright green (playing)
- `role` = `button`, `tabindex` = `0`
- Grid area = `status`

QG-3 — Screenshot: Large "STANDBY" text centered in left cell, dim green, blinking cursor visible (take 2 screenshots 500ms apart to verify blink). No Roboto. No rounded shapes.

**Step 4: Commit**

```bash
git add src/components/StatusWord.vue src/App.vue src/locales/messages.js
git commit -m "feat(signal): add StatusWord with typewriter, blink, and state colors"
```

---

### Task 2.3: StatusBar Component

**Files:**
- Create: `src/components/StatusBar.vue`

**@frontend-design:frontend-design** — invoke for implementation.

**Step 1: Create StatusBar.vue**

Spec reference: Section 3.6, Section 10 decision #1 (about panel)

```vue
<template>
  <footer class="status-bar">
    <div class="status-bar__items">
      <span :class="connectionClass">{{ connectionText }}</span>
      <span class="status-bar__separator">·</span>
      <span>AAC 32kbps</span>
      <span class="status-bar__separator">·</span>
      <span>{{ t('ui.statusUptime') }} {{ uptime }}</span>
      <span class="status-bar__separator">·</span>
      <span class="status-bar__version" @click="showAbout = !showAbout">
        FOCUSED v0.2.0
      </span>
    </div>
    <div v-if="showAbout" class="status-bar__about">
      <p>{{ t('ui.aboutText') }}</p>
      <p>
        {{ t('ui.frontendBy') }}
        <a href="https://github.com/Ivankalachikov/" target="_blank" rel="noopener">
          {{ t('authors.kalachikov') }}
        </a>
      </p>
      <p>
        {{ t('ui.designBy') }}
        <a href="https://www.behance.net/tatiana_emelyanova" target="_blank" rel="noopener">
          {{ t('authors.emelyanova') }}
        </a>
      </p>
      <p>
        {{ t('ui.inspiredBy') }}
        <a href="https://listentothe.cloud" target="_blank" rel="noopener">listentothe.cloud</a>
      </p>
      <p>
        {{ t('ui.thanksTo') }}
        <a href="https://somafm.com" target="_blank" rel="noopener">somafm.com</a>
        {{ t('ui.forMusic') }},
        <a href="https://www.liveatc.net" target="_blank" rel="noopener">liveatc.net</a>
        {{ t('ui.forDispatcherTalks') }}
      </p>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex';
import { useI18n } from 'vue-i18n';

export default {
  name: 'StatusBar',
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      showAbout: false,
      startTime: null,
      uptime: '00:00:00',
      uptimeInterval: null,
    };
  },
  computed: {
    ...mapState({
      appStatus: (state) => state.appStatus,
      musicStatus: (state) => state.music.status,
      airportStatus: (state) => state.airports.status,
    }),
    connectionText() {
      if (this.appStatus === 'paused') return 'OFFLINE';
      if (this.musicStatus === 'pending' || this.airportStatus === 'pending') return 'BUFFERING';
      if (this.musicStatus === 'failed' && this.airportStatus === 'failed') return 'DISCONNECTED';
      return 'CONNECTED';
    },
    connectionClass() {
      return {
        'status-bar__connection': true,
        'status-bar__connection--ok': this.connectionText === 'CONNECTED',
        'status-bar__connection--warn': this.connectionText === 'BUFFERING',
        'status-bar__connection--off': this.connectionText === 'OFFLINE' || this.connectionText === 'DISCONNECTED',
      };
    },
  },
  watch: {
    appStatus(val) {
      if (val === 'playing' && !this.startTime) {
        this.startTime = Date.now();
        this.uptimeInterval = setInterval(this.updateUptime, 1000);
      }
    },
  },
  beforeUnmount() {
    if (this.uptimeInterval) clearInterval(this.uptimeInterval);
  },
  methods: {
    updateUptime() {
      if (!this.startTime) return;
      const diff = Math.floor((Date.now() - this.startTime) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const s = String(diff % 60).padStart(2, '0');
      this.uptime = `${h}:${m}:${s}`;
    },
  },
};
</script>

<style>
.status-bar {
  grid-area: statusbar;
  padding: 6px var(--cell-padding);
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  position: relative;
}

.status-bar__items {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  white-space: nowrap;
}

.status-bar__separator {
  margin: 0 8px;
}

.status-bar__version {
  cursor: pointer;
}
.status-bar__version:hover {
  color: var(--text-primary);
}

.status-bar__connection--ok {
  color: var(--text-primary);
}
.status-bar__connection--warn {
  color: var(--warning);
}
.status-bar__connection--off {
  color: var(--text-muted);
}

.status-bar__about {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: var(--bg);
  border-top: 1px solid var(--grid-line);
  padding: var(--cell-padding);
  z-index: 100;
}

.status-bar__about p {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--text-dim);
  text-transform: none;
}
</style>
```

**Step 2: Add i18n key for uptime label**

Add `statusUptime: 'UPTIME'` to English, and translate for all 9 languages.

**Step 3: Wire into App.vue**

Replace statusbar placeholder.

**QUALITY GATE 2.3:**

QG-2 — check font-size 11px, uppercase, letter-spacing, grid-area.
QG-3 — Screenshot: single-line bar at bottom, dim green text, items separated by `·`. Version clickable. No rounded corners. Border-radius 0.

**Step 4: Commit**

```bash
git add src/components/StatusBar.vue src/App.vue src/locales/messages.js
git commit -m "feat(signal): add StatusBar with connection status, uptime, about panel"
```

---

## Phase 3: DataList Component

### Task 3.1: DataList — Shared Scrollable List

**Files:**
- Create: `src/components/DataList.vue`

**@frontend-design:frontend-design** — invoke for implementation.

**Step 1: Create DataList.vue**

Spec reference: Section 3.4, 3.5, 8.1

This is the reusable list component used by both Airports and Music.

```vue
<template>
  <div class="data-list">
    <div class="data-list__header">
      <span class="data-list__label">{{ label }}</span>
    </div>
    <div class="data-list__search">
      <span class="data-list__prompt">&gt;</span>
      <input
        ref="searchInput"
        v-model="query"
        class="data-list__search-input"
        :placeholder="t('ui.search')"
        @keydown.esc="query = ''"
      />
    </div>
    <div class="data-list__scroll" role="listbox" :aria-label="label">
      <div
        v-for="item in filteredItems"
        :key="item[valueKey]"
        class="data-list__row"
        :class="{ 'data-list__row--active': item[valueKey] === modelValue }"
        role="option"
        :aria-selected="item[valueKey] === modelValue"
        tabindex="0"
        @click="$emit('update:modelValue', item[valueKey])"
        @keydown.enter.prevent="$emit('update:modelValue', item[valueKey])"
      >
        <span class="data-list__indicator">{{ item[valueKey] === modelValue ? '▸' : '\u00A0' }}</span>
        <slot name="row" :item="item" :active="item[valueKey] === modelValue">
          {{ item[labelKey] }}
        </slot>
      </div>
      <div v-if="filteredItems.length === 0" class="data-list__empty">
        {{ t('ui.noResults') }}
      </div>
    </div>
    <div class="data-list__volume">
      <span class="data-list__vol-label">VOL</span>
      <input
        type="range"
        class="data-list__vol-range"
        min="0"
        max="100"
        :value="Math.round(volume * 100)"
        :aria-label="volumeAriaLabel"
        @input="$emit('update:volume', Number($event.target.value) / 100)"
      />
      <span class="data-list__vol-pct">{{ Math.round(volume * 100) }}%</span>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'DataList',
  props: {
    items: { type: Array, required: true },
    valueKey: { type: String, required: true },
    labelKey: { type: String, required: true },
    filterKey: { type: String, required: true },
    modelValue: { default: null },
    volume: { type: Number, default: 1 },
    label: { type: String, required: true },
    volumeAriaLabel: { type: String, default: 'Volume' },
  },
  emits: ['update:modelValue', 'update:volume'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return { query: '' };
  },
  computed: {
    filteredItems() {
      if (!this.query) return this.items;
      const q = this.query.toLowerCase();
      return this.items.filter((item) =>
        String(item[this.filterKey]).toLowerCase().includes(q)
      );
    },
  },
};
</script>

<style>
.data-list {
  display: flex;
  flex-direction: column;
  padding: var(--cell-padding);
  overflow: hidden;
}

.data-list__header {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--grid-line);
  margin-bottom: 4px;
}

.data-list__label {
  font-size: 11px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-dim);
}

.data-list__search {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  border-bottom: 1px solid var(--grid-line);
}

.data-list__prompt {
  font-size: 14px;
  color: var(--text-dim);
  flex-shrink: 0;
}

.data-list__search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.02em;
  padding: 4px 0;
}

.data-list__search-input::placeholder {
  color: var(--text-muted);
}

.data-list__scroll {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
}

@media (max-width: 767px) {
  .data-list__scroll {
    max-height: 40vh;
  }
}

.data-list__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  min-height: 40px;
  cursor: pointer;
  color: var(--text-dim);
  transition: color 0.1s;
}

@media (pointer: coarse) {
  .data-list__row {
    min-height: 44px;
  }
}

.data-list__row:hover {
  color: var(--text-primary);
}

.data-list__row--active {
  color: var(--text-primary);
}

.data-list__indicator {
  flex-shrink: 0;
  width: 12px;
  font-size: 14px;
  color: var(--accent);
  opacity: 0;
  transition: opacity 0.1s;
}

.data-list__row--active .data-list__indicator {
  opacity: 1;
}

.data-list__empty {
  padding: 12px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
}

/* Scrollbar */
.data-list__scroll::-webkit-scrollbar {
  width: 4px;
}
.data-list__scroll::-webkit-scrollbar-track {
  background: var(--bg);
}
.data-list__scroll::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 0;
}

/* Volume */
.data-list__volume {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--grid-line);
  margin-top: 8px;
}

.data-list__vol-label {
  font-size: 11px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  flex-shrink: 0;
}

.data-list__vol-range {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 4px;
  background: var(--grid-line);
  border-radius: 0;
  outline: none;
  cursor: pointer;
}

.data-list__vol-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2px;
  height: 16px;
  background: var(--accent);
  border-radius: 0;
  cursor: pointer;
}

.data-list__vol-range::-moz-range-thumb {
  width: 2px;
  height: 16px;
  background: var(--accent);
  border-radius: 0;
  cursor: pointer;
  border: none;
}

/* Track fill (accent color up to thumb) — Webkit only, Firefox uses ::-moz-range-progress */
.data-list__vol-range::-webkit-slider-runnable-track {
  height: 4px;
  background: linear-gradient(
    to right,
    var(--accent) 0%,
    var(--accent) var(--vol-pct, 100%),
    var(--grid-line) var(--vol-pct, 100%),
    var(--grid-line) 100%
  );
}

.data-list__vol-pct {
  font-size: 11px;
  color: var(--text-dim);
  min-width: 36px;
  text-align: right;
}

@media (pointer: coarse) {
  .data-list__vol-range {
    height: 8px;
    padding: 18px 0;
  }
}
</style>
```

**Step 2: Add i18n keys**

Add `search: 'search...'` and `noResults: 'NO RESULTS'` to all languages.

**QUALITY GATE 3.1:**

This component is not yet mounted in the grid — it will be tested in Task 3.2/3.3 when Airports/Music are wired.

**Step 3: Commit**

```bash
git add src/components/DataList.vue src/locales/messages.js
git commit -m "feat(signal): add DataList reusable component with search, scroll, volume"
```

---

### Task 3.2: Rewrite Airports.vue

**Files:**
- Rewrite: `src/components/Airports.vue`

**Step 1: Rewrite Airports.vue to use DataList**

```vue
<template>
  <DataList
    class="airports-list"
    :items="airports"
    value-key="codeIATA"
    label-key="city"
    filter-key="city"
    :model-value="currentAirportCode"
    :volume="airportVolume"
    :label="t('ui.atcFeed')"
    :volume-aria-label="t('ui.airportVolume')"
    @update:model-value="setCurrentAirportCode"
    @update:volume="setAirportVolume"
  >
    <template #row="{ item, active }">
      <span class="airports-list__iata">{{ item.codeIATA }}</span>
      <span class="airports-list__city">{{ item.city }}</span>
      <span class="airports-list__country">{{ item.countryCode.toUpperCase() }}</span>
    </template>
  </DataList>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import DataList from './DataList.vue';

export default {
  name: 'Airports',
  components: { DataList },
  props: ['audio'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: mapState({
    airports: (state) => state.airports.list,
    currentAirportCode: (state) => state.airports.currentCode,
    airportVolume: (state) => state.airports.volume,
    airportStatus: (state) => state.airports.status,
    appStatus: (state) => state.appStatus,
  }),
  watch: {
    airportVolume(newVal) {
      if (this.audio) this.audio.volume = newVal;
    },
  },
  beforeUpdate() {
    if (this.audio) {
      this.audio.addEventListener('waiting', this.setPending);
      this.audio.addEventListener('emptied', this.setPending);
      this.audio.addEventListener('loadeddata', this.setReady);
    }
  },
  beforeUnmount() {
    if (this.audio) {
      this.audio.removeEventListener('waiting', this.setPending);
      this.audio.removeEventListener('emptied', this.setPending);
      this.audio.removeEventListener('loadeddata', this.setReady);
    }
  },
  methods: {
    ...mapMutations(['setCurrentAirportCode', 'setAirportStatus', 'setAirportVolume']),
    setPending() { this.setAirportStatus('pending'); },
    setReady() { this.setAirportStatus('ready'); },
  },
};
</script>

<style>
.airports-list {
  grid-area: airports;
}

.airports-list__iata {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  min-width: 48px;
}

.airports-list__city {
  font-size: 14px;
  flex: 1;
}

.airports-list__country {
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
}
</style>
```

**Step 2: Add i18n keys**

Add `atcFeed: 'ATC FEED'` and `airportVolume: 'Airport volume'` to all 9 languages.

**Step 3: Wire into App.vue**

Replace the airports placeholder with `<Airports :audio="..." />`. (Audio refs will come from Main.vue later — for now pass `null`.)

**QUALITY GATE 3.2:**

QG-2 — Check:
```js
(() => {
  const rows = document.querySelectorAll('.data-list__row');
  const activeRow = document.querySelector('.data-list__row--active');
  const label = document.querySelector('.airports-list .data-list__label');
  const iata = document.querySelector('.airports-list__iata');
  if (!rows.length) return 'NO ROWS FOUND';
  return {
    rowCount: rows.length,
    hasActiveRow: !!activeRow,
    labelText: label?.textContent,
    iataFontSize: iata ? getComputedStyle(iata).fontSize : 'N/A',
    iataFontWeight: iata ? getComputedStyle(iata).fontWeight : 'N/A',
    gridArea: getComputedStyle(document.querySelector('.airports-list')).gridArea,
    searchInputExists: !!document.querySelector('.data-list__search-input'),
    volumeExists: !!document.querySelector('.data-list__vol-range'),
    listboxRole: document.querySelector('.data-list__scroll')?.getAttribute('role'),
  };
})()
```

**Expected:**
- `rowCount` > 0 (all airports visible)
- Active row highlighted
- IATA font: 16px, weight 700
- Grid area contains `airports`
- Search input exists, volume slider exists
- `role="listbox"` present

QG-3 — Screenshot: Visible scrollable list with IATA codes, city names, country codes. Selected row bright green with `▸` indicator. Search prompt `>` at top. Volume bar at bottom with percentage. NO flags. NO images. NO rounded corners. All text monospace.

**Step 4: Commit**

```bash
git add src/components/Airports.vue src/App.vue src/locales/messages.js
git commit -m "feat(signal): rewrite Airports as DataList-based scrollable table"
```

---

### Task 3.3: Rewrite Music.vue

**Files:**
- Rewrite: `src/components/Music.vue`

**Step 1: Rewrite Music.vue to use DataList**

Same pattern as Airports, but simpler rows (name only, description on hover).

```vue
<template>
  <DataList
    class="music-list"
    :items="musicArray"
    value-key="id"
    label-key="name"
    filter-key="name"
    :model-value="currentMusicId"
    :volume="musicVolume"
    :label="t('ui.musicFeed')"
    :volume-aria-label="t('ui.musicVolume')"
    @update:model-value="setCurrentMusicId"
    @update:volume="setMusicVolume"
  >
    <template #row="{ item, active }">
      <div class="music-list__info">
        <span class="music-list__name">{{ item.name }}</span>
        <span v-if="active" class="music-list__desc">{{ item.description }}</span>
      </div>
    </template>
  </DataList>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import DataList from './DataList.vue';

export default {
  name: 'Music',
  components: { DataList },
  props: ['audio'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: {
    ...mapState({
      music: (state) => state.music.list,
      musicVolume: (state) => state.music.volume,
      currentMusicId: (state) => state.music.currentId,
      musicStatus: (state) => state.music.status,
      appStatus: (state) => state.appStatus,
    }),
    // music is an array in store, ensure it's iterable
    musicArray() {
      return Array.isArray(this.music) ? this.music : Object.values(this.music);
    },
  },
  watch: {
    musicVolume(newVal) {
      if (this.audio) this.audio.volume = newVal;
    },
  },
  beforeUpdate() {
    if (this.audio) {
      this.audio.addEventListener('waiting', this.setPending);
      this.audio.addEventListener('emptied', this.setPending);
      this.audio.addEventListener('loadeddata', this.setReady);
    }
  },
  beforeUnmount() {
    if (this.audio) {
      this.audio.removeEventListener('waiting', this.setPending);
      this.audio.removeEventListener('emptied', this.setPending);
      this.audio.removeEventListener('loadeddata', this.setReady);
    }
  },
  methods: {
    ...mapMutations(['setCurrentMusicId', 'setMusicStatus', 'setMusicVolume']),
    setPending() { this.setMusicStatus('pending'); },
    setReady() { this.setMusicStatus('ready'); },
  },
};
</script>

<style>
.music-list {
  grid-area: music;
}

.music-list__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.music-list__name {
  font-size: 14px;
}

.music-list__desc {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 300;
}
</style>
```

**Step 2: Add i18n keys**

Add `musicFeed: 'MUSIC FEED'` and `musicVolume: 'Music volume'` to all 9 languages.

**QUALITY GATE 3.3:**

Same checks as 3.2 but for music grid area. Screenshot verifying: names only (no images), description visible only for active item, monospace throughout.

**Step 3: Commit**

```bash
git add src/components/Music.vue src/App.vue src/locales/messages.js
git commit -m "feat(signal): rewrite Music as DataList-based scrollable table"
```

---

## Phase 4: Audio Engine

### Task 4.1: useAudioAnalyser Composable

**Files:**
- Create: `src/composables/useAudioAnalyser.js`

Spec reference: Section 12.3, 12.4

**Step 1: Create the composable**

```js
// Shared AudioContext singleton (browser limits to ~6 contexts)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// WeakMap to avoid re-creating MediaElementSource for same <audio>
const sourceMap = new WeakMap();

export function useAudioAnalyser(options = {}) {
  const {
    fftSize = 2048,
    smoothingTimeConstant = 0.8,
  } = options;

  let analyser = null;
  let source = null;
  const waveform = new Uint8Array(fftSize / 2);
  const frequency = new Uint8Array(fftSize / 2);

  function connect(audioElement) {
    if (!audioElement) return;

    const ctx = getAudioContext();

    // Reuse existing MediaElementSource if already created for this element
    if (sourceMap.has(audioElement)) {
      source = sourceMap.get(audioElement);
    } else {
      source = ctx.createMediaElementSource(audioElement);
      sourceMap.set(audioElement, source);
    }

    analyser = ctx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothingTimeConstant;

    source.connect(analyser);
    analyser.connect(ctx.destination);
  }

  function disconnect() {
    if (analyser) {
      try { analyser.disconnect(); } catch (e) { /* already disconnected */ }
      analyser = null;
    }
  }

  function getWaveform() {
    if (analyser) {
      analyser.getByteTimeDomainData(waveform);
    } else {
      waveform.fill(128); // silence
    }
    return waveform;
  }

  function getFrequency() {
    if (analyser) {
      analyser.getByteFrequencyData(frequency);
    } else {
      frequency.fill(0);
    }
    return frequency;
  }

  return {
    connect,
    disconnect,
    getWaveform,
    getFrequency,
  };
}
```

**Step 2: No visual check needed** — this is a pure JS composable. Tested when Oscilloscope uses it.

**Step 3: Commit**

```bash
git add src/composables/useAudioAnalyser.js
git commit -m "feat(signal): add useAudioAnalyser composable for Web Audio API"
```

---

### Task 4.2: Oscilloscope Component

**Files:**
- Create: `src/components/Oscilloscope.vue`

**@frontend-design:frontend-design** — invoke for implementation. THIS IS THE VISUAL CENTERPIECE — extra care.

Spec reference: Section 3.3, Section 12 (all subsections)

**Step 1: Create Oscilloscope.vue**

The component must implement:
- Dual waveform (ATC top, Music bottom)
- Triple-draw phosphor glow effect
- Oscilloscope grid overlay
- dB readout
- `ATC` / `MUS` labels
- Idle sine wave when paused
- ResizeObserver for sharp canvas scaling

```vue
<template>
  <div class="oscilloscope" role="img" :aria-label="t('ui.waveformLabel')">
    <canvas ref="canvas" class="oscilloscope__canvas"></canvas>
    <div class="oscilloscope__labels">
      <span class="oscilloscope__label oscilloscope__label--atc">ATC</span>
      <span class="oscilloscope__label oscilloscope__label--mus">MUS</span>
    </div>
    <span class="oscilloscope__db">{{ dbDisplay }}</span>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'Oscilloscope',
  props: {
    atcAnalyser: { type: Object, default: null },
    musicAnalyser: { type: Object, default: null },
    isPlaying: { type: Boolean, default: false },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      animFrameId: null,
      dbDisplay: '-∞dB',
      resizeObserver: null,
    };
  },
  mounted() {
    this.setupCanvas();
    this.startDrawLoop();
  },
  beforeUnmount() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  },
  methods: {
    setupCanvas() {
      const canvas = this.$refs.canvas;
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(canvas.parentElement);
      this.resizeCanvas();
    },

    resizeCanvas() {
      const canvas = this.$refs.canvas;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    },

    startDrawLoop() {
      const draw = () => {
        if (!document.hidden) {
          this.drawFrame();
        }
        this.animFrameId = requestAnimationFrame(draw);
      };
      draw();
    },

    drawFrame() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw grid
      this.drawGrid(ctx, w, h);

      // Draw divider
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Get waveform data
      const atcData = this.atcAnalyser ? this.atcAnalyser.getWaveform() : null;
      const musicData = this.musicAnalyser ? this.musicAnalyser.getWaveform() : null;
      const t = performance.now();

      // Draw ATC waveform (top half)
      this.drawWaveform(ctx, atcData, 0, h / 2, w, t, 1.0);

      // Draw Music waveform (bottom half, slightly dimmer)
      this.drawWaveform(ctx, musicData, h / 2, h / 2, w, t, 0.5);

      // Update dB readout from ATC
      this.updateDb(atcData);
    },

    drawGrid(ctx, w, h) {
      // Major gridlines every 25%
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const x = (w / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let i = 1; i < 4; i++) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    },

    drawWaveform(ctx, data, yOffset, halfH, w, time, opacity) {
      const len = data ? data.length : 256;

      // Generate data: real if available, idle sine wave if not
      const getY = (i) => {
        if (data && this.isPlaying) {
          return data[i];
        }
        // Idle sine wave
        return 128 + Math.sin((i / len) * Math.PI * 4 + time * 0.001) * 3;
      };

      const centerY = yOffset + halfH / 2;

      // Build path once
      const buildPath = () => {
        ctx.beginPath();
        for (let i = 0; i < len; i++) {
          const x = (i / len) * w;
          const v = getY(i) / 128.0;
          const y = centerY + ((v - 1) * halfH * 0.4);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };

      // Triple draw for phosphor glow
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Layer 1: wide glow
      ctx.globalAlpha = 0.08 * opacity;
      ctx.strokeStyle = '#00FF41';
      ctx.lineWidth = 12;
      ctx.filter = 'blur(6px)';
      buildPath();
      ctx.stroke();

      // Layer 2: narrow glow
      ctx.globalAlpha = 0.3 * opacity;
      ctx.lineWidth = 4;
      ctx.filter = 'blur(2px)';
      buildPath();
      ctx.stroke();

      // Layer 3: core line
      ctx.globalAlpha = 1.0 * opacity;
      ctx.lineWidth = 1.5;
      ctx.filter = 'none';
      buildPath();
      ctx.stroke();

      ctx.restore();
    },

    updateDb(data) {
      if (!data || !this.isPlaying) {
        this.dbDisplay = '-∞dB';
        return;
      }
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      const db = rms > 0 ? Math.round(20 * Math.log10(rms)) : -Infinity;
      this.dbDisplay = isFinite(db) ? `${db}dB` : '-∞dB';
    },
  },
};
</script>

<style>
.oscilloscope {
  grid-area: visualizer;
  position: relative;
  min-height: 200px;
  overflow: hidden;
}

.oscilloscope__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.oscilloscope__labels {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  pointer-events: none;
}

.oscilloscope__label {
  font-size: 11px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  padding: 8px;
}

.oscilloscope__label--atc {
  flex: 1;
}

.oscilloscope__label--mus {
  flex: 1;
}

.oscilloscope__db {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  pointer-events: none;
}

/* Responsive */
@media (max-width: 1023px) {
  .oscilloscope { min-height: 160px; }
}
@media (max-width: 767px) {
  .oscilloscope { min-height: 120px; }
}
@media (max-width: 479px) {
  .oscilloscope { min-height: 100px; }
}
</style>
```

**Step 2: Add i18n key**

Add `waveformLabel: 'Audio waveform visualization'` to all 9 languages.

**Step 3: Wire into App.vue temporarily**

Replace the visualizer placeholder with `<Oscilloscope />` (no analyser props yet — it will show idle sine waves).

**QUALITY GATE 4.2:**

QG-3 — Screenshot. This is the most critical visual check:
- Is the background pure black inside the oscilloscope cell?
- Are the grid lines visible? Faint green, 25% intervals?
- Is there a horizontal divider at 50% height?
- Are two subtle idle sine waves visible (one per half)?
- Does the waveform have the phosphor glow effect? (zoom screenshot to verify green glow around the line)
- Are `ATC` and `MUS` labels in the correct position (top-left of each half)?
- Is the `dB` readout in bottom-right?
- Does the canvas fill the cell with no gaps or overflow?
- Are there ZERO rounded corners anywhere?

**Take screenshots at 1280px AND 375px widths** to verify responsive canvas sizing.

**Step 4: Commit**

```bash
git add src/components/Oscilloscope.vue src/App.vue src/locales/messages.js
git commit -m "feat(signal): add Oscilloscope with phosphor glow, grid, dual waveform"
```

---

## Phase 5: Logo SVG

### Task 5.1: Signal Logo SVG

**Files:**
- Create: `src/assets/signal-logo.svg`
- Modify: `src/components/HeaderBar.vue`

Spec reference: Section 11

**Step 1: Create signal-logo.svg**

Viewbox 32x32. Crosshair + 3 ascending bars + dot.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <!-- Crosshair -->
  <line x1="8" y1="0" x2="8" y2="32" stroke="currentColor" stroke-opacity="0.3" stroke-width="1"/>
  <line x1="0" y1="24" x2="32" y2="24" stroke="currentColor" stroke-opacity="0.3" stroke-width="1"/>
  <!-- Crosshair dot -->
  <circle cx="8" cy="24" r="2" fill="currentColor"/>
  <!-- Signal bars (bottom-aligned to y=28) -->
  <rect x="14" y="20" width="4" height="8" fill="currentColor"/>
  <rect x="20" y="14" width="4" height="14" fill="currentColor"/>
  <rect x="26" y="6" width="4" height="22" fill="currentColor"/>
</svg>
```

**Step 2: Update HeaderBar.vue**

Replace the placeholder component with the real SVG import:

```js
import SignalLogo from '../assets/signal-logo.svg';
```

Add animation class toggling based on `playing` prop:

```vue
<SignalLogo class="header-bar__logo" :class="{ 'header-bar__logo--playing': appStatus === 'playing' }" />
```

CSS for logo:

```css
.header-bar__logo {
  width: 24px;
  height: 24px;
  color: var(--accent);
}

.header-bar__logo--playing circle {
  animation: radar-pulse 2s ease-in-out infinite;
}

@keyframes radar-pulse {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 0 transparent); }
  50% { opacity: 0.6; filter: drop-shadow(0 0 4px var(--accent)); }
}
```

**QUALITY GATE 5.1:**

QG-3 — Screenshot, zoomed into header:
- Logo is 24x24px
- Crosshair lines visible but dim
- 3 ascending bars visible in bright green
- Dot at crosshair intersection
- Logo sits left of "FOCUSED" text with 8px gap
- No rounded corners, no softness

**Step 3: Commit**

```bash
git add src/assets/signal-logo.svg src/components/HeaderBar.vue
git commit -m "feat(signal): add crosshair signal logo SVG with radar pulse animation"
```

---

## Phase 6: Assembly

### Task 6.1: Rewrite Main.vue as Grid Orchestrator

**Files:**
- Rewrite: `src/components/Main.vue`
- Modify: `src/App.vue`

This is the task that wires everything together. The `<audio>` elements and their event handlers stay in Main.vue. The grid layout moves to App.vue (already done in Phase 1). Main.vue becomes a logic wrapper, not a layout wrapper.

**Step 1: Rewrite Main.vue**

Remove all old template content. Main.vue now provides audio elements and connects components:

```vue
<template>
  <audio
    ref="musicPlayer"
    @error="musicErrorHandler"
    @play="musicPlayHandler"
    :src="currentMusicUrl"
    crossorigin="anonymous"
  />
  <audio
    ref="airportPlayer"
    @error="airportErrorHandler"
    @play="airportPlayHandler"
    :src="currentAirportUrl"
    crossorigin="anonymous"
  />

  <HeaderBar />
  <StatusWord
    :app-status="appStatus"
    :music-status="musicStatus"
    :airport-status="airportsStatus"
    @toggle="toggleAppStatus"
  />
  <Oscilloscope
    :atc-analyser="atcAnalyser"
    :music-analyser="musicAnalyser"
    :is-playing="appStatus === 'playing'"
  />
  <Airports :audio="$refs.airportPlayer" />
  <Music :audio="$refs.musicPlayer" />
  <StatusBar />
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import { safePause, safePlay, safeLoad } from '../utilites';
import { useAudioAnalyser } from '../composables/useAudioAnalyser';
import HeaderBar from './HeaderBar.vue';
import StatusWord from './StatusWord.vue';
import Oscilloscope from './Oscilloscope.vue';
import Airports from './Airports.vue';
import Music from './Music.vue';
import StatusBar from './StatusBar.vue';

export default {
  name: 'Main',
  setup() {
    const { t } = useI18n();
    const atcAnalyser = useAudioAnalyser();
    const musicAnalyser = useAudioAnalyser();
    return { t, safePause, safePlay, safeLoad, atcAnalyser, musicAnalyser };
  },
  computed: mapState({
    appStatus: (state) => state.appStatus,
    currentAirportUrl: (state) => state.airports.currentUrl,
    currentMusicUrl: (state) => state.music.currentUrl,
    airportsStatus: (state) => state.airports.status,
    musicStatus: (state) => state.music.status,
    AirportsError: (state) => state.airports.error,
    MusicError: (state) => state.music.error,
  }),
  watch: {
    appStatus(newVal) {
      if (newVal === 'playing') this.play();
      if (newVal === 'paused') this.pause();
    },
    currentMusicUrl() {
      if (this.appStatus === 'playing') {
        safeLoad(this.$refs.musicPlayer);
        safePlay(this.$refs.musicPlayer);
      }
    },
    currentAirportUrl() {
      if (this.appStatus === 'playing') {
        safeLoad(this.$refs.airportPlayer);
        safePlay(this.$refs.airportPlayer);
      }
    },
    MusicError(newVal) {
      if (newVal) {
        this.showToast({ message: newVal, type: 'error' });
        this.setMusicError(null);
      }
    },
    AirportsError(newVal) {
      if (newVal) {
        this.showToast({ message: newVal, type: 'error' });
        this.setAirportError(null);
      }
    },
  },
  mounted() {
    // Connect analysers after audio elements are in DOM
    this.$nextTick(() => {
      this.atcAnalyser.connect(this.$refs.airportPlayer);
      this.musicAnalyser.connect(this.$refs.musicPlayer);
    });
  },
  beforeUnmount() {
    this.atcAnalyser.disconnect();
    this.musicAnalyser.disconnect();
  },
  methods: {
    ...mapMutations([
      'setAppStatus', 'setAirportError', 'setAirportStatus',
      'setMusicError', 'setMusicStatus', 'showToast',
    ]),
    toggleAppStatus() {
      this.setAppStatus(this.appStatus === 'playing' ? 'paused' : 'playing');
    },
    play() {
      this.safePlay(this.$refs.musicPlayer);
      this.safePlay(this.$refs.airportPlayer);
    },
    pause() {
      safePause(this.$refs.musicPlayer);
      safePause(this.$refs.airportPlayer);
    },
    onError(type) {
      this[`set${type}Error`](this.t(`ui.${type.toLowerCase()}PlayError`));
      this[`set${type}Status`]('error');
    },
    musicErrorHandler(e) {
      e.preventDefault();
      this.setMusicStatus('failed');
      this.onError('Music');
    },
    airportErrorHandler(e) {
      e.preventDefault();
      this.setAirportStatus('failed');
      this.onError('Airport');
    },
    musicPlayHandler() {
      if (this.appStatus === 'paused') this.$refs.musicPlayer.pause();
      else this.$refs.musicPlayer.play();
    },
    airportPlayHandler() {
      if (this.appStatus === 'paused') this.$refs.airportPlayer.pause();
      else this.$refs.airportPlayer.play();
    },
  },
  components: { HeaderBar, StatusWord, Oscilloscope, Airports, Music, StatusBar },
};
</script>

<style>
/* Main.vue has no styles — all layout is in App.vue grid, all component styles are in their own files */
</style>
```

**Step 2: Update App.vue template**

Remove all placeholder divs. Go back to simple:

```html
<template>
  <div class="layout">
    <Main />
    <transition name="fade">
      <div v-if="toast" :class="['toast', `toast--${toast.type}`]">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>
```

Re-import Main (remove HeaderBar, StatusWord, etc. — those are now inside Main.vue). Remove Footer import entirely.

**Step 3: Delete old files**

- Delete `src/components/Footer.vue`
- Delete `src/components/CustomSelect.vue`

**Step 4: Remove vue-audio-visual**

```bash
npm uninstall vue-audio-visual
```

Remove from `src/main.js`:
- Delete `import AudioVisual from 'vue-audio-visual';`
- Delete `.use(AudioVisual)` line

**Step 5: Remove christmas easter egg**

Remove `isChristmasTime` computed, christmas-hat image import, christmas template/styles from Main.vue (already gone since we rewrote it).

Delete `src/assets/christmas-hat.png` if it exists.

**QUALITY GATE 6.1 — THE BIG ONE:**

QG-1 — Full DOM structure check:
```js
(() => {
  const layout = document.querySelector('.layout');
  const grid = getComputedStyle(layout);
  const areas = [
    'header-bar', 'status-word', 'oscilloscope',
    'airports-list', 'music-list', 'status-bar'
  ];
  const found = areas.map(cls => ({
    class: cls,
    exists: !!document.querySelector(`.${cls}`),
    gridArea: document.querySelector(`.${cls}`)
      ? getComputedStyle(document.querySelector(`.${cls}`)).gridArea
      : 'NOT FOUND',
  }));
  return {
    gridTemplateAreas: grid.gridTemplateAreas,
    gridTemplateColumns: grid.gridTemplateColumns,
    components: found,
    audioElements: document.querySelectorAll('audio').length,
    hasCustomSelect: !!document.querySelector('.dropdown'),
    hasOldCard: !!document.querySelector('.card'),
    hasAvLine: !!document.querySelector('.audio-visual-music'),
    fontFamily: getComputedStyle(document.getElementById('app')).fontFamily,
  };
})()
```

**Expected:**
- All 6 grid areas present
- `hasCustomSelect` = false (old component removed)
- `hasOldCard` = false
- `hasAvLine` = false
- `audioElements` = 2
- `fontFamily` contains `JetBrains Mono`

QG-3 — FULL PAGE SCREENSHOT at 1280px:
- **Header:** Logo + FOCUSED left, clock right, hairline border bottom
- **Status:** Large "STANDBY" text with cursor, centered in cell
- **Visualizer:** Oscilloscope with grid, dual idle sine waves, ATC/MUS labels, dB readout
- **Airports:** Scrollable list with IATA codes, search prompt, volume bar
- **Music:** Scrollable list with station names, search prompt, volume bar
- **Status bar:** Single line at bottom with connection info
- **Overall:** Pure black background, 1px grid lines between ALL cells, scan-line overlay, ALL text monospace green, ZERO rounded corners, ZERO images/flags, ZERO old UI remnants

QG-4 — Responsive screenshots at 768px and 375px:
- At 768px: single column, all areas stacked
- At 375px: smaller text, oscilloscope shorter, still functional

**Step 6: Commit**

```bash
git add -A
git commit -m "feat(signal): assemble full Signal UI — remove old components, vue-audio-visual"
```

---

## Phase 7: Polish & Refinement

### Task 7.1: Volume Bar Track Fill

The `<input type="range">` track fill (green portion up to thumb) needs JS to set a CSS variable since CSS-only solutions are limited cross-browser.

**Files:**
- Modify: `src/components/DataList.vue`

**Step 1:** Add a method that sets `--vol-pct` on the range element when volume changes:

In DataList.vue template, add a `ref` on the range input and a `style` binding:

```html
<input
  ...
  :style="{ '--vol-pct': Math.round(volume * 100) + '%' }"
/>
```

**Step 2: Commit**

```bash
git add src/components/DataList.vue
git commit -m "fix(signal): volume bar track fill via CSS variable"
```

---

### Task 7.2: Keyboard Shortcuts

**Files:**
- Modify: `src/components/Main.vue`

Spec reference: Section 4.1

**Step 1:** Add global keydown listener in Main.vue `mounted`:

```js
mounted() {
  this.$nextTick(() => {
    this.atcAnalyser.connect(this.$refs.airportPlayer);
    this.musicAnalyser.connect(this.$refs.musicPlayer);
  });
  window.addEventListener('keydown', this.handleGlobalKey);
},
beforeUnmount() {
  this.atcAnalyser.disconnect();
  this.musicAnalyser.disconnect();
  window.removeEventListener('keydown', this.handleGlobalKey);
},
```

```js
handleGlobalKey(e) {
  // Don't capture when typing in search inputs
  if (e.target.tagName === 'INPUT') return;

  switch (e.key) {
    case ' ':
      e.preventDefault();
      this.toggleAppStatus();
      break;
    case '[':
      this.$store.commit('setMusicVolume', Math.max(0, this.$store.state.music.volume - 0.1));
      break;
    case ']':
      this.$store.commit('setMusicVolume', Math.min(1, this.$store.state.music.volume + 0.1));
      break;
    case '{':
      this.$store.commit('setAirportVolume', Math.max(0, this.$store.state.airports.volume - 0.1));
      break;
    case '}':
      this.$store.commit('setAirportVolume', Math.min(1, this.$store.state.airports.volume + 0.1));
      break;
  }
},
```

**Step 2: Commit**

```bash
git add src/components/Main.vue
git commit -m "feat(signal): add global keyboard shortcuts for playback and volume"
```

---

## Phase 8: Final QA — Comprehensive Visual Audit

### Task 8.1: Desktop Full Audit (1280x800)

**THIS IS THE MOST IMPORTANT TASK. Do not rush it.**

**Step 1: Set viewport**

Use `mcp__chrome-devtools__resize_page` to set 1280x800.

**Step 2: Take full-page screenshot**

Use `mcp__chrome-devtools__take_screenshot` with `fullPage: true`.

**Step 3: Analyze against spec — CHECKLIST**

Go through EVERY item. Mark pass/fail:

**Colors:**
- [ ] Background is `#000000` (pure black, not dark gray)
- [ ] Primary text is `#00FF41` (phosphor green, not lime, not teal)
- [ ] Dim text is noticeably less bright than primary
- [ ] Grid lines are `#111` (barely visible but present)
- [ ] No remnant of old colors (#191921, #23242B, #3949D3, #393744)

**Typography:**
- [ ] ALL visible text is monospace (JetBrains Mono)
- [ ] No Roboto anywhere
- [ ] Header title: 14px, bold, uppercase, wide tracking
- [ ] Status word: 48px, bold, uppercase, extra-wide tracking
- [ ] IATA codes: 16px, bold
- [ ] Data labels: 11px, light weight, uppercase
- [ ] Status bar: 11px, uppercase

**Layout:**
- [ ] 2-column grid at 1280px
- [ ] Header spans full width
- [ ] Status bar spans full width
- [ ] Status + Visualizer side by side (equal width)
- [ ] Airports + Music side by side (equal width)
- [ ] 1px grid lines visible between ALL adjacent cells
- [ ] Scan-line overlay visible (subtle horizontal stripes)

**Components:**
- [ ] Header: logo left, "FOCUSED" text, clock right
- [ ] Status: "STANDBY" centered with blinking cursor
- [ ] Oscilloscope: grid overlay visible, idle sine waves, ATC/MUS labels, dB readout
- [ ] Airports: section label "ATC FEED", search with `>` prompt, scrollable list, volume bar with percentage
- [ ] Music: section label "MUSIC FEED", similar structure
- [ ] Status bar: connection status, format, uptime, version

**Anti-patterns (must NOT be present):**
- [ ] No rounded corners (border-radius) ANYWHERE
- [ ] No images or flags
- [ ] No circular play button
- [ ] No card backgrounds (#23242B)
- [ ] No blue/purple accent colors
- [ ] No dropdown menus
- [ ] No Roboto font

**Step 4: Fix any failures**

If anything fails, fix it immediately. Re-screenshot. Re-check.

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix(signal): visual audit fixes — desktop 1280px"
```

---

### Task 8.2: Tablet Audit (768x1024)

**Step 1:** Resize to 768x1024.

**Step 2:** Screenshot.

**Step 3: Verify:**
- [ ] Single column layout
- [ ] All grid areas stacked vertically
- [ ] Status word 32px
- [ ] Oscilloscope 120px height
- [ ] Lists have max-height 40vh with scroll
- [ ] Grid lines still visible between cells
- [ ] Touch targets >= 44px on `pointer: coarse` (emulate touch device)

**Step 4:** Fix and commit.

---

### Task 8.3: Mobile Audit (375x812)

**Step 1:** Resize to 375x812 (iPhone SE size).

**Step 2:** Screenshot.

**Step 3: Verify:**
- [ ] Single column layout
- [ ] Status word 28px with 0.2em spacing
- [ ] Oscilloscope 100px height
- [ ] Cell padding 8px
- [ ] Volume bars touch-friendly
- [ ] No horizontal overflow
- [ ] Status bar items don't wrap (horizontal scroll if needed)
- [ ] All text still legible

**Step 4:** Fix and commit.

---

### Task 8.4: Interaction Audit

**Step 1:** Click the status word area. Verify it toggles to playing/paused via evaluate_script:

```js
document.querySelector('.status-word').click();
// Wait 500ms then check the text
```

Screenshot during "TRANSMITTING" state — verify bright green + glow.

**Step 2:** Click an airport row. Verify selection changes. Screenshot to confirm `▸` indicator moved.

**Step 3:** Type in the search input. Verify filtering works. Screenshot filtered state.

**Step 4:** Commit any fixes.

---

### Task 8.5: Final Commit & Summary

**Step 1:** Run `npm run build` to verify no build errors.

**Step 2:** Run `npm run lint` to verify no lint errors.

**Step 3:** Take a final screenshot at 1280x800 as the "hero" image.

**Step 4:** Update the design doc with a "Status: Implemented" note.

**Step 5:** Final commit:

```bash
git add -A
git commit -m "feat(signal): complete Signal UI redesign — all quality gates passed"
```

---

## Task Dependency Graph

```
Phase 0: Setup (dev server)
    │
Phase 1: Foundation (CSS vars, grid, font)
    │
    ├── Phase 2.1: HeaderBar
    ├── Phase 2.2: StatusWord
    ├── Phase 2.3: StatusBar
    │
Phase 3.1: DataList
    ├── Phase 3.2: Airports (uses DataList)
    ├── Phase 3.3: Music (uses DataList)
    │
Phase 4.1: useAudioAnalyser
    │
Phase 4.2: Oscilloscope (uses useAudioAnalyser)
    │
Phase 5.1: Logo SVG
    │
Phase 6.1: Assembly (wires everything, removes old code)
    │
Phase 7.1-7.2: Polish (volume fill, keyboard shortcuts)
    │
Phase 8.1-8.5: Final QA (screenshots at every breakpoint)
```

**Parallelizable:** Tasks 2.1, 2.2, 2.3 can run in parallel. Tasks 3.2 and 3.3 can run in parallel (after 3.1). Task 4.1 can run in parallel with Phase 2 and 3. Task 5.1 can run in parallel with Phase 4.

**Total tasks:** 16
**Total commits:** ~16
