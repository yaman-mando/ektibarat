<template>
  <div v-if="steps"
    class="relative w-[50vw] sm:w-50 md:w-60 lg:w-[25vw] xl1200:w-[25vw] 2xl:w-[32vw] sm:mx-auto lg:mx-0 xl:mx-auto mx-0"
    :style="{ height: `${steps.length * stepSpacing}px` }">

    <!-- Step rendering loop -->
    <div class="relative" v-for="(step, index) in steps" :key="step.id">
      <!-- Step button -->
      <button @click="(e) =>onStepClick(index, step, e)" :style="getPositionStyle(index)"
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

      <!-- Info popup -->
      <div v-if="step.categoryInfo && step.status === 1 && activePopupIndex === index" 
      :id="`popupRefs-${index}`"
      tabindex="1"
      @focusout="handlePopupFocusOut"
      :class="['popup', popupDirection]" :style="{
  left: `${pattern[index % pattern.length] - 80}px`,
  top: popupDirection === 'up' ? `${index * stepSpacing - 255}px` : `${index * stepSpacing + 90}px`
}">
        <div class="popup-content p-[15px]">
          <div class="popup-inner !p-[0px_10px]">
            <h2 class="text-[16px] font-medium text-purple-78 !text-center m-0">
              <template v-if="step.categoryInfo.isWrong">تدرب على الاسئلة اللتي أخطأت بها</template>
              <template v-else>القسم الذي ستتدرب عليه</template>
            </h2>
            <h3 v-if="step.categoryInfo.categoryName"
              class="mt-[5px] !text-center text-[20px] font-bold text-orange-39">
              <text-slice :length="20" :text="step.categoryInfo.categoryName" />
            </h3>
            <div class="flex items-center justify-between mt-[10px] !p-[0px_12px]">
              <div class="grid justify-items-center gap-y-[6px]">
                <span class="text-[16px] text-purple-78 font-bold">عدد الأسئلة</span>
                <span class="text-[16px] text-gray-63 text-center">{{ step.categoryInfo.numberQuestion }}</span>
              </div>
              <div class="grid justify-items-center gap-y-[6px]">
                <span class="text-[16px] text-purple-78 font-bold">الزمن المتوقع</span>
                <span class="text-[16px] text-gray-63 text-center">{{ formatTime(step.categoryInfo.time) }} ساعة</span>
              </div>
            </div>
            <button @click="toTrining" class="w-[200px] h-[44px] rounded-[6px] bg-purple-78 text-white font-bold 
            text-[16px] mt-[14px] cursor-pointer flex items-center justify-center justify-self-center">ابدأ
              التدريب</button>
          </div>
          <div class="popup-arrow"></div>
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

  </div>
</template>

<script lang="ts" setup>
import { defineProps, type PropType } from 'vue'
import type { step } from '~/main/modules/user-panel/data-access/user-panel.model';
import helpModal from '@/components/user/helpModal.vue'
import selectCategoryModal from '@/components/user/selectCategoryModal.vue'

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
  }
})

// Reactive data setup
const stepSpacing = 90;
const pattern = [0, -44, -70, -44, 0, 44, 70, 44, 0, -44];
const activePopupIndex = ref<number | null>(null);
const popupDirection = ref('up');
const toShowHelpModal = ref(false);
const toShowSelectCategoryModal = ref(false);
const helpModalSeen = ref(false);
const pendingStepIndex = ref<number | null>(null);
const pendingStepData = ref<step | null>(null);
const pendingClickEvent = ref<MouseEvent | null>(null);

function handlePopupFocusOut(event: FocusEvent) {
  const related = event.relatedTarget as HTMLElement | null;
  const currentPopup = event.currentTarget as HTMLElement;

  if (!related || !currentPopup.contains(related)) {
    activePopupIndex.value = null;
  }
}

function toTrining(){
  console.log('toTrainig')
}

watch(activePopupIndex, async (newVal) => {
  if (newVal !== null) {
    await nextTick();
    document.getElementById(`popupRefs-${newVal}`)?.focus()
  }
});

// Handle step click
const onStepClick = async (index, stepData: step | null, event) => {
  if(stepData?.status !== 1) return
  pendingStepIndex.value = index;
  pendingClickEvent.value = event;
  pendingStepData.value = stepData;
  if (props.showHelpModal && !helpModalSeen.value) {
    toShowHelpModal.value = true;
    return;
  }
  if (!stepData?.categoryInfo) {
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
    const spaceBelow = window.innerHeight - rect.bottom;
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
  const complete = step.categoryInfo?.numberQuestionComplte || 0;
  const percent = Math.min(complete / total, 1);
  return circumference * (1 - percent);
};

// Image position based on pattern
const getImagePosition = (index) => {
  if (!import.meta.client) return;
  const cycleIndex = index % pattern.length;
  const offsetX = pattern[cycleIndex];
  let offsetY = index * stepSpacing - 30;
  let spaceValue = window.innerWidth / 8 + offsetX;
  if (window.innerWidth < 640) {
    offsetY = index * stepSpacing - 15;
    spaceValue = 50 + offsetX;
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

// Time formatting
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

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

.popup-content {
  background: #FFFFFF;
  box-shadow: 0px 0px 10px #00000040;
  border: 0.5px solid #BCCCDB;
  border-radius: 15px;
  width: 295px;
  height: 223px;
  position: relative;
}

.popup-inner {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.popup-arrow {
  position: absolute;
  left: 70px;
  width: 20px;
  height: 10px;
  overflow: hidden;
}

.popup.up .popup-arrow {
  bottom: -10px;
}

.popup.up .popup-arrow::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #FFFFFF;
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
}

.popup.down .popup-arrow {
  top: -10px;
}

.popup.down .popup-arrow::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #FFFFFF;
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
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