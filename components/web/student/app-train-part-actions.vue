<template>
  <div
    v-if="staticLocales"
    class="tpa-main"
  >
    <div class="tpa-wrapper">
      <div class="tpa-buttons">
        <lazy-prime-block-u-i :blocked="isLoadingConfirm">
          <button
            :disabled="!isActiveConfirm || isLoadingConfirm"
            type="button"
            class="relative flex items-center justify-center gap-2 bg-purple-8d disabled:!border-gray-8b disabled:!bg-gray-8b active:!opacity-[.8] h-[60px] w-[155px] rounded-[10px] border-solid border-2 border-purple-8d"
            @click="onConfirm"
          >
            <span class="text-lg text-white font-bold">
              {{ staticLocales.trainPage.confirmAnswerLabel }}
            </span>
          </button>
        </lazy-prime-block-u-i>
        <button
          :disabled="!isActiveNext"
          type="button"
          class="a-nb relative flex items-center justify-center gap-2 bg-purple-8d disabled:!border-transparent disabled:!bg-gray-8b active:!opacity-[.8] h-[60px] w-[155px] rounded-[10px] border-solid border-2 border-purple-8d"
          @click="onNext"
        >
          <span class="text-lg text-white font-bold">
            {{ staticLocales.trainPage.next }}
          </span>
          <i class="fa-solid fa-chevron-left text-white absolute left-5"></i>
        </button>
      </div>
      <div class="c-e-wrapper">
        <button
          type="button"
          class="relative w-[190px] flex items-center justify-center gap-2 bg-white disabled:!border-transparent disabled:!bg-gray-8b active:!opacity-[.8] h-[60px] rounded-[10px] border-solid border-2 border-orange-39"
          @click="$emit('complainAction')"
        >
          <img
            alt="warn"
            src="/images/icons/warn.svg"
            class="flex w-[28px]"
          />
          <span class="text-lg text-orange-39 font-bold">
            {{ staticLocales.trainPage.complaintActionLabel }}
          </span>
        </button>
        <app-button
          label="إنهاء التدريب"
          variant="outline"
          iconStartClass="ek-icon-exit-door"
          @click="$emit('endAction')"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';

const emit = defineEmits([
  'confirmAction',
  'nextAction',
  'complainAction',
  'endAction',
]);

const props = withDefaults(
  defineProps<{
    isActiveConfirm?: boolean;
    isActiveNext?: boolean;
    isLoadingConfirm?: boolean;
  }>(),
  {}
);

//compo
const globalStore = useGlobalStore();

//data
const staticLocales = computed(() => globalStore.staticState.locales);

function onConfirm() {
  emit('confirmAction');
}
function onNext() {
  emit('nextAction');
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';
.tpa-main {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;

  .tpa-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include web-desktop-up() {
      display: grid;
      grid-template-columns: minmax(0, 60%) 1fr;
      column-gap: 20px;
    }
    @include web-xl-up() {
      display: grid;
      grid-template-columns: minmax(0, 70%) 1fr;
      column-gap: 36px;
    }

    .tpa-buttons {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      column-gap: 20px;
      button {
        @include web-desktop-up() {
          width: 172px;
        }
        &.a-nb {
          @include web-desktop-up() {
            width: 190px;
          }
        }
      }
      @include web-desktop-only() {
        column-gap: 20%;
      }
      @include web-xl-up() {
        column-gap: 214px;
      }
    }
  }

  .c-e-wrapper {
    display: none;
    @include web-desktop-up() {
      display: flex;
      justify-content: center;
      gap: 36px;
    }

    button {
      span {
        font-size: 20px;
        font-weight: normal;
      }
    }

    ::v-deep {
      .app-button {
        width: 190px !important;
        height: 60px !important;
        .app-button-icon {
          font-size: 29px;
        }
        .app-button-label {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
