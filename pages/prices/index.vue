<template>
  <section class="web-subs-page">
    <!-- <div class="select-global">
      <span class="_title">نوع الباقة</span>
      <lazy-custom-switch
        v-model:active="selectedGlobalType"
        :rightLabel="'قدرات'"
        :leftLabel="'تحصيلي'"
      />
    </div> -->
    <lazy-app-old-prices-list />
  </section>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';
import { GlobalTypes } from '~/main/constants/global-types';

//composable
const globalStore = useGlobalStore();

//data
const selectedGlobalType = ref(false);

//watch
watch(
  () => globalStore.state.globalTypeUserValue,
  (newVal) => {
    if (newVal === GlobalTypes.tahsele) {
      selectedGlobalType.value = true;
    }
  },
  { immediate: true }
);

watch(
  () => selectedGlobalType.value,
  (newVal) => {
    const type = newVal ? GlobalTypes.tahsele : GlobalTypes.kudrat;
    globalStore.patchState({ globalTypeUserValue: type });
  }
);

//meta
definePageMeta({
  layout: 'website-layout',
});
</script>
<style lang="scss" scoped src="./prices.scss"></style>
