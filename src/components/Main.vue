<template>
  <audio
    ref="musicPlayer"
    :src="currentMusicUrl"
    crossorigin="anonymous"
    @error="musicErrorHandler"
    @play="musicPlayHandler"
  />
  <audio
    ref="airportPlayer"
    :src="currentAirportUrl"
    crossorigin="anonymous"
    @error="airportErrorHandler"
    @play="airportPlayHandler"
  />
  <av-line
    class="audio-visual-music"
    :line-width="2"
    line-color="#21212a"
    ref-link="musicPlayer"
    :canv-width="1400"
    :canv-height="210"
    :fft-size="512"
  />
  <av-line
    class="audio-visual-airport"
    :line-width="2"
    line-color="#252535"
    ref-link="airportPlayer"
    :canv-width="1000"
    :canv-height="282"
    :fft-size="512"
  />
  <section class="main">
    <div class="container">
      <div class="logo-wrapper">
        <Logo />
      </div>
      <div
        :class="[
          'playpause',
          {'playing' : appStatus === 'playing'}
        ]"
        :title="appStatus === 'playing' ? t('ui.pause') : t('ui.play')"
        @click="toggleAppStatus"
      />
      <div class="sources">
        <Music :audio="$refs.musicPlayer" />
        <Airports :audio="$refs.airportPlayer" />
      </div>
    </div>
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import { safePause, safePlay, safeLoad } from '../utilites';
import Airports from './Airports.vue';
import Music from './Music.vue';
import Logo from '../assets/images/logo.svg';

export default {
  name: 'Main',
  setup() {
    const { t } = useI18n();
    return {
      t, safePause, safePlay, safeLoad,
    };
  },
  computed: mapState({
    appStatus: (state) => state.appStatus,
    currentMusicUrl: (state) => state.music.currentUrl,
    currentAirportUrl: (state) => state.airports.currentUrl,
    MusicError: (state) => state.music.error,
    AirportsError: (state) => state.airports.error,
  }),
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
        // message.error(newVal, () => {
        //   this.setMusicError(null);
        // });
      }
    },
    AirportsError(newVal) {
      if (newVal) {
        // message.error(newVal, () => {
        //   this.setAirportError(null);
        // });
      }
    },
  },
  methods: {
    ...mapMutations([
      'setAppStatus',
      'setAirportError',
      'setAirportStatus',
      'setMusicError',
      'setMusicStatus',
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
  components: {
    Music,
    Airports,
    Logo,
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  padding-top: 40px;
  padding-bottom: 40px;
}

.playpause {
  position: relative;
  background: #191921;
  border: 6px #a3a4a7;
  outline: none;
  height: 140px;
  width: 140px;
  cursor: pointer;
  border-radius: 50%;
  animation: pulse 2s ease-in infinite alternate;
  animation-play-state: paused;
  margin-top: 75px;
  margin-bottom: 60px;
}

.playpause.playing,
.playpause:hover {
  animation-play-state: running;
}

.playpause:focus {
  outline: none;
}

.playpause:before {
  content: "";
  position: absolute;
  top: 50px;
  left: 56px;
  height: 0;
  border-style: solid;
  border-width: 20px 0 20px 40px;
  border-color: transparent transparent transparent #eeeeee;
  transition: 0.2s ease;
}

.playpause.playing:before {
  left: 54px;
  height: 40px;
  border-width: 0 0 0 35px;
}

.playpause.playing:after {
  width: 11px;
}

.playpause:after {
  content: "";
  position: absolute;
  background: inherit;
  width: 0;
  height: 60px;
  top: 30px;
  left: 66px;
  transition: 0.15s ease-in-out;
}

@media screen and (min-width: 768px) {
  .audio-visual-music canvas,
  .audio-visual-airport canvas {
    position: absolute;
    left: 50%;
    top: calc(50% - 92px);
    transform: translate(-50%, -50%);
  }

  .audio-visual-music canvas {
    width: 1400px;
    height: 210px;
  }

  .audio-visual-airport canvas {
    width: 1000px;
    height: 282px;
  }
}

@media screen and (max-width: 768px) {
  .audio-visual-airport canvas,
  .audio-visual-music canvas {
    display: none;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 45px 15px rgba(85, 98, 212, 0.302);
  }

  50% {
    transform: scale(1);
    box-shadow: 0 0 30px 15px rgba(85, 98, 212, 0.5);
  }

  100% {
    box-shadow: 0 0 35px 12px rgba(85, 98, 212, 0.4);
  }
}
</style>
