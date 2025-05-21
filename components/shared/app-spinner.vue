<template>
  <div
    class="c-spinner"
    :class="[{ 'is-absolute': isAbsolute }]"
  ></div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    isAbsolute?: boolean;
  }>(),
  {
    isAbsolute: false,
  }
);
</script>
<style lang="scss" scoped>
.c-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #ccc;
  border-top-color: var(--purple-8c);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 8px auto;
  &.is-absolute {
    position: absolute;
    inset-block-start: 10px;
    inset-inline-start: 50%;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
