<template>
  <a-layout class="layout">
    <Main />
    <Footer />
  </a-layout>
</template>

<script>
import Main from './components/Main.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Main,
    Footer,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4d9dee;
  height: 100%;
}

.layout {
  min-height: 100%;
  overflow: hidden;
  position: relative;
}

</style>
