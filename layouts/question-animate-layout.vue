<template>
  <client-only>
    <div id="question-animate-layout">
      <slot></slot>
    </div>
  </client-only>
</template>
<script lang="ts" setup>
import { QUESTION_ANIMATE_DEFAULT_CONFIG } from '~/main/utils/question-animate.utils';

provide('questionAnimateConfig', {
  ...QUESTION_ANIMATE_DEFAULT_CONFIG,
  hideQuestionTopActions: true,
  showClockTicking: true,
  showAnswerRect: true,
});

useHead({
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
});
</script>
<style lang="scss">
@import '@/assets/font-icons/ek-icon-v1.0/style.css';
#question-animate-layout > :first-child {
  overflow: hidden !important;
  display: flex;
  justify-self: center;
  width: 100%;
}
</style>
