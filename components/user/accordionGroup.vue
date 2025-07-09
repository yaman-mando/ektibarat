<template>
  <div class="space-y-[20px]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'

const openStates = ref<Record<number, () => void>>({})

const registerAccordion = (index: number, closeFn: () => void) => {
  openStates.value[index] = closeFn
}

const closeOthers = (currentIndex: number) => {
  for (const [indexStr, fn] of Object.entries(openStates.value)) {
    const index = Number(indexStr)
    if (index !== currentIndex) {
      fn()
    }
  }
}

provide('registerAccordion', registerAccordion)
provide('closeOthers', closeOthers)
</script>
