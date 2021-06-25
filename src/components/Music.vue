<template>
  <a-col :xs="{ span: 22 }" :md="{ span: 11 }" :xl="{ span: 7 }" :xxl="{ span: 5 }">
    <a-card :bordered="false">
      <a-row :gutter="16" justify="start">
        <a-col flex="55px">
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
          <a-slider @change="handleVolumeChange" :default-value="100" tooltipPlacement="bottom" />
          </a-col>
      </a-row>
    </a-card>
  </a-col>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { mapState, mapMutations } from 'vuex';
import musicIcon from '../assets/music.svg';

export default {
  name: 'Music',
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: mapState({
    music: (state) => state.music,
    currentMusicId: (state) => state.currentMusicId,
  }),
  methods: {
    ...mapMutations(['setCurrentMusicId']),
    handleChange(id) {
      this.setCurrentMusicId(id);
      if (this.appStatus === 'playing') {
        this.$refs.musicPlayer.play();
      }
    },
    handleVolumeChange(value) {
      this.$refs.musicPlayer.volume = value / 100;
    },
  },
  components: {
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
  display: none;
}
</style>
