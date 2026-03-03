<template>
  <footer class="footer">
    <div class="footer-row">
      <div class="footer-col">
        <p>
          <span>{{ t('ui.inspiredBy') }}</span>
          <a href="https://listentothe.cloud" target="_blank" rel="noopener">https://listentothe.cloud</a>
        </p>
        <p>
          <span>{{ t('ui.thanksTo') }}</span>
          <a href="https://somafm.com" target="_blank" rel="noopener">https://somafm.com</a>
          {{ t('ui.forMusic') }}
        </p>
        <p>
          <a href="https://www.liveatc.net" target="_blank" rel="noopener">https://www.liveatc.net</a>
          {{ t('ui.forDispatcherTalks') }}
        </p>
      </div>
      <div class="footer-col footer-col--right">
        <div class="about-wrapper">
          <p class="about-toggle" @click="showAbout = !showAbout">
            {{ t('ui.about') }}
          </p>
          <div v-if="showAbout" class="about-content">
            <p>{{ t('ui.aboutText') }}</p>
          </div>
        </div>
        <p>
          <span>{{ t('ui.frontendBy') }}</span>
          <a href="https://github.com/Ivankalachikov/" target="_blank" rel="noopener">{{ t('authors.kalachikov') }}</a>
        </p>
        <p>
          <span>{{ t('ui.designBy') }}</span>
          <a href="https://www.behance.net/tatiana_emelyanova" target="_blank" rel="noopener">{{ t('authors.emelyanova') }}</a>
        </p>
      </div>
    </div>
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
  data() {
    return { showAbout: false };
  },
};
</script>

<style>
.footer {
  background: #23232C;
  padding: 24px 40px;
}

.footer-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-col {
  flex: 1;
  min-width: 280px;
}

.footer-col--right {
  text-align: right;
}

.footer p {
  margin: 0 0 4px;
  font-size: 14px;
  color: #dadada;
}

.about-wrapper {
  position: relative;
  display: inline-block;
  margin-left: auto;
}

.about-toggle {
  cursor: pointer;
  display: inline-block;
}

.about-toggle:hover {
  color: #eee;
}

.about-content {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: #23242B;
  border: 1px solid #45444B;
  border-radius: 6px;
  padding: 12px 16px;
  width: 380px;
  max-width: 90vw;
  z-index: 100;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .footer {
    padding: 24px 16px;
  }

  .footer-col--right {
    text-align: left;
  }

  .about-content {
    right: auto;
    left: 0;
  }
}
</style>
