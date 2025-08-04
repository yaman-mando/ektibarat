<template>
  <button
    :class="buttonClass"
    :style="buttonStyle"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  width?: string;
  height?: string;
  radius?: string;

  background?: string | null; 
  bgClass?: string;
  hoverBackground?: string; 
  textColor?: string;
  textSize?: string;
  fontWeight?:string

  border?: boolean;
  borderColor?: string;

  darkMode?: boolean;
  lightMode?: boolean;

  onClick?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  width: 'auto',
  height: 'auto',
  radius: '0.5rem',
  background: null,
  bgClass: 'bg-blue-600',
  hoverBackground: '',
  textColor: 'text-white',
  textSize: 'text-base',
  fontWeight:'normal',
  border: false,
  borderColor: 'border-gray-300',
  darkMode: false,
  lightMode: false,
});

const emit = defineEmits(['click']);

function onClick() {
  if (props.onClick) props.onClick();
  emit('click');
}

const isGradient = computed(() => props.background?.includes('gradient') || props.background?.includes('linear-gradient'));

const buttonClass = computed(() => {
  return [
    'inline-flex',
    'items-center',
    'justify-center',
    'cursor-pointer',
    props.textColor,
    props.textSize,
    props.fontWeight,
    !props.background && props.bgClass, 
    props.border ? `border ${props.borderColor}` : '',
    props.hoverBackground ? `hover:${props.hoverBackground}` : '',
    props.darkMode ? 'dark:bg-gray-800 dark:text-white' : '',
    props.lightMode ? 'bg-white text-black' : '',
  ]
    .filter(Boolean)
    .join(' ');
});


const buttonStyle = computed(() => {
  return {
    width: props.width,
    height: props.height,
    borderRadius: props.radius,
    background: props.background ? props.background : undefined,
  };
});
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}
</style>
