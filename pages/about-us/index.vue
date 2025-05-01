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
        v-if="detail"
        class="c-content"
        v-html="detail.text"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePrivacyStore } from '~/main/modules/privacy/services/usePrivacyStore';
import { useGlobalStore } from '~/main/useGlobalStore';
import { formatContentDate } from '~/main/utils/date-utils';
import { defaultMeta } from '~/main/constants/default-meta';
import { useLazyAsyncData } from '#app';

definePageMeta({
  layout: 'website-layout',
});

//composable
const imageUrl = useImageUrl();
const privacyStore = usePrivacyStore();
const globalStore = useGlobalStore();

const pageTitle = 'من نحن';

const { data } = useLazyAsyncData(async () => {
  const [metaData, detail] = await Promise.all([
    globalStore.getAboutUsStatic(),
    privacyStore.getWhoWeAre(),
  ]);

  return { metaData, detail };
});

const metaData = computed(() => data.value?.metaData);
const detail = computed(() => data.value?.detail);

useHead({
  title: metaData.value?.metaTitle,
  meta: [
    {
      id: 'og:title',
      property: 'og:title',
      content: `${metaData.value?.metaTitle ?? defaultMeta.title}`,
    },
    {
      id: 'keywords',
      name: 'keywords',
      content: metaData.value?.keywords ?? defaultMeta.keywords,
    },
    {
      id: 'og:description',
      name: 'description',
      content: metaData.value?.metaDescription ?? defaultMeta.description,
    },
    {
      id: 'description',
      name: 'description',
      content: metaData.value?.metaDescription ?? defaultMeta.description,
    },
    {
      id: 'og:image',
      property: 'og:image',
      content: metaData.value
        ? `${imageUrl.staticImageUrl(metaData.value.metaImage)}`
        : defaultMeta.img,
    },
    {
      property: 'twitter:image',
      content: metaData.value
        ? `${imageUrl.staticImageUrl(metaData.value.metaImage)}`
        : defaultMeta.img,
      id: 'twitter:image',
    },
    {
      property: 'twitter:title',
      content: metaData.value
        ? `${metaData.value.metaTitle}`
        : defaultMeta.title,
      id: 'twitter:title',
    },
    {
      property: 'twitter:description',
      content: metaData.value
        ? `${metaData.value.metaDescription}`
        : defaultMeta.description,
      id: 'twitter:description',
    },
  ],
});

const updateDate = computed(() =>
  formatContentDate(detail.value?.lastUpdateDate ?? null)
);
</script>
<style
  lang="scss"
  scoped
  src="@/assets/scss/shared/web-content-page.scss"
></style>
