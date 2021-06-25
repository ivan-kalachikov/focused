<template>
   <a-layout-footer>
      <a-row justify="space-between">
        <a-col :xs="{ span: 24 }" :md="{ span: 11 }" :xl="{ span: 8 }">
          <a-typography-text>{{t('ui.inspiredBy')}}</a-typography-text>
          <a-typography-link type="secondary" href="https://listentothe.cloud/">https://listentothe.cloud/</a-typography-link>
        </a-col>
        <a-col :xs="{ span: 24 }" :md="{ span: 11 }" :xl="{ span: 8 }">
          <a-typography-paragraph align="right">
            <a-typography-text>{{t('ui.designBy')}}</a-typography-text>
            <a-typography-link type="secondary" href="https://www.behance.net/tatiana_emelyanova">Татьяна Емельянова</a-typography-link>
          </a-typography-paragraph>
          <a-typography-paragraph align="right">
            <a-typography-text>{{t('ui.frontendBy')}}</a-typography-text>
            <a-typography-link type="secondary" href="https://github.com/Ivankalachikov/">Иван Калачиков</a-typography-link>
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
</style>
