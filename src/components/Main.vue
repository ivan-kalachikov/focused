<template>
  <audio
    ref="musicPlayer"
    @error="musicErrorHandler"
    @play="musicPlayHandler"
    :src="currentMusicUrl"
    crossorigin="anonymous"
  />
  <audio
    ref="airportPlayer"
    @error="airportErrorHandler"
    @play="airportPlayHandler"
    :src="currentAirportUrl"
    crossorigin="anonymous"
  />

  <HeaderBar />
  <StatusWord
    :app-status="appStatus"
    :music-status="musicStatus"
    :airport-status="airportsStatus"
    @toggle="toggleAppStatus"
  />
  <Oscilloscope
    :atc-analyser="atcAnalyser"
    :music-analyser="musicAnalyser"
    :is-playing="appStatus === 'playing'"
  />
  <Airports :audio="$refs.airportPlayer" />
  <Music :audio="$refs.musicPlayer" />
  <StatusBar />
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import { safePause, safePlay, safeLoad } from '../utilites';
import { useAudioAnalyser } from '../composables/useAudioAnalyser';
import HeaderBar from './HeaderBar.vue';
import StatusWord from './StatusWord.vue';
import Oscilloscope from './Oscilloscope.vue';
import Airports from './Airports.vue';
import Music from './Music.vue';
import StatusBar from './StatusBar.vue';

export default {
  name: 'Main',
  components: { HeaderBar, StatusWord, Oscilloscope, Airports, Music, StatusBar },
  setup() {
    const { t } = useI18n();
    const atcAnalyser = useAudioAnalyser();
    const musicAnalyser = useAudioAnalyser();
    return { t, safePause, safePlay, safeLoad, atcAnalyser, musicAnalyser };
  },
  computed: mapState({
    appStatus: (state) => state.appStatus,
    currentAirportUrl: (state) => state.airports.currentUrl,
    currentMusicUrl: (state) => state.music.currentUrl,
    airportsStatus: (state) => state.airports.status,
    musicStatus: (state) => state.music.status,
    AirportsError: (state) => state.airports.error,
    MusicError: (state) => state.music.error,
  }),
  watch: {
    appStatus(newVal) {
      if (newVal === 'playing') this.play();
      if (newVal === 'paused') this.pause();
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
  },
  mounted() {
    // Connect analysers after audio elements are in DOM
    this.$nextTick(() => {
      this.atcAnalyser.connect(this.$refs.airportPlayer);
      this.musicAnalyser.connect(this.$refs.musicPlayer);
    });
    window.addEventListener('keydown', this.handleGlobalKey);
  },
  beforeUnmount() {
    this.atcAnalyser.disconnect();
    this.musicAnalyser.disconnect();
    window.removeEventListener('keydown', this.handleGlobalKey);
  },
  methods: {
    ...mapMutations([
      'setAppStatus', 'setAirportError', 'setAirportStatus',
      'setMusicError', 'setMusicStatus', 'showToast',
      'setMusicVolume', 'setAirportVolume',
    ]),
    handleGlobalKey(e) {
      if (e.target.tagName === 'INPUT') return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          this.toggleAppStatus();
          break;
        case '[':
          this.setMusicVolume(Math.max(0, this.$store.state.music.volume - 0.1));
          break;
        case ']':
          this.setMusicVolume(Math.min(1, this.$store.state.music.volume + 0.1));
          break;
        case '{':
          this.setAirportVolume(Math.max(0, this.$store.state.airports.volume - 0.1));
          break;
        case '}':
          this.setAirportVolume(Math.min(1, this.$store.state.airports.volume + 0.1));
          break;
      }
    },
    toggleAppStatus() {
      this.setAppStatus(this.appStatus === 'playing' ? 'paused' : 'playing');
    },
    play() {
      this.atcAnalyser.resume();
      this.safePlay(this.$refs.musicPlayer);
      this.safePlay(this.$refs.airportPlayer);
    },
    pause() {
      safePause(this.$refs.musicPlayer);
      safePause(this.$refs.airportPlayer);
    },
    onError(type) {
      this[`set${type}Error`](this.t(`ui.${type.toLowerCase()}PlayError`));
      this[`set${type}Status`]('error');
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
      if (this.appStatus === 'paused') this.$refs.musicPlayer.pause();
      else this.$refs.musicPlayer.play();
    },
    airportPlayHandler() {
      if (this.appStatus === 'paused') this.$refs.airportPlayer.pause();
      else this.$refs.airportPlayer.play();
    },
  },
};
</script>

<style>
/* Main.vue has no styles — all layout is in App.vue grid, all component styles are in their own files */
</style>
