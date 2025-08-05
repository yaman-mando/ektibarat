<template>
  <div class="rounded-[8px] shadow-custom overflow-hidden">
    <!-- Header -->
    <button
      class="w-full h-[66px] px-[15px] flex items-center justify-between bg-white cursor-pointer"
      @click="handleToggle"
    >
      <!-- Right slot -->
      <div class="flex-1 flex items-center gap-[20px] overflow-x-auto">
        <slot name="right"></slot>
      </div>

      <!-- Left: Arrow -->
      <div
        v-if="!hideArrow"
        class="w-[24px] h-[24px] flex items-center justify-center text-orange-500 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>

    <!-- Body -->
    <transition name="accordion">
      <div
        v-show="isOpen"
        class="overflow-hidden border-t-1 border-[#BCCCDB]"
      >
        <div :class="`p-4 bg-white ${contentClass}`">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue';

interface Props {
  defaultOpen?: boolean;
  onlyOneOpen?: boolean;
  index?: number;
  contentClass?: string;
  hideArrow?:boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open']);

const isOpen = ref(!!props.defaultOpen);

// Inject from parent to handle "only one open"
const register =
  inject<(index: number, toggle: () => void) => void>('registerAccordion');
const closeOthers = inject<(index: number) => void>('closeOthers');

if (props.onlyOneOpen && register && typeof props.index === 'number') {
  register(props.index, () => {
    isOpen.value = false;
  });
}

const handleToggle = () => {
  if (props.onlyOneOpen && closeOthers && typeof props.index === 'number') {
    closeOthers(props.index);
  }
  isOpen.value = !isOpen.value;
  emit('update:open', isOpen.value);
};
</script>

<style scoped>
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 999px;
  opacity: 1;
}
.accordion-enter-active,
.accordion-leave-active {
  transition:
    max-height 0.5s ease-in-out,
    opacity 0.5s ease-out,
    opacity ease-in 0.3s;
  overflow: hidden;
}
</style>
