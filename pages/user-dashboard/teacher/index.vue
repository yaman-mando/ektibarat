<template>
  <user-panel-wrapper content-class="max-w-[1060px] !mx-auto lg:px-0 px-[5px]">
    <app-data-wrapper :loading="panelStore.fetching.teacherDashboar" :data="baseData" loading-type="spinner-overlay"
      empty-text="لا توجد بيانات متاحة">

      <template>
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-[24px] font-bold text-blue-d6 dark:text-white">
            لوحة المدرب
          </span>
        </div>

        <!-- teacher code -->
        <div
          class="rounded-[8px] bg-white   shadow-custom mb-[20px] flex items-center min-h-[105px] px-[47px] py-[10px] flex-wrap justify-between">
          <div class="grid items-center justify-center justify-items-center flex-1/3">
            <span class="text-[24px] font-bold text-purple-78">الكود الخاص بي</span>
            <span class="text-[40px] font-bold text-red-5e">{{ baseData?.code }}</span>
          </div>
          <div class="text-[16px] font-medium text-gray-63 text-right m-auto">
            يستطيع الطالب الانضمام إلى مجموعتك من خلال إدخال هذا الكود في طلبه
            <br>
            عند اشتراك أي طالب في أحد باقات اختبارات باستخدام الكود الخاص بك
            <br>
            سيحصل الطالب على خصم 10% وستحصل أنت على مكافأة 10% من قيمة الاشتراك
          </div>
        </div>

        <!-- Student Stats Boxes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl1200:grid-cols-3 2xl:grid-cols-4 gap-4 mb-6 justify-items-center">
          <div
            class="grid content-between bg-blue-d6 text-white rounded-[8px] px-[15px] py-[20px] shadow-custom h-[146px] w-full">
            <p class="text-[16px] font-bold">عدد الطلاب</p>
            <span class="text-[56px] leading-none font-bold">
              {{ baseData?.studentsCount }}
            </span>
            <p class="text-[12px] font-medium">طلاب لم ينهوا تحديد المستوى</p>
          </div>

          <div
            class="bg-white dark:bg-dark-700 rounded-[8px] shadow-custom grid content-between px-[15px] py-[20px] h-[146px] w-full">
            <p class="text-[16px] font-bold text-dark-2b dark:text-gray-300">
              متوسط تحديد المستوى
            </p>
            <div class="text-[32px] leading-none font-bold text-blue-d6 dark:text-white mb-[10px]">
              <span class="text-[56px]">{{ formatNumber(baseData?.levelRateAvg) }}</span>
            </div>
            <app-g-progress-bar height="6px" radius="100px" :showText="false" :animated="true"
              background="linear-gradient(90deg, #58CC02 0%, #4E9818 100%)" :value="baseData?.levelRateAvg || 0" />
            <span class="text-gray-8f text-[12px] font-medium mt-[5px]">
              للطلاب الذين أنهوا تحديد المستوى
            </span>
          </div>

          <div
            class="bg-white dark:bg-dark-700 rounded-[8px] shadow-custom grid content-between px-[15px] py-[20px] h-[146px] w-full">
            <p class="text-[16px] font-bold text-dark-2b dark:text-gray-300">
              متوسط الدرجات المتوقعة
            </p>
            <div class="text-[32px] leading-none font-bold text-blue-d6 dark:text-white mb-[10px]">
              <span class="text-[56px]">{{ baseData?.predictedMarksAvg.toFixed(0) }}</span>
            </div>
            <app-g-progress-bar height="6px" radius="100px" :showText="false" :animated="true"
              background="linear-gradient(90deg, #58CC02 0%, #4E9818 100%)" :value="baseData?.predictedMarksAvg || 0" />
            <span class="text-gray-8f text-[12px] font-medium mt-[5px]">
              للطلاب الذين أنهوا تحديد المستوى
            </span>
          </div>

          <div
            class="bg-white dark:bg-dark-700 rounded-[8px] shadow-custom grid content-between px-[15px] py-[20px] h-[146px] w-full">
            <p class="text-[16px] font-bold text-dark-2b dark:text-gray-300">
              متوسط نسبة الالتزام
            </p>
            <div class="text-[32px] leading-none font-bold text-blue-d6 dark:text-white mb-[10px]">
              <span class="text-[56px]">{{ formatNumber(baseData?.planAdherenceAvg) }}%</span>
            </div>
            <app-g-progress-bar height="6px" radius="100px" :showText="false" :animated="true"
              background="linear-gradient(90deg, #58CC02 0%, #4E9818 100%)" :value="baseData?.planAdherenceAvg || 0" />
            <span class="text-gray-8f text-[12px] font-medium mt-[5px]">
              لجميع الطلاب
            </span>
          </div>
        </div>

        <!-- Filters & accepted Table -->
        <div class="max-w-[100vw] overflow-x-auto" v-if="filteredStudents && filteredStudents.length > 0">
          <div class="rounded-[8px] shadow-custom px-[15px] py-[20px] grid gap-y-[20px] bg-white min-w-[1030px]">
            <!-- Filters -->
            <div :class="{ 'justify-self-start': windowSize.isMobileSize }"
              class="flex flex-col md:flex-row items-center justify-between gap-[20px]">
              <div class="flex items-center gap-2" :class="{ 'w-[500px]': windowSize.isMobileSize }">
                <button v-for="(status, i) in statusFilters" :key="i" :class="[
                  'rounded-[20px] border font-medium text-sm w-[110px] h-[40px] flex items-center justify-center cursor-pointer',
                  selectedStatuses.includes(status.value)
                    ? `bg-${status.color} text-white border-${status.color}`
                    : `bg-transparent text-${status.color} border-${status.color}`,
                ]" @click="toggleStatus(status.value)">
                  {{ status.label }}
                  <span v-if="status.count !== null" class="ml-1">
                    ({{ status.count }})
                  </span>
                </button>
              </div>

              <div class="flex items-center gap-2 w-[500px] md:w-auto">
                <input v-model="search" type="text" placeholder="البحث باسم الطالب"
                  class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm w-full dark:bg-dark-700 dark:text-white" />

                <select v-model="filterForm.sortBy"
                  class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm dark:bg-dark-700 dark:text-white"
                  @change="fetchData">
                  <option value="0">
                    ترتيب حسب: التقييم (من الأعلى إلى الأقل)
                  </option>
                  <option value="1">ترتيب حسب: عدد الأسئلة</option>
                </select>
              </div>
            </div>

            <!-- Table -->

            <div class="space-y-2">
              <!-- Header -->
              <div class="h-[70px] w-full flex items-center">
                <div class="bg-[#F5F7FA] h-[100%] flex-[80%] grid items-center border border-[#BCCCDB] !border-l-0 
                rounded-r-[8px] px-[15px] text-purple-78 text-[16px] font-bold grid-cols-[20%_16%_16%_16%_16%_16%]">
                  <div class="">اسم الطالب</div>
                  <div class="text-center">عدد الأسئلة</div>
                  <div class="text-center">
                    الإجابات
                    <br />
                    <span class="font-medium text-[12px]">صحيحة | خاطئة</span>
                  </div>
                  <div class="text-center">مدة التدريب</div>
                  <div class="text-center">الباقة</div>
                  <div class="text-center">التقييم</div>
                </div>
                <div
                  class="bg-[#F5F7FA] h-[100%] flex flex-[20%] items-center border border-[#BCCCDB] !border-r-0 rounded-l-[8px] px-[15px] text-purple-78 text-[16px] font-bold">
                  <div class="w-full text-center">إجراءات</div>
                </div>
              </div>

              <!-- Rows -->
              <div v-for="(std, i) in filteredStudents" :key="i" :class="['h-[60px] flex items-center']">
                <div
                  class="grid flex-[80%] h-[100%] items-center rounded-r-[8px] border border-[#BCCCDB] !border-l-0 px-[15px] grid-cols-[20%_16%_16%_16%_16%_16%]"
                  :class="[i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]']">
                  <div class="text-gray-63 font-medium">
                    {{ std.fullName }}
                  </div>
                  <div class="text-center">{{ std.statistics.totalQuestionsCount }}</div>
                  <div class="text-center">
                    <span class="text-green-8c font-bold text-[14px]">
                      {{ std.statistics.correctQuestionsCount }}
                    </span>
                    |
                    <span class="text-red-5e font-bold text-[14px]">
                      {{ std.statistics.wrongQuestionsCount }}
                    </span>
                  </div>
                  <div class="text-center">
                    {{ formatTime(std.statistics.trainingPeriod) }} ساعة
                  </div>
                  <div class="text-center">{{ std.statistics.subscriptionName }}</div>
                  <div class="text-center">

                    <app-g-progress-bar v-if="std.statistics.showRate" :animated="true"
                      :bgClass="`bg-${getRateColor(std.statistics.rate)}`" :value="std.statistics.rate"
                      :showText="true" />
                    <subs-only-block v-else />
                  </div>
                </div>
                <div
                  class="flex flex-[20%] h-[100%] items-center justify-center px-[15px] gap-x-[12px] rounded-l-[8px] border border-[#BCCCDB]"
                  :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                  <button @click="toAnalytics(std.studentId)"
                    class="border border-purple-78 rounded-[4px] w-[88px] h-[32px] flex items-center justify-center gap-x-[8px] text-purple-78 text-[14px] font-medium cursor-pointer">
                    التفاصيل
                    <i class="fa fa-chevron-left"></i>
                  </button>
                  <app-g-button @click="toWhatsApp(std.phoneNumber)" :disabled="!std.phoneNumber" width="32px"
                    font-weight="normal" height="32px" text-size="14px" radius="4px" bg-class="bg-transparent"
                    text-color="text-green-66" border-color="border-green-66" :border="true">
                    <i class="fab fa-whatsapp" aria-hidden="true"></i>
                  </app-g-button>
                  <app-g-button @click="toDeleteStd(std)" width="32px" height="32px" radius="4px" text-size="14px"
                    bg-class="bg-transparent" text-color="text-red-5e" border-color="border-red-5e" :border="true">
                    <i class="fa fa-times"></i>
                  </app-g-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- refuses students table -->
        <div class="mt-5 flex flex-col gap-5" v-if="pendingStudents && pendingStudents.length > 0">
          <accordion-group>
            <disclosure-group :defaultOpen="true" :onlyOneOpen="false">
              <template #right>
                <span class="text-[18px] font-bold text-orange-39">
                  طلاب بانتظار الموافقة
                  ({{ pendingStudents?.length }})
                </span>
              </template>

              <div class="max-w-[100vw] overflow-x-auto custom-scroll">
                <div class="space-y-2 min-w-[1020px]">
                  <!-- Header -->
                  <div class="h-[70px] w-full flex items-center">
                    <div class="bg-[#F5F7FA] h-[100%] flex-[80%] grid items-center border border-[#BCCCDB] !border-l-0 
                rounded-r-[8px] px-[15px] text-purple-78 text-[16px] font-bold grid-cols-[20%_16%_16%_16%_16%_16%]">
                      <div class="">اسم الطالب</div>
                      <div class="text-center">عدد الأسئلة</div>
                      <div class="text-center">
                        الإجابات
                        <br />
                        <span class="font-medium text-[12px]">صحيحة | خاطئة</span>
                      </div>
                      <div class="text-center">مدة التدريب</div>
                      <div class="text-center">الباقة</div>
                      <div class="text-center">التقييم</div>
                    </div>
                    <div
                      class="bg-[#F5F7FA] h-[100%] flex flex-[20%] items-center border border-[#BCCCDB] !border-r-0 rounded-l-[8px] px-[15px] text-purple-78 text-[16px] font-bold">
                      <div class="w-full text-center">إجراءات</div>
                    </div>
                  </div>

                  <!-- Rows -->
                  <div v-for="(std, i) in pendingStudents" :key="i" :class="['h-[60px] flex items-center']">
                    <div
                      class="grid flex-[80%] h-[100%] items-center rounded-r-[8px] border border-[#BCCCDB] !border-l-0 px-[15px] grid-cols-[20%_16%_16%_16%_16%_16%]"
                      :class="[i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]']">
                      <div class="text-gray-63 font-medium">
                        {{ std.fullName }}
                      </div>
                      <div class="text-center">{{ std.statistics.totalQuestionsCount }}</div>
                      <div class="text-center">
                        <span class="text-green-8c font-bold text-[14px]">
                          {{ std.statistics.correctQuestionsCount }}
                        </span>
                        |
                        <span class="text-red-5e font-bold text-[14px]">
                          {{ std.statistics.wrongQuestionsCount }}
                        </span>
                      </div>
                      <div class="text-center">
                        {{ formatTime(std.statistics.trainingPeriod) }} ساعة
                      </div>
                      <div class="text-center">{{ std.statistics.subscriptionName }}</div>
                      <div class="text-center">

                        <app-g-progress-bar v-if="std.statistics.showRate" :animated="true"
                          :bgClass="`bg-${getRateColor(std.statistics.rate)}`" :value="std.statistics.rate"
                          :showText="true" />
                        <subs-only-block v-else />
                      </div>
                    </div>
                    <div
                      class="flex flex-[20%] h-[100%] items-center justify-center px-[15px] gap-x-[12px] rounded-l-[8px] border border-[#BCCCDB]"
                      :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                      <button @click="acceptStd(std.id)"
                        class="border border-purple-78 rounded-[4px] w-[88px] h-[32px] flex items-center justify-center gap-x-[8px] text-purple-78 text-[14px] font-medium cursor-pointer">
                        قبول
                      </button>
                      <app-g-button @click="toWhatsApp(std.phoneNumber)" :disabled="!std.phoneNumber" width="32px"
                        font-weight="normal" height="32px" text-size="14px" radius="4px" bg-class="bg-transparent"
                        text-color="text-green-66" border-color="border-green-66" :border="true">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i>
                      </app-g-button>
                      <app-g-button @click="toDeleteStd(std)" width="32px" height="32px" radius="4px" text-size="14px"
                        bg-class="bg-transparent" text-color="text-red-5e" border-color="border-red-5e" :border="true">
                        <i class="fa fa-times"></i>
                      </app-g-button>
                    </div>
                  </div>
                </div>
              </div>
            </disclosure-group>
          </accordion-group>
        </div>

        <delete-modal v-model:isOpen="isOpenDeleteModal" :isReject="false" :msg="deleteMsg"
          @onConfirm="confirmDeleteStd" />

      </template>

    </app-data-wrapper>
    <!-- <div v-else class="h-[75vh] flex items-center justify-center text-[50px] font-bold text-red-5e">لا يوجد بيانات</div> -->
  </user-panel-wrapper>
