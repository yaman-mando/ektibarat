<template>
  <user-panel-wrapper content-class="max-w-[1060px] !mx-auto lg:px-0 px-[5px]">

    <app-data-wrapper :loading="panelStore.fetching.schoolDashboard" :data="baseData" loading-type="spinner-overlay"
      empty-text="لا توجد بيانات متاحة">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-[24px] font-bold text-blue-d6 dark:text-white">
          لوحة المدرسة
        </span>
        <select v-if="userData.role === UserRoles.schoolManager" v-model="filterForm.teacherId"
          class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm dark:bg-dark-700 dark:text-white"
          @change="fetchData">
          <option :key="0" :value="null">
            جميع المدربين
          </option>
          <option v-for="item in teachersList" :key="item.id ?? 0" :value="item.id">
            المدرب: {{ item.label }}
          </option>
        </select>
      </div>

      <!-- Student Stats Boxes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl1200:grid-cols-3 2xl:grid-cols-4 gap-4 mb-6 justify-items-center">
        <div
          class="grid content-between bg-blue-d6 text-white rounded-[8px] px-[15px] py-[20px] shadow-custom h-[146px] w-full">
          <p class="text-[16px] font-bold">عدد الطلاب</p>
          <span class="text-[56px] leading-none font-bold">
            {{ baseData?.main.studentsCount }}
          </span>
          <p class="text-[12px] font-medium">طلاب لم ينهوا تحديد المستوى</p>
        </div>

        <div
          class="bg-white dark:bg-dark-700 rounded-[8px] shadow-custom grid content-between px-[15px] py-[20px] h-[146px] w-full">
          <p class="text-[16px] font-bold text-dark-2b dark:text-gray-300">
            متوسط تحديد المستوى
          </p>
          <div class="text-[32px] leading-none font-bold text-blue-d6 dark:text-white mb-[10px]">
            <span class="text-[56px]">{{ formatNumber(baseData?.main.levelRateAvg) }}</span>
          </div>
          <app-g-progress-bar height="6px" radius="100px" :showText="false" :animated="true"
            background="linear-gradient(90deg, #58CC02 0%, #4E9818 100%)" :value="baseData?.main.levelRateAvg || 0" />
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
            <span class="text-[56px]">{{ baseData?.main.predictedMarksAvg.toFixed(0) }}</span>
          </div>
          <app-g-progress-bar height="6px" radius="100px" :showText="false" :animated="true"
            background="linear-gradient(90deg, #58CC02 0%, #4E9818 100%)"
            :value="baseData?.main.predictedMarksAvg || 0" />
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
            <span class="text-[56px]">{{ formatNumber(baseData?.main.planAdherenceAvg) }}%</span>
          </div>
          <app-g-progress-bar height="6px" radius="100px" :showText="false" :animated="true"
            background="linear-gradient(90deg, #58CC02 0%, #4E9818 100%)"
            :value="baseData?.main.planAdherenceAvg || 0" />
          <span class="text-gray-8f text-[12px] font-medium mt-[5px]">
            لجميع الطلاب
          </span>
        </div>
      </div>

      <!-- Filters & Table -->
      <div class="max-w-[100vw] overflow-x-auto">
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

              <select v-model.number="filterForm.sortBy"
                class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm dark:bg-dark-700 dark:text-white"
                @change="fetchData">
                <option :value="0">ترتيب حسب: التقييم</option>
                <option :value="1">ترتيب حسب: عدد الأسئلة</option>
              </select>

              <select v-model.number="filterForm.sortDirection"
                class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm dark:bg-dark-700 dark:text-white"
                @change="fetchData">
                <option :value="1">من الأعلى إلى الأقل</option>
                <option :value="0">من الأقل إلى الأعلى</option>
              </select>
            </div>
          </div>

          <!-- Table -->

          <div class="space-y-2">
            <!-- Header -->
            <div class="h-[70px] w-full flex items-center">
              <div
                class="bg-[#F5F7FA] h-[100%] flex-[90%] grid items-center border border-[#BCCCDB] !border-l-0 rounded-r-[8px] px-[15px] text-purple-78 text-[16px] font-bold"
                :class="userData.role === UserRoles.schoolManager
                  ? 'grid-cols-[15%_10%_10%_10%_10%_10%_10%_10%_15%]'
                  : 'grid-cols-[16%_12%_12%_12%_12%_12%_12%_12%]'
                  ">
                <div class="">اسم الطالب</div>
                <div class="text-center">عدد الأسئلة</div>
                <div class="text-center">
                  الإجابات
                  <br />
                  <span class="font-medium text-[12px]">صحيحة | خاطئة</span>
                </div>
                <div class="text-center">مدة التدريب</div>
                <div class="text-center">تحديد المستوى</div>
                <div class="text-center">الدرجة المتوقعة</div>
                <div class="text-center">الدرجة المطلوبة</div>
                <div class="text-center">الالتزام بالخطة</div>
                <div v-if="userData.role === UserRoles.schoolManager" class="text-center">
                  المدرب
                </div>
              </div>
              <div
                class="bg-[#F5F7FA] h-[100%] flex flex-[10%] items-center border border-[#BCCCDB] !border-r-0 rounded-l-[8px] px-[15px] text-purple-78 text-[16px] font-bold">
                <div class="w-full text-center">إجراءات</div>
              </div>
            </div>

            <!-- Rows -->
            <div v-for="(std, i) in filteredStudents" :key="i" :class="['h-[60px] flex items-center']">
              <div
                class="grid flex-[90%] h-[100%] items-center rounded-r-[8px] border border-[#BCCCDB] !border-l-0 px-[15px]"
                :class="[
                  i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]',
                  userData.role === UserRoles.schoolManager
                    ? 'grid-cols-[15%_10%_10%_10%_10%_10%_10%_10%_15%]'
                    : 'grid-cols-[16%_12%_12%_12%_12%_12%_12%_12%]',
                ]">
                <div class="text-gray-63 font-medium">
                  {{ std.studentName }}
                </div>
                <div class="text-center">{{ std.questionsCount }}</div>
                <div class="text-center">
                  <span class="text-green-8c font-bold text-[14px]">
                    {{ std.correctAnswersCount }}
                  </span>
                  |
                  <span class="text-red-5e font-bold text-[14px]">
                    {{ std.wrongAnswersCount }}
                  </span>
                </div>
                <div class="text-center">
                  {{ formatTime(std.trainingPeriod) }} ساعة
                </div>
                <div class="text-center text-green-8c font-bold text-[18px]">
                  {{ std.levelRate }}
                </div>
                <div class="text-center text-green-8c font-bold text-[18px]">
                  {{ std.predictedMark }}
                </div>
                <div class="text-center text-dark-63 font-bold text-[18px]">
                  {{ std.requiredGrade }}
                </div>
                <div class="text-center">
                  <app-g-progress-bar :animated="true" :bgClass="`bg-${getRateColor(std.planAdherence)}`"
                    :value="std.planAdherence" :showText="true" />
                </div>
                <div v-if="userData.role === UserRoles.schoolManager"
                  class="text-center flex items-center justify-end w-full">
                  <select :value="std.teacherId" class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm w-[120px]"
                    :title="teachersList?.find(t => t.id === std.teacherId)?.label || ''"
                    @change="(e) => handleSelectChange(std, e)">
                    <option v-for="item in teachersList" :key="item.id" :value="item.id">
                      المدرب: {{ item.label }}
                    </option>
                  </select>
                  <ConfirmDialog v-if="isOpenConfirmModal && tempStudent" v-model:visible="isOpenConfirmModal"
                    title="تأكيد" confirmText="نعم، احفظ" cancelText="لا، تجاهل" :onConfirm="confirmChange"
                    :onCancel="cancelChange">
                    <template #message>
                      هل تريد فعلا تغيير الطالب
                      <strong style="color:#0266D6">{{ tempStudent.studentName }}</strong>
                      من المدرس
                      <strong style="color:red">({{ tempStudent.oldTeacherLabel }})</strong>
                      إلى المدرس
                      <strong style="color:green">({{ tempStudent.newTeacherLabel }})</strong>؟
                    </template>
                  </ConfirmDialog>

                </div>
              </div>
              <div class="flex flex-[10%] h-[100%] items-center justify-center rounded-l-[8px] border border-[#BCCCDB]"
                :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                <button @click="toAnalytics(std.studentId)"
                  class="border border-purple-78 rounded-[4px] w-[88px] h-[32px] flex items-center justify-center gap-x-[8px] text-purple-78 text-[14px] font-medium cursor-pointer">
                  التفاصيل
                  <i class="fa fa-chevron-left"></i>
                </button>
              </div>
            </div>

            <app-pagination v-if="baseData?.data.totalPages && baseData?.data.totalPages > 1"
              :current-page="baseData?.data.currentPage ?? 1" :total-pages="baseData?.data.totalPages ?? 1"
              :max-visible-buttons="10" :hide-first-last="true" @pagechanged="changePage" />
          </div>
        </div>
      </div>

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



