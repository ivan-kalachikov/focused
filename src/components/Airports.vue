<template>
  <div class="card-col">
    <div class="card">
      <div class="card-header">
        <div :class="['icon-wrapper', airportsStatus === 'failed' && 'error']">
          <Spinner v-if="airportsStatus === 'pending' && appStatus === 'playing'" class="spinner" />
          <airportIcon />
        </div>
        <CustomSelect
          :options="airports"
          :model-value="currentAirportCode"
          value-key="codeIATA"
          label-key="city"
          filter-key="city"
          :placeholder="t('ui.selectAirport')"
          @update:model-value="handleChange"
        >
          <template #selected="{ option }">
            {{ option.city }} ({{ option.codeIATA }})
          </template>
          <template #option="{ option }">
            <img
              :src="`https://flagcdn.com/32x24/${option.countryCode}.png`"
              width="32"
              height="24"
              :alt="option.country"
            />
            <span>{{ option.city }} <span class="text-secondary">({{ option.codeIATA }})</span></span>
          </template>
        </CustomSelect>
      </div>
      <input
        type="range"
        class="slider"
        min="0"
        max="100"
        value="85"
        @input="handleVolumeChange(Number($event.target.value))"
        :disabled="airportsStatus === 'failed'"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import airportIcon from '../assets/airport.svg';
import Spinner from '../assets/tail-spin.svg';
import CustomSelect from './CustomSelect.vue';

export default {
  name: 'Airports',
  components: {
    airportIcon,
    Spinner,
    CustomSelect,
  },
  props: ['audio'],
  beforeUpdate() {
    this.audio.addEventListener('waiting', this.setPending);
    this.audio.addEventListener('emptied', this.setPending);
    this.audio.addEventListener('loadeddata', this.setReady);
  },
  beforeUnmount() {
    this.audio.removeEventListener('waiting', this.setPending);
    this.audio.removeEventListener('emptied', this.setPending);
    this.audio.removeEventListener('loadeddata', this.setReady);
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: mapState({
    airports: (state) => state.airports.list,
    currentAirportCode: (state) => state.airports.currentCode,
    airportsStatus: (state) => state.airports.status,
    airportVolume: (state) => state.airports.volume,
    appStatus: (state) => state.appStatus,
  }),
  watch: {
    airportVolume(newVal) {
      this.audio.volume = newVal;
    },
  },
  methods: {
    ...mapMutations(['setCurrentAirportCode', 'setAirportStatus', 'setAirportVolume']),
    handleChange(code) {
      this.setCurrentAirportCode(code);
    },
    handleVolumeChange(value) {
      this.setAirportVolume(value / 100);
    },
    setPending() {
      this.setAirportStatus('pending');
    },
    setReady() {
      this.setAirportStatus('ready');
    },
  },
};
</script>
