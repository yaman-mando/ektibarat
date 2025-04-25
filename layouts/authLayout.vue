<template>
  <client-only>
    <div class="auth-layout">
      <div class="app-nuxt">
        <slot></slot>
      </div>
    </div>
  </client-only>
</template>
<script setup lang="ts">
useHead({
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
});
</script>
<style lang="scss">
@import '@/assets/scss/style';

* {
  @include app-scroll-bar();
}

#__layout,
#__nuxt,
body,
html {
  height: 100%;
  overflow-y: hidden;
}

.auth-layout {
  height: 100%;
  //background-color: var(--bg-color);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;

  .app-nuxt {
    height: 100%;
    width: 100%;
    //margin-inline-end: 8px;
  }
}
</style>
