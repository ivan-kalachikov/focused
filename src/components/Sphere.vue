<template>
  <button
    class="sphere"
    :class="stateClass"
    @click="$emit('toggle')"
    role="button"
    :aria-label="`Toggle playback. Currently ${appStatus}`"
    tabindex="0"
  >
    <span v-if="appStatus !== 'playing'" class="sphere__play" aria-hidden="true"></span>
    <span v-if="appStatus === 'playing'" class="sphere__pause" aria-hidden="true"></span>
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

/* Play icon (triangle) */
.sphere__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-40%, -50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 18px 0 18px 30px;
  border-color: transparent transparent transparent rgba(200, 180, 255, 0.35);
  transition: border-color 0.3s ease;
}

.sphere:hover .sphere__play {
  border-color: transparent transparent transparent rgba(200, 180, 255, 0.7);
}

/* Pause icon (two bars) */
.sphere__pause {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-50% - 8px), -50%);
  width: 8px;
  height: 28px;
  background: rgba(200, 180, 255, 0.2);
  border-radius: 2px;
  box-shadow: 16px 0 0 rgba(200, 180, 255, 0.2);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.sphere:hover .sphere__pause {
  background: rgba(200, 180, 255, 0.5);
  box-shadow: 16px 0 0 rgba(200, 180, 255, 0.5);
}

/* Hover glow */
.sphere:hover {
  box-shadow:
    0 0 60px var(--accent-neutral-glow),
    0 0 100px rgba(170, 136, 255, 0.2);
}

/* Responsive */
@media (max-width: 1023px) {
  .sphere { width: 140px; height: 140px; }
  .sphere__play { border-width: 15px 0 15px 25px; }
  .sphere__pause { width: 7px; height: 24px; transform: translate(calc(-50% - 7px), -50%); box-shadow: 14px 0 0 rgba(200, 180, 255, 0.2); }
}
@media (max-width: 767px) {
  .sphere { width: 120px; height: 120px; }
  .sphere__play { border-width: 12px 0 12px 20px; }
  .sphere__pause { width: 6px; height: 20px; transform: translate(calc(-50% - 6px), -50%); box-shadow: 12px 0 0 rgba(200, 180, 255, 0.2); }
}
@media (max-width: 479px) {
  .sphere { width: 100px; height: 100px; }
  .sphere__play { border-width: 10px 0 10px 17px; }
  .sphere__pause { width: 5px; height: 18px; transform: translate(calc(-50% - 5px), -50%); box-shadow: 10px 0 0 rgba(200, 180, 255, 0.2); }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .sphere, .sphere--paused, .sphere--buffering { animation: none; }
  .sphere__ring, .sphere__loading-ring { animation: none; display: none; }
}
</style>
