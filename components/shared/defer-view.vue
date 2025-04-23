<template>
  <div
    v-if="!visible"
    ref="trigger"
    style="height: 1px"
  ></div>
  <template v-if="visible">
    <slot></slot>
  </template>
</template>

<script setup>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

const trigger = ref(null);
const visible = ref(false);

useIntersectionObserver(
  trigger,
  ([entry]) => {
    if (entry.isIntersecting) {
      visible.value = true;
    }
  },
  { threshold: 0 }
);
</script>
