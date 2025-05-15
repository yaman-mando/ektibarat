<template>
  <div
    class="progress"
    :style="{ height: computedHeight }"
  >
    <div
      class="progress-bar"
      :style="{
        width: computedWidth + '%',
      }"
      role="progressbar"
      :aria-valuenow="value"
      :aria-valuemin="0"
      :aria-valuemax="max"
    >
      <span v-if="showLabel">{{ computedWidth.toFixed(0) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    default: 100,
  },
  color: {
    type: String,
    default: '#0d6efd',
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  height: {
    type: [String, Number],
    default: '1.5rem',
  },
});

const computedWidth = computed(() => {
  const percentage = (props.value / props.max) * 100;
  return Math.min(Math.max(percentage, 0), 100);
});

const computedHeight = computed(() => {
  return typeof props.height === 'number' ? `${props.height}px` : props.height;
});
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
  border-radius: 0.375rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  white-space: nowrap;
  transition: width 0.6s ease;
  background-color: var(--purple-8c);
}
</style>
