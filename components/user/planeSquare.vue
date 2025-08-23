<template>
    <div class="min-h-[300px] bg-white shadow-custom rounded-[8px] p-[20px_15px] grid relative">
        <no-sub-plane :type="noSubType" v-if="!isShowRate" />
        <template v-else>
            <app-overlay msg="جاري جلب بيانات الخطة ..." v-if="fetching" />


            <!-- First line -->
            <div class="flex items-center justify-between h-[50px]">
                <div class="flex flex-col items-start">
                    <span class="text-blue-d6 font-bold text-[16px] 2xl:text-[18px]">
                        الالتزام بالخطة
                    </span>
                    <span class="flex gap-x-[5px] items-center">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4" cy="4" r="4" :fill="levelColor" />
                        </svg>
                        <span class="text-[14px] 2xl:text-[16px] font-medium" :style="{ color: levelColor }">
                            {{ level }}
                        </span>
                    </span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-[40px] 2xl:text-[48px] leading-[42px] font-bold text-dark-63">
                        <template v-if="stdPlaneInfo?.totalPercentage && stdPlaneInfo?.totalPercentage > 0">
                            <span>{{ stdPlaneInfo?.totalPercentage }}</span>
                            <span class="text-[26px] 2xl:text-[30px]">%</span>
                        </template>
                        <span v-else>--</span>
                    </span>
                    <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">
                        {{ dateFormat.formatStoMMHH(stdPlaneInfo?.timeDone) }} | {{
                            dateFormat.formatStoMMHH(stdPlaneInfo?.timeRequired) }}
                    </span>
                </div>
            </div>

            <!-- Progress bar -->
            <div class="mt-[15px] h-[84px] grid items-center relative">
                <div style="box-shadow: 2px 2px 4px 0px #00000026 inset" class="relative h-[20px] bg-[#F0F0F0]">
                    <!-- Green bar -->
                    <div style="background: linear-gradient(90deg, #58CC02 0%, #4E9818 100%)"
                        class="absolute top-0 bottom-0 right-0" :style="{ width: `${stdPlaneInfo?.percentageDone}%` }">
                    </div>

                    <!-- Orange bar -->
                    <div style="
                    background: linear-gradient(
                      90deg,
                      #fdc830 0%,
                      #ce9800 100%
                    );
                  " class="absolute top-0 bottom-0" :style="{
                    width: `${(stdPlaneInfo?.percentageRequired ?? 0) - (stdPlaneInfo?.percentageDone ?? 0)}%`,
                    right: `${stdPlaneInfo?.percentageDone ?? 0}%`
                }">
                    </div>
                </div>

                <!-- "You are here" indicator -->
                <div v-if="stdPlaneInfo?.percentageDone > 0"
                    :style="{ right: `calc(${stdPlaneInfo?.percentageDone ?? 0}% - 30px)` }"
                    class="absolute -top-[10px] h-[27px] grid gap-y-[5px] justify-items-center w-[40px]">
                    <div class="text-[10px] 2xl:text-[12px] text-black font-medium">أنت هنا</div>
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 14L0 0L16 0L8 14Z" fill="#00C48C" />
                    </svg>
                </div>

                <!-- Target indicator -->
                <div v-if="stdPlaneInfo?.percentageRequired > 0"
                    :style="{ right: `calc(${stdPlaneInfo?.percentageRequired ?? 0}% - 45px)` }"
                    class="absolute bottom-0 h-[27px] grid gap-y-[5px] justify-items-center w-[80px]">
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0L16 14H0L8 0Z" fill="#EAB316" />
                    </svg>
                    <div class="text-[10px] 2xl:text-[12px] h-[8px] text-black font-medium">
                        الإنجاز المقرر
                    </div>
                </div>
            </div>

            <!-- Last week / month -->
            <div class="flex flex-wrap gap-y-[10px] justify-around items-center mt-[28px] h-[30px]">
                <div class="flex items-center gap-x-[8px] text-right pr-[5px] border-r-[3px] border-r-purple-e0">
                    <div class="font-bold text-[24px] 2xl:text-[28px] text-dark-63">
                        <template v-if="stdPlaneInfo?.lastMonth.percentage && stdPlaneInfo?.lastMonth.percentage > 0">
                            {{ stdPlaneInfo?.lastMonth.percentage }}%
                        </template>
                        <template v-else>--</template>
                    </div>
                    <div class="flex flex-col items-center text-[12px] 2xl:text-[14px] font-medium text-gray-8f">
                        <span>آخر الشهر</span>
                        <span>{{ dateFormat.formatStoMMHH(stdPlaneInfo?.lastMonth.timeDone) }} | {{
                            dateFormat.formatStoMMHH(stdPlaneInfo?.lastMonth.timeRequired) }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-x-[8px] text-right pr-[5px] border-r-[3px] border-r-purple-e0">
                    <div class="font-bold text-[24px] 2xl:text-[28px] text-dark-63">
                        <template v-if="stdPlaneInfo?.lastWeek.percentage && stdPlaneInfo?.lastWeek.percentage > 0">
                            {{ stdPlaneInfo?.lastWeek.percentage }}%
                        </template>
                        <template v-else>--</template>
                    </div>
                    <div class="flex flex-col items-center text-[12px] 2xl:text-[14px] font-medium text-gray-8f">
                        <span>آخر أسبوع</span>
                        <span>{{ dateFormat.formatStoMMHH(stdPlaneInfo?.lastWeek.timeDone) }} | {{
                            dateFormat.formatStoMMHH(stdPlaneInfo?.lastWeek.timeRequired) }}</span>
                    </div>
                </div>
            </div>

            <!-- Dates -->
            <hr class="border-[#BCCCDB] border-t-[2px] mt-[25px] mb-[10px]" />
            <div class="flex items-center justify-around h-[8px]">
                <div class="flex items-center gap-x-[12px]">
                    <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">بداية التدريب </span>
                    <span class="text-dark-2b text-[10px] 2xl:text-[12px]">{{ stdPlaneInfo?.startTraining }}</span>
                </div>
                <div class="flex items-center gap-x-[12px]">
                    <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">تاريخ الاختبار</span>
                    <span class="text-dark-2b text-[10px] 2xl:text-[12px]">{{ stdPlaneInfo?.examDate }}</span>
                </div>
            </div>

        </template>
    </div>
</template>

<script setup lang="ts">
import { UserRoles } from "~/core/auth/constants/user-roles";
import type { UserInfoDataModel } from "~/core/auth/data-access/models/auth.model";
import { planSubscribedEnum } from "~/main/constants/global.enums";
import { useSubscriptionsStore } from "~/main/modules/subscriptions/services/useSubscriptionsStore";
import type { trainingPlanSummaryResponse } from "~/main/modules/user-panel/data-access/user-panel.model";
import * as dateFormat from "~/main/utils/date-utils";
import { useUserPanelStore } from "~/store/user-panel";


interface Props {
    stdPlaneInfo?: trainingPlanSummaryResponse | null;
    fetching: boolean;
}

const subscriptionsStore = useSubscriptionsStore();
const panelStore = useUserPanelStore();

const props = defineProps<Props>();


const { data } = useAuth()
const userData = computed(() => data.value as UserInfoDataModel);


const noSubType = computed(() => {
    if (isSubscribe.value) {
        if (isStudent.value) {
            return 'studentHasNoPlane'
        }
        return 'studentHasNoPlaneForTeacher'
    }
    else {
        if (isStudent.value) {
            return 'studentNotSubscribe'
        }
        return 'studentNotSubscribeForTeacher'
    }
})

const isStudent = computed(() => {
    return userData.value.role === UserRoles.student || userData.value.role === UserRoles.admin
})

const isSubscribe = computed(() => {
    return isStudent.value ? subscriptionsStore.state.userCurrentSubVal?.freeType === null : panelStore.studentSubscriptionDetails?.isSubscribed
})

const planSubscription = computed(() => {
    return isStudent.value ? userData.value.planSubscribed : panelStore.studentSubscriptionDetails?.planSubscription
})


const isShowRate = computed(() => {
    return isSubscribe.value && (planSubscription.value === planSubscribedEnum.finished || planSubscription.value === planSubscribedEnum.subscribed)
})





const level = computed<string>(() => {
    const percentageDone = props.stdPlaneInfo?.percentageDone ?? 0;

    if (percentageDone >= 95) return "ممتاز";
    if (percentageDone >= 80) return "جيد";
    if (percentageDone >= 50) return "متوسط";
    return "ضعيف";
});


const levelColors: Record<string, string> = {
  "ممتاز": "#58CC02",
  "جيد": "#58CC02",
  "متوسط": "#EAB316",
  "ضعيف": "#F04438"
};

const levelColor = computed(() => levelColors[level.value] ?? "#999999");

</script>
