<template>
  <div class="web-content-page">
    <div class="a-part flex items-center justify-center">
      <div class="a-wrapper">
        <h1>شروط وأحكام برنامج الشراكات</h1>
        <div
          v-if="detail?.['conditions-date']"
          class="date-wrapper"
        >
          <span>تاريخ اخر تعديل:</span>
          <span>{{ detail['conditions-date'] }}</span>
        </div>
      </div>
    </div>
    <div class="c-part !flex items-center justify-center">
      <div
        class="c-content"
        v-html="detail?.['conditions-text']"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';
import { defaultMeta } from '~/main/constants/default-meta';

const globalStore = useGlobalStore();
const imageUrl = useImageUrl();
await globalStore.getConditionStatic();
await globalStore.getPartnerShipConditionsJsonStatic();

//data
const metaData = globalStore.staticState.conditionJson!;
const detail = globalStore.staticState.partnerShipConditionsJson;

definePageMeta({
  layout: 'website-layout',
});
useHead({
  title: metaData.metaTitle,
  meta: [
    {
      property: 'og:title',
      content: `${metaData?.metaTitle ?? defaultMeta.title}`,
    },
    {
      name: 'keywords',
      content: metaData?.keywords ?? defaultMeta.keywords,
    },
    {
      name: 'description',
      content: metaData?.metaDescription ?? defaultMeta.description,
    },
    {
      name: 'description',
      content: metaData?.metaDescription ?? defaultMeta.description,
    },
    {
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
    },
    {
      property: 'twitter:title',
      content: metaData ? `${metaData.metaTitle}` : defaultMeta.title,
    },
    {
      property: 'twitter:description',
      content: metaData
        ? `${metaData.metaDescription}`
        : defaultMeta.description,
    },
  ],
});
</script>
<style
  lang="scss"
  scoped
  src="@/assets/scss/shared/web-content-page.scss"
></style>
