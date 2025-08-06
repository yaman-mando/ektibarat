<template>
  <div
    class="w-full dark:bg-dark-600 overflow-hidden"
    :class="[!emptyBackground && bgEmptyClass]"
    :style="{
      height,
      ...(emptyBackground || !bgEmptyClass ? { background: emptyBackground} : {}),
      ...(hasShadow ? { boxShadow: shadow } : {}),
      borderRadius: radius
    }"
  >
    <div
      class="h-full flex items-center justify-center transition-all duration-700 ease-in-out"
      :class="[bgClass]"
      :style="{
        width: animated ? animatedWidth + '%' : value + '%',
        background: background,
        borderRadius: radius
      }"
    >
      <span
        v-if="showText"
        :class="[
          'text-sm font-medium',
          textColor ? '' : value > 12 ? 'text-white' : 'text-black'
        ]"
        :style="{ color: textColor, fontSize }"
      >
        {{ value }}%
      </span>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  value: { type: Number, required: true },
  showText: { type: Boolean, default: true },
  height: { type: String, default: '18px' },
  radius: { type: String, default: '4px' },
  background: { type: String, default: null },
  bgClass: { type: String, default: '' },
  bgEmptyClass: { type: String, default: 'bg-gray-200' },
  emptyBackground: { type: String, default: null },
  shadow: { type: String, default: '2px 2px 4px 0px #00000026 inset' },
  hasShadow: { type: Boolean, default: false },
  textColor: { type: String, default: '' },
  fontSize: { type: String, default: '14px' },
  animated: { type: Boolean, default: true }
});

const animatedWidth = ref(0);
const defaultColor = '#58CC02';

onMounted(() => {
  if (props.animated) {
    setTimeout(() => {
      animatedWidth.value = props.value;
    }, 100); // slight delay for animation
  }
});

watch(() => props.value, (newVal) => {
  if (props.animated) {
    animatedWidth.value = newVal;
  }
});
</script>

<style scoped></style>
