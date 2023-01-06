import { createI18n } from 'vue-i18n';
import messages from './messages';

const currentLanguage = window.navigator.language;

const i18n = createI18n({
  locale: currentLanguage,
  fallbackLocale: 'en',
  messages,
});

export default i18n;
