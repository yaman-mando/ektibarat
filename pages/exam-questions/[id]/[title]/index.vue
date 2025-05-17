<template>
  <exam-question-id-page />
</template>
<script lang="ts" setup>
import { GlobalTypes } from '~/main/constants/global-types';
import { defaultMeta } from '~/main/constants/default-meta';
import { useStore } from 'vuex';
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';
import ExamQuestionIdPage from '~/pages/exam-questions/[id]/[title]/exam-question-id-page.vue';

definePageMeta({
  layout: 'exam-question-layout',
  middleware: 'user-services-middleware',
});

const runtimeConfig = useRuntimeConfig();
const store = useStore();
const route = useRoute();
const params = route.params;
const { data, error } = await useAsyncData('exam-info', async () => {
  const id = !params.id ? params.title : params.id;
  if (!store.state.examQuestion || store.state.examQuestion.id !== id) {
    return await store.dispatch('getExamQuestion', id);
  }
  return store.state.examQuestion;
});

if (error.value) {
  await navigateTo(webErrorPathUtil());
}

const questionData = data.value;
const isTahseleQuestion = questionData?.grade == GlobalTypes.tahsele;
const staticTitle = () => {
  if (isTahseleQuestion) {
    return 'أسئلة اختبار تحصيلي | اختبارات';
  }
  return 'أسئلة اختبار القدرات | اختبارات';
};

const titleSeo = computed(() => {
  try {
    if (questionData && questionData?.questionSlug) {
      const re = new RegExp('-', 'g');
      return questionData.questionSlug.replace(re, ' ') + ' | ' + staticTitle();
    }
    return staticTitle();
  } catch (e) {
    return staticTitle();
  }
});

function staticTypeName() {
  if (isTahseleQuestion) {
    return 'تحصيلي';
  }
  return 'القدرات العامة';
}

function descSeo() {
  try {
    const re = new RegExp('-', 'g');
    const desc =
      ` انضم إلى اختبارات وتدرب على هذا السؤال من اختبار ${staticTypeName()} - قسم ` +
      questionData?.categoryTitle +
      ' والكثير من الأسئلة باستخدام الذكاء الاصطناعي. تعرف على إجابة سؤال ' +
      questionData?.questionSlug.replace(re, ' ') +
      ' وطريقة الحل.';
    return desc;
  } catch (e) {
    return `انضم إلى اختبارات وتدرب على هذا السؤال من اختبار ${staticTypeName()} و طريقة الحل`;
  }
}

function keyWords() {
  try {
    const re = new RegExp('-', 'g');
    const _title = questionData?.questionSlug.replace(re, ' ');
    const title = _title?.split(' ').slice(0, 4);
    return title?.join(', ');
  } catch (e) {
    return null;
  }
}

useHead({
  title: titleSeo.value ?? defaultMeta.title,
  meta: [
    { charset: 'utf-8' },
    {
      property: 'og:title',
      name: 'og:title',
      content: titleSeo.value ?? defaultMeta.title,
    },
    {
      name: 'og:description',
      property: 'og:description',
      content: descSeo() ?? defaultMeta.description,
    },
    {
      property: 'description',
      name: 'description',
      content: descSeo() ?? defaultMeta.description,
    },
    { name: 'author', content: `اختبارات` },
    { name: 'robots', content: 'index,follow' },
    { name: 'keywords', content: keyWords() },
    { name: 'theme-color', content: '#4F008C' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    {
      name: 'apple-mobile-web-app-title',
      content: `${titleSeo.value ?? defaultMeta.title}`,
    },
    {
      property: 'og:url',
      content: `${runtimeConfig.public.websiteUrl}${route.path}`,
    },
    {
      property: 'og:site_name',
      content: 'اختبارات',
    },
    { property: 'og:type', content: 'learning' },
    {
      property: 'og:image',
      content: questionData?.contentUrl
        ? `${runtimeConfig.public.websiteUrl}/files/questions/image/${questionData?.contentUrl}-xs.jpg`
        : '/images/EkhtibaratLogoColor.png',
    },
    {
      name: 'google-site-verification',
      content: 'gO1k74ix_HujK_ULD07VzvKm_qnv_sHX1GUY3_zZKIo',
    },
  ],
});
</script>
