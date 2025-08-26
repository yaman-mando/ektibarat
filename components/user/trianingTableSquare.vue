<template>
    <!-- tables filter -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-baseline mt-[25px] gap-x-[30px] gap-y-[15px]">
        <h2 class="text-[24px] font-bold text-blue-d6 text-right">تفاصيل التدريب</h2>

        <select v-model="selectedPeriodTable"
            class="w-full md:w-[220px] h-[40px] bg-white border border-[#BCCCDB] rounded-[6px] text-dark-2b outline-0">
            <option v-for="item in tablePeriodList" :key="item.id" :value="item.id">
                الفترة: {{ item.label }}
            </option>
        </select>
    </div>

    <!-- tables - Accordion -->
    <div class="mt-5 flex flex-col gap-5 relative">
        <app-overlay msg="جاري جلب البيانات ..." v-if="fetching" />
        <app-no-data v-else-if="!stdAnlyzeDataTable || stdAnlyzeDataTable.length === 0" />

        <accordionGroup v-else>
            <disclosureGroup v-for="(item, index) in stdAnlyzeDataTable" :key="index" :defaultOpen="true"
                :isResponsive="true" :onlyOneOpen="false" :index="index">
                <!-- head -->
                <template #right>
                    <div class="flex justify-between w-[705px] items-center justify-self-center p-2">
                        <div class="flex gap-x-[5px] items-center">
                            <img src="/images/svg/calculator.svg" alt="icon" />
                            <span class="text-[18px] font-bold text-orange-39">{{ item?.categoryName }}</span>
                        </div>
                        <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                            <span class="font-bold text-purple-78">الأسئلة</span>
                            <span class="text-dark-2b">{{ item.questionsCount }}</span>
                        </div>
                        <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                            <span class="font-bold text-purple-78">الإجابات</span>
                            <span class="text-green-8c">
                                {{ item.correctAnswersCount }}
                                <span class="text-gray-8f px-1">|</span>
                                <span class="text-red-5e">{{ item.wrongAnswersCount }}</span>
                            </span>
                        </div>
                        <div class="text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                            <span class="font-bold text-purple-78">مدة التدريب</span>
                            <span class="text-dark-2b">
                                {{ dateFormat.formatStoSSMM_MMHH(item.totalTime) }}
                                <span class="text-gray-8f" v-if="item.totalTime>0">
                                    <template v-if="item.totalTime < 60">ثانية</template>
                                    <template v-else-if="item.totalTime < 3600">دقيقة</template>
                                    <template v-else>ساعة</template>
                                </span>
                            </span>
                        </div>
                    </div>
                </template>

                <!-- table -->
                <div class="space-y-2">
                    <!-- Header -->
                    <div class="h-[70px] w-full flex items-center">
                        <!-- first part -->
                        <div
                            class="bg-[#F5F7FA] h-[100%] flex-[70%] flex items-center border border-[#BCCCDB] rounded-[8px] px-[15px] text-purple-78 text-[16px] font-bold">
                            <div class="w-[40%]">القسم</div>
                            <div class="w-[20%] text-center">عدد الأسئلة</div>
                            <div class="w-[20%] text-center">
                                الإجابات
                                <br />
                                <span class="font-medium">
                                    <span class="text-green-8c font-medium text-[12px]">صحيحة</span> |
                                    <span class="text-red-5e font-medium text-[12px]">خاطئة</span>
                                </span>
                            </div>
                            <div class="w-[20%] text-center">زمن الإجابة والمتوسط</div>
                            <div class="w-[20%] text-center">مدة التدريب</div>
                        </div>

                        <div class="w-[15px]"></div>

                        <!-- second part -->
                        <div
                            class="bg-[#F5F7FA] h-[100%] flex flex-[30%] items-center border border-[#BCCCDB] rounded-[8px] px-[15px] text-purple-78 text-[16px] font-bold">
                            <div class="w-[55%] text-center">التقييم العام</div>
                            <div class="w-[45%] text-center">إجراءات</div>
                        </div>
                    </div>

                    <!-- data -->
                    <div v-for="(child, i) in item.children" :key="i" :class="['h-[60px] flex items-center']">
                        <!-- first part -->
                        <div class="flex flex-[70%] h-[100%] items-center rounded-[8px] border border-[#BCCCDB] px-[15px]"
                            :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                            <div class="w-[40%] text-gray-63 font-medium">
                                {{ child.categoryName }}
                            </div>
                            <div class="w-[20%] text-gray-63 font-medium text-center">
                                {{ child.questionsCount }}
                            </div>
                            <div class="w-[20%] text-center">
                                <span class="text-green-8c font-bold text-[14px]">
                                    {{ child.correctAnswersCount  }}
                                </span>
                                |
                                <span class="text-red-5e font-bold text-[14px]">
                                    {{ child.wrongAnswersCount }}
                                </span>
                            </div>
                            <div class="w-[20%] text-center">
                                <span class="text-green-8c font-bold text-[14px]">
                                    {{ dateFormat.formatStoSSMM_MMHH(child.studentTimeTakenRate) }}
                                </span>
                                |
                                <span class="text-red-5e font-bold text-[14px]">
                                    {{ dateFormat.formatStoSSMM_MMHH(child.allStudentsTimeTakenRate) }}
                                </span>
                            </div>
                            <div class="w-[20%] text-gray-63 font-medium text-center">
                                {{ dateFormat.formatStoSSMM_MMHHWithText(child.totalTime) }}
                            </div>
                        </div>

                        <div class="w-[15px]"></div>

                        <!-- second part -->
                        <div class="flex flex-[30%] h-[100%] items-center rounded-[8px] border border-[#BCCCDB]"
                            :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                            <div class="w-[55%] h-[100%] flex justify-center items-center">
                                <template v-if="child.isEnabled">
                                    <span v-if="child.rate === 0" class="text-[14px] font-bold text-purple-e0">
                                        عدد الأسئلة غير كاف
                                    </span>
                                    <rate-progress-bar v-else :value="child.rate" />
                                </template>
                                <template v-else>
                                    <span
                                        class="text-purple-e0 flex items-center gap-x-[5px] text-[13px] font-medium opacity-80 cursor-pointer"
                                        @click="openSubscribeModal">
                                        <i class="fa fa-lock"></i>
                                        للمشتركين
                                    </span>
                                </template>
                            </div>

                            <div class="w-[45%] h-[100%] flex justify-center items-center border-r-1 border-[#BCCCDB]">
                                <template v-if="!child.hasLawAnalyze">
                                    <button v-if="isStudent && userData.planSubscribed !== planSubscribedEnum.subscribed"
                                        class="border border-purple-78 w-[110px] h-[32px] rounded-[4px] text-purple-78 text-[14px] font-bold cursor-pointer"
                                        @click="toTraining(child.parentId, child.categoryId)">
                                        تدرب
                                    </button>
                                    <button v-else disabled
                                        class="border border-purple-78 w-[110px] h-[32px] rounded-[4px] text-purple-78 text-[14px] font-bold opacity-50">
                                        تدرب
                                    </button>
                                </template>
                                <template v-else>
                                    <button v-if="child.rate>0"
                                        class="border border-purple-78 w-[110px] h-[32px] rounded-[4px] text-purple-78 text-[14px] font-bold cursor-pointer"
                                        @click="toAnalyticsDetails(child.categoryId)">
                                        تحليل النتيجة
                                    </button>
                                    <button v-else disabled
                                        class="border border-purple-78 w-[110px] h-[32px] rounded-[4px] text-purple-78 text-[14px] font-bold opacity-50">
                                        تحليل النتيجة
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </disclosureGroup>
        </accordionGroup>
    </div>

    <!-- subscribe modal -->
    <subscribe-modal v-if="showSubscribeModal" :show="showSubscribeModal" @update:show="
        ($event) => {
            showSubscribeModal = $event;
        }
    " />
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { UserInfoDataModel } from "~/core/auth/data-access/models/auth.model"
import type { analyzeStudentCategoryForTable } from "~/main/modules/user-panel/data-access/user-panel.model"
import { planSubscribedEnum } from '~/main/constants/global.enums';
import * as dateFormat from '~/main/utils/date-utils'
import { RouteHelper } from "~/main/utils/route-helper";
import { UserRoles } from "~/core/auth/constants/user-roles";


