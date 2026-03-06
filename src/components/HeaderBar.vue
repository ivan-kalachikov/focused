<template>
  <header class="header">
    <div class="header__left">
      <span class="header__name">ORBITAL</span>
      <span class="header__dot" :class="{ 'header__dot--playing': appStatus === 'playing' }" aria-hidden="true"></span>
    </div>
    <div class="header__right">
      <span class="header__status">{{ statusText }}</span>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HeaderBar',
  computed: {
    ...mapState(['appStatus']),
    ...mapState({
      currentCode: (state) => state.airports.currentCode,
      currentId: (state) => state.music.currentId,
      musicList: (state) => state.music.list,
    }),
    currentStationName() {
      return this.musicList[this.currentId]?.name ?? '';
    },
    statusText() {
      if (this.appStatus === 'playing') {
        return `NOW PLAYING: ${this.currentCode} / ${this.currentStationName}`;
      }
      return '';
    },
  },
};
</script>

<style scoped>
.header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--surface);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
  grid-area: header;
  z-index: 10;
}

.header__left {
  display: flex;
  align-items: center;
}

.header__name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-neutral);
}

.header__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-neutral);
  margin-left: 8px;
  display: inline-block;
  vertical-align: middle;
  opacity: 0.3;
  transform: scale(0.8);
}

.header__dot--playing {
  animation: dot-breathe 2s ease-in-out infinite;
}

.header__status {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-dim);
}

@keyframes dot-breathe {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
