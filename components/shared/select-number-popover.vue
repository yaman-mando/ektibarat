<template>
  <div class="relative inline-block">
    <!-- Trigger -->
    <div
      ref="trigger"
      class="a-bo"
      @click="toggle"
    >
      <span
        v-if="modelValue"
        class="a-val"
      >
        {{ modelValue }}
      </span>
      <span
        v-else
        class="a-e"
      >
        اختر القيمة
      </span>
    </div>

    <!-- Popover -->
    <transition name="fade">
      <div
        v-if="isOpen"
        ref="popover"
        class="shadow-[0_0_5px_gray] border-0 rounded-[15px] overflow-visible"
        :class="[
          'absolute z-50 w-[200px] rounded border shadow bg-white overflow-auto max-h-[240px]',
          positionClass,
        ]"
        :style="popoverStyle"
      >
        <!-- Triangle Pointer -->
        <div
          v-if="!isCentered"
          class="absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]"
        ></div>

        <!-- Numbers -->
        <div class="grid grid-cols-4 gap-2 p-[15px]">
          <div
            v-for="num in numbers"
            :key="num"
            class="a-num cursor-pointer text-center p-1 rounded text-[22px] font-bold"
            :class="{
              'active-num': num === modelValue,
              'hover:bg-gray-200': num !== modelValue,
            }"
            @click="selectNumber(num)"
          >
            {{ num }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  modelValue: { type: Number, default: null },
  start: { type: Number, default: 10 },
  end: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
});
const emit = defineEmits(['update:modelValue']);

const trigger = ref<HTMLElement | null>(null);
const popover = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const isCentered = ref(false);
const popoverStyle = ref<Record<string, string>>({});
const positionClass = ref('');

const numbers = computed(() => {
  const nums: number[] = [];
  for (let i = props.start; i <= props.end; i += props.step) {
    nums.push(i);
  }
  return nums;
});

function toggle() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

async function open() {
  await nextTick();
  positionPopover();
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function positionPopover() {
  if (!trigger.value) return;
  const rect = trigger.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Estimate height dynamically if popover exists in DOM
  const tempHeight = popover.value?.scrollHeight || 240; // fallback max

  const spaceBelow = viewportHeight - rect.bottom;
  isCentered.value = spaceBelow < tempHeight + 8;

  if (isCentered.value) {
    popoverStyle.value = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    positionClass.value = 'fixed';
  } else {
    popoverStyle.value = {
      top: `${rect.height + 20}px`,
      left: '50%',
      transform: 'translateX(-50%)',
    };
    positionClass.value = 'absolute';
  }
}

function selectNumber(num: number) {
  emit('update:modelValue', num);
  close();
}

function handleClickOutside(e: MouseEvent) {
  if (
    isOpen.value &&
    popover.value &&
    !popover.value.contains(e.target as Node) &&
    !trigger.value?.contains(e.target as Node)
  ) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.a-bo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid var(--gray-db);
}
.a-val {
  font-size: 18px;
  font-weight: bold;
}
.a-e {
  text-align: center;
  font-size: 14px;
  color: var(--gray-8f);
}
.a-num.active-num {
  color: #fff;
  background-color: var(--purple-8c) !important;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
