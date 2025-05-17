<template>
  <exam-info-id-page :examInfo="examInfo" />
</template>
<script lang="ts" setup>
import { useStore } from 'vuex';
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';
import { defaultMeta } from '~/main/constants/default-meta';
import { getKeyWords } from '~/main/utils/shared-utils';
import { metaOption } from '~/main/constants/meta-options';
import ExamInfoIdPage from '~/pages/exam-info/[id]/[title]/exam-info-id-page.vue';

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const store = useStore();
const { error } = await useAsyncData('exam-info', async () => {
  const params = route.params;
  console.log(params);
  console.log(decodeURIComponent(route.path));
  const id = !params.id ? params.title : params.id;

  await store.dispatch('student/callExamWizardDetails', id);
  await store.dispatch('student/callExamSuggestions', id);

  return store.state.student.examWizardDetails;
});

if (error.value) {
  await navigateTo(webErrorPathUtil());
}

const examInfo = computed(() => {
  return store.state.student.examWizardDetails;
});

definePageMeta({
  layout: 'website-layout',
});
useHead({
  bodyAttrs: {
    class: 'no-background',
  },
  meta: [
    { charset: 'utf-8' },
    {
      property: 'og:title',
      content: `${examInfo.value.title ? examInfo.value.title : defaultMeta.title}`,
    },
    {
      property: 'og:description',
      content: `${
        examInfo.value.shortDescription
          ? examInfo.value.shortDescription
          : defaultMeta.description
      }`,
    },
    {
      property: 'description',
      content: `${
        examInfo.value.shortDescription
          ? examInfo.value.shortDescription
          : defaultMeta.description
      }`,
    },
    { name: 'author', content: `اختبارات` },
    { name: 'robots', content: 'index,follow' },
    { name: 'keywords', content: getKeyWords() },
    { name: 'theme-color', content: '#4F008C' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    {
      name: 'apple-mobile-web-app-title',
      content: `${examInfo.value.title ?? defaultMeta.title}`,
    },
    {
      property: 'og:image',
      content: examInfo.value.pictureUrl
        ? `${runtimeConfig.public.websiteUrl}/files/Exams/${examInfo.value.pictureUrl}-meta.jpg`
        : defaultMeta.img,
    },
    {
      property: 'og:image:secure_url',
      content: examInfo.value.pictureUrl
        ? `${runtimeConfig.public.websiteUrl}/files/Exams/${examInfo.value.pictureUrl}-meta.jpg`
        : defaultMeta.img,
    },
    {
      property: 'og:image:width',
      content: metaOption.facebook.width,
    },
    {
      property: 'og:image:height',
      content: metaOption.facebook.height,
    },
    { property: 'og:title', content: 'اختبارات' },
    {
      property: 'og:url',
      content: `${runtimeConfig.public.websiteUrl}${route.path}`,
    },
    {
      property: 'og:site_name',
      content: 'اختبارات',
    },
    { property: 'og:type', content: 'product' },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:creator',
      content: `${examInfo.value.title}- @ekhtibarat`,
    },
    { name: 'twitter:site', content: 'اختبارات' },
    {
      name: 'twitter:image',
      property: 'twitter:image',
      content: examInfo.value.pictureUrl
        ? `${runtimeConfig.public.websiteUrl}/files/Exams/${examInfo.value.pictureUrl}-xs.jpg`
        : defaultMeta.img,
    },
    {
      property: 'twitter:title',
      name: 'twitter:title',
      content: `${examInfo.value.title}`,
    },
    {
      name: 'twitter:description',
      property: 'twitter:description',
      content: `${
        examInfo.value.shortDescription
          ? examInfo.value.shortDescription
          : 'اختبارات'
      }`,
    },
    {
      name: 'twitter:url',
      property: 'twitter:url',
      content: `${runtimeConfig.public.websiteUrl}${route.path}`,
    },
  ],
});
</script>
