import { createApp } from 'vue';
import {
  Select, Typography, Slider, Row, Col, Card, Layout, Popover,
} from 'ant-design-vue';
import AudioVisual from 'vue-audio-visual';
import store from './store';
import i18n from './locales/i18n';

import App from './App.vue';

const AppInstance = createApp(App);
AppInstance.use(store)
  .use(i18n)
  .use(Select)
  .use(Typography)
  .use(Slider)
  .use(Row)
  .use(Col)
  .use(Card)
  .use(Layout)
  .use(Popover)
  .use(AudioVisual)
  .mount('#app');
