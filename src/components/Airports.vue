<template>
  <a-col :xs="{ span: 22 }" :md="{ span: 11 }" :xl="{ span: 7 }" :xxl="{ span: 5 }">
    <a-card :bordered="false">
      <a-row :gutter="16" justify="start">
        <a-col flex="55px" :class="['icon-wrapper', airportsStatus === 'failed' && 'error']">
          <Spinner v-if="airportsStatus === 'pending' && appStatus === 'playing'" class="spinner" />
          <airportIcon />
        </a-col>
        <a-col flex="auto">
          <a-select
            size="large"
            show-search
            optionFilterProp="name"
            :placeholder="t('ui.selectAirport')"
            style="width: 100%"
            :filter-option="true"
            @change="handleChange"
            :default-value="currentAirportCode"
          >
            <a-select-option
              v-for="item in airports"
              :key="item.urlPostfix"
              :value="item.codeIATA"
              :name="item.city"
              :title="item.airport"
            >
              <span >
                <img
                  class="country"
                  width="32"
                  height="24"
                  :src="`https://flagcdn.com/32x24/${item.countryCode}.png`"
                />
                {{ item.city }}
                <span class="ant-typography ant-typography-secondary">({{ item.codeIATA }})</span>
              </span>
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col flex="100%">
          <a-slider
            @change="handleVolumeChange"
            :default-value="85"
            tooltipPlacement="bottom"
            :disabled="airportsStatus === 'failed'"
          />
          </a-col>
      </a-row>
    </a-card>
  </a-col>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import airportIcon from '../assets/airport.svg';
import Spinner from '../assets/tail-spin.svg';

export default {
  name: 'Airports',
  components: {
    airportIcon,
    Spinner,
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

<style>
.ant-select-item-option-content .country {
  width: 32px;
  height: 24px;
  margin-right: 5px;
}

.ant-select-selection-item img {
  display: none;
}

.icon-wrapper {
  position: relative;
}

.icon-wrapper.error path {
  fill: #6f2b39;
}

.icon-wrapper.error circle {
  stroke: #6f2b39;
}

.spinner {
  position: absolute;
  top: -1px;
  left: 7px;
}
</style>
