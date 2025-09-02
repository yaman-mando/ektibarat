<template>
  <user-panel-wrapper contentClass="max-w-[1060px] !mx-auto lg:px-0 px-[5px]">
    <div class="mx-auto">
      <!-- analytics info  -->
      <div class="flex flex-col 2xl:flex-row gap-[20px]">
        <!-- analytics info right part -->
        <div
          class="flex flex-1/3 flex-col gap-y-[20px] w-full 2xl:min-w-[330px]"
        >
          <!-- rate square -->
          <rate-square
            :stdAnlyzeData="stdAnlyzeData"
            :fetching="panelStore.fetching.studentAnalyze"
          />

          <!-- plane square -->
          <plane-square
            :stdPlaneInfo="stdPlaneInfo"
            :fetching="panelStore.fetching.studentPlanInfo"
          />
        </div>

        <!-- analytics info left part - chart filter -->
        <div class="w-full flex-2/3 2xl:min-w-[710px] h-auto">
          <analytics-chart-square
            v-model:selectedPeriod="selectedPeriodTable"
            :fetching="panelStore.fetching.studentAnalyzeChart"
            :categories="stdChartData?.mainCategoriesRates"
            :selectedCategoryId="selectedCategoryId"
            :chartSeries="chartSeries"
            :stdChartData="stdChartData"
            @selectCategory="selectCategory"
            @changePeriod="selectPeriodChart"
          />
        </div>
      </div>

      <!-- tables filter -->
      <lazy-trianing-table-square
        :stdAnlyzeDataTable="stdAnlyzeDataTable"
        :fetching="panelStore.fetching.studentAnalyze"
        @fetchStudentAnalyze="fetchStudentAnalyze"
      />
    </div>
  </user-panel-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserPanelStore } from '~/store/user-panel';
import type {
  analyzeStudentCategory,
  analyzeStudentCategoryForTable,
} from '~/main/modules/user-panel/data-access/user-panel.model';

//use fun
const panelStore = useUserPanelStore();

//data
const selectedCategoryId = ref<any>(null);
const selectedPeriodTable = ref(0);
const selectedPeriodChart = ref(0);
const chartSeries = ref<any>([]);

//computed
const stdAnlyzeData = computed(() => {
  return panelStore.studentAnalyze;
});

const stdAnlyzeDataTable = computed(() => {
  const flat = stdAnlyzeData.value?.analayzeStudentCategories ?? [];

  const map = new Map<number, any>();

  const result: analyzeStudentCategoryForTable = [];

  flat.forEach((item) => {
    map.set(item.categoryId, { ...item, children: [] });
  });

  flat.forEach((item) => {
    if (item.parentId === null) {
      result.push(map.get(item.categoryId));
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(map.get(item.categoryId));
      }
    }
  });

  return result;
});

const stdChartData = computed(() => {
  return panelStore.studentAnalyzeChart;
});

const stdPlaneInfo = computed(() => {
  return panelStore.studentPlanInfo;
});

//methods
function selectCategory(id) {
  selectedCategoryId.value = id;
  fetchStudentAnalyzeChart();
}

function selectPeriodChart(period) {
  selectedPeriodChart.value = period;
  fetchStudentAnalyzeChart();
}

async function fetchStudentAnalyze(selectedPeriod) {
  selectedPeriodTable.value = selectedPeriod;
  await panelStore.getStudentAnalyze(selectedPeriodTable.value);
}

async function fetchStudentAnalyzeChart() {
  await panelStore.getStudentAnalyzeChart(
    selectedPeriodChart.value,
    selectedCategoryId.value
  );
  const data = stdChartData.value?.chartData
    .filter((item) => item.count > 0)
    .map((item) =>
      item.date ? { x: formatDate(item.date), y: item.count } : null
    )
    .filter(Boolean);

  chartSeries.value = [
    {
      name: 'النقاط',
      data: data && data.length >= 2 ? data : [],
    },
  ];
}

async function fetchStudentTrainingPlane() {
  await panelStore.getTrainingPlansInfo();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

onMounted(async () => {
  fetchStudentAnalyzeChart();
  fetchStudentAnalyze(selectedPeriodTable.value);
  fetchStudentTrainingPlane();
});

//watch
watch(
  () => panelStore.globalType,
  async (newVal, oldVal) => {
    fetchStudentAnalyzeChart();
    fetchStudentAnalyze(selectedPeriodTable.value);
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
