<template>
  <div class="training-layout">
    <slot></slot>
    <client-only>
      <lazy-surveys-modal ref="modal_surveys_ref" />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { useStore } from 'vuex';

const store = useStore();
const modalSurveysRef = useTemplateRef('modal_surveys_ref');
const openModalTimeoutId = ref<any>(null);

const openSurveysModal = () => {
  if (import.meta.client) {
    modalSurveysRef.value?.showModal();
  }
};

const selectedSurveys = computed(() => store.state.selectedSurveys);

watch(
  () => selectedSurveys,
  (newVal) => {
    if (openModalTimeoutId.value) {
      clearTimeout(openModalTimeoutId.value);
      openModalTimeoutId.value = null;
    }

    if (!newVal) return;
    const waitTime = (newVal.value?.timeInitialize || 0) * 1000;
    openModalTimeoutId.value = setTimeout(() => {
      openSurveysModal();
      openModalTimeoutId.value = null;
    }, waitTime);
  },
  { immediate: true, deep: true }
);

//meta
useHead({
  title: 'اختبارات',
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light',
  },
});
</script>
<style lang="scss">
@import '@/assets/scss/shared/sidebar-filter.scss';
@import '@/assets/scss/style.scss';
@import '@/assets/em-icons/style.css';
@import '@/assets/scss/main.scss';
* {
  @include app-scroll-bar();
}

#g_a11y_announcement {
  display: none;
}

#__layout,
#__nuxt,
body,
html {
  height: 100%;
  overflow-y: hidden;
  &.zoom-wrapper {
    .training-layout {
      zoom: 0.9;
      @media (max-width: 1399px) {
        .image-panner {
          zoom: 1.1;
        }
      }
    }
  }
}
.training-layout {
  height: 100%;
  width: 100%;
  //background-color: var(--bg-color);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  //overflow-y: auto;

  .a-select-item {
    &.correct-answer,
    &.wrong-answer,
    &.active {
      border-width: 3px !important;
    }
  }
}
</style>
