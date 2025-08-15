<template>
  <div
    v-if="staticLocales"
    class="tpa-main"
  >
    <div class="tpa-wrapper">
      <div></div>
      <div class="tpa-buttons">
        <app-button
          v-if="isActiveConfirm"
          :isDisabled="!isActiveConfirm || isLoadingConfirm"
          :isLoading="isLoadingConfirm"
          :label="staticLocales.trainPage.confirmAnswerLabel"
          labelClass="text-lg text-white font-bold"
          colorType="blue"
          @click="onConfirm"
        />
        <app-button
          v-else
          :isDisabled="!isActiveNext"
          label="السؤال التالي"
          labelClass="text-lg text-white font-bold"
          :colorType="colorTypeModel"
          @click="onNext"
        />
      </div>
      <div class="c-e-wrapper">
        <template v-if="isActiveQuestionAnswered">
          <app-popover-wrapper
            triggerEvent="click"
            popoverClass="ce-pop"
          >
            <template #trigger="{ bindTrigger }">
              <app-button
                class="ce-bt"
                v-bind="bindTrigger"
                variant="outline"
                iconStartClass="fa-solid fa-question"
                :label="windowSize.isMobileSize ? '' : 'مساعدة'"
                labelClass="text-lg text-orange-39"
              />
            </template>
            <template #content>
              <div class="ce-pop-content">
                <span class="qt-a">مساعدة</span>
                <div class="qt-w">
                  <div
                    class="qt-w-item"
                    @click="$emit('showAnswerAction')"
                  >
                    <img
                      src="/images/svg/lightbulb.svg"
                      alt=""
                    />
                    <span>طريقة الحل</span>
                  </div>
                  <div
                    v-if="canShowLaw"
                    class="qt-w-item"
                    @click="onLawsClick"
                  >
                    <img
                      src="/images/svg/br.svg"
                      alt=""
                    />
                    <span>قوانين السؤال</span>
                  </div>
                  <div class="qt-w-item">
                    <img
                      src="/images/svg/br.svg"
                      alt=""
                    />
                    <span>فيديوهات التأسيس</span>
                  </div>
                  <div
                    class="qt-w-item"
                    @click="$emit('complainAction')"
                  >
                    <img
                      src="/images/svg/triangle-exclamation-solid.svg"
                      alt=""
                    />
                    <span>أبلغنا عن خطأ</span>
                  </div>
                </div>
              </div>
            </template>
          </app-popover-wrapper>
        </template>
      </div>
    </div>
    <client-only>
      <lazy-app-laws-images-modal
        ref="laws_images_modal_ref"
        :questionId="questionId!"
      />
    </client-only>
  </div>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '~/main/useGlobalStore';
import { QuestionStateEnum } from '~/main/modules/students-exam/data-access/constats/question-state.enum';

const emit = defineEmits([
  'confirmAction',
  'nextAction',
  'complainAction',
  'endAction',
  'showAnswerAction',
  'showLawsAction',
]);

const props = withDefaults(
  defineProps<{
    isActiveConfirm?: boolean;
    isActiveNext?: boolean;
    isActiveQuestionAnswered?: boolean;
    isLoadingConfirm?: boolean;
    questionId?: string | number;
    canShowLaw?: boolean;
    questionState?: number;
  }>(),
  {}
);

//compo
const windowSize = useWindowSize();
const globalStore = useGlobalStore();

//data
const colorTypeModel = computed(() => {
  const state = props.questionState;
  if (!state) return 'blue';

  if (state === QuestionStateEnum.correct) {
    return 'success';
  }

  if (state === QuestionStateEnum.wrong) {
    return 'warn';
  }

  return 'blue';
});
const staticLocales = computed(() => globalStore.staticState.locales);

function onConfirm() {
  emit('confirmAction');
}
function onNext() {
  emit('nextAction');
}

const lawsModalRef = useTemplateRef('laws_images_modal_ref');

function onLawsClick() {
  lawsModalRef.value?.showModal();
  emit('showLawsAction');
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;
.tpa-main {
  padding-top: 15px !important;
  padding-bottom: 15px !important;
  @include web-desktop-up() {
    padding-top: 25px !important;
    padding-bottom: 25px !important;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;

  .tpa-wrapper {
    width: 100%;
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, 1fr);
    gap: 35px;
    @include web-desktop-up() {
      gap: 0;
    }

    .tpa-buttons {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      column-gap: 20px;
      :deep(.app-button) {
        width: 160px;
        height: 50px;
        border-radius: 8px;
        @include web-desktop-up() {
          width: 200px;
          height: 50px;
        }

        .app-button-label {
          font-size: 16px !important;
          @include web-desktop-up() {
            font-size: 18px !important;
          }
        }
      }
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
    @include web-desktop-up() {
      display: flex;
      justify-content: flex-end;
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
        border-radius: 25px;
        width: 50px !important;
        height: 50px !important;
        border-width: 1px !important;
        @include web-desktop-up() {
          width: 130px !important;
          height: 50px !important;
        }
        .app-button-icon {
          position: relative;
          inset-inline-start: 0;
          @include web-desktop-up() {
            position: absolute;
            inset-inline-start: 15px;
          }
          border-radius: 50%;
          border: 1px solid;
          display: flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .app-button-label-w {
          display: none;
          @include web-desktop-up() {
            display: flex;
          }
        }
        .app-button-label {
          padding-inline-start: 32px;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.ce-pop {
  .ce-pop-content {
    width: 280px;
    .qt-a {
      display: block;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: var(--purple-c2);
      margin-bottom: 10px;
    }
    .qt-w {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      gap: 20px;
      .qt-w-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        gap: 16px;
        img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: auto;
        }
        span {
          display: block;
          font-size: 20px;
          color: var(--purple-8c);
          text-align: start;
        }
      }
    }
  }
}
</style>
