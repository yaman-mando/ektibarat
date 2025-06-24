<!-- LessonCard.vue -->
<template>
    <div class="rounded-[8px] cursor-pointer p-[15px_17px] flex items-center justify-between h-[70px] border-[1px]"
        :class="cardClass">
        <div class="flex items-center gap-x-[10px]">
            <span v-if="status === 'completed'"
                class="flex items-center justify-center w-9 h-9 rounded-full bg-white text-green-8c text-[22px]">
                ✔
            </span>
            <span v-else-if="status === 'next'"
                class="flex items-center justify-center w-9 h-9 rounded-full bg-white  text-[22px] text-yellow-30">
                <i class="fa fa-star"></i>
            </span>
            <span v-else class="flex items-center justify-center w-9 h-9 
                rounded-full bg-[#BCCCDB33] text-[22px] text-gray-8f">

                <tooltip>
                    <template #default>
                        <i class="fa fa-lock"></i>
                    </template>
                    <template #content>
                        <span class="text-[16px] font-medium text-gray-63">
                            سيفتح هذا الدرس بعد إكمالك
                            <br>
                            للدروس السابقة له.
                        </span>
                    </template>
                </tooltip>


            </span>
            <div class="grid">
                <span :class="textClass">{{ titleText }}</span>
                <span v-if="lesson.periodTime" class="flex items-center gap-[6px] text-[14px] text-gray-8f">
                    <i class="fa-solid fa-clock text-[12px]"></i>
                    {{ formatTime(lesson.periodTime) }}
                </span>
            </div>
        </div>
        <i class="fa fa-chevron-left"></i>
    </div>
</template>

<script setup lang="ts">
import Tooltip from '~/components/user/toolTip.vue'
const props = defineProps<{
    lesson: {
        id: number
        title: string
        type: number
        periodTime: number
        isWatched: boolean
        isShow: boolean
    }
    status: 'completed' | 'next' | 'locked'
}>()

const cardClass = computed(() => {
    switch (props.status) {
        case 'completed':
            return 'text-green-8c bg-gradient-to-r from-[#ECFFFA] to-[#ECFFFA]'
        case 'next':
            return 'text-yellow-16 bg-gradient-to-r from-[#FFF8E2] to-[#FFF8E2]'
        case 'locked':
            return 'bg-white-ff text-gray-8f'
    }
})

const textClass = computed(() => {
    return 'md:text-[20px] text-sm md:font-bold'
})

const titleText = computed(() => {
    switch (props.lesson.type) {
        case 1: {
            return props.lesson.title
        }
        case 2: {
            return 'تدريبات القسم'
        }
        case 3: {
            return 'معلومات الحفظ'
        }
        default:
            return props.lesson.title
    }
})

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}
</script>
