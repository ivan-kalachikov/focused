<template>
  <div class="layout">
    <Main />
    <Footer />
    <transition name="fade">
      <div v-if="toast" :class="['toast', `toast--${toast.type}`]">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Main from './components/Main.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Main,
    Footer,
  },
  computed: mapState(['toast']),
  watch: {
    toast(val) {
      if (val) {
        setTimeout(() => this.clearToast(), 3000);
      }
    },
  },
  methods: mapMutations(['clearToast']),
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background: #191921;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #dadada;
  height: 100%;
}

a {
  color: #bbb;
  text-decoration: none;
}

a:hover, a:active {
  color: #eee;
}

.layout {
  min-height: 100%;
  overflow: hidden;
  position: relative;
  background: #191921;
  display: flex;
  flex-direction: column;
}

/* Shared layout utilities */
.row {
  display: flex;
  flex-wrap: wrap;
}

.justify-center {
  justify-content: center;
}

/* Shared card styles */
.card-col {
  width: 100%;
  max-width: 360px;
}

.card {
  background: #23242B;
  border-radius: 8px;
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

/* Text utilities */
.text-secondary {
  color: #888;
}

/* Shared slider styles */
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: #393744;
  border-radius: 3px;
  outline: none;
  margin-top: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #3949D3;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #3949D3;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Shared icon wrapper */
.icon-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 40px;
}

.icon-wrapper.error path {
  fill: #6f2b39;
}

.icon-wrapper.error circle {
  stroke: #6f2b39;
}

.spinner {
  position: absolute;
  top: -1px;
  left: -1px;
}

/* Toast notifications */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  border-radius: 6px;
  color: #dadada;
  font-size: 14px;
  z-index: 1000;
}

.toast--error {
  background: #5E2551;
  border: 1px solid #6f2b39;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
