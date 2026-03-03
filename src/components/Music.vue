<template>
  <div class="card-col">
    <div class="card">
      <div class="card-header">
        <div :class="['icon-wrapper', musicStatus === 'failed' && 'error']">
          <Spinner v-if="musicStatus === 'pending' && appStatus === 'playing'" class="spinner" />
          <musicIcon />
        </div>
        <CustomSelect
          :options="music"
          :model-value="currentMusicId"
          value-key="id"
          label-key="name"
          filter-key="name"
          :placeholder="t('ui.selectMusic')"
          @update:model-value="handleChange"
        >
          <template #option="{ option }">
            <img :src="option.imageUrl" width="40" height="40" :alt="option.name" />
            <span :title="option.description">{{ option.name }}</span>
          </template>
        </CustomSelect>
      </div>
      <input
        type="range"
        class="slider"
        min="0"
        max="100"
        value="100"
        @input="handleVolumeChange(Number($event.target.value))"
        :disabled="musicStatus === 'failed'"
      />
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import musicIcon from '../assets/music.svg';
import Spinner from '../assets/tail-spin.svg';
import CustomSelect from './CustomSelect.vue';

export default {
  name: 'Music',
  setup() {
    const { t } = useI18n();
    return { t };
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
  computed: mapState({
    music: (state) => state.music.list,
    musicStatus: (state) => state.music.status,
    musicVolume: (state) => state.music.volume,
    currentMusicId: (state) => state.music.currentId,
    appStatus: (state) => state.appStatus,
  }),
  watch: {
    musicVolume(newVal) {
      this.audio.volume = newVal;
    },
  },
  methods: {
    ...mapMutations(['setCurrentMusicId', 'setMusicStatus', 'setMusicVolume']),
    handleChange(id) {
      this.setCurrentMusicId(id);
    },
    handleVolumeChange(value) {
      this.setMusicVolume(value / 100);
    },
    setPending() {
      this.setMusicStatus('pending');
    },
    setReady() {
      this.setMusicStatus('ready');
    },
  },
  components: {
    musicIcon,
    Spinner,
    CustomSelect,
  },
};
</script>
