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

<script>
import { mapState, mapMutations } from 'vuex';
import Main from './components/Main.vue';

export default {
  name: 'App',
  components: { Main },
  computed: mapState(['toast']),
  watch: {
    toast(val) {
      if (val) {
        setTimeout(() => this.clearToast(), 3000);
      }
    },
  },
  methods: mapMutations(['clearToast']),
};
</script>

<style>
:root {
  --bg: #000000;
  --surface: #0A0A0A;
  --grid-line: #111111;
  --grid-line-dim: #080808;
  --text-primary: #00FF41;
  --text-dim: #00AA30C0;
  --text-muted: #2D5A35;
  --accent: #00FF41;
  --accent-glow: #00FF4133;
  --error: #FF3333;
  --warning: #FFB000;
  --white: #CCCCCC;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace;
  --cell-padding: 12px;
}

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

*:focus-visible {
  outline: none;
  text-shadow: 0 0 8px var(--accent-glow);
  box-shadow: inset 0 0 0 1px var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .layout::after {
    display: none;
  }
}

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
</style>
