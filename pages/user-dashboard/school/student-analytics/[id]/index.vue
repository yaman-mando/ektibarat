<template>
  <user-panel-wrapper content-class="max-w-[1060px] !mx-auto lg:px-0 px-[5px]" :has-l-info="windowsSize.isDesktop"
    :has-r-info="windowsSize.isDesktop" :page-name="`تحليل الطالب: ${stdAnlyzeFullData?.fullName}`" :withBackPage="true"
    :has-prev="!windowsSize.isDesktop">
    <div class="mx-auto">
      <div v-if="windowsSize.isDesktop"
        class="flex items-center text-dark-2b font-medium gap-[5px] cursor-pointer mb-[20px] mt-[-60px]"
        @click="toSchool">
        <i class="fa fa-chevron-right"></i>
        <span>رجوع للخلف</span>
      </div>


      <!-- student info for teacher -->
      <div class="flex flex-wrap justify-center gap-[15px] lg:justify-between my-[20px]">
        <!-- info part -->
        <div class="flex gap-[20px] items-center">
          <img src="/images/png/person.png" class="rounded-full w-[80px] h-[80px] bg-white" />
          <div class="grid">
            <span class="text-blue-d6 text-[18px] 2xl:text-[24px] font-bold">
              {{ stdAnlyzeFullData?.fullName }}
            </span>
            <span class="text-gray-8f text-[14px] 2xl:text-[20px] font-medium">
              <i class="fa-solid fa-mobile-screen ml-[5px]"></i>
              <span>{{ stdAnlyzeFullData?.phoneNumber }}</span>
            </span>
          </div>
        </div>
        <!-- actions part -->
        <div class="flex gap-[3px] sm:gap-[12px] items-center">
          <!-- advices -->
          <button style="
              background: linear-gradient(95.1deg, #24a7f1 0.47%, #0266d6 100%);
            "
            class="flex items-center justify-center gap-[15px] w-[147px] h-[44px] text-white font-medium text-[16px] rounded-[8px] cursor-pointer"
            @click="scrollToRecommendations()">
            <i class="fa-solid fa-lightbulb"></i>
            <span>التوصيات</span>
          </button>
          <!-- watsapp -->
          <a :href="`https://wa.me/${stdAnlyzeFullData?.phoneNumber}`" target="_blank" rel="noopener noreferrer">
            <button
              class="flex items-center justify-center w-[96px] h-[44px] bg-green-66 gap-[5px] text-white font-medium text-[16px] rounded-[8px] cursor-pointer">
              <i class="fa-brands fa-whatsapp"></i>
              <span>رسالة</span>
            </button>
          </a>
          <!-- phone -->
          <a :href="`tel:+${stdAnlyzeFullData?.phoneNumber}`">
            <button
              class="flex items-center justify-center w-[98px] h-[44px] gap-[5px] text-red-5e border border-red-5e bg-transparent font-medium text-[16px] rounded-[8px] cursor-pointer">
              <i class="fa-solid fa-phone"></i>
              <span>اتصال</span>
            </button>
          </a>
        </div>
      </div>

      <!-- analytics info  -->
      <div class="flex flex-col 2xl:flex-row gap-[20px]">
        <!-- analytics info right part -->
        <div class="flex flex-1/3 flex-col gap-y-[20px] w-full 2xl:min-w-[330px]">
          <!-- rate square -->
          <rateSquare :stdAnlyzeData="stdAnlyzeData" :fetching="panelStore.fetching.studentAnalyzeForTeacher" />

          <!-- plane square -->
          <planeSquare :stdPlaneInfo="stdPlaneInfo" :fetching="panelStore.fetching.studentPlanInfoForTeacher" />
        </div>

        <!-- analytics info left part - chart filter -->
        <div class="w-full flex-2/3 2xl:min-w-[710px] h-auto">
          <analyticsChartSquare :fetching="panelStore.fetching.studentAnalyzeChartForTeacher"
            :categories="stdChartData?.mainCategoriesRates" :selectedCategoryId="selectedCategoryId"
            v-model:selectedPeriod="selectedPeriodTable" :chartSeries="chartSeries" :stdChartData="stdChartData"
            @select-category="selectCategory" @change-period="selectPeriodChart" />
        </div>
      </div>


      <!-- tables filter -->
      <LazyTrianingTableSquare :stdAnlyzeDataTable="stdAnlyzeDataTable" :fetching="panelStore.fetching.studentAnalyzeForTeacher"
        @fetchStudentAnalyze="fetchStudentAnalyze" />


      <!-- advices part -->
      <advicesSquare :data="stdRecommendations" />

    </div>
  </user-panel-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import advicesSquare from '~/components/user/advicesSquare.vue';
import { useApexChartService } from '~/main/services/useApexChartService';
import { RouteHelper } from '~/main/utils/route-helper';
import { useUserPanelStore } from '~/store/user-panel';
import type { analyzeStudentCategory, analyzeStudentCategoryForTable } from '~/main/modules/user-panel/data-access/user-panel.model';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserRoles } from '~/core/auth/constants/user-roles';


