<template>
  <div
    class="tp-status w-full"
    :class="[{ 'is-mobile': windowSize.isMobileSize.value }]"
  >
    <template v-if="windowSize.isMobileSize.value">
      <div class="ex-mm">
        <client-only>
          <lazy-app-popover-wrapper triggerEvent="click">
            <template #trigger="{ bindTrigger }">
              <div
                class="ex-i is-mobile"
                v-bind="bindTrigger"
              >
                <i class="fa-solid fa-exclamation"></i>
              </div>
            </template>
            <template #content>
              <lazy-app-train-question-setting-info
                :minValue="questionMinSecond"
                :maxValue="questionMaxSecond"
                :rangeList="questionPointsSettingModel"
              />
            </template>
          </lazy-app-popover-wrapper>
        </client-only>
        <div class="tp-icon-wrapper">
          <div class="flex items-center justify-center gap-1 text-green-8c">
            <i
              class="fa-solid fa-check text-xs !flex items-center justify-center text-white rounded-[50%] w-[20px] h-[20px] bg-green-8c"
            ></i>
            <span class="">{{ correctAnswerCount }}</span>
          </div>
          <div class="tp-sep"></div>
          <div class="flex items-center justify-center gap-1 text-red-63">
            <i
              class="fa-solid fa-xmark text-xs !flex items-center justify-center text-white rounded-[50%] w-[20px] h-[20px] bg-red-63"
            ></i>
            <span class="">{{ wrongAnswerCount }}</span>
          </div>
          <div class="tp-sep"></div>
          <div class="flex items-center justify-center gap-1 text-yellow-42">
            <i
              class="fa-solid fa-star text-xs !flex items-center justify-center text-white rounded-[50%] w-[20px] h-[20px] bg-yellow-42"
            ></i>
            <span class="">{{ totalPointsCountLocal }}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="block w-full tp-status-wrapper">
        <div class="a-meta-title">
          <span class="a-m-label">
            {{ staticLocales.trainPage.answersRating }}
          </span>
          <div class="a-m-end">
            <transition
              :css="false"
              @enter="onEnter"
              @afterEnter="onAfterEnter"
            >
              <div
                v-if="showAnimation"
                class="tra-plus"
              >
                <span>{{ tempPlusPoint }}</span>
              </div>
            </transition>
            <client-only>
              <lazy-app-popover-wrapper>
                <template #trigger="{ bindTrigger }">
                  <div
                    class="ex-i"
                    v-bind="bindTrigger"
                  >
                    <i class="fa-solid fa-exclamation"></i>
                  </div>
                </template>
                <template #content>
                  <lazy-app-train-question-setting-info
                    :minValue="questionMinSecond"
                    :maxValue="questionMaxSecond"
                    :rangeList="questionPointsSettingModel"
                  />
                </template>
              </lazy-app-popover-wrapper>
            </client-only>
          </div>
        </div>
        <div class="tps-i">
          <div class="tps-i-w">
            <div class="w-full grid grid-cols-[1fr_auto_1fr] gap-2 mb-[15px]">
              <div class="flex flex-col items-center justify-start gap-2 pt-4">
                <span
                  class="text-[60px] leading-[50px] font-bold text-green-8c"
                >
                  {{ correctAnswerCount }}
                </span>
                <span class="text-[22px]">
                  {{ staticLocales.trainPage.correctAnswerLabel }}
                </span>
              </div>
              <div class="tp-sep"></div>
              <div class="flex flex-col items-center justify-start gap-2 pt-4">
                <span class="text-[60px] leading-[50px] font-bold text-red-63">
                  {{ wrongAnswerCount }}
                </span>
                <span class="text-[22px]">
                  {{ staticLocales.trainPage.wrongAnswerLabel }}
                </span>
              </div>
            </div>
            <div class="w-full pt-8 mb-[30px]">
              <div
                class="relative flex flex-col items-center justify-start gap-1"
              >
                <div
                  class="relative text-[60px] leading-[50px] font-bold text-yellow-42"
                >
                  <div
                    dir="ltr"
                    class="absolute right-[-44px] top-[-40px] text-[30px] text-green-8c font-bold"
                  >
                    <!--                    <span>+</span>-->
                    <span
                      ref="end_target_ref"
                      class="tpt"
                    >
                      <!--                      {{ plusPointsCountLocal }}-->
                    </span>
                  </div>
                  <span>{{ totalPointsCountLocal }}</span>
                </div>
                <span class="text-[22px]">
                  {{ staticLocales.trainPage.gainedPoints }}
                </span>
              </div>
            </div>
          </div>

          <div class="tps-i-e">
            <div class="tps-i-e-w">
              <div class="tps-ti">
                <span class="text-[30px] font-bold text-blue-f7">
                  {{ staticLocales.trainPage.helpMethodsLabel }}
                </span>
                <lazy-service-lock v-if="hasSomeLockedAction" />
              </div>
              <div class="adc-w">
                <div class="relative">
                  <lazy-service-block
                    v-if="!userServicesState.HELPINPRACTICE.isActive"
                  />
                  <app-button
                    :isLoading="isLoadingRemoveAnswer"
                    :isDisabled="!canRemoveAnswer"
                    :label="staticLocales.trainPage.removeWrongAnswerLabel"
                    labelClass="text-lg"
                    variant="outline"
                    colorType="warn"
                    @click="$emit('removeAction')"
                  />
                </div>
                <div class="relative">
                  <lazy-service-block
                    v-if="!userServicesState.SHOWSOLVESOLUATION.isActive"
                  />
                  <app-button
                    :isDisabled="!canShowAnswer"
                    :label="staticLocales.trainPage.showSolutionLabel"
                    colorType="success"
                    class="relative border-green-8c bg-green-8c flex items-center justify-center gap-2 disabled:!border-transparent disabled:!bg-gray-8b active:!opacity-[.8] rounded-[10px] border-solid border-2"
                    @click="$emit('showAnswerAction')"
                  />
                </div>
                <app-button
                  v-if="canShowLaw"
                  label="القوانين"
                  colorType="blue"
                  variant="outline"
                  @click="onLawsClick"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <client-only>
      <lazy-app-laws-images-modal
        ref="laws_images_modal_ref"
        :questionId="questionId!"
      />
    </client-only>
  </div>