</template>

<script lang="ts" setup>
import { useUserPanelStore } from '~/store/user-panel';
import { ref, computed, onMounted, watch } from 'vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { RouteHelper } from '~/main/utils/route-helper';
import type { TPstudent } from '~/main/modules/user-panel/data-access/user-panel.model';
import { toWhatsApp } from '~/main/utils/shared-utils';



const panelStore = useUserPanelStore();
const { data } = useAuth();
const router = useRouter();
const { $axios } = useNuxtApp()
const toast = useToastMessage()
const windowSize = useWindowSize()
const userData = data.value as UserInfoDataModel;

const filterForm = ref({
  teacherId: null,
  grade: panelStore.globalType,
  sortBy: 0,
  sortDirection: 1,
});

const search = ref('');
const selectedStatuses = ref<string[]>([]);
const isOpenConfirmModal = ref<boolean>(false);
const isOpenDeleteModal = ref<boolean>(false);
const stdToDelete = ref<TPstudent | null>(null)


const fetchData = () => {
  panelStore.getTeacherDashboardData()
};



const toAnalytics = (studentId) => {
  router.push(RouteHelper.studentAnalyticsForTeacher(studentId))
}

function toDeleteStd(std: TPstudent) {
  stdToDelete.value = std
  isOpenDeleteModal.value = true
}