const panelStore = useUserPanelStore();
const { data } = useAuth();
const router = useRouter();
const { $axios } = useNuxtApp()
const toast = useToastMessage()
const windowSize = useWindowSize()
const userData = data.value as UserInfoDataModel;

const filterForm = ref({
  predicate: null as string | null,
  teacherId: null as number | null,
  grade: panelStore.globalType,
  sortBy: 0,
  sortDirection: 1,
});

const search = ref<string>("");
const selectedStatuses = ref<string[]>([]);
const isOpenConfirmModal = ref<boolean>(false);
const tempStudent = ref<any>(null);
const currentPage = ref<number>(1)

const fetchData = () => {
  panelStore.getSchoolDashboardData({ body: filterForm.value, pageSize: 20, pageNumber: currentPage.value });
};

const changePage = (cPage) => {
  currentPage.value = cPage
  fetchData()
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(search, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    filterForm.value.predicate = newVal.trim() === "" ? null : newVal.trim();
    currentPage.value = 1;
    fetchData();
  }, 1000);
});

function handleSelectChange(student, event) {
  const newTeacherId = Number(event.target.value)
  if (!teachersList.value) return
  const oldTeacher = teachersList.value.find(t => t.id === student.teacherId)
  const newTeacher = teachersList.value.find(t => t.id === newTeacherId)


  tempStudent.value = {
    ...student,
    newTeacherId,
    oldTeacherLabel: oldTeacher?.label,
    newTeacherLabel: newTeacher?.label
  }
  isOpenConfirmModal.value = true
}

