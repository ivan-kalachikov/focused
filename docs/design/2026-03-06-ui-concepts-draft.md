# UI Design Concepts — Draft

> Focused: ambient music (SomaFM) + airport radio (LiveATC) streaming app.
> Current state: dark minimal UI, pulsing play button, two waveform visualizers, two selector cards with volume sliders.

---

## Concept 1: "Orbital" — Spatial Depth / Celestial

**Vibe:** You're floating above Earth at night, watching airport lights glow below. The app is a cockpit window into sound.

### Key Elements

- **Background layer:** A slow-rotating subtle 3D globe (or flat stylized map) rendered via CSS 3D transforms. Airport locations glow as soft dots — the selected one pulses brighter. No literal globe required — could be an abstract starfield with nodes.
- **Play button:** Becomes a luminous sphere at center — a small sun. When playing, it emits soft concentric light rings that expand outward (think radar ping). Idle, it's a dim orb with a frosted-glass surface (glassmorphism).
- **Controls:** Music and airport selectors float as translucent panels on either side, slightly tilted in 3D perspective (`transform: perspective(800px) rotateY(±3deg)`). They have frosted glass backgrounds with `backdrop-filter: blur`. Volume is a circular arc/dial instead of a slider.
- **Audio visualization:** Instead of flat waveform lines, audio data drives a ring of particles orbiting the central sphere — music = inner orbit (warm tones), airport = outer orbit (cool tones). Achievable with Canvas 2D or lightweight WebGL.
- **Animations:** Micro-parallax on mouse move. Elements shift subtly in depth. Transitions between states use spring physics (soft bounce).
- **Typography:** Thin, wide-tracked sans-serif (e.g., Inter Thin or Space Grotesk Light). Airport IATA codes in large semi-transparent type behind the panels.

### Technical Grounding

CSS 3D transforms, `backdrop-filter`, Canvas 2D for particles, CSS custom properties for theming. No heavy 3D library required for the core — Three.js optional for globe enhancement.

---

## Concept 2: "Liquid" — Organic Morphism / Generative

**Vibe:** A living canvas. The interface breathes. Sound becomes color and shape. Think lava lamp meets generative album art.

### Key Elements

- **Background layer:** A full-screen generative gradient mesh that slowly morphs — 4-5 color blobs that shift hue/position based on audio frequency bands. Low frequencies = deep movement, high = shimmer. Achieved via SVG `<feTurbulence>` + `<feDisplacementMap>` filters animated over time, or a simple Canvas shader.
- **Play button:** An organic blob shape (not a circle) that continuously morphs its boundary using CSS `border-radius` animation (e.g., `60% 40% 30% 70% / 60% 30% 70% 40%` cycling). When playing, the blob "breathes" faster and its interior fills with a swirling gradient.
- **Controls:** No rigid cards. Selectors and volume controls sit inside soft, pill-shaped containers with no hard borders — just subtle elevation via layered shadows. The containers themselves have slightly animated blob-shaped clip-paths. Volume control is a vertical liquid-fill bar — the "liquid" level rises/falls with smooth spring animation.
- **Audio visualization:** The two waveforms merge into the background itself. Music frequencies modulate the background blob colors. Airport audio modulates the displacement/turbulence intensity. The entire screen IS the visualizer.
- **State transitions:** Morphing. Play -> Pause doesn't toggle abruptly — the blob contracts, colors desaturate and slow, the background stills gradually over ~800ms.
- **Typography:** Rounded, soft — something like Nunito or Plus Jakarta Sans. Text color subtly shifts with the dominant background hue.

### Technical Grounding

SVG filters for generative backgrounds (no WebGL needed), CSS `border-radius` morphing for blob shapes, Web Audio API `AnalyserNode` (already used via vue-audio-visual) for frequency data, CSS transitions with custom easing.

---

## Concept 3: "Signal" — Data-Art / Neo-Brutalist ATC

**Vibe:** An air traffic control terminal reimagined as contemporary art. Raw data becomes beautiful. Ryoji Ikeda meets Bloomberg Terminal.

### Key Elements

- **Background:** Pure black `#000000`. No gradients, no blurs. The beauty comes from information density and precise typography.
- **Layout:** Strict grid. The screen is divided into visible grid cells with hairline borders (`1px solid #111`). Each cell has a purpose — current station, frequency data, waveform, time, status indicators.
- **Play button:** No button. A large monospace word: `TRANSMITTING` / `STANDBY` that blinks with a cursor. Clicking anywhere on the word toggles state. Or: a minimal square outline that fills with a scan-line animation when active.
- **Audio visualization:** A real oscilloscope aesthetic — green or amber monochrome waveform on black, drawn with sharp 1px lines on Canvas. Actual FFT frequency bars in a tight grid, each bar just 2-3px wide. Numbers scroll beside it showing real-time dB levels.
- **Selectors:** Airport shown as a data table — IATA code, city, country, frequency — in monospace type. The selected row has a bright accent highlight (electric blue `#00F0FF` or phosphor green `#00FF41`). No dropdown — the full list is always visible in a scrollable panel with scan-line overlay.
- **Accents:** Single high-contrast accent color on pure black. Occasional glitch/flicker micro-animations on text elements (CSS `@keyframes` with `opacity` and `transform: translate` jitter).
- **Details:** A subtle CRT scan-line overlay via CSS repeating-linear-gradient. Timestamps in the corner updating every second. The footer becomes a "status bar" showing connection state, bitrate, uptime.

### Technical Grounding

Pure CSS grid layout, monospace system fonts or JetBrains Mono, Canvas 2D for oscilloscope, CSS animations for glitch effects, zero external dependencies needed. The most lightweight of the three.

---

## Comparison

| Dimension        | Orbital                          | Liquid                              | Signal                             |
|------------------|----------------------------------|-------------------------------------|------------------------------------|
| **Feel**         | Premium, spatial, calm           | Organic, playful, immersive         | Raw, intense, intellectual         |
| **Complexity**   | Medium-High                      | Medium                              | Low-Medium                         |
| **Performance**  | Good (CSS 3D + Canvas)           | Good (SVG filters heavy on mobile)  | Excellent (minimal GPU)            |
| **Mobile**       | Needs adaptation (reduce 3D)     | Scales naturally (blobs any size)   | Scales perfectly (grid collapses)  |
| **Wow factor**   | Depth, parallax, glass           | The screen breathes with sound      | "Is this an art installation?"     |
| **Risk**         | Globe/map could feel generic     | Blob shapes can look gimmicky       | Could feel cold if accent is off   |

---

## References & Inspiration

- [2026 Web Design Trends: Glassmorphism, Micro-Animations & AI (Digital Upward)](https://www.digitalupward.com/blog/2026-web-design-trends-glassmorphism-micro-animations-ai-magic/)
- [Top Web Design Trends for 2026 (Figma)](https://www.figma.com/resource-library/web-design-trends/)
- [12 UI/UX Design Trends 2026 (Index.dev)](https://www.index.dev/blog/ui-ux-design-trends)
- [Neumorphism vs Glassmorphism (Zignuts)](https://www.zignuts.com/blog/neumorphism-vs-glassmorphism)
- [Audio Player designs (Dribbble)](https://dribbble.com/tags/audio-player)
- [Music App UI (Behance)](https://www.behance.net/search/projects/music%20app%20ui)
- [Radio App UI (Dribbble)](https://dribbble.com/tags/radio-app-ui)
