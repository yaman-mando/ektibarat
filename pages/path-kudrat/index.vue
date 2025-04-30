<template>
  <div
    v-if="jsonData"
    class="track-details"
  >
    <paths-part1 />
    <lazy-paths-part2 hydrate-on-visible />
    <defer-view>
      <lazy-paths-kudrat-part />
      <lazy-paths-part3 />
    </defer-view>
  </div>
</template>
<script lang="ts" setup>
import { useLazyAsyncData } from '#app';
import { useGlobalStore } from '~/main/useGlobalStore';

//composable
const globalStore = useGlobalStore();

//meta
definePageMeta({
  layout: 'website-layout',
});

//data
const kudratJsonRequest = useLazyAsyncData(async () => {
  return globalStore.getKudratJsonStatic();
});

const jsonData = computed(() => kudratJsonRequest.data.value);
</script>
