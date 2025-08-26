<template>
  <div v-if="forPart" class="flex justify-center">
    <app-g-button @click="onClickPart(steps?.[0])" style="opacity: 1 !important" :disabled="steps?.[0]?.status === 0"
      width="190px" height="40px" radius="8px" text-color="text-white"
      :background="steps?.[0]?.status === 0 ? '#BCCCDB' : '#00C48C'">
      <div class="flex items-center justify-center gap-x-[10px] text-[16px] font-bold">
        <i class="fa-solid fa-table-list"></i>
        اختيار القسم التالي
      </div>
    </app-g-button>
  </div>
  <div v-else-if="steps" class="relative w-full max-w-[650px] mx-auto flex justify-center"
    :style="{ height: `${steps.length * stepSpacing}px` }">

    <!-- Step rendering loop -->
    <div class="relative" v-for="(step, index) in steps" :key="step.id">

      <!-- Step button -->
      <button @click="(e) => onStepClick(index, step, e)" :style="getPositionStyle(index)"
        class="group absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover-effect">
        <div class="relative flex items-center justify-center transition-transform active:scale-95 animate-bounce-in"
          :style="getButtonStyle(step.status, index)">

          <!-- Progress ring -->
          <svg v-if="step.status === 1" class="absolute mt-[5px]" :width="svgSize" :height="svgSize" style="z-index:0;">
            <circle stroke="#eee" :stroke-width="progressWidth" fill="transparent" :r="progressRadius" :cx="svgCenter"
              :cy="svgCenter" />
            <circle stroke="#00C48C" :stroke-width="progressWidth" fill="transparent" :r="progressRadius"
              :cx="svgCenter" :cy="svgCenter" :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset(step)" stroke-linecap="round" transform="rotate(-90, 50, 50)" />
          </svg>

          <!-- Icon -->
          <i :class="getIcon(step.status)" class="text-[34px] text-white relative z-10"></i>
        </div>
      </button>

      <!-- Step image -->
      <img v-if="step.image_path" :src="step.image_path" alt=""
        class="absolute object-contain w-[75px] sm:w-[12vw] max-w-[136px]" :style="getImagePosition(index)" />


      <!-- Start popup -->
      <div v-if="step.status === 1 && activePopupIndex === null" :id="`popupReStart-${index}`" tabindex="1"
        @focusout="handlePopupFocusOut" :class="['popup', popupDirection]" :style="{
          left: `${pattern[index % pattern.length] - 45}px`,
          top: popupDirection === 'up' ? `${index * stepSpacing - 70}px` : `${index * stepSpacing + 90}px`
        }">
        <div class="popup-start-content flex items-center justify-center">
          <div class="popup-start-inner flex items-center justify-center">
            <span class="text-[18px] font-bold text-green-8c">ابدأ</span>
          </div>
          <div class="popup-start-arrow"></div>
        </div>
      </div>

      <!-- Info popup -->
      <div @focusout="handlePopupFocusOut"
        v-if="(step.type !== stepTypesEnum.examSimulator || step.categoryInfo?.isWrong) && step.categoryInfo && step.status === 1 && activePopupIndex === index"
        :id="`popupRefs-${index}`" tabindex="1" :class="['popup', popupDirection]" :style="{
          left: `${pattern[index % pattern.length] - 80}px`,
          top: popupDirection === 'up' ? `${index * stepSpacing - 255}px` : `${index * stepSpacing + 90}px`
        }">
        <div class="popup-content p-[15px]">
          <div class="popup-inner !p-[0px_10px]">
            <h2 class="text-[16px] font-medium text-purple-78 !text-center m-0">
              <template v-if="step.categoryInfo.isWrong">تدرب على الاسئلة اللتي أخطأت بها</template>
              <template v-else>القسم الذي ستتدرب عليه</template>
            </h2>
            <h3 class="mt-[5px] !text-center text-[20px] font-bold text-orange-39">
              <text-slice :length="20" :text="step.categoryInfo.categoryName ?? '--'" />
            </h3>
            <div class="flex items-center justify-between mt-[10px] !p-[0px_12px]">
              <div class="grid justify-items-center gap-y-[6px]">
                <span class="text-[16px] text-purple-78 font-bold">عدد الأسئلة</span>
                <span class="text-[16px] text-gray-63 text-center">{{ step.categoryInfo.numberQuestion -
                  step.categoryInfo.numberQuestionComplete }}</span>
              </div>
              <div class="grid justify-items-center gap-y-[6px]">
                <span class="text-[16px] text-purple-78 font-bold">الزمن المتوقع</span>
                <span class="text-[16px] text-gray-63 text-center">{{
                  dateFormat.formatStoMMHHWithText(step.categoryInfo.time)
                }}</span>
              </div>
            </div>
            <app-overlay v-if="examLoading" />

            <button @click="toTrining(step)"
              class="w-[200px] h-[44px] rounded-[6px] bg-purple-78 text-white font-bold text-[16px] mt-[14px] cursor-pointer flex items-center justify-center justify-self-center">
              ابدأ التدريب
            </button>
          </div>
          <div class="popup-arrow"></div>
        </div>
      </div>

      <div @focusout="handlePopupFocusOut"
        v-if="(step.type === stepTypesEnum.examSimulator && !step.categoryInfo?.isWrong) && step.categoryInfo && step.status === 1 && activePopupIndex === index"
        :id="`popupRefs-${index}`" tabindex="1" :class="['popup', popupDirection]" :style="{
          left: `${pattern[index % pattern.length] - 80}px`,
          top: popupDirection === 'up' ? `${index * stepSpacing - 140}px` : `${index * stepSpacing + 90}px`
        }">
        <div class="popup-content p-[15px] !h-[120px]">
          <div class="popup-inner !p-[0px_10px]">
            <h2 class="text-[22px] font-bold text-purple-78 !text-center m-0">
              محاكي اختبار
            </h2>
            <app-overlay v-if="examLoading" />
            <button @click="startExam(step)"
              class="w-[200px] h-[44px] rounded-[6px] bg-purple-78 text-white font-bold text-[16px] mt-[14px] cursor-pointer flex items-center justify-center justify-self-center">
              ابدأ الاختبار
            </button>

          </div>
          <div class="popup-arrow"></div>
        </div>
      </div>

    </div>

  </div>
  <!-- Help modal -->
  <helpModal :show="toShowHelpModal" @continue="() => {
    toShowHelpModal = false,
      helpModalSeen = true,
      onStepClick(pendingStepIndex, pendingStepData, pendingClickEvent)
  }" />

  <!-- Category selection modal -->
  <selectCategoryModal v-if="pendingStepData" :stepId="pendingStepData?.id" :show="toShowSelectCategoryModal"
    @update:show="toShowSelectCategoryModal = $event" @continue="() => {
      toShowSelectCategoryModal = false,
        onStepClick(pendingStepIndex, pendingStepData, pendingClickEvent)
    }">
  </selectCategoryModal>

