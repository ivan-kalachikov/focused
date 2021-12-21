<template>
  <a-col :xs="{ span: 22 }" :md="{ span: 11 }" :xl="{ span: 7 }" :xxl="{ span: 5 }">
    <a-card :bordered="false">
      <a-row :gutter="16" justify="start">
        <a-col flex="55px" :class="['icon-wrapper', musicStatus === 'failed' && 'error']">
          <Spinner v-if="musicStatus === 'pending' && appStatus === 'playing'" class="spinner" />
          <musicIcon />
        </a-col>
        <a-col flex="auto">
          <a-select
            size="large"
            show-search
            optionFilterProp="name"
            :placeholder="t('ui.selectMusic')"
            style="width: 100%"
            :filter-option="true"
            @change="handleChange"
            :default-value="currentMusicId"
          >
            <a-select-option
              v-for="item in music"
              :key="item.id"
              :value="item.id"
              :name="item.name"
              :title="item.description"
            >
              <span v-if="item">
                <img width="40" height="40" :src="item.imageUrl" />
                {{ item.name }}
              </span>
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col flex="100%">
          <a-slider
            @change="handleVolumeChange"
            :default-value="100"
            tooltipPlacement="bottom"
            :disabled="musicStatus === 'failed'"
          />
          </a-col>
      </a-row>
    </a-card>
  </a-col>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import musicIcon from '../assets/music.svg';
import Spinner from '../assets/tail-spin.svg';

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
  },
};
</script>

<style>
.ant-select-item-option-content {
  height: 50px;
  align-items: center;
  display: flex;
}

.ant-select-item-option-content img {
  width: 40px;
  height: 40px;
  margin-right: 5px;
}

.ant-select-selection-item img {
  display: none;
}

.icon-wrapper {
  position: relative;
}

.icon-wrapper.error path {
  fill: #6f2b39;
}

.spinner {
  position: absolute;
  top: -1px;
  left: 7px;
}
</style>
