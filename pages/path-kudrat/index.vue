<template>
  <div
    v-if="jsonData"
    class="track-details"
  >
    <lazy-paths-part1 />
    <lazy-paths-part2 />
    <lazy-paths-kudrat-part :listForSubject="listForSubject" />
  </div>
</template>
<script lang="ts" setup>
import { useLazyAsyncData } from '#app';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useCategoriesStore } from '~/main/modules/categories/services/useCategoriesStore';

//composable
const globalStore = useGlobalStore();
const categoriesStore = useCategoriesStore();
const runtimeConfig = useRuntimeConfig();

//meta
definePageMeta({
  layout: 'website-layout',
});

//data
const kudratJsonRequest = useLazyAsyncData(async () => {
  return globalStore.getKudratJsonStatic();
});
const listForSubjectRequest = useLazyAsyncData(async () => {
  return categoriesStore.getListForSubject({
    shownForBlog: true,
    subjects: [runtimeConfig.public.defaultSubjectId],
  });
});

const jsonData = computed(() => kudratJsonRequest.data.value);
const listForSubject = computed(() => listForSubjectRequest.data.value);
</script>