const props = defineProps<{
    stdAnlyzeDataTable: analyzeStudentCategoryForTable
    fetching: boolean
}>()

const emit = defineEmits<{
    (e: "fetchStudentAnalyze", id: string | number): void
}>()

const router = useRouter();
const route = useRoute()
const { data } = useAuth()

const showSubscribeModal = ref(false)
const userData = computed(() => data.value as UserInfoDataModel);
const isStudent = computed(()=>{
    return userData.value.role === UserRoles.student
})

const stdId = route.params.id;
const tablePeriodList = [
    { id: 0, label: 'كامل المدة' },
    { id: 1, label: 'اليوم' },
    { id: 2, label: 'الأمس' },
    { id: 3, label: 'الشهر الماضي' },
    { id: 4, label: '3 اشهر الماضية' },
    { id: 5, label: '6 اشهر الماضية' },
]

const selectedPeriodTable = ref(tablePeriodList[0]?.id)

function toTraining(parentId, catId) {
    router.push(
        `/user-dashboard/prepare?page=trainings&parentId=${parentId}&childId=${catId}`
    );
}


function toAnalyticsDetails(categoryId) {
    router.push(RouteHelper.userAnalyticsDetails(categoryId, isStudent.value?null:stdId))
}

function openSubscribeModal() {
    showSubscribeModal.value = true
}

watch(selectedPeriodTable, (newVal) => {
  emit('fetchStudentAnalyze', newVal);
});

</script>
