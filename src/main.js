import { createApp } from 'vue';
import {
  Button, Select, Typography, Slider, Row, Col, Card,
} from 'ant-design-vue';
import store from './store';
import i18n from './locales/i18n';

import App from './App.vue';

const AppInstance = createApp(App);
AppInstance.use(store)
  .use(i18n)
  .use(Button)
  .use(Select)
  .use(Typography)
  .use(Slider)
  .use(Row)
  .use(Col)
  .use(Card)
  .mount('#app');
