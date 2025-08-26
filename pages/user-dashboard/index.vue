<template>
    <user-panel-wrapper content-class="max-w-[1050px] !mx-auto px-[5px]">
        <div class="mt-0 sm:mt-[-60px] text-[20px] font-bold text-blue-d6 dark:text-white">
            <span>أهلاً </span>
            <span>{{ userData.userName || userData.firstName }}!</span>
        </div>

        <!-- السلايدر -->
        <app-data-wrapper :loading="panelStore.fetching.homeSliders" :data="sliders" loading-type="text"
            loadingText="جاري تحميل السلايدر ..." empty-text="لا توجد صور سلايدر">
            <app-slider class="mt-[20px]" v-if="sliders" :slides="sliders" :delay-action="6000" :tagFilter="0" />
        </app-data-wrapper>

        <!-- التحليلات -->
        <div v-if="userData.role === UserRoles.admin" class="flex 2xl:flex-nowrap flex-wrap mt-[20px] gap-[20px]">
            <!-- مربع اختبار القدرات -->
            <div class=" flex-2/3 p-[18px_15px] rounded-lg bg-white dark:bg-gray-800 shadow-custom grid gap-[10px]">
                <div class="flex items-center justify-between">
                    <!-- عنوان الاختبار + التقييم -->
                    <div class="flex flex-col gap-1">
                        <div class="text-[18px] font-bold text-blue-d6 dark:text-gray-300">
                            اختبار {{ analyzeInfo?.subjectName }}
                        </div>
                        <div class="text-[16px] font-medium text-green-8c">
                            <span class="inline-block w-2 h-2 bg-green-8c rounded-full ml-1"></span>
                            {{ getStudentRateLabel(analyzeInfo?.studentRate ?? 0) }}
                        </div>
                    </div>

                    <!-- نسبة الأداء -->
                    <app-circule-progress-bar :isLock="!isSubscribe" :percentage="analyzeInfo?.studentRate ?? 0"
                        :gradientColors="['#58CC02', '#4E9818']" :strokeWidth="9" :textSize="16"
                        textClass="text-blue-d6" />

                </div>

                <!-- أقسام التدريب -->
                <div class="flex-1 min-h-[100px] mt-4 sm:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                    <div v-for="cat in analyzeInfo?.trainingAnalyzeCategories" :key="cat.categoryId"
                        class="bg-gray-fa dark:bg-gray-700 rounded-[8px] p-[12px] flex flex-col gap-[8px]">
                        <div class="flex items-center justify-center gap-[10px]">
                            <img src="/images/svg/calculator.svg" class="w-[28px] h-auto" alt="icon" />
                            <div class="text-orange-39 font-bold text-[16px]">{{ cat.categoryName }}</div>
                        </div>
                        <div class="flex justify-between text-sm text-gray-700 dark:text-gray-200">
                            <div class="flex flex-col items-center">
                                <span class=" text-purple-78 text-[14px] font-bold">الأسئلة</span>
                                <span class=" text-gray-63 text-[14px]">{{
                                    dateFormat.formatNoData(cat.questionsCount) }}</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-purple-78 text-[14px] font-bold">الإجابات</span>
                                <div>
                                    <span class="text-red-5e text-[14px] font-medium">{{
                                        dateFormat.formatNoData(cat.wrongAnswersCount) }}</span>
                                    |
                                    <span class="text-green-8c text-[14px] font-medium">{{
                                        dateFormat.formatNoData(cat.correctAnswersCount)
                                    }}</span>
                                </div>
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-purple-78 text-[14px] font-bold">مدة التدريب</span>
                                <span class="text-gray-63 text-[14px]">{{
                                    dateFormat.formatStoMMHHWithText(cat.totalTime) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- زر التحليلات -->
                <div class="w-full flex justify-center">
                    <app-g-button @click="toAnalytics" width="150px" height="44px" bg-class="bg-blue-d6" radius="8px"
                        text-color="text-white" text-size="16px" font-weight="font-medium">
                        التحليلات
                    </app-g-button>

                </div>
            </div>



            <!-- مربع التقدم بالخطة -->
            <div class="flex-1/3 min-h-[300px] bg-white shadow-custom rounded-[8px] p-[20px_15px] grid relative">
                <!-- not subscribe -->
                <no-sub-plane type="studentHasNoPlane" v-if="!isSubscribe" />
                <template v-else>
                    <app-overlay msg="جاري جلب بيانات الخطة ..." v-if="panelStore.fetching.planInfoSimple" />
                    <!-- First line -->
                    <div class="flex items-center justify-between h-[50px]">
                        <div class="flex flex-col items-start">
                            <span class="text-blue-d6 font-bold text-[16px] 2xl:text-[18px]">
                                الالتزام بالخطة
                            </span>
                            <span class="flex gap-x-[5px] items-center">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="4" cy="4" r="4" :fill="levelColor" />
                                </svg>
                                <span class="text-[14px] 2xl:text-[16px] font-medium" :style="{ color: levelColor }">
                                    {{ level }}
                                </span>
                            </span>
                        </div>
                        <div class="flex flex-col items-center">
                            <span class="text-[40px] 2xl:text-[48px] leading-[42px] font-bold text-dark-63">
                                <span>{{ dateFormat.formatNoData(planInfo?.totalPercentage) }}</span>
                                <span class="text-[26px] 2xl:text-[30px]"
                                    v-if="planInfo?.totalPercentage && planInfo?.totalPercentage > 0">%</span>
                            </span>
                            <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">
                                {{ dateFormat.minutesToHHMM(planInfo?.timeDone, false) }} | {{
                                    dateFormat.minutesToHHMM(planInfo?.timeRequired, false) }}
                            </span>
                        </div>
                    </div>

                    <!-- Progress bar -->
                    <div class="mt-[15px] h-[84px] grid items-center relative">
                        <div style="box-shadow: 2px 2px 4px 0px #00000026 inset" class="relative h-[20px] bg-[#F0F0F0]">
                            <!-- Green bar -->
                            <div style="background: linear-gradient(90deg, #58CC02 0%, #4E9818 100%)"
                                class="absolute top-0 bottom-0 right-0"
                                :style="{ width: `${planInfo?.percentageDone}%` }">
                            </div>

                            <!-- Orange bar -->
                            <div style="
                    background: linear-gradient(
                      90deg,
                      #fdc830 0%,
                      #ce9800 100%
                    );
                  " class="absolute top-0 bottom-0" :style="{
                    width: `${(planInfo?.percentageRequired ?? 0) - (planInfo?.percentageDone ?? 0)}%`,
                    right: `${planInfo?.percentageDone ?? 0}%`
                }">
                            </div>
                        </div>

                        <!-- "You are here" indicator -->
                        <div v-if="planInfo?.percentageDone > 0"
                            :style="{ right: `calc(${planInfo?.percentageDone ?? 0}% - 18px)` }"
                            class="absolute -top-[10px] h-[27px] grid gap-y-[5px] justify-items-center w-[40px]">
                            <div class="text-[10px] 2xl:text-[12px] text-black font-medium">أنت هنا</div>
                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 14L0 0L16 0L8 14Z" fill="#00C48C" />
                            </svg>
                        </div>

                        <!-- Target indicator -->
                        <div v-if="planInfo?.percentageRequired > 0"
                            :style="{ right: `calc(${planInfo?.percentageRequired ?? 0}% - 40px)` }"
                            class="absolute bottom-0 h-[27px] grid gap-y-[5px] justify-items-center w-[80px]">
                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0L16 14H0L8 0Z" fill="#EAB316" />
                            </svg>
                            <div class="text-[10px] 2xl:text-[12px] h-[8px] text-black font-medium">
                                الإنجاز المقرر
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-center gap-x-[20px]">
                        <app-g-button @click="toPlane" width="150px" height="44px" bg-class="bg-transparent"
                            :border="true" border-color="border-purple-8c" radius="8px" text-color="text-purple-8c"
                            text-size="16px" font-weight="font-medium">
                            خطتي
                        </app-g-button>
                        <app-g-button @click="toTraining" width="150px" height="44px" bg-class="bg-purple-78"
                            radius="8px" text-color="text-white" text-size="16px" font-weight="font-medium">
                            تدرب
                        </app-g-button>
                    </div>
                </template>
            </div>
        </div>

        <!-- أحدث المقالات -->
        <div class="grid gap-y-[25px] mt-[40px] mb-[30px]">
            <span class=" text-blue-d6 text-[24px] font-bold">أحدث المقالات</span>
            <app-data-wrapper :loading="panelStore.fetching.blogs" :data="blogs" loading-type="text"
                loadingText="جاري تحميل المقالات ..." empty-text="لا توجد بيانات متاحة">
                <app-blogs v-if="blogs" :blogs="blogs" />
            </app-data-wrapper>
        </div>

    </user-panel-wrapper>
</template>

<script lang="ts" setup>
import { useUserPanelStore } from '~/store/user-panel';
import { computed } from 'vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { planSubscribedEnum } from '~/main/constants/global.enums';
import { RouteHelper } from '~/main/utils/route-helper';
import { webUserSteps, webUserTrainingPlan, webUserTrainWithUs } from '~/main/utils/web-routes.utils';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import * as dateFormat from '~/main/utils/date-utils'

const panelStore = useUserPanelStore();
const { data } = useAuth();
const router = useRouter()

panelStore.getBlogs();
panelStore.getHomeSlides();
panelStore.getSimpleTrainingAnalyze();
panelStore.getSimplePlansInfo();

const subscriptionsStore = useSubscriptionsStore();
const isSubscribe = computed(() => {
    return subscriptionsStore.state.userCurrentSubVal?.freeType === null
})

const userData = computed(() => data.value as UserInfoDataModel);
const blogs = computed(() => panelStore.blogs);
const sliders = computed(() => panelStore.homeSliders);
const planInfo = computed(() => panelStore.planInfoSimple);
const analyzeInfo = computed(() => panelStore.trainingAnalyzeSimple);


const getStudentRateLabel = (rate: number) => {
    if (rate >= 85) return 'ممتاز';
    if (rate >= 70) return 'جيد جداً';
    if (rate >= 50) return 'جيد';
    return 'ضعيف';
};

const level = computed(() => {
    if (planInfo.value?.percentageDone >= 95) return 'ممتاز';
    if (planInfo.value?.percentageDone >= 80) return 'جيد';
    if (planInfo.value?.percentageDone >= 50) return 'متوسط';
    return 'ضعيف';
});

const levelColor = computed(() => {
    switch (level.value) {
        case 'جيد':
        case 'ممتاز':
            return '#58CC02';
        case 'متوسط':
            return '#EAB316';
        case 'ضعيف':
            return '#F04438';
        default:
            return '#999999';
    }
});



const toAnalytics = () => {
    router.push(RouteHelper.userAnalytics())
}

const toTraining = () => {
    if (userData.value.planSubscribed === planSubscribedEnum.finished || userData.value.planSubscribed === planSubscribedEnum.subscribed) {
        router.push(webUserSteps())
        return
    }
    router.push(webUserTrainWithUs())
}

const toPlane = () => {
    if (userData.value.planSubscribed === planSubscribedEnum.finished || userData.value.planSubscribed === planSubscribedEnum.subscribed) {
        router.push(webUserTrainingPlan())
        return
    }
    router.push(webUserTrainWithUs())
}

</script>

<style scoped>
.hide-scroll-bar::-webkit-scrollbar {
    display: none;
}

.hide-scroll-bar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
