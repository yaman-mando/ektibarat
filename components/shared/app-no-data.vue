<template>
  <div class="w-full p-6 flex flex-col items-center justify-center text-center text-gray-400">
    <i :class="icon" class="text-4xl mb-2 text-purple-8c"></i>
    <p class="text-lg font-medium text-purple-8c">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message?: string;
    icon?: string;
  }>(),
  { message: 'لا توجد بيانات لعرضها', icon:'fa fa-inbox'}
);
</script>
