<template>
  <div>
    <NuxtRouteAnnouncer />
    <LazyHelloMessage v-if="isLazyLoadedComponentVisible" />
    <button @click="isLazyLoadedComponentVisible = true">load</button>
  </div>
</template>
<script setup lang="ts">
const isLazyLoadedComponentVisible = ref(false);
</script>
