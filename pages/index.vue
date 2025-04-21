<template>
  <div class="home-page">
    <lazy-home-slide />
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '#shared/useGlobalStore';

//composable
const globalStore = useGlobalStore();

await globalStore.getHomeStatic();

//meta
definePageMeta({
  layout: 'website-layout',
  middleware: ['user-services-middleware'],
});
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.home-page {
}
</style>