</template>

<script lang="ts" setup>
import { defineProps, type PropType } from 'vue'
import type { step } from '~/main/modules/user-panel/data-access/user-panel.model';
import helpModal from '@/components/user/helpModal.vue'
import selectCategoryModal from '@/components/user/selectCategoryModal.vue'
import { getUuid, sleepUtil } from '~/main/utils/shared-utils';
import { GlobalTypes } from '~/main/constants/global-types';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useStore } from 'vuex';
import * as dateFormat from '~/main/utils/date-utils'

// Define props
const props = defineProps({
  steps: {
    type: Array as PropType<step[]>,
    required: true
  },
  showHelpModal: {
    type: Boolean,
    default: false,
    required: true
  },
  forPart: {
    type: Boolean,
    default: false,
  }
})

const globalStore = useGlobalStore()
const runtimeConfig = useRuntimeConfig();
const store = useStore();
const authStore = useAuthStore();
const { $axios } = useNuxtApp();
const router = useRouter();
const toastMessage = useToastMessage()

//enum
class examForm {
  subjectId: number | string;

  constructor(subjectId: number | string) {
    this.subjectId = subjectId;
  }
  totalQuestionsCount: number = 0;
  willDo = false;
  withoutStudentEvaluate = false;
  randomLevel = false;
  isOpen = false;
  tagsIds = [] as any[];
  takfeelTagsIds = [] as any[];
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  randomQuestionsSettings = [] as any[];
  questionsLevelsMin = 0;
  questionsCount: null | number = 10;
  questionsLevelsMax = 10;
  customerId: any | null = null;
  sessionId: any | null = null;
  stepId: null | number = null;
}


// Reactive data setup
const stepSpacing = 90;
const pattern = [0, -44, -70, -44, 0, 44, 70, 44, 0, -44];
//const pattern = [0, -30, -50, -30, 0, 30, 50, 30, 0, -30];
const activePopupIndex = ref<number | null>(null);
const popupDirection = ref('up');
const toShowHelpModal = ref(false);
const toShowSelectCategoryModal = ref(false);
const helpModalSeen = ref(false);
const pendingStepIndex = ref<number | null>(null);
const pendingStepData = ref<step | null>(null);
const pendingClickEvent = ref<MouseEvent | null>(null);
const examLoading = ref<boolean>(false)
const form = ref(new examForm(runtimeConfig.public.defaultSubjectId));
const stepTypesEnum = {
  selectedCategory: 1,
  trainings: 2,
  examSimulator: 5
}

