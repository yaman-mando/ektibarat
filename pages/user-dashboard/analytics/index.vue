<template>
  <user-panel-wrapper content-class="max-w-[1060px] !mx-auto lg:px-0 px-[5px]">
    <div class="mx-auto">
      <!-- analytics info  -->
      <div class="flex flex-col 2xl:flex-row gap-[20px]">
        <!-- analytics info right part -->
        <div class="flex flex-1/3 flex-col gap-y-[20px] w-full 2xl:min-w-[330px]">
          
          <!-- rate square -->
          <rateSquare :stdAnlyzeData="stdAnlyzeData" :isSubscribe="isSubscribe"
            :fetching="panelStore.fetching.studentAnalyze" @open-subscribe="openSubscribeModal" />

          <!-- plane square -->
          <planeSquare :stdPlaneInfo="stdPlaneInfo" :isSubscribe="isSubscribe"
            :fetching="panelStore.fetching.studentPlanInfo" />


        </div>

        <!-- analytics info left part - chart filter -->
        <div class="w-full flex-2/3 2xl:min-w-[710px] h-auto">
          <analyticsChartSquare :isSubscribe="isSubscribe" :fetching="panelStore.fetching.studentAnalyzeChart"
            :categories="stdChartData?.mainCategoriesRates" :selectedCategoryId="selectedCategoryId"
            v-model:selectedPeriod="selectedPeriodTable" :chartSeries="chartSeries" :stdChartData="stdChartData"
            @go-prices="toPricesPage" @select-category="selectCategory" @change-period="fetchStudentAnalyzeChart" />
        </div>
      </div>


      <LazyTrianingTableSquare :stdAnlyzeDataTable="stdAnlyzeDataTable" :fetching="panelStore.fetching.studentAnalyze"
        @fetchStudentAnalyze="fetchStudentAnalyze" />

      <!-- subscribe modal -->
      <subscribe-modal v-if="showSubscribeModal" :show="showSubscribeModal" @update:show="
        ($event) => {
          showSubscribeModal = $event;
        }
      " />
    </div>
  </user-panel-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import disclosureGroup from '~/components/user/disclosureGroup.vue';
import accordionGroup from '~/components/user/accordionGroup.vue';
import rateProgressBar from '~/components/user/rateProgressBar.vue';
import advicesSquare from '~/components/user/advicesSquare.vue';
import { RouteHelper } from '~/main/utils/route-helper';
import { useUserPanelStore } from '~/store/user-panel';
import type { analyzeStudentCategory, analyzeStudentCategoryForTable } from '~/main/modules/user-panel/data-access/user-panel.model';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { planSubscribedEnum } from '~/main/constants/global.enums';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import * as dateFormat from '~/main/utils/date-utils'


const router = useRouter();
const panelStore = useUserPanelStore();
const { data } = useAuth()

const userData = computed(() => data.value as UserInfoDataModel);

const subscriptionsStore = useSubscriptionsStore();
const isSubscribe = computed(() => {
  return subscriptionsStore.state.userCurrentSubVal?.freeType === null
})


const tablePeriodList = [
  { id: 0, label: 'كامل المدة' },
  { id: 1, label: 'اليوم' },
  { id: 2, label: 'الأمس' },
  { id: 3, label: 'الشهر الماضي' },
  { id: 4, label: '3 اشهر الماضية' },
  { id: 5, label: '6 اشهر الماضية' },
]


const rawCategories = [
  { categoryId: 1, categoryName: 'القسم الكمي', parentId: null, rate: 75 },
  { categoryId: 2, categoryName: 'القسم اللفظي', parentId: null, rate: 80.8 },
  { categoryId: 241, categoryName: 'المسائل الحسابية', parentId: 1, rate: 75 },
  { categoryId: 4, categoryName: 'المسائل الهندسية', parentId: 1, rate: 75 },
  { categoryId: 7, categoryName: 'الخطأ السياقي', parentId: 2, rate: 75 },
  { categoryId: 8, categoryName: 'إكمال الجمل', parentId: 2, rate: 75 },
]



const stdAnlyzeData = computed(() => {
  return panelStore.studentAnalyze
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
  return panelStore.studentAnalyzeChart
})

const stdPlaneInfo = computed(() => {
  return panelStore.studentPlanInfo
})


const formatTimeWithText = (seconds?: number, showText = true) => {
  if (!seconds || seconds < 60) {
    return '--';
  }

  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  if (hrs < 1) {
    return `${String(mins).padStart(2, '0')}${showText ? ' دقيقة' : ''}`;
  }

  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}${showText ? ' ساعة' : ''}`;
};


const showSubscribeModal = ref(false)
const selectedCategoryId = ref<any>(null)


const selectedPeriodTable = ref(0)
const chartSeries = ref<any>([]);


function selectCategory(id) {
  selectedCategoryId.value = id
  fetchStudentAnalyzeChart()
}


function openSubscribeModal() {
  showSubscribeModal.value = true
}



function scrollToRecommendations() {
  const target = document.getElementById("recommendations");
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

function toAnalyticsDetails(categoryId) {
  router.push(RouteHelper.userAnalyticsDetails(categoryId))
}

function toPricesPage() {
  router.push(RouteHelper.webPrices())
}

function toTraining(parentId, catId) {
  router.push(
    `/user-dashboard/prepare?page=trainings&parentId=${parentId}&childId=${catId}`
  );
}

async function fetchStudentAnalyze() {
  await panelStore.getStudentAnalyze(selectedPeriodTable.value)
}



function fetchDefaultChartData() {
  const now = new Date()
  const data: any = []
  const totalPoints = 12

  for (let i = totalPoints - 1; i >= 0; i--) {
    const d = new Date(now);

    if (selectedPeriodTable.value === 0) {
      d.setDate(now.getDate() - i)
    } else if (selectedPeriodTable.value === 1) {
      d.setDate(now.getDate() - i * 7)
    } else if (selectedPeriodTable.value === 2) {
      d.setMonth(now.getMonth() - i)
    }

    const formatted = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(
      d.getDate()
    ).padStart(2, '0')}`;

    data.push({ x: formatted, y: Math.floor(Math.random() * 90) + 10 });
  }

  chartSeries.value = [{ name: 'النقاط', data }];
}

async function fetchStudentAnalyzeChart(periodId?: number) {
  if (periodId) selectedPeriodTable.value = periodId
  if (!isSubscribe) {
    fetchDefaultChartData()
    return
  }
  await panelStore.getStudentAnalyzeChart(selectedPeriodTable.value, selectedCategoryId.value)
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
  await panelStore.getTrainingPlansInfo()
}

function fetchAdvices() {
  const bodyData = {
    totalPercentage: stdPlaneInfo.value?.totalPercentage,
    lastWeekPercentage: stdPlaneInfo.value?.lastWeek.percentage,
    analayzeStudentCategories: stdAnlyzeData.value?.analayzeStudentCategories
  }
  panelStore.getanalyzeRecommendations(bodyData)
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

onMounted(async () => {
  fetchStudentAnalyzeChart()
  fetchStudentAnalyze()
  fetchStudentTrainingPlane()
})

//watch
watch(
  () => panelStore.globalType,
  async (newVal, oldVal) => {
    fetchStudentAnalyzeChart()
    fetchStudentAnalyze()
  },
  { immediate: true }
);

</script>

<style lang="scss" scoped>
@media (max-width: 640px) {
  .chart-section h2 {
    font-size: 16px;
  }

  .category-button {
    min-width: 90px;
    height: 50px;
  }
}
</style>