</template>
<script lang="ts" setup>
import type { StudentsExamPartSettingsDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';

defineExpose({
  setPoint,
});
const emit = defineEmits([
  'removeAction',
  'showAnswerAction',
  'showLawsAction',
]);

const props = withDefaults(
  defineProps<{
    isMobile?: boolean;
    canShowLaw?: boolean;
    canRemoveAnswer?: boolean;
    isLoadingRemoveAnswer?: boolean;
    canShowAnswer?: boolean;
    correctAnswerCount?: number;
    wrongAnswerCount?: number;
    totalPointsCount?: number;
    questionMinSecond?: number;
    questionMaxSecond?: number;
    questionPointsSetting?: StudentsExamPartSettingsDataModel[];
    questionId?: string | number;
  }>(),
  {
    canShowAnswer: true,
    correctAnswerCount: 0,
    wrongAnswerCount: 0,
    totalPointsCount: 0,
  }
);

//composable
const windowSize = useWindowSize();
const globalStore = useGlobalStore();
const subscriptionsStore = useSubscriptionsStore();

//refs
const lawsModalRef = useTemplateRef('laws_images_modal_ref');
const endTargetRef = useTemplateRef('end_target_ref');
//data
const tempPlusPoint = ref(0);
const plusPointsCountLocal = ref(0);
const tempTotalPoint = ref(0);
const showAnimation = ref(false);
const totalPointsCountLocal = ref(props.totalPointsCount);

//computed
const staticLocales = computed(() => globalStore.staticState.locales!);
const hasSomeLockedAction = computed(() => {
  return (
    !userServicesState.value.HELPINPRACTICE.isActive ||
    !userServicesState.value.SHOWSOLVESOLUATION.isActive
  );
});
const userServicesState = computed(() => {
  return subscriptionsStore.state.userServicesState;
});
const questionPointsSettingModel = computed(() => {
  return props.questionPointsSetting;
});

//method
function onLawsClick() {
  lawsModalRef.value?.showModal();
  emit('showLawsAction');
}
function onPlusPointChange() {
  showAnimation.value = true;
}
async function onEnter(element: Element, done: () => void) {
  const el = element as HTMLElement;
  const sourceRect = el.getBoundingClientRect();
  const targetRect = endTargetRef.value!.getBoundingClientRect();
  const targetWidth = parseInt(window.getComputedStyle(el).width, 10);
  const targetHeight = parseInt(window.getComputedStyle(el).height, 10);

  const x = targetRect.x - sourceRect.x - targetWidth / 3;
  const y = targetRect.y - sourceRect.y - targetHeight / 3;
  el.classList.add('num-enter-active');
  await new Promise((resolve) => setTimeout(resolve, 1200));
  el.style.transform = `translate(${x}px, ${y}px)`;
  await new Promise((resolve) => setTimeout(resolve, 500));
  done();
}
async function onAfterEnter(element: Element) {
  const el = element as HTMLElement;
  el.style.transition = 'all .2s ease';
  // el.style.opacity = '0';
  await new Promise((resolve) => setTimeout(resolve, 200));
  showAnimation.value = false;
  plusPointsCountLocal.value = tempPlusPoint.value;
  //wait for 2 sec before apply values to total and reset local plus
  // await new Promise(resolve => setTimeout(resolve, 1500));
  plusPointsCountLocal.value = 0;
  totalPointsCountLocal.value = tempTotalPoint.value;
}
function setPoint(totalPoints: number | null, plusPoints: number | null) {
  if (!totalPoints) return;

  if (!plusPoints) {
    totalPointsCountLocal.value = totalPoints;
    plusPointsCountLocal.value = 0;
  }

  if (plusPoints) {
    tempTotalPoint.value = totalPoints;
    tempPlusPoint.value = plusPoints;
    onPlusPointChange();
  }

  if (windowSize.isMobileSize.value) {
    totalPointsCountLocal.value = totalPoints;
  }
}

//hook
onMounted(() => {
  globalStore.getLocalesJsonStatic();
});
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

.tp-status {
  .tp-status-wrapper {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    @include web-desktop-up() {
      border-radius: 15px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    .a-meta-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background-color: var(--dark-63);
      padding: 18px 25px;
      max-height: 80px;

      .a-m-label {
        display: block;
        font-size: 30px;
        color: var(--white-ff);
        font-weight: bold;
      }

      .a-m-end {
        display: flex;
        align-items: center;
        gap: 10px;

        .tra-plus {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--green-8c);
          color: var(--white-ff);
          border: 1px solid var(--green-8c);
          border-radius: 50%;
          font-size: 25px;
          width: 40px;
          height: 40px;
          transition: all 0.5s ease-in-out;
          font-weight: 600;

          span {
            margin-bottom: -10px;
          }
        }
      }
    }

    .tps-i {
      width: 100%;
      padding: 25px 20px;
      background-color: var(--white-ff);
      display: grid;
      grid-template-rows: 1fr min-content;

      .tps-i-w {
        align-self: center;
      }

      .tps-i-e {
        align-self: flex-end;
      }

      .tps-i-e-w {
        .tps-ti {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: baseline;
          margin-bottom: 10px;
          gap: 10px;
          .service-loc-icon {
            font-size: 22px;
          }
        }
      }
    }
  }

  .tp-sep {
    width: 2px;
    background: var(--gray-be);
  }

  .tp-icon-wrapper {
    display: grid;
    justify-content: flex-end;
    grid-template-columns: repeat(5, min-content);
    grid-gap: 10px;
  }

  .adc-w {
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 11px;
    display: flex;
    :deep(.app-button) {
      width: 110px !important;
      height: 80px !important;
      .app-button-label {
        font-size: 20px;
      }
    }
    button {
      width: 110px;
      height: 80px;

      span {
        font-weight: normal;
        font-size: 20px;
      }
    }
  }

  .ex-i {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #b7bac0;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;

    i {
      font-size: 14px;
    }

    &.is-mobile {
      background-color: #b7bac0;
      width: 20px;
      height: 20px;
      i {
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
.ex-tm {
  opacity: 1 !important;

  .bs-tooltip-bottom .arrow::before,
  .bs-tooltip-auto[x-placement^='bottom'] .arrow::before {
    border-bottom-color: #494949;
  }

  .tooltip-inner {
    padding: 11px 16px;
    border-radius: 8px;
    background-color: #494949;
  }
}

.ex-mm {
  display: flex;
  width: 100%;
  gap: 15px;
  align-items: center;
  justify-content: flex-end;
}
</style>
