<template>
  <a-layout-footer>
    <a-row justify="space-between">
      <a-col :xs="{ span: 24 }" :md="{ span: 11 }" :xl="{ span: 8 }">
        <a-typography-paragraph>
          <a-typography-text>{{ t('ui.inspiredBy') }}</a-typography-text>
          <a-typography-link
            type="secondary"
            href="https://listentothe.cloud"
            target="_blank"
            rel="noopener"
            >https://listentothe.cloud</a-typography-link
          >
        </a-typography-paragraph>
        <a-typography-paragraph>
          <a-typography-text>{{ t('ui.thanksTo') }}</a-typography-text>
          <a-typography-link
            type="secondary"
            href="https://somafm.com"
            target="_blank"
            rel="noopener"
            >https://somafm.com</a-typography-link
          >{{ t('ui.forMusic') }}
        </a-typography-paragraph>
        <a-typography-paragraph>
          <a-typography-link
            type="secondary"
            href="https://www.liveatc.net"
            target="_blank"
            rel="noopener"
            >https://www.liveatc.net</a-typography-link
          >{{ t('ui.forDispatcherTalks') }}
        </a-typography-paragraph>
      </a-col>
      <a-col :xs="{ span: 24 }" :md="{ span: 11 }" :xl="{ span: 8 }" align="right">
        <a-popover class="about" placement="topRight">
          <template v-slot:content>
            <slot>
              <p>{{ t('ui.aboutText') }}</p>
            </slot>
          </template>
          <a-typography-paragraph>
            {{ t('ui.about') }}
          </a-typography-paragraph>
        </a-popover>
        <a-typography-paragraph>
          <a-typography-text>{{ t('ui.frontendBy') }}</a-typography-text>
          <a-typography-link
            type="secondary"
            href="https://github.com/Ivankalachikov/"
            target="_blank"
            rel="noopener"
            >{{ t('authors.kalachikov') }}</a-typography-link
          >
        </a-typography-paragraph>
        <a-typography-paragraph>
          <a-typography-text>{{ t('ui.designBy') }}</a-typography-text>
          <a-typography-link
            type="secondary"
            href="https://www.behance.net/tatiana_emelyanova"
            target="_blank"
            rel="noopener"
            >{{ t('authors.emelyanova') }}</a-typography-link
          >
        </a-typography-paragraph>
      </a-col>
    </a-row>
  </a-layout-footer>
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
.ant-layout-footer .ant-typography {
  margin-bottom: 0;
}

.about .ant-typography {
  display: inline-block;
  margin-left: auto;
}

.ant-popover-content {
  max-width: 300px;
}
</style>
