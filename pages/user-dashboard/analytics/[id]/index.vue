<template>
  <userPanelLayout>

    <!-- <div v-if="rotateWarning"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 text-white text-center p-4">
      <div class="text-lg font-bold">
        الرجاء قلب الجهاز لعرض الشكل بشكل مناسب 
      </div>
    </div> -->

    <div>

      <div @click="toAnalytics"
        class="flex items-center text-dark-2b font-medium gap-[5px] cursor-pointer mb-[20px] mt-[-60px]">
        <i class="fa fa-chevron-right"></i>
        <span>رجوع للخلف</span>
      </div>


      <div class="mb-[15px]">
        <span class="text-[24px] font-bold text-blue-d6">
          تحليل قسم: {{ mainCategory?.categoryName }}
        </span>
      </div>


      <div class="flex gap-[20px] flex-col md:flex-row">


        <div class="bg-white dark:bg-dark-800 rounded-[8px] shadow-custom 
    p-[10px] xl:p-[15px] flex flex-col items-center justify-center 
    gap-[6px] xl:gap-2 w-full md:max-w-[340px] 
    min-h-[180px] xl:min-h-[220px] text-[14px] xl:text-[16px]">


          <div class="flex items-center justify-between w-full">

            <div class="grid">
              <span class="text-[20px] xl:text-[24px] text-blue-d6 dark:text-white font-bold">تقييمك</span>
              <div class="text-[14px] xl:text-[16px] font-medium flex items-center"
                :class="`text-${getRateColor(mainCategory?.rate)}`">
                <div class="w-[8px] h-[8px] rounded-full ml-[5px]" :class="`bg-${getRateColor(mainCategory?.rate)}`">
                </div>
                {{ getRateLabel(mainCategory?.rate) }}
              </div>
            </div>


            <div class="relative w-[70px] xl:w-[80px] h-[70px] xl:h-[80px]">
              <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                <path class="text-gray-300 dark:text-dark-600" stroke="currentColor" stroke-width="4" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="text-green-500" :stroke-dasharray="`${mainCategory?.rate}, 100`" stroke-linecap="round"
                  stroke="currentColor" stroke-width="4" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div
                class="absolute inset-0 flex items-center justify-center text-[16px] xl:text-[20px] font-bold text-green-600 dark:text-green-400">
                {{ mainCategory?.rate }}%
              </div>
            </div>
          </div>


          <div
            class="flex justify-between w-full text-center text-[13px] xl:text-[14px] font-medium text-gray-63 dark:text-gray-300 mt-[15px] xl:mt-[20px]">
            <div class="flex-1 space-y-[4px]">
              <div class="text-purple-78 text-[15px] xl:text-[16px] font-bold">الأسئلة</div>
              <div>{{ mainCategory?.questionsCount }}</div>
            </div>
            <div class="flex-1 space-y-[4px]">
              <div class="text-purple-78 text-[15px] xl:text-[16px] font-bold">الإجابات</div>
              <div>
                <span class="text-green-8c">{{ mainCategory?.correctAnswersCount }}</span>
                |
                <span class="text-red-5e">{{ mainCategory?.wrongAnswersCount }}</span>
              </div>
            </div>
            <div class="flex-1 space-y-[4px]">
              <div class="text-purple-78 text-[15px] xl:text-[16px] font-bold">مدة التدريب</div>
              <div>
                {{ formatTime(mainCategory?.totalTime || 0) }} ساعة
              </div>
            </div>
          </div>


          <span
            class="text-[16px] xl:text-[18px] mt-[8px] xl:mt-[10px] font-bold text-center text-red-5e dark:text-rose-400">
            {{ analyzeProgressNoteByValue(chartData) }}
          </span>
          <p class="text-[13px] xl:text-[14px] font-medium text-center text-gray-63 dark:text-gray-400">
            استمر في التدريب لترتفع مستواك في هذه المهارة
          </p>


          <div class="grid gap-[8px] xl:gap-[10px] mt-[10px] justify-items-center w-full">
            <button @click="getAdvices(mainCategory?.categoryId)"
              class="hover:bg-blue-600 text-white rounded-[8px] w-[180px] xl:w-[200px] h-[40px] xl:h-[44px] cursor-pointer flex items-center justify-center gap-[12px] text-[14px] xl:text-[16px]"
              style="background: linear-gradient(95.1deg, #24A7F1 0.47%, #0266D6 100%)">
              <img src="/images/svg/user-panel/lamp-white.svg" class="w-[18px] xl:w-[20px]" />
              نصائح اختبارات
            </button>
            <button @click="toTraining(mainCategory?.parentId, mainCategory?.categoryId)"
              class="bg-purple-78 text-white rounded-[8px] w-[180px] xl:w-[200px] h-[40px] xl:h-[44px] cursor-pointer flex items-center justify-center gap-[12px] text-[14px] xl:text-[16px]">
              <img src="/images/svg/user-panel/dumbbell.svg" class="w-[18px] xl:w-[20px]" />
              تدرب على القسم
            </button>
          </div>
        </div>




        <div class="w-full flex-2/3 2xl:min-w-[700px] h-[380px] bg-white shadow-md rounded-lg p-4 relative grid">
          <div class="flex justify-between items-baseline mb-[15px] flex-wrap gap-[10px] max-sm:justify-center">
            <span class="text-[24px] text-blue-d6 font-bold">تطور أداءك في القسم</span>
            <select v-model="selectedPeriod" @change="fetchChartData"
              class="border border-[#BCCCDB] p-2 rounded-[6px] text-sm">
              <option v-for="item in chartPeriodList" :key="item.id" :value="item.id">
                الفترة: {{ item.label }}
              </option>
            </select>
          </div>

          <!-- الرسم البياني -->
          <div :id="apexChartService.apexChartWrapperId" class="relative" v-if="chartData.some(k => k.count > 0)">
            <component :is="apexChartService.apexComponent.value" v-if="apexChartService.apexComponent.value"
              :key="chartKey" type="area" :height="'280px'" :options="chartOptions" :series="chartSeries" />
          </div>
          <div v-else class="flex justify-center align-middle">
            <span class=" text-[26px] text-red-5e font-bold">لا يوجد بيانات</span>
          </div>
        </div>
      </div>


      <div class="mt-5 flex flex-col gap-5">
        <accordionGroup>
          <disclosureGroup :defaultOpen="true" :onlyOneOpen="false">
            <template #right>
              <span class="text-[18px] font-bold text-orange-39">تفاصيل المهارات في القسم</span>
            </template>

            <div class="max-w-[100vw] overflow-x-auto">
              <div class="space-y-2 min-w-[900px]">
                <div class="h-[70px] w-full flex items-center">
                  <div
                    class="bg-[#F5F7FA] h-[100%] flex-[75%] flex items-center border border-[#BCCCDB] !border-l-0 rounded-r-[8px] px-[15px] text-purple-78 text-[16px] font-bold">
                    <div class="w-[40%]">القسم الفرعي</div>
                    <div class="w-[20%] text-center">عدد الأسئلة</div>
                    <div class="w-[20%] text-center">الإجابات<br><span class="font-medium text-[12px]">صحيحة |
                        خاطئة</span></div>
                    <div class="w-[20%] text-center">زمن الإجابة والمتوسط</div>
                    <div class="w-[20%] text-center">مدة التدريب</div>
                    <div class="w-[20%] text-center">التقييم</div>
                  </div>
                  <div
                    class="bg-[#F5F7FA] h-[100%] flex flex-[25%] items-center border border-[#BCCCDB] !border-r-0 rounded-l-[8px] px-[15px] text-purple-78 text-[16px] font-bold">
                    <div class="w-full text-center">توصيات</div>
                  </div>
                </div>

                <div v-for="(child, i) in tableCategories" :key="i" :class="['h-[60px] flex items-center']">
                  <div class="flex flex-[75%] h-[100%] items-center rounded-r-[8px] border border-[#BCCCDB] !border-l-0 px-[15px]"
                    :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                    <div class="w-[40%] text-gray-63 font-medium">{{ child.categoryName }}</div>
                    <div class="w-[20%] text-center">{{ child.questionsCount }}</div>
                    <div class="w-[20%] text-center">
                      <span class="text-green-8c font-bold text-[14px]">{{ child.correctAnswersCount }}</span> |
                      <span class="text-red-5e font-bold text-[14px]">{{ child.wrongAnswersCount }}</span>
                    </div>
                    <div class="w-[20%] text-center">
                      <span class="text-green-8c font-bold text-[14px]">{{ formatTime(child.allStudentsTimeTakenRate)
                      }}</span> |
                      <span class="text-red-5e font-bold text-[14px]">{{ formatTime(child.studentTimeTakenRate)
                      }}</span>
                    </div>
                    <div class="w-[20%] text-center">{{ formatTime(child.totalTime) }} ساعة</div>
                    <div class="w-[20%] text-center">
                      <div class="w-full bg-gray-200 h-[18px] rounded-[4px] dark:bg-dark-600">
                        <div :class="`bg-${getRateColor(child.rate)}`"
                          class="h-[18px] rounded-[4px] flex items-center justify-center"
                          :style="{ width: child.rate + '%' }">
                          <span v-if="child.rate > 0" class="text-sm"
                            :class="child.rate > 12 ? 'text-white' : 'text-black'">{{
                              child.rate }}%</span>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div class="flex flex-[25%] h-[100%] items-center rounded-l-[8px] border border-[#BCCCDB]"
                    :class="i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'">
                    <div class="w-full h-[100%] flex justify-center items-center gap-[15px] flex-wrap">
                      <template v-if="child.rate >= 60 && !child.hasLawAnalyze && userData.planSubscribed">
                        <span class="text-green-8c font-bold text-[16px]">أنت متقن لهذا القسم</span>
                      </template>
                      <template v-else>
                        <template v-if="child.rate < 60">
                          <button @click="router.push(`/user-dashboard/foundation`)"
                            class="bg-blue-d6 text-white text-[14px] font-medium h-[32px] w-[110px] rounded-[4px] cursor-pointer">إعادة
                            تأسيس</button>
                        </template>
                        <template v-if="child.hasLawAnalyze">
                          <button
                            class="bg-red-5e text-white text-[14px] font-medium h-[32px] w-[70px] rounded-[4px] cursor-pointer">للحفظ</button>
                        </template>
                        <template v-if="!userData.planSubscribed">
                          <button
                            class=" bg-purple-78  text-white text-[14px] font-medium h-[32px] w-[60px] rounded-[4px] cursor-pointer">تدرب</button>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </disclosureGroup>
        </accordionGroup>
      </div>

    </div>
    <adviceLoading v-if="isLoadingAdvices" />
    <adviceModal v-if="showAdviceModal" :content="advicesModalData" @close="showAdviceModal = false" />
  </userPanelLayout>
