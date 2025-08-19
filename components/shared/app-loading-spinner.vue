<template>
  <div class="w-full flex flex-col items-center justify-center relative">

    <!-- Spinner -->
    <div v-if="showSpinner" class="h-[75vh] flex items-center">
      <svg class="animate-spin h-8 w-8 text-purple-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

    <!-- نص التحميل -->
    <p v-if="showText" class="text-sm text-gray-600 dark:text-gray-300 animate-pulse text-center">
      {{ text }}
    </p>

    <!-- Skeleton -->
    <div v-if="showSkeleton"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-6xl">
      <div v-for="i in skeletonCount" :key="i" class="animate-pulse rounded-2xl p-4 bg-white dark:bg-dark-37 shadow">
        <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>

    <!-- Overlay Spinner -->
    <div v-if="showSpinnerOverlay" class="fixed inset-0 bg-black/50 z-30 flex items-center justify-center h-[100vh]">
      <svg class="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>

  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'spinner' | 'text' | 'skeleton' | 'spinner-overlay'
  text?: string
  skeletonCount?: number
}>(), {
  type: 'spinner',
  skeletonCount: 10
})


const showSpinner = computed(() => props.type === 'spinner')
const showText = computed(() => props.type === 'text')
const showSkeleton = computed(() => props.type === 'skeleton')
const showSpinnerOverlay = computed(() => props.type === 'spinner-overlay')
</script>

