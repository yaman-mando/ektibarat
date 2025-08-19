<template>
  
    <!-- حالة التحميل -->
    <app-loading-spinner
      v-if="loading"
      :type="loadingType"
      :text="loadingText"
      :skeletonCount="skeletonCount"
    />

    <!-- حالة لا توجد بيانات -->
    <div
      v-if="isEmpty && !loading"
      class="flex w-full justify-center items-center py-10 text-gray-500 dark:text-gray-300"
    >
      {{ emptyText }}
    </div>

    <!-- حالة عرض البيانات -->
    
      <slot v-else-if="!(loading && loadingType !== 'spinner-overlay')" />
    
  
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  loading: boolean
  data: any
  loadingType?: 'spinner' | 'text' | 'skeleton' | 'spinner-overlay'
  loadingText?: string
  skeletonCount?: number
  emptyText?: string
}>(), {
  loadingType: 'spinner',
  loadingText: 'جاري التحميل...',
  skeletonCount: 10,
  emptyText: 'لا توجد بيانات'
})

// التحقق إن كانت البيانات فاضية
const isEmpty = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data.length === 0
  }
  return !props.data
})
</script>
