<template>
  <a-layout class="layout">
    <a-layout-content>
      <a-row align="middle" justify="center" class="container">
        <Main />
      </a-row>
    </a-layout-content>
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
}

.container {
  height: 100%;
  padding-top: 70px;
  padding-bottom: 70px;
}
</style>