const deleteMsg = computed(() => {
  const stdName = stdToDelete.value?.fullName
  const label = 'حذف الطالب :' + stdName
  return label
})

const confirmDeleteStd = async () => {
  try {
    const res = await panelStore.deleteStudentFromTeacherDashboard(stdToDelete.value?.id)
    if (res) {
      toast.showSuccess({ summary: 'تم حذف الطالب بنجاح' })
      isOpenDeleteModal.value = false
      return
    }
    toast.showError()
  }
  catch (e) {
    console.log(e)
    toast.showError()
  }

}


const acceptStd = async (stdId) => {
  try {
    const res = await panelStore.acceptStudentInTeacherDashboard(stdId, 1)
    if (res) {
      toast.showSuccess({ summary: 'تم قبول الطالب بنجاح' })
      return
    }
    toast.showError()
  }
  catch (e) {
    console.log(e)
    toast.showError()
  }

}

function getRateColor(rate: number): string {
  if (rate < 50) return 'red-5e';
  if (rate < 70) return 'yellow-16';
  return 'green-8c';
}

const formatTime = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString();
  } else {
    return num.toFixed(2).replace(/\.?0+$/, '');
  }
}

const baseData = computed(() => panelStore.teacherDashboardData);

const acceptedStudents = computed(() => baseData.value?.studentsList.filter(k => k.state === 1) ?? [])

