<template>
  <div>
    <audio
      ref="musicPlayer"
      :src="this.currentMusicUrl"
      autoplay
    />
    <audio
      ref="soundPlayer"
      :src="this.currentAirportUrl"
      autoplay
    />
    <a-row
      gutter={16}
      justify="center"
    >
      <div :class="`playpause ${appStatus === 'playing' ? 'playing': ''}`"
        @click="toggleAppStatus()"
        :title="appStatus === 'playing' ? t('ui.pause') : t('ui.play')"
      ></div>
    </a-row>
    <a-row
      gutter={16}
      justify="center"
    >
      <a-col span={8}>
        <a-card>
          <musicIcon />
          <a-select
            size="large"
            show-search
            optionFilterProp="name"
            placeholder="Select music channel"
            style="width: 250px"
            :filter-option="true"
            @change="handleMusicChange"
            :default-value="currentMusicId"
          >
            <a-select-option
              v-for="item in music"
              :key="item.id"
              :value="item.id"
              :name="item.name"
              :title="item.description"
            >
              <span>
                <img
                  width="40"
                  height="40"
                  :src="item.imageUrl"
                />
                {{item.name}}
              </span>
            </a-select-option>
          </a-select>
          <a-slider
            @change="handleMusicVolumeChange"
            :default-value="100"
          />
        </a-card>
      </a-col>
      <a-col span={8}>
        <a-card>
          <airportIcon />
          <a-select
            size="large"
            show-search
            optionFilterProp="name"
            placeholder="Select airport channel"
            style="width: 250px"
            :filter-option="true"
            @change="handleAirportChange"
            :default-value="currentAirportCode"
          >
            <a-select-option
              v-for="item in airports"
              :key="item.urlPostfix"
              :value="item.codeIATA"
              :name="item.city"
              :title="item.airport"
            >
              <span>
                <img
                  width="40"
                  height="40"
                  :src="`https://www.countryflags.io/${item.countryCode}/shiny/48.png`"
                >
                {{item.city}}
                <a-typography-text type="secondary">({{item.codeIATA}})</a-typography-text>
              </span>
            </a-select-option>
          </a-select>
          <a-slider
            @change="handleAirportVolumeChange"
            :default-value="85"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import airportIcon from '../assets/airport.svg';
import musicIcon from '../assets/music.svg';

export default {
  name: 'MusicPlayer',
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: mapState({
    appStatus: (state) => state.appStatus,
    music: (state) => state.music,
    airports: (state) => state.airports,
    currentMusicId: (state) => state.currentMusicId,
    currentMusicUrl: (state) => state.currentMusicUrl,
    currentAirportCode: (state) => state.currentAirportCode,
    currentAirportUrl: (state) => state.currentAirportUrl,
  }),
  watch: {
    appStatus(newVal) {
      switch (newVal) {
        case 'playing':
          this.play();
          break;
        case 'paused':
          this.pause();
          break;
        default:
      }
    },
  },
  methods: {
    ...mapMutations([
      'setAppStatus',
      'setCurrentMusicId',
      'setCurrentAirportCode',
    ]),
    toggleAppStatus() {
      const newStatus = this.appStatus === 'playing' ? 'paused' : 'playing';
      this.setAppStatus(newStatus);
    },
    play() {
      this.$refs.musicPlayer.play();
      this.$refs.soundPlayer.play();
    },
    pause() {
      this.$refs.musicPlayer.pause();
      this.$refs.soundPlayer.pause();
    },
    handleMusicChange(id) {
      this.setCurrentMusicId(id);
      if (this.appStatus === 'playing') {
        this.$refs.musicPlayer.play();
      }
    },
    handleAirportChange(code) {
      this.setCurrentAirportCode(code);
      if (this.appStatus === 'playing') {
        this.$refs.soundPlayer.play();
      }
    },
    handleMusicVolumeChange(value) {
      this.$refs.musicPlayer.volume = value / 100;
    },
    handleAirportVolumeChange(value) {
      this.$refs.soundPlayer.volume = value / 100;
    },
  },
  components: {
    airportIcon,
    musicIcon,
  },
};
</script>

<style>
  .ant-select-item-option-content img {
    width: 40px;
    height: 40px;
  }

  .ant-select-selection-item img {
    width: 25px;
    height: 25px;
  }

  .playpause{
    position: relative;
    background: #ffffff;
    border: none;
    outline:none;
    height: 5em;
    width: 5em;
    font-size: 2em;
    box-shadow: 0px 2px 25px rgba(0, 0, 0, .2);
    cursor:pointer;
    border-radius: 5em;
    transition: box-shadow 0.2s;
  }

  .playpause.playing {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, .3);
  }

  .playpause:focus{
    outline:none;
  }

  .playpause:before {
    content: "";
    position: absolute;
    top: 1.5em;
    left: 1.72em;
    height: 0;
    border-style: solid;
    border-width: 1em 0 1em 2em;
    border-color: transparent transparent transparent #1890ff;
    transition: 0.2s ease;
  }

  .playpause.playing:before {
    left: 1.55em;
    height: 2em;
    border-width: 0 0 0 2em;
  }

   .playpause.playing:after {
      width: .24em;
    }

  .playpause:after {
    content: "";
    position: absolute;
    background: inherit;
    width: 0;
    height: 2em;
    top: 1.5em;
    left: 2.42em;
    transition: .218s ease;
  }
</style>
