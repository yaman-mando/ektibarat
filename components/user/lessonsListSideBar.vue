<template>
    <div class="space-y-[30px]">

        <!-- next lesson -->
        <div v-if="nextLesson">
            <div
                class="flex items-center text-center gap-x-[10px] text-[24px] text-gray-8f font-medium relative mb-[12px]">
                <span>الدرس القادم</span>
                <div class="top-1/2 w-full border-t border-gray-8f left-0 z-0 flex-1"></div>
            </div>

            <div class="bg-white h-[68px] rounded-[4px] p-[9px_15px] shadow-custom">

                <div class="grid">
                    <span :class="textClass">{{ nextLesson.title }}</span>
                    <span class="flex items-center gap-[6px] text-[14px] text-gray-8f">
                        <i class="fa-solid fa-clock text-[12px]"></i>
                        {{ formatDuration(nextLesson.periodTime) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- lessons list -->
        <div>
            <div
                class="flex items-center text-center gap-x-[10px] text-[24px] text-gray-8f font-medium relative mb-[12px]">
                <span>{{ sectionTitle }}</span>
                <div class="top-1/2 w-full border-t border-gray-8f left-0 z-0 flex-1"></div>
            </div>

            <div class="space-y-[12px]" v-if="sectionLessons">
                <template v-for="lesson in sectionLessons">
                    <div v-if="lesson" :key="lesson.id" class="h-[68px] rounded-[4px] p-[9px_15px] shadow-custom"
                        :class="{
                            'bg-green-fa text-green-8c': lesson.status === 'watched',
                            'flex items-center gap-x-[10px]': lesson.status === 'locked',
                            'bg-white': lesson.status !== 'watched'
                        }">

                        <span v-if="lesson.status === 'locked'"
                            class="flex items-center justify-center w-9 h-9 rounded-full bg-[#BCCCDB33] text-[22px] text-gray-8f">

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
                            <span class="text-[20px] font-medium dark:text-purple-8c">{{ lesson.title }}
                                <i v-if="lesson.status === 'watched'"
                                    class="fa fa-check rounded-full p-[2px] border text-[12px] mr-[5px]"></i>
                            </span>
                            <span class="flex items-center gap-[6px] text-[14px] text-gray-8f">
                                <i class="fa-solid fa-clock text-[12px]"></i>
                                {{ formatDuration(nextLesson.periodTime) }}
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import Tooltip from '~/components/user/toolTip.vue'
import type { similarVidModel } from '~/main/modules/user-panel/data-access/user-panel.model';

const props = defineProps<{
    lessons: similarVidModel
    sectionTitle: string
}>()


//sorted lessons
const sortedLessons = [...props.lessons].sort((a, b) => a.order - b.order)

//last watched lesson
const lastWatchedIndex = sortedLessons.map(l => l.isWatched).lastIndexOf(true)
const nextLesson = sortedLessons[lastWatchedIndex + 1] ?? null

//lesson list
const sectionLessons = sortedLessons.map((lesson, idx) => {
    if (idx <= lastWatchedIndex) return { ...lesson, status: 'watched' }
    if (lesson === nextLesson) return { ...lesson, status: 'next' }
    return { ...lesson, status: 'locked' }
}).filter(Boolean)

//time format
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

//text class
const textClass = computed(() => {
    return 'md:text-[20px] text-sm md:font-medium text-gray-63'
})
</script>