const pendingStudents = computed(() => baseData.value?.studentsList.filter(k => k.state === 0) ?? [])

const statusFilters = computed(() => {
  const students = acceptedStudents.value || [];
  const counts = { committed: 0, average: 0, danger: 0 };
  students.forEach((s) => {
    const rate = s.statistics.rate;
    if (rate < 50) counts.danger++;
    else if (rate < 70) counts.average++;
    else counts.committed++;
  });
  return [
    {
      label: 'ملتزم',
      value: 'committed',
      color: 'green-8c',
      count: counts.committed,
    },
    {
      label: 'متوسط',
      value: 'average',
      color: 'yellow-16',
      count: counts.average,
    },
    { label: 'خطر', value: 'danger', color: 'red-5e', count: counts.danger },
  ];
});

const toggleStatus = (status: string) => {
  const index = selectedStatuses.value.indexOf(status);
  if (index === -1) {
    selectedStatuses.value.push(status);
  } else {
    selectedStatuses.value.splice(index, 1);
  }
};

const filteredStudents = computed(() => {
  let students = acceptedStudents.value || [];

  if (selectedStatuses.value.length > 0) {
    students = students.filter((s) => {
      const rate = s.statistics.rate;
      const status = rate < 50 ? 'danger' : rate < 70 ? 'average' : 'committed';
      return selectedStatuses.value.includes(status);
    });
  }

  if (search.value.trim()) {
    students = students.filter((s) =>
      s.fullName.toLowerCase().includes(search.value.trim().toLowerCase())
    );
  }

  return students;
});

onMounted(() => {
  fetchData();
});

watch(() => panelStore.globalType, fetchData, { immediate: true });
</script>

<style scoped></style>
