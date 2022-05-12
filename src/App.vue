<template>
  <section class="layout">
    <Main />
    <Footer />
  </section>
</template>

<script>
import Main from './components/Main.vue';
import Footer from './components/Footer.vue';
import 'element-plus/theme-chalk/dark/css-vars.css';

export default {
  name: 'App',
  components: {
    Main,
    Footer,
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

:global(body) {
  background-color: $primary-background;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  color: $text-color-primary;
}

.layout {
  min-height: 100%;
  overflow: hidden;
  position: relative;
}

</style>
