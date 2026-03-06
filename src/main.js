import { createApp } from 'vue';
import store from './store';
import i18n from './locales/i18n';
import App from './App.vue';

function initGA() {
  const gaId = import.meta.env.VITE_GA_ID;
  if (!gaId) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line no-inner-declarations
  function gtag(...args) { window.dataLayer.push(args); }
  gtag('js', new Date());
  gtag('config', gaId);
}

const app = createApp(App);
app.use(store)
  .use(i18n);

initGA();

app.mount('#app');
