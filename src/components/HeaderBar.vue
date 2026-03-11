<template>
  <header class="header-bar">
    <div class="header-bar__left">
      <SignalLogo class="header-bar__logo" :class="{ 'header-bar__logo--playing': appStatus === 'playing' }" />
      <span class="header-bar__title">FOCUSED</span>
    </div>
    <div class="header-bar__right">
      <span class="header-bar__clock">{{ clock }}</span>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import SignalLogo from '../assets/signal-logo.svg';

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
      this.clock = now.toTimeString().slice(0, 8);
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

.header-bar__logo {
  width: 24px;
  height: 24px;
  color: var(--accent);
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

.header-bar__logo--playing circle {
  animation: radar-pulse 2s ease-in-out infinite;
}

@keyframes radar-pulse {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 0 transparent); }
  50% { opacity: 0.6; filter: drop-shadow(0 0 4px var(--accent)); }
}
</style>
