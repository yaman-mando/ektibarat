<template>
  <!-- Grid ريسبونسيف – كل كرت 340px والمسافة 20px -->
  <div
    class="grid justify-center gap-5
           [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]"
  >
    <app-subscription-card 
      v-for="p in arrangedPackets"
      :key="p.id"
      :packet="p"
      class="h-full"
      @select="id => emit('select', id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { subscriptionsParentsResponse } from '~/main/modules/user-panel/data-access/user-panel.model';


const props = defineProps<{
  packets: subscriptionsParentsResponse | null
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
}>()

// مراقبة عرض الشاشة لتحديد الموبايل
const width = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)
const onResize = () => (width.value = window.innerWidth)
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
const isMobile = computed(() => width.value < 768) // md breakpoint

// ترتيب المصفوفة بحيث الـ isBestPrice بالمنتصف (وعلى الموبايل يكون أول عنصر)
const arrangedPackets = computed<subscriptionsParentsResponse>(() => {
  const src = props.packets ?? []
  if (src.length === 0) return []

  const bestIdx = src.findIndex(p => p.isBestPrice)
  if (bestIdx === -1) return src

  const list = [...src]
  const [best] = list.splice(bestIdx, 1)

  if (isMobile.value) {
    // موبايل: الأفضل أول كرت
    return [best, ...list]
  }

  // عرض: الأفضل في الوسط
  // الوسط = قبل منتصف الباقين، يعمل مع 2..n
  const mid = Math.floor(list.length / 2)
  list.splice(mid, 0, best)
  return list
})
</script>

