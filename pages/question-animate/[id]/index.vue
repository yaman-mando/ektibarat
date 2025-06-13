<template>
  <question-animate-id-page-part
    v-if="dataStatic"
    :data="dataStatic"
  />
</template>
<script setup lang="ts">
import { QUESTION_ANIMATE_DEFAULT_CONFIG } from '~/main/utils/question-animate.utils';
import { useStore } from 'vuex';
import { useGlobalStore } from '~/main/useGlobalStore';
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';

export type QuestionAnimateDataUiModel = {
  text1: string | null;
  text2: string | null;
  speedAnimationBy: number;
};

const questionAnimateConfig = inject(
  'questionAnimateConfig',
  QUESTION_ANIMATE_DEFAULT_CONFIG
);
const globalStore = useGlobalStore();
const store = useStore();
const route = useRoute();
const params = route.params;

const getAnimateSpeed = (str) => {
  if (!str) return 1;

  const parsed = parseInt(str, 10);
  if (!isNaN(parsed) && isFinite(parsed) && parsed !== 0) {
    return parsed;
  }
  return 1;
};

const dataStatic = ref<QuestionAnimateDataUiModel | null>(null);

try {
  const id = params.id;
  await globalStore.getLocalesJsonStatic();
  await store.dispatch('getExamQuestion', id);
  const file1Static = await globalStore.getFile1JsonStatic();
  dataStatic.value = {
    text1: file1Static?.text1 ? file1Static?.text1 : null,
    text2: file1Static?.text2 ? file1Static?.text2 : null,
    speedAnimationBy: getAnimateSpeed(file1Static?.speedAnimationBy),
  };
} catch (e) {
  console.error(e);
  navigateTo(webErrorPathUtil());
}

definePageMeta({
  layout: 'question-animate-layout',
});
</script>
