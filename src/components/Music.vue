<template>
  <DataList
    class="music-list"
    :items="musicArray"
    value-key="id"
    label-key="name"
    filter-key="name"
    :model-value="currentMusicId"
    :volume="musicVolume"
    :label="t('ui.musicFeed')"
    :volume-aria-label="t('ui.musicVolume')"
    @update:model-value="setCurrentMusicId"
    @update:volume="setMusicVolume"
  >
    <template #row="{ item, active }">
      <div class="music-list__info">
        <span class="music-list__name">{{ item.name }}</span>
        <span v-if="active" class="music-list__desc">{{ item.description }}</span>
      </div>
    </template>
  </DataList>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { useI18n } from 'vue-i18n';
import DataList from './DataList.vue';

export default {
  name: 'Music',
  components: { DataList },
  props: ['audio'],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  computed: {
    ...mapState({
      music: (state) => state.music.list,
      musicVolume: (state) => state.music.volume,
      currentMusicId: (state) => state.music.currentId,
      musicStatus: (state) => state.music.status,
      appStatus: (state) => state.appStatus,
    }),
    // music is an array in store, ensure it's iterable
    musicArray() {
      return Array.isArray(this.music) ? this.music : Object.values(this.music);
    },
  },
  watch: {
    audio(el) {
      if (el) el.volume = this.musicVolume;
    },
    musicVolume(newVal) {
      if (this.audio) this.audio.volume = newVal;
    },
  },
  beforeUpdate() {
    if (this.audio) {
      this.audio.addEventListener('waiting', this.setPending);
      this.audio.addEventListener('emptied', this.setPending);
      this.audio.addEventListener('loadeddata', this.setReady);
    }
  },
  beforeUnmount() {
    if (this.audio) {
      this.audio.removeEventListener('waiting', this.setPending);
      this.audio.removeEventListener('emptied', this.setPending);
      this.audio.removeEventListener('loadeddata', this.setReady);
    }
  },
  methods: {
    ...mapMutations(['setCurrentMusicId', 'setMusicStatus', 'setMusicVolume']),
    setPending() { this.setMusicStatus('pending'); },
    setReady() { this.setMusicStatus('ready'); },
  },
};
</script>

<style>
.music-list {
  grid-area: music;
}

.music-list__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.music-list__name {
  font-size: 16px;
}

.music-list__desc {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 300;
}
</style>
