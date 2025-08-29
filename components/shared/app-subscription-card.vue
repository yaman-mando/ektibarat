<template>
  <article
    class="relative h-full w-[340px] min-h-[400px] rounded-xl shadow-md flex flex-col items-stretch overflow-hidden bg-white"
  >
    <!-- شارة أفضل قيمة -->
    <div
      v-if="packet.isBestPrice"
      class="absolute left-0 top-[35px] z-10 w-[109px] h-[40px] flex items-center justify-center bg-[#FF6A39] text-white text-sm font-bold shadow-[0_0_10px_0_#00000026] rounded-r-[20px]"
    >
      أفضل قيمة
    </div>

    <!-- الهيدر -->
    <header
      class="h-[80px] flex items-center justify-center text-white font-bold text-lg"
      :class="packet.isBestPrice
        ? 'bg-gradient-to-r from-[#7840E0] to-[#300378]'
        : 'bg-[#0266D6]'"
    >
      {{ packet.title }}
    </header>

    <!-- السعر -->
    <div class="px-6 pt-4">
      <div class="text-[28px] leading-none font-bold text-[#1f2937]">
        {{ packet.currentPrice }} <span class="text-[#4B5363] text-xl">﷼</span>
      </div>
    </div>

    <!-- المزايا -->
    <ul class="flex flex-col gap-3 px-6 pt-6 pb-4 flex-1">
      <li
        v-for="(feature, i) in packet.features"
        :key="i"
        class="flex items-start gap-2 text-[#4B5363] text-sm leading-6"
      >
        <span class="w-6 h-6 rounded-full bg-[#E3F0FF] flex items-center justify-center shrink-0 mt-[2px]">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#0266D6]" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span v-html="feature"></span>
      </li>
    </ul>

    <!-- زر اختر -->
    <div class="flex justify-center pb-5">
      <button
        class="w-[200px] h-[46px] rounded-[8px] font-semibold"
        :class="packet.isBestPrice
          ? 'bg-[#7840E0] text-white'
          : 'bg-transparent border border-[#4B5363] text-[#4B5363]'"
        @click="emit('select', packet.id)"
      >
        اختر
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { subscriptionsParents } from '~/main/modules/user-panel/data-access/user-panel.model';




const props = defineProps<{
  packet: subscriptionsParents
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
}>()
</script>