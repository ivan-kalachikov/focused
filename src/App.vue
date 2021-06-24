<template>
  <div class="md-layout">
    <MusicPlayer />
    <!-- <SoundPlayer /> -->
  </div>
</template>

<script>
import MusicPlayer from './components/MusicPlayer.vue';
// import SoundPlayer from './components/SoundPlayer.vue';

export default {
  name: 'App',
  components: {
    MusicPlayer,
    // SoundPlayer,
  },
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4d9dee;
  margin-top: 60px;
}
</style>
