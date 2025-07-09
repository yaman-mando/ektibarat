<template>
  <div class="w-[90px] h-[18px] bg-gray-300 rounded-[4px] overflow-hidden">
    <div
      class="h-full text-xs text-white text-center leading-[18px] transition-all duration-700 ease-out"
      :class="progressColor"
      :style="{ width: animatedWidth + '%' }"
    >
      {{ showLabel ? `${value}%` : '' }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch} from 'vue';

const props = defineProps({
  value: { type: Number, required: true }, 
  thresholds: {
    type: Object,
    default: () => ({
      danger: 40,
      warning: 70,
    }),
  },
  colors: {
    type: Object,
    default: () => ({
      danger: 'bg-red-5e',
      warning: 'bg-yellow-16',
      success: 'bg-green-15',
    }),
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
});

const animatedWidth = ref(0);


const progressColor = computed(() => {
  if (props.value <= props.thresholds.danger) return props.colors.danger;
  if (props.value <= props.thresholds.warning) return props.colors.warning;
  return props.colors.success;
});


watch(
  () => props.value,
  (newVal) => {
    requestAnimationFrame(() => {
      animatedWidth.value = newVal;
    });
  },
  { immediate: true }
);
</script>
