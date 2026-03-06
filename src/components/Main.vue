<template>
  <audio ref="musicPlayer" @error="musicErrorHandler" @play="musicPlayHandler" :src="currentMusicUrl" crossorigin="anonymous" />
  <audio ref="airportPlayer" @error="airportErrorHandler" @play="airportPlayHandler" :src="currentAirportUrl" crossorigin="anonymous" />

  <main class="main-area">
    <Starfield :musicAmplitude="musicAmplitude" :airportAmplitude="airportAmplitude" />
    <ParticleCanvas
      :musicAmplitude="musicAmplitude"
      :airportAmplitude="airportAmplitude"
      :sphereRect="sphereRect"
      :isPlaying="appStatus === 'playing'"
    />

    <!-- Desktop: panels + sphere -->
    <template v-if="!isMobile">
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
    </template>

    <Sphere
      :app-status="appStatus"
      :is-buffering="isBuffering"
      :has-error="hasError"
      @toggle="toggleAppStatus"
    />

    <template v-if="!isMobile">
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
    </template>

    <!-- Mobile: drawer -->
    <MobileDrawer
      v-if="isMobile"
      :airportItems="airports"
      :musicItems="musicList"
      :currentAirportCode="currentAirportCode"
      :currentMusicId="currentMusicId"
      :airportVolume="airportVolume"
      :musicVolume="musicVolume"
      @update:airportCode="setCurrentAirportCode"
      @update:musicId="setCurrentMusicId"
      @update:airportVolume="setAirportVolume"
      @update:musicVolume="setMusicVolume"
    />
  </main>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import { safePause, safePlay, safeLoad } from '../utilites';
import { useAudioAnalyser } from '../composables/useAudioAnalyser';
import Sphere from './Sphere.vue';
import GlassPanel from './GlassPanel.vue';
import DataList from './DataList.vue';
import Starfield from './Starfield.vue';
import ParticleCanvas from './ParticleCanvas.vue';
import MobileDrawer from './MobileDrawer.vue';

export default {
  name: 'Main',
  setup() {
    const { t } = useI18n();
    return {
      t, safePause, safePlay, safeLoad,
    };
  },
  data() {
    return {
      isMobile: false,
      musicAudio: null,
      airportAudio: null,
      sphereRect: null,
      musicAmplitude: 0,
      airportAmplitude: 0,
      amplitudeRafId: null,
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
        this.connectAnalysers();
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
  mounted() {
    this.musicAudio = useAudioAnalyser();
    this.airportAudio = useAudioAnalyser();

    if (this.appStatus === 'playing') {
      this.connectAnalysers();
    }

    this.updateSphereRect();
    this._resizeHandler = () => this.updateSphereRect();
    window.addEventListener('resize', this._resizeHandler);

    this._mobileQuery = window.matchMedia('(max-width: 767px)');
    this.isMobile = this._mobileQuery.matches;
    this._mobileHandler = (e) => { this.isMobile = e.matches; };
    this._mobileQuery.addEventListener('change', this._mobileHandler);

    this.startAmplitudeLoop();
  },
  beforeUnmount() {
    if (this.musicAudio) this.musicAudio.disconnect();
    if (this.airportAudio) this.airportAudio.disconnect();

    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }

    if (this._mobileQuery && this._mobileHandler) {
      this._mobileQuery.removeEventListener('change', this._mobileHandler);
    }

    if (this.amplitudeRafId != null) {
      cancelAnimationFrame(this.amplitudeRafId);
      this.amplitudeRafId = null;
    }
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
    connectAnalysers() {
      if (this.musicAudio && this.$refs.musicPlayer) {
        this.musicAudio.connect(this.$refs.musicPlayer);
      }
      if (this.airportAudio && this.$refs.airportPlayer) {
        this.airportAudio.connect(this.$refs.airportPlayer);
      }
    },
    updateSphereRect() {
      this.$nextTick(() => {
        const sphereEl = this.$el?.querySelector('.sphere');
        const mainEl = this.$el?.querySelector('.main-area') || this.$el;
        if (!sphereEl || !mainEl) return;

        const sphereBounds = sphereEl.getBoundingClientRect();
        const mainBounds = mainEl.getBoundingClientRect();

        this.sphereRect = {
          x: sphereBounds.left - mainBounds.left,
          y: sphereBounds.top - mainBounds.top,
          width: sphereBounds.width,
          height: sphereBounds.height,
        };
      });
    },
    startAmplitudeLoop() {
      const loop = () => {
        if (!document.hidden) {
          this.musicAmplitude = this.musicAudio ? this.musicAudio.getAmplitude() : 0;
          this.airportAmplitude = this.airportAudio ? this.airportAudio.getAmplitude() : 0;
        }
        this.amplitudeRafId = requestAnimationFrame(loop);
      };
      this.amplitudeRafId = requestAnimationFrame(loop);
    },
  },
  components: { Sphere, GlassPanel, DataList, Starfield, ParticleCanvas, MobileDrawer },
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

@media (max-width: 767px) {
  .main-area {
    flex-direction: column;
    padding-bottom: 60px; /* space for collapsed drawer */
  }
}
</style>
