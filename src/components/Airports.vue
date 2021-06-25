<template>
  <a-col :xs="{ span: 22 }" :md="{ span: 11 }" :xl="{ span: 7 }" :xxl="{ span: 5 }">
    <a-card :bordered="false">
      <a-row :gutter="16" justify="start">
        <a-col flex="55px">
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
              <span v-if="item">
                <img
                  width="40"
                  height="40"
                  :src="`https://www.countryflags.io/${item.countryCode}/flat/48.png`"
                />
                {{ item.city }}
                <a-typography-text type="secondary">({{ item.codeIATA }})</a-typography-text>
              </span>
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col flex="100%">
          <a-slider @change="handleVolumeChange" :default-value="85" tooltipPlacement="bottom" />
          </a-col>
      </a-row>
    </a-card>
  </a-col>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import airportIcon from '../assets/airport.svg';

export default {
  name: 'Airports',
  components: {
    airportIcon,
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: mapState({
    airports: (state) => state.airports,
    currentAirportCode: (state) => state.currentAirportCode,
  }),
  methods: {
    ...mapMutations(['setCurrentAirportCode']),
    handleChange(code) {
      this.setCurrentAirportCode(code);
      if (this.appStatus === 'playing') {
        this.$refs.soundPlayer.play();
      }
    },
    handleVolumeChange(value) {
      this.$refs.soundPlayer.volume = value / 100;
    },
  },
};
</script>

<style>
.ant-select-item-option-content img {
  width: 40px;
  height: 40px;
}

.ant-select-selection-item img {
  display: none;
}
</style>
