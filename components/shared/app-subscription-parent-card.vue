<template>
  <article
    class="relative h-full w-[330px] sm:w-[340px] min-h-[400px] rounded-[8px] shadow-custom flex flex-col items-stretch overflow-hidden bg-white"
  >
    
    <div
      v-if="packet.isBestPrice"
      class="absolute left-0 top-[115px] z-10 w-[109px] h-[40px] flex items-center justify-center bg-[#FF6A39] text-white text-[16px] font-medium shadow-[0_0_10px_0_#00000026] rounded-r-[20px]"
    >
      أفضل قيمة
    </div>

    
    <header
      class="h-[80px] grid items-center content-center justify-items-center text-white"
      :class="packet.isBestPrice
        ? 'bg-gradient-to-r from-[#7840E0] to-[#300378]'
        : 'bg-[#0266D6]'"
    >
      <span class="text-[22px] font-bold">{{ packet.title }}</span>
      <span class="text-[18px] font-medium">{{ packet.subTitle }}</span>
    </header>

    
    <div class="px-6 pt-4">
      <span class="text-gray-8f font-medium text-[16px]">ابتداءً من</span>
      <div class="leading-none font-bold text-[#1f2937] flex items-center gap-x-[8px]">
        <span class="text-[54px] text-2b font-bold">{{ packet.currentPrice }}</span>
        <img src="/images/svg/s-riyal.svg" />
      </div>
    </div>

    <!-- المزايا -->
    <ul class="flex flex-col gap-3 px-[20px] pt-6 pb-4 flex-1">
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
    <div class="flex justify-center pb-5 mt-[10px]">
      <button
        class="w-[200px] h-[46px] rounded-[8px] font-medium text-[18px] cursor-pointer"
        :class="packet.isBestPrice
          ? 'bg-[#7840E0] text-white'
          : 'bg-transparent border border-[#AFAFAF] text-[#4B5363]'"
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