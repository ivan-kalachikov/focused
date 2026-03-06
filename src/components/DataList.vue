<template>
  <div class="data-list">
    <span class="data-list__label">{{ label }}</span>
    <div class="data-list__search-wrapper">
      <input
        class="data-list__search"
        type="text"
        :placeholder="t('ui.search')"
        v-model="query"
        :aria-label="'Search ' + label"
      />
    </div>
    <div class="data-list__items" role="listbox" :aria-label="label + ' selection'">
      <div
        v-for="item in filteredItems"
        :key="item[valueKey]"
        class="data-list__row"
        :class="{ 'data-list__row--active': item[valueKey] === modelValue }"
        role="option"
        :aria-selected="item[valueKey] === modelValue"
        @click="$emit('update:modelValue', item[valueKey])"
      >
        <span class="data-list__indicator">{{ item[valueKey] === modelValue ? '*' : '' }}</span>
        <span class="data-list__primary">{{ item[labelKey] }}</span>
        <span v-for="sec in secondaryKeys" :key="sec.key" class="data-list__secondary">
          {{ item[sec.key] }}
        </span>
      </div>
    </div>
    <div class="data-list__volume">
      <span class="data-list__vol-label">{{ t('ui.volume') }}</span>
      <input
        type="range"
        class="data-list__slider"
        min="0"
        max="100"
        :value="Math.round(volume * 100)"
        @input="$emit('update:volume', Number($event.target.value) / 100)"
        :aria-label="label + ' volume'"
      />
      <span class="data-list__vol-value">{{ Math.round(volume * 100) }}%</span>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'DataList',
  setup() {
    const { t } = useI18n();
    return { t };
  },
  props: {
    items: { type: Array, required: true },
    valueKey: { type: String, required: true },
    labelKey: { type: String, required: true },
    secondaryKeys: { type: Array, default: () => [] },
    filterKeys: { type: Array, required: true },
    modelValue: { required: true },
    volume: { type: Number, required: true },
    label: { type: String, required: true },
    accentColor: { type: String, default: '--accent-cool' },
  },
  emits: ['update:modelValue', 'update:volume'],
  data() {
    return {
      query: '',
    };
  },
  computed: {
    filteredItems() {
      if (!this.query) return this.items;
      const q = this.query.toLowerCase();
      return this.items.filter((item) =>
        this.filterKeys.some((key) =>
          String(item[key] || '').toLowerCase().includes(q)
        )
      );
    },
  },
  methods: {
    applyAccentColor() {
      const glowVar = this.accentColor + '-glow';
      this.$el.style.setProperty('--accent', 'var(' + this.accentColor + ')');
      this.$el.style.setProperty('--accent-glow', 'var(' + glowVar + ')');
    },
    scrollToActive() {
      const container = this.$el?.querySelector('.data-list__items');
      if (!container) return;
      const activeRow = container.querySelector('.data-list__row--active');
      if (!activeRow) return;
      activeRow.scrollIntoView({ block: 'center', behavior: 'smooth' });
    },
  },
  mounted() {
    this.applyAccentColor();
    this.$nextTick(() => this.scrollToActive());
  },
  watch: {
    accentColor() {
      this.applyAccentColor();
    },
    modelValue() {
      this.$nextTick(() => this.scrollToActive());
    },
  },
};
</script>

<style>
.data-list__label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  display: block;
  margin-bottom: 12px;
}

.data-list__search {
  width: 100%;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0 12px;
  height: 36px;
  outline: none;
  transition: border-color 0.2s ease;
}
.data-list__search::placeholder {
  color: var(--text-muted);
}
.data-list__search:focus {
  border-color: var(--accent);
}

.data-list__items {
  max-height: 300px;
  overflow-y: auto;
  margin: 12px 0;
}
/* Custom scrollbar */
.data-list__items::-webkit-scrollbar { width: 4px; }
.data-list__items::-webkit-scrollbar-track { background: transparent; }
.data-list__items::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 2px; }

.data-list__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 44px;
  cursor: pointer;
  color: var(--text-dim);
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  border-left: 2px solid transparent;
}
.data-list__row:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.03);
}
.data-list__row--active {
  color: var(--accent);
  border-left-color: var(--accent);
  box-shadow: inset 4px 0 8px var(--accent-glow);
}

.data-list__indicator {
  width: 12px;
  text-align: center;
  flex-shrink: 0;
  color: var(--accent);
}

.data-list__primary {
  flex: 1;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-list__secondary {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-dim);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.data-list__volume {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.data-list__vol-label,
.data-list__vol-value {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-dim);
  flex-shrink: 0;
}

.data-list__slider {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  outline: none;
}
.data-list__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 8px var(--accent-glow);
}
.data-list__slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 8px var(--accent-glow);
}

@media (pointer: coarse) {
  .data-list__search { height: 44px; }
  .data-list__row { min-height: 44px; }
  .data-list__slider { padding: 20px 0; }
}
</style>
