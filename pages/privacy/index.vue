<template>
  <div class="web-content-page">
    <template v-if="request.status.value === 'pending'">
      <app-spinner />
    </template>
    <template v-else>
      <template v-if="request.data.value">
        <div class="a-part flex items-center justify-center">
          <div class="a-wrapper">
            <h1>{{ pageTitle }}</h1>
            <div class="date-wrapper">
              <span>تاريخ اخر تعديل:</span>
              <span>{{ updateDate }}</span>
            </div>
          </div>
        </div>
        <div class="c-part flex items-center justify-center">
          <div
            class="c-content"
            v-html="request.data.value.text"
          ></div>
        </div>
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { formatContentDate } from '~/main/utils/date-utils';
import { getMetaTitle } from '~/main/utils/shared-utils';
import { useStore } from 'vuex';
import type { AxiosResponse } from 'axios';
import { useLazyAsyncData } from '#app';
import type { PrivacyDataModel } from '~/main/modules/privacy/data-access/privacy.model';

//const
const pageTitle = 'سياسة الخصوصية';

//compo
const store = useStore();

//fetch
const request = useLazyAsyncData('privacy-content-request', async () => {
  const res: AxiosResponse<PrivacyDataModel> = await store.dispatch(
    'admin/callContentDetail',
    {
      type: 'privacy',
    }
  );
  return res.data;
});

//data
const updateDate = computed(() => {
  if (!request.data.value) return '';

  return formatContentDate(request.data.value.lastUpdateDate);
});

definePageMeta({
  layout: 'website-layout',
});

useHead({
  title: getMetaTitle(pageTitle),
});
</script>
<style
  lang="scss"
  scoped
  src="@/assets/scss/shared/web-content-page.scss"
></style>