function handlePopupFocusOut(event: FocusEvent) {
  if (examLoading.value) return
  const related = event.relatedTarget as HTMLElement | null;
  const currentPopup = event.currentTarget as HTMLElement;

  if (!related || !currentPopup.contains(related)) {
    activePopupIndex.value = null;
  }
}

function toTrining(step: step) {
  form.value.totalQuestionsCount = Math.max(
    0,
    (step.categoryInfo?.numberQuestion ?? 0) -
    (step.categoryInfo?.numberQuestionComplete ?? 0)
  );
  if (!step.categoryInfo?.isWrong) {
    form.value.randomQuestionsSettings.push({
      categoryId: step.categoryInfo?.categoryId,
      questionLevel: 0,
      questionsCount: (step.categoryInfo?.numberQuestion ?? 0) - (step.categoryInfo?.numberQuestionComplete ?? 0),
    })
  }
  form.value.stepId = step.id
  if (step.categoryInfo?.isWrong) {
    form.value.onlyWrongQuestions = true
  }
  startTrainig()
}

const handleClarityData = async () => {
  try {
    //eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      if (!window['clarity']) {
        resolve(null);
        return null;
      }
      const custom_session_id = getUuid();

      const result = await window['clarity'](
        'identify',
        user.value.email,
        user.value.id + '_' + custom_session_id
      );
      form.value.customerId = result?.userId;
      form.value.sessionId = result?.sessionId;
      resolve(result);
    });
  } catch (e) {
    console.log(e);
    return null;
  }
}

const startTrainig = async () => {
  try {
    examLoading.value = true;
    if (runtimeConfig.public.currentEnv === 'dev') {
      await handleClarityData();
    }
    const url = 'studentsExam/customFromTags';
    form.value.subjectId = isTahsele.value
      ? runtimeConfig.public.defaultSubjectIdTahsele
      : runtimeConfig.public.defaultSubjectId;
    const { data: res } = await $axios.post(url, form.value)
    if (res) {
      store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', res);
      router.push(`/student/training/${res.id}`)
    }
    await sleepUtil(1500);
    examLoading.value = false;
  } catch (e) {
    toastMessage.showError({
      life: 2500,
      summary: 'عذراً حدث خطأ في إنشاء امتحانكم ... يرجى إعادة المحاولة',
    });
    await sleepUtil(1000);
    examLoading.value = false;
    console.log(e);
  }
}


const startExam = async (step: step) => {
  try {
    examLoading.value = true;
    const bodyData = {
      examId: 1,
      stepId: step.id,
      willDo: true,
      tagsIds: [],
      customerId: null,
      sessionId: null
    }
    const { data: res } = await $axios.post('/studentsExam', bodyData)
    if (res) {
      router.push(`/student/exams/${res.id}`);
    }
    await sleepUtil(1000);
    examLoading.value = false;
  } catch (e) {
    toastMessage.showError({
      life: 2500,
      summary: 'عذراً حدث خطأ في إنشاء امتحانكم ... يرجى إعادة المحاولة',
    });
    await sleepUtil(1000);
    examLoading.value = false;
    console.log(e);
  }
}

//computed
const user = computed(
  () => { return authStore.state.userData as unknown as UserInfoDataModel }
)

const globalUser = computed(() => {
  return globalStore.state.globalTypeUserValue
})

const isTahsele = computed(() => {
  return globalUser.value === GlobalTypes.tahsele;
})

//watch
watch(activePopupIndex, async (newVal) => {
  if (newVal !== null) {
    await nextTick();
    document.getElementById(`popupRefs-${newVal}`)?.focus()
  }
});


const onClickPart = (stepData) => {
  pendingStepData.value = stepData;
  toShowSelectCategoryModal.value = true;
}

// Handle step click
const onStepClick = async (index, stepData: step | null, event) => {
  if (stepData?.status !== 1) return
  pendingStepIndex.value = index;
  pendingClickEvent.value = event;
  pendingStepData.value = stepData;
  if (props.showHelpModal && !helpModalSeen.value) {
    toShowHelpModal.value = true;
    return;
  }
  if (stepData?.type === stepTypesEnum.selectedCategory) {
    toShowSelectCategoryModal.value = true;
    return;
  }
  togglePopup(index, event);
};

// Toggle info popup
const togglePopup = async (index, event) => {
  if (activePopupIndex.value === index) {
    activePopupIndex.value = null;
  } else {
    await nextTick();
    const rect = event.target.getBoundingClientRect();
    const spaceAbove = rect.top;
    popupDirection.value = spaceAbove > 400 ? 'up' : 'down';
    activePopupIndex.value = index;
  }
};

// Calculate button position
const getPositionStyle = (index) => {
  const cycleIndex = index % pattern.length;
  const left = pattern[cycleIndex];
  const top = index * stepSpacing;
  return {
    left: `${left}px`,
    top: `${top}px`
  };
};

