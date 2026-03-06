<template>
  <footer class="status-bar" role="status" aria-live="polite">
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
