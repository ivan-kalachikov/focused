<template>
  <audio ref="musicPlayer" :src="this.currentMusicUrl" autoplay />
    <audio ref="soundPlayer" :src="this.currentAirportUrl" autoplay />
    <a-col flex="100%">
<a-row justify="center">
      <Logo />
    </a-row>
    <a-row justify="center">
      <div
        :class="`playpause ${appStatus === 'playing' ? 'playing' : ''}`"
        @click="toggleAppStatus()"
        :title="appStatus === 'playing' ? t('ui.pause') : t('ui.play')"
      ></div>
    </a-row>
    <a-row :gutter="24" justify="center">
      <Music />
      <Airports />
    </a-row>
    </a-col>

</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import Airports from './Airports.vue';
import Music from './Music.vue';
import Logo from '../assets/logo.svg';

export default {
  name: 'Main',
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: mapState({
    appStatus: (state) => state.appStatus,
    currentMusicUrl: (state) => state.currentMusicUrl,
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
    ...mapMutations(['setAppStatus']),
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
  },
  components: {
    Music,
    Airports,
    Logo,
  },
};
</script>

<style>
.playpause {
  position: relative;
  background: #191921;
  border: 6px #a3a4a7;
  outline: none;
  height: 140px;
  width: 140px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 0 45px 15px rgba(85, 98, 212, 0.35);
  margin-top: 75px;
  margin-bottom: 60px;
}

.playpause.playing,
.playpause:hover {
  box-shadow: 0 0 15px 10px rgba(255, 255, 255, 0.2);
  animation: pulse 2s ease-in infinite alternate;
}

.playpause:focus {
  outline: none;
}

.playpause:before {
  content: '';
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
  content: '';
  position: absolute;
  background: inherit;
  width: 0;
  height: 60px;
  top: 30px;
  left: 66px;
  transition: 0.15s ease-in-out;
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
