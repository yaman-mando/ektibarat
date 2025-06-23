<template>
  <div
    v-if="configModel"
    class="report-student-count-chart"
  >
    <h3 class="my-0">{{ configModel.title }}</h3>
    <client-only>
      <div class="w-full flex flex-col gap-2 relative">
        <app-overlay v-if="isLoadingData" />
        <form-select
          v-model:selectedValues="form.period"
          inputId="period"
          class="lg:w-1/4"
          :list="adminReportsPeriodOptions()"
          :placeholder="'المدة'"
          :isMulti="false"
        />
        <div
          :id="apexChartService.apexChartWrapperId"
          class="relative"
        >
          <component
            :is="apexChartService.apexComponent.value"
            v-if="apexChartService.apexComponent.value && chartLineOptions"
            :key="chartKey"
            :height="'300px'"
            :series="chartLineSeries"
            :options="chartLineOptions"
          />
          <div
            v-if="isTooltipVisible"
            :id="apexChartService.apexChartTooltipId"
            tabindex="0"
            @click.stop
          ></div>
        </div>
      </div>
    </client-only>
  </div>
</template>
<script lang="ts">
import { useApexChartService } from '~/main/services/useApexChartService';
import { ADMIN_REPORT_CHART_TYPE } from '~/main/constants/admin-report-chart-type.enum';
import { adminReportsPeriodOptions } from '~/main/constants/admin-reports-period-options.enum';
import { deepCloneUtil, deepEqualUtil } from '~/main/utils/lodash.utils';
import { useGlobalStore } from '~/main/useGlobalStore';
import { fromEvent, takeWhile } from 'rxjs';
import { dateUi } from '~/main/utils/date-utils';
import ReportChartCountTooltip from '~/components/admin/report-chart-count-tooltip.vue';
import { createApp, h } from 'vue';

