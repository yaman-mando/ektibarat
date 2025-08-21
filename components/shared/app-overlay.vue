<template>
  <div
    ref="overlay_ref"
    class="app-overlay"
    :class="[{ 'full-screen': fullScreen }, variant]"
  >
    <div class="app-overlay__wrapper">
      <lazy-app-spinner v-if="!hideSpinner" />
      <span v-if="msg">{{ msg }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    msg?: string | null;
    fullScreen?: boolean;
    hideSpinner?: boolean;
    variant?: 'light' | 'dark';
  }>(),
  { msg: null, fullScreen: false, hideSpinner: false, variant: 'light' }
);
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
  z-index: 999;
  pointer-events: all;

  &.dark {
    background-color: #252525bf;
  }

  &.full-screen {
    position: fixed;
  }
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    span {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
