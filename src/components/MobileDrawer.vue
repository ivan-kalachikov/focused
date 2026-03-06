<template>
  <div class="drawer" :class="{ 'drawer--collapsed': collapsed }">
    <div
      class="drawer__handle"
      @click="onHandleClick"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="drawer__handle-bar" />
    </div>

    <div class="drawer__tabs" role="tablist">
      <button
        class="drawer__tab"
        :class="{ 'drawer__tab--active': activeTab === 'atc' }"
        role="tab"
        :aria-selected="activeTab === 'atc'"
        @click="activeTab = 'atc'"
      >
        ATC
      </button>
      <button
        class="drawer__tab"
        :class="{ 'drawer__tab--active': activeTab === 'music' }"
        role="tab"
        :aria-selected="activeTab === 'music'"
        @click="activeTab = 'music'"
      >
        MUSIC
      </button>
    </div>

    <div class="drawer__content" role="tabpanel">
      <DataList
        v-if="activeTab === 'atc'"
        :items="airportItems"
        value-key="codeIATA"
        label-key="city"
        :secondary-keys="[{ key: 'codeIATA' }, { key: 'countryCode' }]"
        :filter-keys="['city', 'codeIATA', 'codeICAO', 'country']"
        :model-value="currentAirportCode"
        @update:model-value="$emit('update:airportCode', $event)"
        :volume="airportVolume"
        @update:volume="$emit('update:airportVolume', $event)"
        label="ATC FEED"
        accent-color="--accent-cool"
      />
      <DataList
        v-if="activeTab === 'music'"
        :items="musicItems"
        value-key="id"
        label-key="name"
        :filter-keys="['name', 'description']"
        :model-value="currentMusicId"
        @update:model-value="$emit('update:musicId', $event)"
        :volume="musicVolume"
        @update:volume="$emit('update:musicVolume', $event)"
        label="MUSIC FEED"
        accent-color="--accent-warm"
      />
    </div>
  </div>
</template>

<script>
import DataList from './DataList.vue';

export default {
  name: 'MobileDrawer',
  components: { DataList },
  props: {
    airportItems: {
      type: Array,
      default: () => [],
    },
    musicItems: {
      type: Array,
      default: () => [],
    },
    currentAirportCode: {
      type: String,
      default: '',
    },
    currentMusicId: {
      type: [String, Number],
      default: '',
    },
    airportVolume: {
      type: Number,
      default: 1,
    },
    musicVolume: {
      type: Number,
      default: 1,
    },
  },
  emits: [
    'update:airportCode',
    'update:musicId',
    'update:airportVolume',
    'update:musicVolume',
  ],
  data() {
    return {
      collapsed: true,
      activeTab: 'atc',
      touchStartY: 0,
    };
  },
  methods: {
    onTouchStart(e) {
      this.touchStartY = e.touches[0].clientY;
    },
    onTouchMove(e) {
      e.preventDefault();
    },
    onTouchEnd(e) {
      const delta = e.changedTouches[0].clientY - this.touchStartY;
      if (delta > 50) this.collapsed = true;
      if (delta < -50) this.collapsed = false;
    },
    onHandleClick() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style>
.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 50vh;
  border-radius: 16px 16px 0 0;
  background: var(--surface-active);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--glass-border-active);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.drawer--collapsed {
  transform: translateY(calc(100% - 48px));
}

.drawer__handle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  cursor: grab;
}

.drawer__handle-bar {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--text-muted);
}

.drawer__tabs {
  display: flex;
  height: 48px;
}

.drawer__tab {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-dim);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.drawer__tab--active {
  color: var(--text-primary);
  border-bottom-color: var(--accent-neutral);
}

.drawer__content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
}
</style>
