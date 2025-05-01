<template>
  <div
    v-if="jsonData"
    class="track-details"
  >
    <paths-part1 :isTahsel="true" />
    <lazy-paths-part2
      :isTahsel="true"
      hydrate-on-visible
    />
    <defer-view>
      <lazy-paths-tahsel-part />
      <lazy-paths-part3 :isTahsel="true" />
    </defer-view>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';

//composable
const globalStore = useGlobalStore();

//meta
definePageMeta({
  layout: 'website-layout',
});

//data
const tahselJsonRequest = useLazyAsyncData(async () => {
  return globalStore.getTahselJsonStatic();
});

const jsonData = computed(() => tahselJsonRequest.data.value);
</script>
