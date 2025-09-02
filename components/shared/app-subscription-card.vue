<template>
    <div class="w-[330px]  sm:w-[340px] min-h-[400px] flex flex-col p-[25px] bg-white shadow-custom rounded-[8px] relative">
        
        <div class="flex items-center justify-center">
            <h2 class="text-blue-d6 font-bold text-[30px]">
                <text-slice :text="subscription.title" length="17" />
            </h2>
        </div>

        
        <div class="flex justify-between items-center">
            <div class="relative inline-block text-[40px] text-[#8F8F8F]">
                {{ subscription.oldPrice }}
                <span class="absolute left-0 top-3/4 w-full h-[3px] bg-[#FF375E] origin-left -rotate-[30deg]"></span>
            </div>
            <div
                class="bg-yellow-16 text-dark-2b text-[18px] font-bold rounded-[8px] px-2 py-1 h-[30px] flex items-center">
                توفير {{ subscription.oldPrice - subscription.currentPrice }} ريال
            </div>
        </div>

        
        <div
            class="bg-purple-78 text-white text-[60px] font-bold h-[62px] flex items-center justify-center gap-x-[8px] w-full mb-3">
            <span>{{ subscription.currentPrice }}</span>
            <img src="/images/svg/s-riyal-white.svg" />
        </div>

        
        <p class="font-bold text-dark-63 mb-[10px]">تشمل الباقة</p>
        <ul class="flex flex-col gap-3 flex-1">
            <li v-for="(feature, i) in subscription.features" :key="i"
                class="flex items-start gap-2 text-[#4B5363] text-sm leading-6">
                <span class="w-6 h-6 rounded-full bg-[#E3F0FF] flex items-center justify-center shrink-0 mt-[2px]">
                    <svg v-if="feature.isExist" viewBox="0 0 24 24" class="w-4 h-4 text-[#0266D6]" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else class="text-red-500">✖</span>
                </span>
                <span v-html="feature.title"></span>
            </li>
        </ul>

        
        <div class="flex justify-center absolute bottom-[25px] left-[70px]">
            <button class="w-[200px] h-[46px] rounded-[8px] font-medium text-[18px] cursor-pointer" :class="subscription.isRecommended
                ? 'bg-[#7840E0] text-white'
                : 'bg-transparent border border-[#AFAFAF] text-[#4B5363]'" @click="emit('select', subscription.id)">
                اختر
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { subscriptionPacket } from '~/main/modules/user-panel/data-access/user-panel.model';


defineProps<{
    subscription: subscriptionPacket
}>();
const emit = defineEmits<{
    (e: 'select', id: number): void
}>()
</script>
