<template>
  <prime-dialog
    v-if="staticLocales"
    :id="'question-animate-answer-modal'"
    v-model:visible="isOpen"
    :showHeader="false"
    :closeOnEscape="false"
    :closable="false"
    :dismissableMask="false"
    :modal="true"
    contentClass="rounded-[15px] overflow-hidden"
    bodyClass="!p-0 !pb-[15px]"
    class="mx-auto w-container a-wc-m question-animate-answer-modal"
  >
    <div class="qn-title-wrapper">
      <span class="qn-title-wrapper__title">
        {{ staticLocales.trainPage.solutionLabel }}
      </span>
    </div>

    <div class="aqs-w">
      <app-math-text-html
        :noPopover="true"
        :text="htmlContent"
      />
    </div>
  </prime-dialog>
</template>
<script lang="ts" setup>
import { useSetupStaticLocales } from '~/main/services/setup/useSetupStaticLocales';

const props = withDefaults(
  defineProps<{
    htmlContent: string;
  }>(),
  {}
);
const locales = useSetupStaticLocales();
const staticLocales = computed(() => locales.staticLocales.value);
const isOpen = ref(false);
function showModal() {
  isOpen.value = true;
}

function hideModal() {
  isOpen.value = false;
}

defineExpose({ showModal });
</script>
<style lang="scss">
@use '@/assets/scss/mixin' as *;

#question-animate-layout {
  .p-dialog-mask {
    opacity: 0;
  }
}

#question-animate-answer-modal {
  opacity: 0;
  margin-top: 100px;
  max-width: 516px;
  .math-text {
    > div {
      opacity: 1;
      > * {
        opacity: 0;
      }
    }
  }

  .math-text {
    font-size: 50px;
    * {
      font-size: 50px;
    }
  }

  .qn-title-wrapper {
    opacity: 0;
    display: flex;
    align-items: center;
    width: 100%;
    background-image: url('/images/png/seo-head-q.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: #fefeff;
    padding: 6px 15px 26px;
    &__title {
      color: #fff;
      font-size: 40px;
    }
    //@include mobile-down() {
    background-size: 149% 119%;
    background-repeat: no-repeat;
    background-color: #fefeff;
    padding: 6px 10px 10px;
    background-position: 100% -5px;
    height: 50px;
    //}
  }
}
</style>
