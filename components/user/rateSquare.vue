<template>
    <div
        class="h-[160px] bg-white shadow-custom rounded-[8px] px-[15px] pt-[15px] pb-[7px] grid justify-items-center relative">
        <app-overlay v-if="(!stdAnlyzeData?.analayzeStudentCategories && fetching)" msg="جاري جلب البيانات ..." />

        <!-- icon -->
        <div class="absolute right-[15px] top-[20px]">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_608_900)">
                    <rect y="22.6157" width="8.16" height="12.72" rx="0.96" fill="url(#paint0_linear_608_900)" />
                    <rect
x="11.5199" y="15.6557" width="8.16" height="19.68" rx="0.96"
                        fill="url(#paint1_linear_608_900)" />
                    <path
                        d="M26.9821 0.867689C27.1712 0.670722 27.4866 0.670456 27.6755 0.867689L35.8425 9.39992C36.1342 9.70513 35.918 10.2111 35.4958 10.2114H31.1189V34.44C31.1189 34.9701 30.6891 35.3999 30.1589 35.3999H24.0495C23.5195 35.3997 23.0896 34.97 23.0896 34.44V10.2114H19.1618C18.7392 10.2114 18.5229 9.70519 18.8151 9.39992L26.9821 0.867689Z"
                        fill="url(#paint2_linear_608_900)" />
                </g>
                <defs>
                    <linearGradient
id="paint0_linear_608_900" x1="8.16" y1="22.6157" x2="0" y2="22.6157"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#24A7F1" />
                        <stop offset="1" stop-color="#0266D6" />
                    </linearGradient>
                    <linearGradient
id="paint1_linear_608_900" x1="19.6799" y1="15.6557" x2="11.5199" y2="15.6557"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#24A7F1" />
                        <stop offset="1" stop-color="#0266D6" />
                    </linearGradient>
                    <linearGradient
id="paint2_linear_608_900" x1="35.9764" y1="0.719864" x2="18.6809" y2="0.719864"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#24A7F1" />
                        <stop offset="1" stop-color="#0266D6" />
                    </linearGradient>
                    <clipPath id="clip0_608_900">
                        <rect width="36" height="36" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>

        <span class="text-center text-blue-d6 h-[30px] text-[18px] 2xl:text-[22px] font-bold">الدرجة المتوقعة</span>
        <span class="text-center  text-dark-63 h-[20px] text-[14px] 2xl:text-[16px] font-medium" :class="{'mt-[-12px]':activeCase === casesEnum.gradeShow}">
            في الاختبار الحقيقي
        </span>



        <!-- not subscribe part -->
        <div
v-if="!isSubscribe" class="absolute bottom-[7px] px-[15px] w-full min-w-[300px] h-[76px] z-50 flex items-center justify-center backdrop-blur-[16px] cursor-pointer"
            @click="isStudent?openSubscribeModal:{}">
            <button
                :class="{'cursor-pointer':isStudent}"
                class="flex items-center justify-center gap-x-[10px] w-full h-[76px] px-6 border border-purple-e0 rounded-[8px] bg-transparent backdrop-blur-[16px]">
                <i class="fas fa-lock text-[22px] text-purple-e0"></i>
                <span class="text-dark-2b text-[28px] font-bold"> للمشتركين فقط </span>
            </button>
        </div>

        <!-- content -->
        <div class="relative mt-auto w-full">
            <div class="text-center text-green-8c font-bold" :class="activeCase === casesEnum.gradeShow?'leading-1':'leading-none'" >
                <span v-if="activeCase === casesEnum.level" class="text-[22px] 2xl:text-[26px]">بانتظار
                    تحديد المستوى</span>
                <span v-if="activeCase === casesEnum.notEnoght" class="text-[22px] 2xl:text-[26px]">عدد
                    الاسئلة غير كافي</span>
                <span v-if="activeCase === casesEnum.gradeShow" class="text-[40px] 2xl:text-[50px]">{{ predictedMark
                    }}</span>
            </div>
            <hr class="border-[#BCCCDB] border-t-[2px] my-[10px]" />
            <div class="flex items-center justify-around">
                <div class="flex items-center gap-x-[12px]">
                    <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">درجة تحديد المستوى </span>
                    <span class="font-bold text-dark-2b text-[10px] 2xl:text-[12px]">{{ stdAnlyzeData?.levelRate
                    }}</span>
                </div>
                <div class="flex items-center gap-x-[12px]">
                    <span class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium">الدرجة المطلوبة</span>
                    <span class="font-bold text-dark-2b text-[10px] 2xl:text-[12px]">{{ stdAnlyzeData?.requiredGrade
                    }}</span>
                </div>
            </div>
        </div>


        <!-- subscribe modal -->
        <subscribe-modal
v-if="showSubscribeModal" :show="showSubscribeModal" @update:show="
            ($event) => {
                showSubscribeModal = $event;
            }
        " />
    </div>
</template>

<script setup lang="ts">
import type { studentAnalyzeResponse } from '~/main/modules/user-panel/data-access/user-panel.model';
import { useSubscriptionsStore } from "~/main/modules/subscriptions/services/useSubscriptionsStore";
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { useUserPanelStore } from '~/store/user-panel';
import { planSubscribedEnum } from '~/main/constants/global.enums';



interface Props {
    stdAnlyzeData: studentAnalyzeResponse | null;
    fetching: boolean;
}

const props = defineProps<Props>();

const subscriptionsStore = useSubscriptionsStore();
const panelStore = useUserPanelStore();
const { data } = useAuth()

const casesEnum = {
    gradeShow: 'gradeShow',
    notEnoght: 'notEnoght',
    level: 'level'
}
const showSubscribeModal = ref(false)


const userData = computed(() => data.value as UserInfoDataModel);

const activeCase = computed(() => {
    if(userData.value.role === UserRoles.admin){
        return casesEnum.gradeShow
    }
    if (props.stdAnlyzeData?.studentRate && props.stdAnlyzeData?.studentRate > 0) {
        return casesEnum.gradeShow
    }
    if (planSubscription.value === planSubscribedEnum.finished || planSubscription.value === planSubscribedEnum.subscribed) {
        return casesEnum.level
    }
    else {
        return casesEnum.notEnoght
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


const predictedMark = computed<string>(() => {
    const numericMark = Number(props.stdAnlyzeData?.studentRate ?? 0);

    if (numericMark >= 100) {
        return "100";
    }

    const increaseMark = numericMark + 5;
    const cappedMark = increaseMark > 100 ? 100 : increaseMark;

    return `${numericMark}~${cappedMark}`;
});

function openSubscribeModal() {
    showSubscribeModal.value = true
}

</script>
