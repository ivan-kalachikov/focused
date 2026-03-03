<template>
  <div class="dropdown" ref="root" :class="{ open }">
    <button type="button" class="dropdown__trigger" @click="toggle">
      <span v-if="selectedOption" class="dropdown__value">
        <slot name="selected" :option="selectedOption">
          {{ selectedOption[labelKey] }}
        </slot>
      </span>
      <span v-else class="dropdown__placeholder">{{ placeholder }}</span>
      <span class="dropdown__arrow">&#9662;</span>
    </button>
    <div v-if="open" class="dropdown__panel">
      <input
        ref="searchInput"
        v-model="query"
        class="dropdown__search"
        placeholder="Search..."
        @keydown.esc="open = false"
      />
      <div class="dropdown__list">
        <div
          v-for="opt in filteredOptions"
          :key="opt[valueKey]"
          class="dropdown__option"
          :class="{ 'dropdown__option--active': opt[valueKey] === modelValue }"
          @click="select(opt)"
        >
          <slot name="option" :option="opt">
            {{ opt[labelKey] }}
          </slot>
        </div>
        <div v-if="filteredOptions.length === 0" class="dropdown__empty">
          No results
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    options: { type: Array, required: true },
    modelValue: { default: null },
    valueKey: { type: String, required: true },
    labelKey: { type: String, required: true },
    filterKey: { type: String, default: '' },
    placeholder: { type: String, default: 'Select...' },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      open: false,
      query: '',
    };
  },
  computed: {
    selectedOption() {
      return this.options.find((o) => o[this.valueKey] === this.modelValue) || null;
    },
    filteredOptions() {
      if (!this.query) return this.options;
      const key = this.filterKey || this.labelKey;
      const q = this.query.toLowerCase();
      return this.options.filter((o) => String(o[key]).toLowerCase().includes(q));
    },
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open) {
        this.query = '';
        this.$nextTick(() => this.$refs.searchInput?.focus());
      }
    },
    select(opt) {
      this.$emit('update:modelValue', opt[this.valueKey]);
      this.open = false;
    },
    onClickOutside(e) {
      if (this.$refs.root && !this.$refs.root.contains(e.target)) {
        this.open = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.onClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onClickOutside);
  },
};
</script>

<style>
.dropdown {
  position: relative;
  flex: 1;
  min-width: 0;
}

.dropdown__trigger {
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  background: #23242B;
  color: #dadada;
  border: 1.5px solid #45444B;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  text-align: left;
  display: flex;
  align-items: center;
  font-family: inherit;
}

.dropdown__trigger:focus,
.dropdown.open .dropdown__trigger {
  border-color: #313DA9;
}

.dropdown__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown__placeholder {
  flex: 1;
  color: #666;
}

.dropdown__arrow {
  margin-left: 8px;
  color: #45444B;
  font-size: 12px;
}

.dropdown__panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #23242B;
  border: 1.5px solid #45444B;
  border-radius: 6px;
  z-index: 100;
  overflow: hidden;
}

.dropdown__search {
  width: 100%;
  padding: 8px 12px;
  background: #191921;
  color: #dadada;
  border: none;
  border-bottom: 1px solid #45444B;
  outline: none;
  font-size: 14px;
  font-family: inherit;
}

.dropdown__search::placeholder {
  color: #666;
}

.dropdown__list {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown__option {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}

.dropdown__option:hover {
  background: #191921;
}

.dropdown__option--active {
  background: #191921;
}

.dropdown__option img {
  flex-shrink: 0;
  border-radius: 2px;
}

.dropdown__empty {
  padding: 12px;
  text-align: center;
  color: #666;
}

.dropdown__list::-webkit-scrollbar {
  width: 6px;
}

.dropdown__list::-webkit-scrollbar-track {
  background: #23242B;
}

.dropdown__list::-webkit-scrollbar-thumb {
  background: #45444B;
  border-radius: 3px;
}
</style>
