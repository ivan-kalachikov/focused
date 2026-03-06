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
    appStatus: { type: String, required: true },
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
      return this.appStatus === 'playing' ? this.t('ui.pause') : this.t('ui.play');
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
  animation: typewriter 0.4s steps(12) forwards, subtle-glitch 8s ease-in-out 1s infinite;
}

.status-word__cursor {
  font-size: 48px;
  font-weight: 700;
  animation: blink 1s step-end infinite;
}

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

.status-word--buffering .status-word__text::after {
  content: '';
  animation: dots 1.2s step-end infinite;
}

.status-word--error .status-word__text,
.status-word--error .status-word__cursor {
  color: var(--error);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes dots {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
}

@keyframes typewriter {
  from { max-width: 0; }
  to { max-width: 20ch; }
}

.status-word--error .status-word__text {
  animation: typewriter 0.4s steps(12) forwards, glitch 0.3s ease-in-out 0.4s infinite;
}

@keyframes subtle-glitch {
  0%, 100% { transform: translate(0); opacity: 1; }
  92% { transform: translate(0); opacity: 1; }
  93% { transform: translate(-2px, 1px); opacity: 0.8; }
  94% { transform: translate(1px, -1px); opacity: 0.85; }
  95% { transform: translate(-1px, 0); opacity: 0.75; }
  96% { transform: translate(0); opacity: 1; }
}

@keyframes glitch {
  0%, 100% { transform: translate(0); opacity: 1; }
  20% { transform: translate(-2px, 1px); opacity: 0.8; }
  40% { transform: translate(2px, -1px); opacity: 0.9; }
  60% { transform: translate(-1px, -1px); opacity: 0.7; }
  80% { transform: translate(1px, 2px); opacity: 0.95; }
}

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
