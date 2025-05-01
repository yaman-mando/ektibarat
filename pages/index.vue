<template>
  <div class="home-page">
    <home-slide />
    <lazy-home-tasks hydrate-on-visible />
    <lazy-home-join-us hydrate-on-visible />
    <lazy-home-exam-part hydrate-on-visible />
    <lazy-home-stats-part hydrate-on-visible />
    <defer-view>
      <lazy-home-partners />
    </defer-view>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';

//composable
const globalStore = useGlobalStore();

await globalStore.getHomeStatic();

//meta
definePageMeta({
  layout: 'website-layout',
});
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.home-page {
}
</style>
