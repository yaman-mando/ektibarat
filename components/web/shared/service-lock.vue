<template>
  <i
    :style="fontSize ? `font-size:${fontSize}px` : ''"
    class="fa fa-lock service-loc-icon"
  ></i>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    fontSize?: string | null;
  }>(),
  { fontSize: null }
);
</script>
<style lang="scss" scoped>
i.service-loc-icon {
  color: var(--gray-97) !important;
}
</style>
