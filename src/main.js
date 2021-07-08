import { createApp } from 'vue';
import {
  Select, Typography, Slider, Row, Col, Card, Layout, Popover,
} from 'ant-design-vue';
import AudioVisual from 'vue-audio-visual';
import VueYandexMetrika from 'vue-yandex-metrika';
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
  .use(VueYandexMetrika, {
    id: 82726366,
    env: process.env.NODE_ENV,
  })
  .mount('#app');
