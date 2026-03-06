<template>
  <div class="layout">
    <Main />
    <Footer />
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
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Main,
    Footer,
  },
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
/* ── Orbital Design System ── */

/* 1. CSS Variables (spec 1.1) */
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

/* 2. Global reset */
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
a { color: var(--text-primary); text-decoration: none; }
a:hover { color: #fff; }

/* 3. Layout with aurora background (spec 1.4) */
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

/* 4. Toast styles (spec 3.8) */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
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

/* 5. Transitions */
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
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 6. Focus states (spec 4.3) */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-neutral), 0 0 12px var(--accent-neutral-glow);
}

/* 7. Backdrop-filter fallback (spec 11) */
@supports not (backdrop-filter: blur(1px)) {
  .panel, .header, .footer, .toast, .drawer {
    background: rgba(15, 15, 25, 0.85) !important;
  }
}
</style>
