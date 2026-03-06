<template>
  <button
    class="sphere"
    :class="stateClass"
    @click="$emit('toggle')"
    role="button"
    :aria-label="`Toggle playback. Currently ${appStatus}`"
    tabindex="0"
  >
    <span v-if="appStatus === 'playing'" class="sphere__ring" v-for="n in 3" :key="n"></span>
    <span v-if="isBuffering" class="sphere__loading-ring"></span>
  </button>
</template>

<script>
export default {
  name: 'Sphere',
  props: {
    appStatus: {
      type: String,
      required: true,
    },
    isBuffering: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggle'],
  computed: {
    stateClass() {
      return {
        'sphere--playing': this.appStatus === 'playing',
        'sphere--paused': this.appStatus === 'paused',
        'sphere--buffering': this.isBuffering,
        'sphere--error': this.hasError,
      };
    },
  },
};
</script>

<style scoped>
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
  /* Reset button styles */
  padding: 0;
  outline: none;
  font: inherit;
  color: inherit;
  flex-shrink: 0;
  z-index: 2;
}

/* Paused (breathing) */
.sphere--paused {
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); box-shadow: 0 0 40px var(--accent-neutral-glow); }
  50% { transform: scale(1.04); box-shadow: 0 0 60px var(--accent-neutral-glow); }
}

/* Playing */
.sphere--playing {
  transform: scale(1.02);
  box-shadow:
    0 0 60px var(--accent-neutral-glow),
    0 0 120px rgba(170, 136, 255, 0.15);
}

/* Rings (playing state) */
.sphere__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--accent-neutral);
  pointer-events: none;
  animation: ring-expand 3s ease-out infinite;
}

.sphere__ring:nth-child(1) { animation-delay: 0s; }
.sphere__ring:nth-child(2) { animation-delay: 1s; }
.sphere__ring:nth-child(3) { animation-delay: 2s; }

@keyframes ring-expand {
  0% { transform: scale(1); opacity: 0.4; border-width: 2px; }
  100% { transform: scale(2.5); opacity: 0; border-width: 0.5px; }
}

/* Buffering */
.sphere--buffering {
  animation: breathe 1.5s ease-in-out infinite;
}

.sphere--buffering .sphere__loading-ring {
  /* exists */
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

@keyframes orbit-ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error */
.sphere--error {
  box-shadow: 0 0 40px rgba(255, 102, 85, 0.3);
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 1023px) { .sphere { width: 140px; height: 140px; } }
@media (max-width: 767px) { .sphere { width: 120px; height: 120px; } }
@media (max-width: 479px) { .sphere { width: 100px; height: 100px; } }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .sphere, .sphere--paused, .sphere--buffering { animation: none; }
  .sphere__ring, .sphere__loading-ring { animation: none; display: none; }
}
</style>