// Determine color by status
const getColor = (status) => {
  switch (status) {
    case 2: return '#00C48C';
    case 1: return '#FDC830';
    case 0: return '#BCCCDB';
    default: return '#BCCCDB';
  }
};

// Determine icon by status
const getIcon = (status) => {
  switch (status) {
    case 2: return 'fa fa-check';
    case 1: return 'fa fa-star';
    case 0: return 'fa fa-lock';
    default: return 'fa fa-question';
  }
};

// Button and progress ring settings
const buttonWidth = 70;
const buttonHeight = 57;
const borderSpace = 7;
const progressWidth = 7;
const svgSize = buttonWidth + borderSpace * 2 + progressWidth * 2;
const svgCenter = svgSize / 2;
const progressRadius = buttonWidth / 2 + borderSpace;
const circumference = 2 * Math.PI * progressRadius;

// Button styling
const getButtonStyle = (status, index) => ({
  '--path-level-color': getColor(status),
  '--color-black': '0, 0, 0',
  background: 'var(--path-level-color)',
  borderRadius: '50% / 50%',
  boxShadow: `0 8px 0 rgb(var(--color-black), 0.2), 0 8px 0 var(--path-level-color)`,
  width: `${buttonWidth}px`,
  height: `${buttonHeight}px`,
  animationDelay: `${index * 0.1}s`
});

// Calculate progress offset
const progressOffset = (step) => {
  const total = step.categoryInfo?.numberQuestion || 1;
  const complete = step.categoryInfo?.numberQuestionComplete || 0;
  const percent = Math.min(complete / total, 1);
  return circumference * (1 - percent);
};

// Image position based on pattern
const getImagePosition = (index) => {
  if (!import.meta.client) return;
  const cycleIndex = index % pattern.length;
  const offsetX = pattern[cycleIndex];
  let offsetY = index * stepSpacing - 30;
  const container = document.querySelector('.your-container-class') as HTMLElement;
  const containerWidth = container?.offsetWidth || 600;

  let spaceValue = containerWidth / 5 + offsetX;

  if (window.innerWidth < 640) {
    offsetY = index * stepSpacing - 15;
    spaceValue = 90 + offsetX;
  }
  if (offsetX <= 0) {
    return {
      left: `${spaceValue}px`,
      top: `${offsetY}px`
    };
  } else {
    return {
      left: `${-1 * spaceValue}px`,
      top: `${offsetY}px`
    };
  }
};


</script>

<style scoped>
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  60% {
    opacity: 1;
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease forwards;
}

.hover-effect:hover {
  transform: translateY(1.5px);
}




.popup {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: grow-fade 0.4s ease forwards;
  transform-origin: center;
  z-index: 50;
}


.popup-box {
  background: #FFFFFF;
  box-shadow: 0px 0px 10px #00000040;
  border: 0.5px solid #BCCCDB;
  border-radius: 15px;
  position: relative;
}


.popup-content {
  width: 295px;
  height: 223px;
}

.popup-content,
.popup-start-content {
  background: #FFFFFF;
  box-shadow: 0px 0px 10px #00000040;
  border: 0.5px solid #BCCCDB;
  border-radius: 15px;
  position: relative;
}


.popup-start-content {
  width: 80px;
  height: 45px;
}

.popup.up .popup-start-content {
  animation: floating 2.5s ease-in-out infinite;
}

.popup.down .popup-start-content {
  animation: floatingDown 2.5s ease-in-out infinite;
}


.popup-inner {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}


.popup-arrow,
.popup-start-arrow {
  position: absolute;
  width: 20px;
  height: 10px;
  overflow: hidden;
}

.popup-arrow {
  left: 70px;
}

.popup-start-arrow {
  left: 30px;
}

.popup.up .popup-arrow {
  bottom: -10px;
}

.popup.down .popup-arrow {
  top: -10px;
}

.popup.up .popup-start-arrow {
  bottom: -10px;
}

.popup.down .popup-start-arrow {
  top: -10px;
}

.popup.up .popup-arrow::after,
.popup.up .popup-start-arrow::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #FFFFFF;
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
}

.popup.down .popup-arrow::after,
.popup.down .popup-start-arrow::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #FFFFFF;
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
}

/* Animation: floating up/down */
@keyframes floating {
  0% {
    transform: translateY(15px);
  }

  50% {
    transform: translateY(25px);
  }

  100% {
    transform: translateY(15px);
  }
}

@keyframes floatingDown {
  0% {
    transform: translateY(-15px);
  }

  50% {
    transform: translateY(-25px);
  }

  100% {
    transform: translateY(-15px);
  }
}

@keyframes grow-fade {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>