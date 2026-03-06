<template>
  <audio ref="musicPlayer" @error="musicErrorHandler" @play="musicPlayHandler" :src="currentMusicUrl" crossorigin="anonymous" />
  <audio ref="airportPlayer" @error="airportErrorHandler" @play="airportPlayHandler" :src="currentAirportUrl" crossorigin="anonymous" />

  <main class="main-area">
    <GlassPanel tilt="left" :ghostText="currentAirportCode" accent-color="--accent-cool">
      <DataList
        :items="airports"
        value-key="codeIATA"
        label-key="city"
        :secondary-keys="[{ key: 'codeIATA' }, { key: 'countryCode' }]"
        :filter-keys="['city', 'codeIATA', 'codeICAO', 'country']"
        :model-value="currentAirportCode"
        @update:model-value="setCurrentAirportCode"
        :volume="airportVolume"
        @update:volume="setAirportVolume"
        label="ATC FEED"
        accent-color="--accent-cool"
      />
    </GlassPanel>

    <Sphere
      :app-status="appStatus"
      :is-buffering="isBuffering"
      :has-error="hasError"
      @toggle="toggleAppStatus"
    />

    <GlassPanel tilt="right" :ghostText="currentMusicName" accent-color="--accent-warm">
      <DataList
        :items="musicList"
        value-key="id"
        label-key="name"
        :filter-keys="['name', 'description']"
        :model-value="currentMusicId"
        @update:model-value="setCurrentMusicId"
        :volume="musicVolume"
        @update:volume="setMusicVolume"
        label="MUSIC FEED"
        accent-color="--accent-warm"
      />
    </GlassPanel>
  </main>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import { safePause, safePlay, safeLoad } from '../utilites';
import Sphere from './Sphere.vue';
import GlassPanel from './GlassPanel.vue';
import DataList from './DataList.vue';

export default {
  name: 'Main',
  setup() {
    const { t } = useI18n();
    return {
      t, safePause, safePlay, safeLoad,
    };
  },
  computed: {
    ...mapState({
      AirportsError: (state) => state.airports.error,
      appStatus: (state) => state.appStatus,
      currentAirportUrl: (state) => state.airports.currentUrl,
      currentMusicUrl: (state) => state.music.currentUrl,
      MusicError: (state) => state.music.error,
      airports: (state) => state.airports.list,
      currentAirportCode: (state) => state.airports.currentCode,
      airportVolume: (state) => state.airports.volume,
      musicList: (state) => state.music.list,
      currentMusicId: (state) => state.music.currentId,
      musicVolume: (state) => state.music.volume,
    }),
    currentMusicName() {
      const station = this.musicList[this.currentMusicId];
      return station ? station.name : '';
    },
    isBuffering() {
      return this.$store.state.airports.status === 'pending' || this.$store.state.music.status === 'pending';
    },
    hasError() {
      return this.$store.state.airports.status === 'failed' || this.$store.state.music.status === 'failed';
    },
  },
  watch: {
    appStatus(newVal) {
      if (newVal === 'playing') {
        this.play();
      }
      if (newVal === 'paused') {
        this.pause();
      }
    },
    currentMusicUrl() {
      if (this.appStatus === 'playing') {
        safeLoad(this.$refs.musicPlayer);
        safePlay(this.$refs.musicPlayer);
      }
    },
    currentAirportUrl() {
      if (this.appStatus === 'playing') {
        safeLoad(this.$refs.airportPlayer);
        safePlay(this.$refs.airportPlayer);
      }
    },
    MusicError(newVal) {
      if (newVal) {
        this.showToast({ message: newVal, type: 'error' });
        this.setMusicError(null);
      }
    },
    AirportsError(newVal) {
      if (newVal) {
        this.showToast({ message: newVal, type: 'error' });
        this.setAirportError(null);
      }
    },
    airportVolume(newVal) {
      if (this.$refs.airportPlayer) this.$refs.airportPlayer.volume = newVal;
    },
    musicVolume(newVal) {
      if (this.$refs.musicPlayer) this.$refs.musicPlayer.volume = newVal;
    },
  },
  methods: {
    ...mapMutations([
      'setAppStatus',
      'setAirportError',
      'setAirportStatus',
      'setMusicError',
      'setMusicStatus',
      'showToast',
      'setCurrentAirportCode',
      'setAirportVolume',
      'setCurrentMusicId',
      'setMusicVolume',
    ]),
    toggleAppStatus() {
      const newStatus = this.appStatus === 'playing' ? 'paused' : 'playing';
      this.setAppStatus(newStatus);
    },
    play() {
      this.safePlay(this.$refs.musicPlayer);
      this.safePlay(this.$refs.airportPlayer);
    },
    onError(type) {
      this[`set${type}Error`](this.t(`ui.${type.toLowerCase()}PlayError`));
      this[`set${type}Status`]('error');
    },
    pause() {
      safePause(this.$refs.musicPlayer);
      safePause(this.$refs.airportPlayer);
    },
    musicErrorHandler(e) {
      e.preventDefault();
      this.setMusicStatus('failed');
      this.onError('Music');
    },
    airportErrorHandler(e) {
      e.preventDefault();
      this.setAirportStatus('failed');
      this.onError('Airport');
    },
    musicPlayHandler() {
      if (this.appStatus === 'paused') {
        this.$refs.musicPlayer.pause();
      } else {
        this.$refs.musicPlayer.play();
      }
    },
    airportPlayHandler() {
      if (this.appStatus === 'paused') {
        this.$refs.airportPlayer.pause();
      } else {
        this.$refs.airportPlayer.play();
      }
    },
  },
  components: { Sphere, GlassPanel, DataList },
};
</script>

<style>
.main-area {
  grid-area: main;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 24px;
  position: relative;
}

@media (max-width: 1023px) {
  .main-area {
    gap: 24px;
    padding: 16px;
  }
}
</style>