//use fun
const apexChartService = useApexChartService();
const route = useRoute()
const router = useRouter();
const panelStore = useUserPanelStore();
const windowsSize = useWindowSize()
const { data } = useAuth()



//data
const studentId = Number(route.params.id)
const selectedCategoryId = ref<any>(null)
const selectedPeriodTable = ref(0)
const selectedPeriodChart = ref(0)
const chartSeries = ref<any>([]);




//computed
const userData = computed(() => data.value as UserInfoDataModel);


const stdAnlyzeFullData = computed(() => {
  return panelStore.studentAnalyzeForTeacher
})

const stdAnlyzeData = computed(() => {
  return stdAnlyzeFullData.value?.analyzes[0] || null
})

const stdRecommendations = computed(() => {
  return panelStore.recommendations
})

const stdAnlyzeDataTable = computed(() => {
  const flat = stdAnlyzeData.value?.analayzeStudentCategories ?? []

  const map = new Map<number, any>()

  const result: analyzeStudentCategoryForTable = []

  flat.forEach(item => {
    map.set(item.categoryId, { ...item, children: <analyzeStudentCategory[]>[] })
  })

  flat.forEach(item => {
    if (item.parentId === null) {
      result.push(map.get(item.categoryId))
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(map.get(item.categoryId))
      }
    }
  })

  return result
})

const stdChartData = computed(() => {
  return panelStore.studentAnalyzeChartForTeacher
})

const stdPlaneInfo = computed(() => {
  return panelStore.studentPlanInfoForTeacher
})


//methods
function selectCategory(id) {
  selectedCategoryId.value = id
  fetchStudentAnalyzeChart()
}

function selectPeriodChart(period) {
  selectedPeriodChart.value = period
  fetchStudentAnalyzeChart()
}


function scrollToRecommendations() {
  const target = document.getElementById("recommendations");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

function toSchool() {
  router.push(RouteHelper.schoolPanel())
}

async function fetchStudentAnalyze(selectedPeriod) {
  selectedPeriodTable.value = selectedPeriod
  await panelStore.getStudentAnalyzeForTeacher(selectedPeriodTable.value, studentId)
}

async function fetchStudentAnalyzeChart() {
  await panelStore.getStudentAnalyzeChartForTeacher(selectedPeriodChart.value, selectedCategoryId.value, studentId)
  const data = stdChartData.value?.chartData
    .filter(item => item.count > 0)
    .map(item => item.date ? { x: formatDate(item.date), y: item.count } : null)
    .filter(Boolean);

  chartSeries.value = [
    {
      name: 'النقاط',
      data: (data && data.length >= 2) ? data : []
    }
  ];
}

async function fetchStudentTrainingPlane() {
  await panelStore.getTrainingPlansInfoForTeacher(studentId)
}

async function fetchStudentSubscriptionsDetails() {
  await panelStore.getStudentSubscriptionsDetails(studentId)
}

function fetchRecommendations() {
  const bodyData = {
    totalPercentage: stdPlaneInfo.value?.totalPercentage,
    lastWeekPercentage: stdPlaneInfo.value?.lastWeek.percentage,
    Categories: stdAnlyzeData.value?.analayzeStudentCategories
  }
  panelStore.getanalyzeRecommendations(bodyData)
}


function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}


onMounted(async () => {
  apexChartService.initApexChart();
  await fetchStudentSubscriptionsDetails()
  fetchStudentAnalyzeChart()
  await fetchStudentAnalyze(selectedPeriodTable.value)
  await fetchStudentTrainingPlane()
  fetchRecommendations()
})

//watch
watch(
  () => panelStore.globalType,
  async (newVal, oldVal) => {
    if (oldVal && oldVal !== newVal) {
      fetchStudentAnalyzeChart()
      fetchStudentAnalyze(selectedPeriodTable.value)
    }
  },
  { immediate: true }
);

</script>

<style lang="scss" scoped></style>