function confirmChange() {
  if (!tempStudent.value) return
  fetchChangeTeacher(tempStudent.value.studentId, tempStudent.value.newTeacherId)
}


function cancelChange() {
  tempStudent.value = null
}

const fetchChangeTeacher = (stdId, teacherId) => {
  try {
    $axios.put(`/teachersStudents/addStudentToTeacher`, {
      studentId: stdId,
      teacherId: teacherId
    }).then(({ data: res }) => {
      if (res.isAdded) {
        const student = filteredStudents.value.find(s => s.studentId === tempStudent.value.studentId)
        if (student) student.teacherId = tempStudent.value.newTeacherId
        toast.showSuccess({ summary: 'تم تعديل المدرس بنجاح' })
        return
      }
      toast.showError()
    })
      .catch(e => {
        toast.showError()
      })
  }
  catch (e) {
    toast.showError()
  }
}

const toAnalytics = (studentId) => {
  router.push(RouteHelper.studentAnalytics(studentId))
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

const baseData = computed(() => panelStore.schoolDashboardData);
const teachersList = computed(() => panelStore.teachersOfManager);

const statusFilters = computed(() => {
  const students = baseData.value?.data.page || [];
  const counts = { committed: 0, average: 0, danger: 0 };
  students.forEach((s) => {
    const rate = s.planAdherence;
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
  let students = baseData.value?.data.page || [];

  if (selectedStatuses.value.length > 0) {
    students = students.filter((s) => {
      const rate = s.planAdherence;
      const status = rate < 50 ? 'danger' : rate < 70 ? 'average' : 'committed';
      return selectedStatuses.value.includes(status);
    });
  }

  return students;
});

onMounted(() => {
  fetchData();
  if (userData.role === UserRoles.schoolManager) panelStore.getTeachersOfManager();
});

watch(() => panelStore.globalType, fetchData, { immediate: true });
</script>

<style scoped></style>