export default {
  props: {
    reportType: {
      type: String,
      default: ADMIN_REPORT_CHART_TYPE.studentCountToTrain,
    },
  },
  setup() {
    const windowSize = useWindowSize();
    const apexChartService = useApexChartService();
    const globalStore = useGlobalStore();
    onMounted(() => {
      apexChartService.initApexChart();
    });
    return {
      windowSize,
      apexChartService,
      globalType: computed(() => globalStore.state.globalTypeValue),
    };
  },
  data() {
    return {
      isTooltipVisible: false,
      chartKey: Symbol(),
      chartLineOptions: null as any | null,
      chartLineSeries: [
        {
          name: 'ChartLine',
          data: [] as any[],
        },
      ],
      isLoadingData: false,
      form: {
        period: 0,
      },
    };
  },
  computed: {
    configModel() {
      switch (this.reportType) {
        case ADMIN_REPORT_CHART_TYPE.studentCountToTrain:
          return {
            title: 'تقرير عدد الطلاب',
            apiUrl: 'dashboard/analyzeDailyStudentCounts',
          };
        case ADMIN_REPORT_CHART_TYPE.questionCountInPeriod:
          return {
            title: 'تقرير الاجابات خلال فترة زمنية',
            apiUrl: 'dashboard/analyzeDailyQuestionsCounts',
          };
        case ADMIN_REPORT_CHART_TYPE.studentCompletedRegCount:
          return {
            title: 'تقرير عدد الطلاب المكتمل تسجيلهم',
            apiUrl: 'students/analyzeStudentsRegistration',
          };
        case ADMIN_REPORT_CHART_TYPE.studentNotCompletedRegCount:
          return {
            title: 'تقرير عدد الطلاب الغير مكتمل تسجيلهم',
            apiUrl: 'students/analyzeStudentsRegistration',
          };
        default:
          return null;
      }
    },
    isLoading() {
      return this.apexChartService.state.apexLibLoading ?? this.isLoadingData;
    },
    formModel() {
      return deepCloneUtil(this.form);
    },

    isStudentRegApi() {
      return (
        this.reportType ===
          ADMIN_REPORT_CHART_TYPE.studentNotCompletedRegCount ||
        this.reportType === ADMIN_REPORT_CHART_TYPE.studentCompletedRegCount
      );
    },
  },
  watch: {
    formModel: {
      deep: true,
      handler(val, oldVal) {
        if (deepEqualUtil(val, oldVal)) return;

        this.init();
      },
    },
    globalType: {
      deep: true,
      handler(newVal, oldVal) {
        this.init();
      },
    },
  },
  mounted() {
    if (import.meta.client) {
      this.setChartOptions();
      this.init();

      fromEvent(document, 'click')
        .pipe(takeWhile(() => this.apexChartService.state.isAliveApexView))
        .subscribe((e) => {
          const event = e as unknown as any;
          const tooltipWrapper = document.getElementById(
            this.apexChartService.apexChartTooltipId
          );
          if (
            !!tooltipWrapper &&
            !tooltipWrapper.contains(event.target) &&
            !event.target!.classList.contains('apexcharts-marker')
          ) {
            this.isTooltipVisible = false;
          }
        });
    }
  },
  methods: {
    adminReportsPeriodOptions() {
      return adminReportsPeriodOptions;
    },
    setChartOptions() {
      this.chartLineOptions = {
        chart: {
          type: 'line',
          toolbar: { show: false },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              event.stopPropagation();
              const seriesIndex = config.seriesIndex;
              const dataPointIndex = config.dataPointIndex;
              const seriesValue =
                chartContext.opts.series[seriesIndex].data[dataPointIndex];
              const xValue = chartContext.opts.xaxis.categories[dataPointIndex];

              //start
              const app = createApp({
                render() {
                  return h(ReportChartCountTooltip, {
                    count: seriesValue,
                    date: xValue,
                  });
                },
              });
              const div = document.createElement('div');
              app.mount(div);
              const htmlString = div.innerHTML;
              this.isTooltipVisible = true;

              this.$nextTick(() => {
                const parent = document.getElementById(
                  this.apexChartService.apexChartWrapperId
                )!;
                const tooltipWrapper = document.getElementById(
                  this.apexChartService.apexChartTooltipId
                )!;
                tooltipWrapper.innerHTML = htmlString;
                tooltipWrapper.style.position = 'absolute';

                const tooltipComputedStyle =
                  window.getComputedStyle(tooltipWrapper);
                // Get click position relative to parent
                const parentRect = parent.getBoundingClientRect();
                const padding = 6;

                // Get click position relative to parent
                const clickX = event.clientX - parentRect.left;
                const clickY = event.clientY - parentRect.top;
                const popUpWidth = parseInt(tooltipComputedStyle.width, 10);
                const popUpHeight = parseInt(tooltipComputedStyle.height, 10);
                let adjustedLeft = clickX + padding;
                let adjustedTop = clickY - popUpHeight - padding; // Attempt to position above the click

                // Check if there's enough space above the click
                if (adjustedTop < padding) {
                  // Not enough space above, position below the click
                  adjustedTop = clickY + padding;
                }

                // Ensure it doesn't overflow on the right side
                if (adjustedLeft + popUpWidth > parentRect.width) {
                  adjustedLeft = parentRect.width - popUpWidth - padding;
                }

                // Ensure it doesn't overflow on the left side
                if (adjustedLeft < padding) {
                  adjustedLeft = padding;
                }

                tooltipWrapper.style.left = `${adjustedLeft}px`;
                tooltipWrapper.style.top = `${adjustedTop}px`;
              });

              //end
            },
          },
          zoom: { enabled: false },
          parentHeightOffset: 0,
          selection: { enabled: false },
          height: 400,
        },
        markers: {
          size: this.windowSize.isMobileSize ? 3 : 6,
          colors: ['#46008c'],
          strokeWidth: 0,
          strokeOpacity: 1,
          hover: {
            size: 6,
            sizeOffset: 3,
          },
        },
        colors: ['#46008c'],
        dataLabels: { enabled: false },
        fill: { opacity: 1 },
        tooltip: {
          intersect: true,
          shared: false,
          enabled: true, // Disable the default tooltip on hover
          custom: ({ series, seriesIndex, dataPointIndex }) => {
            return '';
          },
        },
        legend: { show: false },
        stroke: {
          curve: 'straight',
          show: true,
          width: 2,
          colors: ['#46008c'],
        },
        xaxis: {
          tickAmount: this.windowSize.isMobileSize ? 2 : 7,
          type: 'category',
          categories: [],
          labels: {
            trim: false,
            rotate: 45,
            show: true,
            style: {
              cssClass: 'a-x-label',
              fontSize: '14px',
              colors: '#3183f7',
              fontFamily: 'Droid Arabic Kufi", "Open Sans", Arial, sans-serif',
            },
            formatter: function (val) {
              return dateUi(val);
            },
          },
          tooltip: { enabled: false },
          crosshairs: { show: true },
          axisBorder: {
            show: true,
            color: '#f0f1f2',
            height: 1,
            width: '100%',
          },
          axisTicks: { show: false },
        },
        yaxis: {
          show: true,
          forceNiceScale: true,
          labels: {
            align: 'center',
            style: {
              cssClass: 'a-y-label',
              fontSize: '16px',
              colors: ['#3183f7'],
            },
            offsetX: -5,
            formatter: function (val) {
              return val.toFixed(0);
            },
          },
          crosshairs: { show: false },
        },
        grid: {
          show: true,
          borderColor: '#d9c9e6',
        },
      };
    },
    setChartData(data) {
      this.chartLineOptions.xaxis.categories = [];
      this.chartLineSeries[0].data = [];
      data.forEach((val) => {
        this.chartLineOptions.xaxis.categories.push(val.date);
        this.chartLineSeries[0].data.push(val.count);
      });
      this.chartKey = Symbol();
    },
    getApi(model) {
      if (this.isStudentRegApi) {
        return this.$axios.post(this.configModel!.apiUrl, {
          isCompleted:
            this.reportType ===
            ADMIN_REPORT_CHART_TYPE.studentCompletedRegCount,
          period: model.period,
          grade: this.$store.state.globalType,
        });
      }
      return this.$axios.get(this.configModel!.apiUrl, {
        params: {
          period: model.period,
          grade: this.$store.state.globalType,
        },
      });
    },
    async init() {
      try {
        this.isLoadingData = true;
        const { data: res } = await this.getApi(this.form);
        this.setChartData(res);
        this.isLoadingData = false;
      } catch (e) {
        this.isLoadingData = false;
        throw e;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.report-student-count-chart {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
