<template>
    <div :class="!isSubscribe ? 'p-0' : 'p-4'"
        class="bg-white shadow-md rounded-lg relative h-full">
        <app-overlay msg="جاري جلب بيانات المخطط ..." v-if="fetching && isSubscribe" />

        <img @click="$emit('go-prices')" v-if="!isSubscribe" class=" cursor-pointer w-full h-full"
            src="/images/png/analysisChartNotSub.png" alt="" />

        <template v-else>
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-baseline mb-4 gap-4">
                <div class="flex gap-[12px] flex-wrap overflow-x-auto sm:overflow-visible p-[10px] sm:p-0">
                    <button v-for="(category, index) in categories" :key="category.categoryId ?? index"
                        @click="$emit('select-category', category.categoryId)" :class="['rounded-[8px] min-w-[90px] h-[50px] text-[12px] sm:min-w-[100px] sm:h-[60px] sm:text-[13px] xl:min-w-[140px] xl:h-[80px] xl:text-[16px]',
                            'shadow-custom font-medium cursor-pointer',
                            selectedCategoryId === category.categoryId ? 'bg-blue-d6 text-white shadow-none' : 'bg-white text-dark-2b'
                        ]" class="category-button">
                        <div class="grid items-center justify-items-center">
                            <TextSlice :text="category.categoryName" :length="12" />
                            <span class="font-bold text-[18px] sm:text-[22px] xl:text-[30px]"> {{
                                dateFormat.formatNoData(category.rate) }} </span>
                        </div>
                    </button>
                </div>
                <select v-model="selectedPeriodLocal" @change="$emit('change-period', selectedPeriodLocal)"
                    class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm">
                    <option v-for="item in chartPeriodList" :key="item.id" :value="item.id"> الفترة: {{ item.label }}
                    </option>
                </select>
            </div>

            <!-- Chart -->
            <div class="relative max-w-full overflow-x-auto">
                <component :is="apexChartComponent" v-if="apexChartComponent" :key="chartKey" type="area"
                    :height="'280px'" :options="chartOptions" :series="chartSeries" />
            </div>

            <!-- Stats -->
            <div
                class="flex justify-around items-center justify-self-center text-sm text-gray-700 max-w-[88vw] w-[540px] h-[50px] border border-[#BCCCDB] rounded-[8px] p-2">
                <div class="text-[11px] sm:text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                    <span>الأسئلة</span>
                    <span class="text-dark-2b">{{ dateFormat.formatNoData(stdChartData?.totalQuestionsCount) }}</span>
                </div>
                <div class="text-[11px] sm:text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                    <span>الإجابات</span>
                    <span class="text-green-8c">{{ dateFormat.formatNoData(stdChartData?.correctCount) }}
                        <span class="text-gray-8f px-1">|</span>
                        <span class="text-red-5e">{{ dateFormat.formatNoData(stdChartData?.wrongCount) }}</span>
                    </span>
                </div>
                <div class="text-[11px] sm:text-[14px] text-gray-8f font-medium space-x-[5px] lg:space-x-[20px]">
                    <span>مدة التدريب</span>
                    <span class="text-dark-2b">{{ dateFormat.formatStoMMHH(stdChartData?.totalPeriod) }}
                        <span class="text-gray-8f">
                            <template
                                v-if="stdChartData?.totalPeriod && stdChartData?.totalPeriod < 3600">دقيقة</template>
                            <template v-else>ساعة</template>
                        </span>
                    </span>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useApexChartService } from "~/main/services/useApexChartService";
import * as dateFormat from "~/main/utils/date-utils";
import type { mainCategoryRate, studentAnalyzeChartResponse } from "~/main/modules/user-panel/data-access/user-panel.model";


interface Props {
  isSubscribe: boolean;
  fetching: boolean;
  categories: mainCategoryRate[] | any;
  selectedCategoryId: string | number;
  selectedPeriod: number;
  chartSeries: any[];
  stdChartData: studentAnalyzeChartResponse | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "go-prices"): void;
  (e: "select-category", categoryId: string | number): void;
  (e: "change-period", periodId?: number): void;
}>();

const apexChartService = useApexChartService();
const windowsSize = useWindowSize()

const chartKey = Symbol();
const selectedPeriodLocal =ref(0)
const chartPeriodList = [
  { id: 0, label: 'يومي' },
  { id: 1, label: 'اسبوعيا' },
  { id: 2, label: 'شهريا' },
]

const apexChartComponent = computed(() => {
  return apexChartService.apexComponent.value;
});

const chartOptions = computed(() => ({
  chart: {
    id: "main-chart",
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: "Tajawal, sans-serif",
  },
  noData: {
    text: "لا توجد قيم كافية لعرض الرسم البياني",
    align: "center",
    verticalAlign: "middle",
    style: {
      color: "#6b7280",
      fontSize: "14px",
      fontFamily: "Tajawal, sans-serif",
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      show: props.chartSeries.length > 0,
      rotate: -45,
      style: { fontSize: "12px" },
      formatter: (val: string | number) => formatDate(val),
    },
    tickAmount: windowsSize.isDesktop ? 6 : 2,
    tooltip: { enabled: false },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => `${Math.round(val)}`,
    },
    forceNiceScale: true,
    decimalsInFloat: 0,
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 3,
    colors: ["#0266D6"],
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.1,
      stops: [0, 100],
      gradientToColors: ["#0266D6"],
      colorStops: [],
    },
  },
  markers: {
    size: 0,
    hover: { size: 8, sizeOffset: 0 },
    colors: ["#0266D6"],
    strokeColors: "#fff",
    strokeWidth: 2,
  },
  tooltip: {
    x: {
      formatter: (val: string) => {
        const date = new Date(val);
        const weekday = date.toLocaleDateString("ar-EG", { weekday: "long" });
        const fullDate = formatDate(val);
        return `${weekday} - ${fullDate}`;
      },
    },
    y: {
      formatter: (val: number) => `${Math.round(val)}`,
    },
  },
  grid: { strokeDashArray: 4 },
  colors: ["#0266D6"],
}));


function formatDate(dateStr: string | number): string {
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}

onMounted(async () => {
    selectedPeriodLocal.value = props.selectedPeriod
  apexChartService.initApexChart();
});
</script>

