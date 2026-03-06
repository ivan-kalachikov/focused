<template>
  <div class="data-list">
    <div class="data-list__header">
      <span class="data-list__label">{{ label }}</span>
    </div>
    <div class="data-list__search">
      <span class="data-list__prompt">&gt;</span>
      <input
        ref="searchInput"
        v-model="query"
        class="data-list__search-input"
        :placeholder="t('ui.search')"
        @keydown.esc="query = ''"
      />
    </div>
    <div class="data-list__scroll" role="listbox" :aria-label="label">
      <div
        v-for="item in filteredItems"
        :key="item[valueKey]"
        class="data-list__row"
        :class="{ 'data-list__row--active': item[valueKey] === modelValue }"
        role="option"
        :aria-selected="item[valueKey] === modelValue"
        tabindex="0"
        @click="$emit('update:modelValue', item[valueKey])"
        @keydown.enter.prevent="$emit('update:modelValue', item[valueKey])"
      >
        <span class="data-list__indicator">{{ item[valueKey] === modelValue ? '\u25B8' : '\u00A0' }}</span>
        <slot name="row" :item="item" :active="item[valueKey] === modelValue">
          {{ item[labelKey] }}
        </slot>
      </div>
      <div v-if="filteredItems.length === 0" class="data-list__empty">
        {{ t('ui.noResults') }}
      </div>
    </div>
    <div class="data-list__volume">
      <span class="data-list__vol-label">VOL</span>
      <input
        type="range"
        class="data-list__vol-range"
        min="0"
        max="100"
        :value="Math.round(volume * 100)"
        :aria-label="volumeAriaLabel"
        @input="$emit('update:volume', Number($event.target.value) / 100)"
      />
      <span class="data-list__vol-pct">{{ Math.round(volume * 100) }}%</span>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'DataList',
  props: {
    items: { type: Array, required: true },
    valueKey: { type: String, required: true },
    labelKey: { type: String, required: true },
    filterKey: { type: String, required: true },
    modelValue: { default: null },
    volume: { type: Number, default: 1 },
    label: { type: String, required: true },
    volumeAriaLabel: { type: String, default: 'Volume' },
  },
  emits: ['update:modelValue', 'update:volume'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return { query: '' };
  },
  computed: {
    filteredItems() {
      if (!this.query) return this.items;
      const q = this.query.toLowerCase();
      return this.items.filter((item) =>
        String(item[this.filterKey]).toLowerCase().includes(q)
      );
    },
  },
};
</script>

<style>
.data-list {
  display: flex;
  flex-direction: column;
  padding: var(--cell-padding);
  overflow: hidden;
}

.data-list__header {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--grid-line);
  margin-bottom: 4px;
}

.data-list__label {
  font-size: 11px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-dim);
}

.data-list__search {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  border-bottom: 1px solid var(--grid-line);
}

.data-list__prompt {
  font-size: 14px;
  color: var(--text-dim);
  flex-shrink: 0;
}

.data-list__search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.02em;
  padding: 4px 0;
}

.data-list__search-input::placeholder {
  color: var(--text-muted);
}

.data-list__scroll {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
}

@media (max-width: 767px) {
  .data-list__scroll {
    max-height: 40vh;
  }
}

.data-list__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  min-height: 40px;
  cursor: pointer;
  color: var(--text-dim);
  transition: color 0.1s;
}

@media (pointer: coarse) {
  .data-list__row {
    min-height: 44px;
  }
}

.data-list__row:hover {
  color: var(--text-primary);
}

.data-list__row--active {
  color: var(--text-primary);
}

.data-list__indicator {
  flex-shrink: 0;
  width: 12px;
  font-size: 14px;
  color: var(--accent);
  opacity: 0;
  transition: opacity 0.1s;
}

.data-list__row--active .data-list__indicator {
  opacity: 1;
}

.data-list__empty {
  padding: 12px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
}

/* Scrollbar */
.data-list__scroll::-webkit-scrollbar {
  width: 4px;
}
.data-list__scroll::-webkit-scrollbar-track {
  background: var(--bg);
}
.data-list__scroll::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 0;
}

/* Volume */
.data-list__volume {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--grid-line);
  margin-top: 8px;
}

.data-list__vol-label {
  font-size: 11px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  flex-shrink: 0;
}

.data-list__vol-range {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 4px;
  background: var(--grid-line);
  border-radius: 0;
  outline: none;
  cursor: pointer;
}

.data-list__vol-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 2px;
  height: 16px;
  background: var(--accent);
  border-radius: 0;
  cursor: pointer;
}

.data-list__vol-range::-moz-range-thumb {
  width: 2px;
  height: 16px;
  background: var(--accent);
  border-radius: 0;
  cursor: pointer;
  border: none;
}

/* Track fill (accent color up to thumb) — Webkit only, Firefox uses ::-moz-range-progress */
.data-list__vol-range::-webkit-slider-runnable-track {
  height: 4px;
  background: linear-gradient(
    to right,
    var(--accent) 0%,
    var(--accent) var(--vol-pct, 100%),
    var(--grid-line) var(--vol-pct, 100%),
    var(--grid-line) 100%
  );
}

.data-list__vol-pct {
  font-size: 11px;
  color: var(--text-dim);
  min-width: 36px;
  text-align: right;
}

@media (pointer: coarse) {
  .data-list__vol-range {
    height: 8px;
    padding: 18px 0;
  }
}
</style>
