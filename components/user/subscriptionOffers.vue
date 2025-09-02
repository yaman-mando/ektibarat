<template>
    <div class="flex flex-col mb-[100px]">
        <!-- العنوان -->
        <h1 v-if="windowSize.isDesktop"  class="text-[24px] font-bold text-blue-d6">اختيار مدة الاشتراك</h1>
        <h2 v-if="windowSize.isDesktop" class="text-[18px] font-medium text-dark-63">الباقة:باقة  {{ parent.title }}</h2>

        <!-- الكروت -->
        <div class="grid gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 justify-center w-fit justify-self-center mt-[20px] mx-auto">
            <app-subscription-card @select="id=>emit('select',id)" v-for="s in parent.subscriptions" :key="s.id" :subscription="s" />
        </div>

        <!-- مزايا الباقة -->
        <div class="bg-white shadow-md rounded-lg p-4 mt-[20px]">
            <h3 class=" text-orange-39 text-[18px] font-bold mb-3">مزايا باقة  {{ parent.title }}</h3>

            <!-- نعرض 3 عناصر كحد أقصى، ريسبونسيف -->
            <ul class="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="(txt, i) in parent.features.slice(0, 3)" :key="i" class="flex items-center gap-2">
                    <!-- نفس الدائرة والرمز المستخدمين في الكرت -->
                    <div class="w-6 h-6 rounded-full flex items-center justify-center bg-[#E3F0FF]">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#0266D6]" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span v-html="txt"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { subscriptionsResponse } from '~/main/modules/user-panel/data-access/user-panel.model';

const windowSize = useWindowSize();
defineProps<{
    parent: subscriptionsResponse
}>();
const emit = defineEmits<{
    (e: 'select', id: number): void
}>()
</script>
