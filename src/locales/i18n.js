import { createI18n } from 'vue-i18n';
import messages from './messages';

const browserLanguage = window.navigator.language;
const baseLanguage = browserLanguage.split('-')[0];
const currentLanguage = messages[browserLanguage] ? browserLanguage : baseLanguage;

const i18n = createI18n({
  locale: currentLanguage,
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages,
});

export default i18n;
