<template>
  <DataList
    class="airports-list"
    :items="airports"
    value-key="codeIATA"
    label-key="city"
    filter-key="city"
    :model-value="currentAirportCode"
    :volume="airportVolume"
    :label="t('ui.atcFeed')"
    :volume-aria-label="t('ui.airportVolume')"
    @update:model-value="setCurrentAirportCode"
    @update:volume="setAirportVolume"
  >
    <template #row="{ item, active }">
      <span class="airports-list__iata">{{ item.codeIATA }}</span>
      <span class="airports-list__city">{{ item.city }}</span>
      <span class="airports-list__country">{{ item.countryCode.toUpperCase() }}</span>
    </template>
  </DataList>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import DataList from './DataList.vue';

export default {
  name: 'Airports',
  components: { DataList },
  props: ['audio'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: mapState({
    airports: (state) => state.airports.list,
    currentAirportCode: (state) => state.airports.currentCode,
    airportVolume: (state) => state.airports.volume,
    airportStatus: (state) => state.airports.status,
    appStatus: (state) => state.appStatus,
  }),
  watch: {
    airportVolume(newVal) {
      if (this.audio) this.audio.volume = newVal;
    },
  },
  beforeUpdate() {
    if (this.audio) {
      this.audio.addEventListener('waiting', this.setPending);
      this.audio.addEventListener('emptied', this.setPending);
      this.audio.addEventListener('loadeddata', this.setReady);
    }
  },
  beforeUnmount() {
    if (this.audio) {
      this.audio.removeEventListener('waiting', this.setPending);
      this.audio.removeEventListener('emptied', this.setPending);
      this.audio.removeEventListener('loadeddata', this.setReady);
    }
  },
  methods: {
    ...mapMutations(['setCurrentAirportCode', 'setAirportStatus', 'setAirportVolume']),
    setPending() { this.setAirportStatus('pending'); },
    setReady() { this.setAirportStatus('ready'); },
  },
};
</script>

<style>
.airports-list {
  grid-area: airports;
}

.airports-list__iata {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  min-width: 48px;
}

.airports-list__city {
  font-size: 14px;
  flex: 1;
}

.airports-list__country {
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
}
</style>
