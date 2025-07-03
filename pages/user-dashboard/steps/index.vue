<template>
    <userPanelLayout>

        <app-loading-spinner v-if="userPanelStore.fetching.studentStages" text="جاري تحميل البيانات..."
            :showText="false" :showSpinner="false" :showSkeleton="true" :skeletonCount="16" />

        <div v-else-if="!userPanelStore.studentStages" class="flex justify-center items-center py-10">
            <span class="text-gray-500 dark:text-gray-300">لا توجد بيانات</span>
        </div>

        <div v-else class="flex flex-col xl1200:flex-row gap-[50px]">
            <div class="flex-1 xl1200:mt-[-60px]" v-if="activePhase">
                <!-- Header displaying active phase info -->
                <div class="grid h-[110px] text-white sm:p-[11px_20px] p-[11px_10px] rounded-[8px] 
                transition-[background] duration-700 ease-in-out" :style="{
                    background: `linear-gradient(to right, ${activePhase.color_1}, ${activePhase.color_2})`

                }">
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg font-bold">{{ activePhase.phase_name }}</h2>
                        <div class="time flex items-center gap-x-[10px] sm:ml-[40px]">
                            <img src="/images/svg/clock.svg" alt="" />
                            <div class="grid gap-y-2">
                                <span class="text-white sm:text-[16px] text-[13px] opacity-70">الوقت المتبقي</span>
                                <span>
                                    <span class="text-white sm:text-[26px] text-[20px] font-bold">{{
                                        formatTime(activePhase.total_time_remaining) }}</span>
                                    <span class="text-white-[12px] font-medium mr-[17px] opacity-70">ساعة </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-x-[23px] justify-between">
                        <div class="w-full h-[8px] bg-white/30 rounded-[8px]">
                            <div class="h-full bg-white rounded transition-all duration-1000 ease-[cubic-bezier(0.4, 0, 0.2, 1)]"
                                :style="{ width: `${(activePhase.completed_steps / activePhase.total_steps) * 100}%` }">
                            </div>
                        </div>
                        <span>{{ activePhase.completed_steps }}/{{ activePhase.total_steps }}</span>
                    </div>
                </div>


                <!-- steps -->
                <!-- scroll element -->
                <div ref="scrollContainer" class="overflow-y-auto pr-2 hide-scrollbar"
                    style="max-height: calc(100vh - 171px);">
                    <div v-for="stage of props?.stages" :key="stage.phase_id" class="mb-8"
                        :ref="el => stageRefs.set(stage.phase_id, el)">
                        <div class="flex items-center justify-center mb-[40px]">
                            <div class="flex-grow border-t-[2px] border-[#C4C4C5]"></div>
                            <span class="px-4 mt-2 text-[20px] font-medium text-gray-8f whitespace-nowrap">
                                {{ stage.phase_name }}
                            </span>
                            <div class="flex-grow border-t-[2px] border-[#C4C4C5]"></div>
                        </div>
                        <spiralButton :show-help-modal="props?.show_modal_need_help??false" :steps="stage.steps" />
                    </div>
                </div>




            </div>

            <!-- Daily Challenges -->
            <div class="w-full xl1200:w-[310px]">
                <dailyChallenges />
            </div>
        </div>
    </userPanelLayout>

</template>

<script lang="ts" setup>
import userPanelLayout from '~/layouts/user-panel-layout.vue';
import spiralButton from '~/components/user/spiralButton.vue';
import { ref, computed, onMounted, nextTick, watchEffect } from 'vue';
import { useUserPanelStore } from '~/store/user-panel';


//store
const userPanelStore = useUserPanelStore()
await userPanelStore.getStudentStages()


const props = userPanelStore.studentStages

const showHelpModal = ref(props?.show_modal_need_help);

const activePhase = ref(props?.stages.find(p => p.phase_id === props.active_phase_id));
const scrollContainer = <any>ref(null);
const stageRefs = new Map();
const currentStep = computed(() => activePhase.value?.steps.find(s => s.id === props?.active_step_id));
const needsCategorySelection = computed(() => !currentStep.value?.categoryInfo?.categoryId);


const challenges = [
    'حل 5 أسئلة من المرحلة الحالية',
    'مراجعة الأخطاء السابقة',
    'الاستمرار لمدة 10 دقائق',
];

const remainingQuestions = (step) => {
    const info = step.categoryInfo;
    return info ? info.numberQuestion - info.numberQuestionComplte : 0;
};

const onStepClick = (step) => {
    if (!step.status || step.status === 0) return;
    if (step.categoryInfo?.categoryId === null) {
        showHelpModal.value = true;
    } else if (props?.show_modal_need_help && step.categoryInfo?.isWrong) {
        showHelpModal.value = true;
    }
};

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
};

const updateActivePhaseOnScroll = () => {
    let closestStage: any = null;
    let smallestDistance = Infinity;

    for (const [phaseId, el] of stageRefs.entries()) {
        const rect = el.getBoundingClientRect();
        const containerRect = scrollContainer.value.getBoundingClientRect();

        // ✅ أضف offset هنا (مثلاً 90px)
        const offset = -200;
        const adjustedTop = rect.top - containerRect.top - offset;

        const distanceToTop = Math.abs(adjustedTop);

        if (distanceToTop < smallestDistance) {
            smallestDistance = distanceToTop;
            closestStage = props?.stages.find(p => p.phase_id === phaseId);
        }
    }

    if (closestStage && activePhase.value?.phase_id !== closestStage.phase_id) {
        activePhase.value = closestStage;
    }
};



onMounted(async () => {
    await nextTick();

    scrollContainer.value.addEventListener('scroll', updateActivePhaseOnScroll);

    const activeEl = stageRefs.get(props?.active_phase_id);

    if (activeEl && scrollContainer.value) {
        const container = scrollContainer.value;


        const offsetTop = activeEl.offsetTop;
        container.scrollTo({
            top: offsetTop - 20,
            behavior: 'smooth'
        });
    }
});


</script>

<style scoped>
.snap-x {
    scroll-snap-type: x mandatory;
}

.snap-start {
    scroll-snap-align: start;
}

.hide-scrollbar {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari */
}
</style>
