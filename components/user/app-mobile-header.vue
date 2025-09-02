<template>
  <div
    v-if="windowSize.isMobileSize"
    class="app-mobile-header z-10 w-full flex items-center justify-center p-[15px] bg-[#fff] shadow-[0_0_10px_0_rgba(0,0,0,0.15)]"
  >
    <div
      class="w-full grid grid-cols-[20px_1fr_20px] items-center justify-items-center"
    >
      <i
        class="fa fa-chevron-right cursor-pointer"
        @click="emit('backToEvent')"
      ></i>
      <h1 class="!m-0 text-center text-[#4B5363] text-[18px] font-bold">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string;
  }>(),
  {}
);
const emit = defineEmits<{
    (e: 'backToEvent'): void
}>()

const router = useRouter();
const windowSize = useWindowSize();
</script>
<style scoped lang="scss">
.app-mobile-header {
  height: var(--app-mobile-header-height);
}
</style>
