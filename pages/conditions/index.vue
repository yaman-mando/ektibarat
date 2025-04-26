<template>
  <div class="web-content-page">
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
        v-html="detail.text"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePrivacyStore } from '#shared/modules/privacy/services/usePrivacyStore';
import { useGlobalStore } from '#shared/useGlobalStore';
import { formatContentDate } from '#shared/utils/date-utils';
import { defaultMeta } from '#shared/constants/default-meta';

definePageMeta({
  layout: 'website-layout',
});

//composable
const imageUrl = useImageUrl();
const privacyStore = usePrivacyStore();
const globalStore = useGlobalStore();

const pageTitle = 'الشروط والأحكام';

const [metaData, detail] = await Promise.all([
  globalStore.getConditionStatic(),
  privacyStore.getCondition(),
]);

useHead({
  title: metaData.metaTitle,
  meta: [
    {
      id: 'og:title',
      property: 'og:title',
      content: `${metaData?.metaTitle ?? defaultMeta.title}`,
    },
    {
      id: 'keywords',
      name: 'keywords',
      content: metaData?.keywords ?? defaultMeta.keywords,
    },
    {
      id: 'og:description',
      name: 'description',
      content: metaData?.metaDescription ?? defaultMeta.description,
    },
    {
      id: 'description',
      name: 'description',
      content: metaData?.metaDescription ?? defaultMeta.description,
    },
    {
      id: 'og:image',
      property: 'og:image',
      content: metaData
        ? `${imageUrl.staticImageUrl(metaData.metaImage)}`
        : defaultMeta.img,
    },
    {
      property: 'twitter:image',
      content: metaData
        ? `${imageUrl.staticImageUrl(metaData.metaImage)}`
        : defaultMeta.img,
      id: 'twitter:image',
    },
    {
      property: 'twitter:title',
      content: metaData ? `${metaData.metaTitle}` : defaultMeta.title,
      id: 'twitter:title',
    },
    {
      property: 'twitter:description',
      content: metaData
        ? `${metaData.metaDescription}`
        : defaultMeta.description,
      id: 'twitter:description',
    },
  ],
});

const updateDate = formatContentDate(detail.lastUpdateDate);
</script>
<style
  lang="scss"
  scoped
  src="@/assets/scss/shared/web-content-page.scss"
></style>
