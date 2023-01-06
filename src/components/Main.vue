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
  <a-layout-content class="content">
    <a-row
      align="middle"
      justify="center"
      class="container"
    >
      <a-col flex="100%">
        <a-row justify="center">
          <div v-if="isChristmasTime" class="christmas">
            <img
              src="../assets/christmas-hat.png"
              :alt="t('ui.christmas')"
              :title="t('ui.christmas')"
              class="christmas-hat"
            >
          </div>
          <Logo />
        </a-row>
        <a-row justify="center">
          <div
            :class="['playpause', appStatus === 'playing' ? 'playing' : '']"
            @click="toggleAppStatus()"
            :title="appStatus === 'playing' ? t('ui.pause') : t('ui.play')"
          ></div>
        </a-row>
        <a-row
          :gutter="[24, 12]"
          justify="center"
        >
          <Music :audio="this.$refs.musicPlayer" />
          <Airports :audio="this.$refs.airportPlayer" />
        </a-row>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import { message } from 'ant-design-vue';
import { safePause, safePlay, safeLoad } from '../utilites';
import Airports from './Airports.vue';
import Music from './Music.vue';
import Logo from '../assets/logo.svg';

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
    }),
    isChristmasTime() {
      const currentDate = Date.now();
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const christmasStart = new Date(`${currentMonth === 11 ? currentYear : currentYear - 1}-12-20`).getTime();
      const christmasEnd = new Date(`${currentMonth === 0 ? currentYear : currentYear + 1}-01-10`).getTime();
      return currentDate > christmasStart && currentDate < christmasEnd;
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
        message.error(newVal, () => {
          this.setMusicError(null);
        });
      }
    },
    AirportsError(newVal) {
      if (newVal) {
        message.error(newVal, () => {
          this.setAirportError(null);
        });
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

<style>
.content {
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

.christmas {
  position: absolute;
  transform: translate(100px, -50%);
}

.christmas-hat {
   width: 91px;
  animation: christmas 2s ease-in infinite alternate;
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

@keyframes christmas {
  0% {
    transform: rotate(0deg)
  }
  20% {
    transform: rotate(5deg)
  }
  40% {
    transform: rotate(-5deg)
  }
  60% {
    transform: rotate(10deg)
  }
  80% {
    transform: rotate(-10deg)
  }
  100% {
    transform: rotate(0deg)
  }

}
</style>
