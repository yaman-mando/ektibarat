<template>
  <div
    ref="overlay_ref"
    class="app-overlay"
  >
    <lazy-app-spinner />
  </div>
</template>

<script lang="ts" setup>
const overlayRef = useTemplateRef('overlay_ref');

onMounted(() => {
  // if (props.noWrap) {
  // const parent = overlay.value?.parentElement;
  // if (parent && getComputedStyle(parent).position === 'static') {
  //   parent.style.position = 'relative';
  // }
  // }
});
</script>

<style lang="scss" scoped>
.app-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #e8e8e8bf;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: all;
}
</style>
