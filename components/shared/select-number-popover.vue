<template>
  <div class="relative inline-block">
    <div
      ref="trigger"
      class="a-bo"
      @click="togglePopover"
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
    <prime-popover
      ref="popover"
      :pt="{
        root: 'w-[200px] max-h-[200px] overflow-auto rounded border shadow bg-white',
      }"
      :showCloseIcon="false"
      :dismissable="true"
      :target="trigger"
    >
      <div class="grid grid-cols-4 gap-2 p-2">
        <div
          v-for="num in numbers"
          :key="num"
          class="a-num cursor-pointer text-center p-1 rounded"
          :class="{
            'active-num': num === modelValue,
            'hover:bg-gray-200': num !== modelValue,
          }"
          @click="selectNumber(num)"
        >
          {{ num }}
        </div>
      </div>
    </prime-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Popover } from 'primevue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  start: {
    type: Number,
    default: 10,
  },
  end: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(['update:modelValue']);

const trigger = ref(null);
const popover = useTemplateRef<InstanceType<typeof Popover>>('popover');

const numbers = computed(() => {
  const nums = [] as number[];
  for (let i = props.start; i <= props.end; i += props.step) {
    nums.push(i);
  }
  return nums;
});

const selectNumber = (num) => {
  emit('update:modelValue', num);
  popover.value?.hide();
};

const togglePopover = (event: any) => {
  popover.value?.toggle(event);
};
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
  .a-val {
    font-size: 18px;
    font-weight: bold;
  }

  .a-e {
    text-align: center;
    font-size: 14px;
    color: var(--gray-8f);
  }
}
.a-num {
  &.active-num {
    color: #fff;
    background-color: var(--purple-8c) !important;
  }
}
</style>
