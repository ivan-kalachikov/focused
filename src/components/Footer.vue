<template>
  <footer class="footer">
    <span>{{ t('ui.inspiredBy') }} <a href="https://listentothe.cloud" target="_blank" rel="noopener">listentothe.cloud</a></span>
    <span class="footer__sep">|</span>
    <span>{{ t('ui.frontendBy') }} <a href="https://github.com/Ivankalachikov/" target="_blank" rel="noopener">{{ t('authors.kalachikov') }}</a></span>
    <span class="footer__sep">|</span>
    <span>{{ t('ui.designBy') }} <a href="https://www.behance.net/tatiana_emelyanova" target="_blank" rel="noopener">{{ t('authors.emelyanova') }}</a></span>
    <span class="footer__sep">|</span>
    <span>v0.2.0</span>
  </footer>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'Footer',
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>

<style>
.footer {
  grid-area: footer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  height: 36px;
  padding: 0 24px;
  background: var(--surface);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-top: 1px solid var(--glass-border);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 300;
  color: var(--text-dim);
  overflow-x: auto;
  white-space: nowrap;
}
.footer a {
  color: var(--text-primary);
  text-decoration: none;
}
.footer a:hover {
  color: #fff;
  text-decoration: underline;
}
.footer__sep {
  margin: 0 8px;
  color: var(--text-muted);
}
@media (max-width: 767px) {
  .footer {
    padding: 0 16px;
    font-size: 10px;
  }
}
</style>