</template>
<script setup lang="ts">
import userPanelLayout from '~/layouts/user-panel-layout.vue';
import { RouteHelper } from '~/main/utils/route-helper';
import { useUserPanelStore } from '~/store/user-panel';
import { useApexChartService } from '~/main/services/useApexChartService';
import { ref, computed, onMounted } from 'vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';

const userPanelStore = useUserPanelStore();
const route = useRoute();
const router = useRouter();
const { data } = useAuth()
const apexChartService = useApexChartService();
const { $axios } = useNuxtApp()

const id = route.params.id;
const selectedPeriod = ref(0);
const chartKey = Symbol();
const chartSeries = ref<any>([]);
const isLoadingAdvices = ref(false);
const showAdviceModal = ref(false);
const advicesModalData = ref<any>(null);

const chartPeriodList = [
  { id: 0, label: 'اسبوع' },
  { id: 1, label: 'شهر' },
  { id: 2, label: '3 أشهر' },
  { id: 3, label: '6 أشهر' },
];

const chartOptions = ref({
  chart: {
    id: 'main-chart',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  xaxis: {
    type: 'category',
    labels: {
      rotate: -45,

      formatter: val => new Date(val).toLocaleDateString('en-US')
    }
  },
  yaxis: {
    labels: {
      formatter: val => `${val}%`
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: ['#0266D6']
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.1,
      colorStops: [],
      stops: [0, 100],
      gradientToColors: ['#0266D6']
    }
  },
  markers: {
    size: 8,
    colors: ['#0266D6'],
    strokeColors: '#fff',
    strokeWidth: 2
  },
  tooltip: {
    x: {
      formatter: val => val
    }
  }
});


async function fetchChartData() {
  await userPanelStore.getAnalyzeDetailsChartForStudent({ categoryId: id, period: selectedPeriod.value });

  const data = chartData.value
    .filter(item => item.count > 0)
    .map(item => {
      return { x: new Date(item.date).getTime(), y: item.count };
    });

  chartSeries.value = [
    {
      name: 'النشاط',
      data
    }
  ];
}



function toAnalytics() {
  router.push(RouteHelper.userAnalytics());
}

function getRateLabel(rate) {
  if (rate == 0) return 'لايوجد';
  if (rate < 30) return 'ضعيف جداً';
  if (rate < 50) return 'ضعيف';
  if (rate < 70) return 'جيد';
  if (rate < 90) return 'جيد جداً';
  return 'ممتاز';
}

function getRateColor(rate) {
  if (rate < 50) return 'red-5e';
  if (rate < 70) return 'yellow-00';
  return 'green-8c';
}


function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function analyzeProgressNoteByValue(data) {
  if (!data || data.length === 0 || data.every(item => item.count === 0)) return 'لا يوجد قيم';

  let lastValue = data[data.length - 1].count;
  let previousValue = null;

  for (let i = data.length - 2; i >= 0; i--) {
    if (data[i].count !== lastValue) {
      previousValue = data[i].count;
      break;
    }
  }

  if (previousValue === null || lastValue >= previousValue) {
    return 'تتقدم بشكل ملحوظ في الفترة السابقة';
  } else {
    return 'تراجعت مهارتك عن الفترات السابقة';
  }
}

function toTraining(parentId, catId) {
  router.push(`/user-dashboard/prepare?page=trainings&parentId=${parentId}&childId=${catId}`)
}

function getAdvices(catId) {
  isLoadingAdvices.value = true;
  $axios.get(`/dashboard/getExamsAdvicesForStudent/${catId}`)
    .then(res => {
      advicesModalData.value = res.data;
      showAdviceModal.value = true;
    })
    .catch(err => {
      console.error('advicesAPI:', err);
    })
    .finally(() => {
      isLoadingAdvices.value = false;
    });
}

const mainCategory = computed(() => {
  return userPanelStore.analyticsDetails?.find(k => k.categoryId === Number(id));
});

const tableCategories = computed(() => {
  return userPanelStore.analyticsDetails?.filter(k => k.categoryId !== Number(id));
});

const chartData = computed(() => {
  return userPanelStore.analyzeDetailsChartForStudent || [];
});


const userData = computed(() => data.value as UserInfoDataModel);


const isMobile = ref(false);
const rotateWarning = ref(false);
const scaleValue = ref(1);

onMounted(async () => {
  apexChartService.initApexChart();

  if (id) {
    await userPanelStore.getAnalyticsDetails(id);
    await fetchChartData();
  }

  const updateScale = () => {
    const width = window.innerWidth;
    isMobile.value = width < 768;
    rotateWarning.value = isMobile.value && window.innerHeight > window.innerWidth;
    scaleValue.value = 1
  };

  updateScale();
  window.addEventListener("resize", updateScale);
  window.addEventListener("orientationchange", updateScale);
});
</script>
