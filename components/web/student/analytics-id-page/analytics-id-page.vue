<template>
  <div
    v-if="mainData"
    class="student-analytics-page"
  >
    <div
      v-if="studentInfo"
      class="student-info"
    >
      <div class="r-part">
        <img
          :src="
            imageService.getUrl(
              ImagesFolderName.Users,
              studentInfo.pictureUrl,
              ImageSize.original,
              ImageExt.jpg
            )
          "
          alt=""
          @error="setDefaultImage"
        />
        <div class="__info">
          <span class="_t1">تحليلات الطالب</span>
          <span class="_t2">
            {{ studentInfo.fullName ? studentInfo.fullName : 'لا يوجد اسم' }}
          </span>
          <span class="_t3">
            {{ studentInfo.userName ? studentInfo.userName : 'لا يوجد اسم' }}
          </span>
        </div>
      </div>
      <app-button
        size="md"
        class="exit-btn"
        variant="outline"
        label="رجوع"
        iconStartClass="fa fa-solid fa-right-from-bracket"
        @click="toAnalyticsPage"
      />
    </div>
    <div
      v-if="infoData"
      class="student-analytics"
    >
      <div
        v-if="!studentInfo"
        class="c-back-mobile"
      >
        <app-button
          variant="outline"
          iconStartClass="fa fa-solid fa-right-from-bracket"
          size="md"
          label="رجوع"
          @click="toAnalyticsPage"
        />
        <span class="__label">
          تحليل قسم:
          <span>{{ infoData.categoryName }}</span>
        </span>
      </div>

      <div class="cw-info">
        <div class="cw-info-r">
          <div class="cw-info-r-rw-1">
            <app-button
              v-if="!studentInfo"
              variant="outline"
              size="md"
              label="رجوع"
              iconStartClass="fa fa-solid fa-right-from-bracket"
              @click="toAnalyticsPage"
            />
            <span class="__label">
              تحليل قسم:
              <span>{{ infoData.categoryName }}</span>
            </span>
          </div>
          <div class="cw-info-r-rw-2">
            <div class="__info-groups">
              <div class="__group">
                <span class="__label">الأسئلة</span>
                <span class="__info">{{ infoData.questionsCount }}</span>
              </div>
              <div class="__group">
                <span class="__label">الإجابات</span>
                <span class="__info __range">
                  <span class="__r1">{{ infoData.correctAnswersCount }}</span>
                  <span class="__r2"></span>
                  <span class="__r3">{{ infoData.wrongAnswersCount }}</span>
                </span>
              </div>
              <div class="__group">
                <span class="__label">التقييم</span>
                <span class="__info __rate">
                  {{ getRateLabel(infoData.rate) }}
                </span>
              </div>
            </div>
            <div class="__chart">
              <a-progress
                :size="66"
                type="circle"
                :percent="infoData.rate"
                stroke-linecap="round"
                :strokeColor="{
                  '0%': '#FD6C6C',
                  '100%': '#008FFB',
                }"
                trailColor="#cfd1d4"
                :strokeWidth="11"
              >
                <template #format="percent">
                  <span class="percent">
                    <span style="font-size: 16px; margin-inline-end: 2px">
                      %
                    </span>
                    <span>{{ percent }}</span>
                  </span>
                </template>
              </a-progress>
            </div>
          </div>
          <div class="cw-info-r-rw-3">
            <span>{{ noteByAnalyticsValue }}</span>
          </div>
          <div class="cw-info-r-rw-4">
            <span>استمر في التدرب لتتمكن من رفع مستواك في هذه المهارة</span>
          </div>
          <div class="cw-info-r-rw-5">
            <app-button
              size="md"
              label="تدرب"
              :isDisabled="loadingBtn === infoData.categoryId"
              @click.stop="
                onTrainClickStudent(infoData.parentId, infoData.categoryId)
              "
            />
            <div class="w-full relative">
              <app-overlay
                v-if="loadingAdvice"
                :fullScreen="true"
                :hideSpinner="true"
                class="tips-overlay"
                variant="dark"
              >
                <template #default>
                  <div class="tips-container">
                    <h2>⏳ جاري تجهيز نصائحك الشخصية...</h2>

                    <p>
                      نظام
                      <span class="highlight">اختبارات الذكي</span>
                      يعمل الآن على تحليل أدائك وتجهيز نصائح مخصصة لك 👨‍🏫📊
                    </p>

                    <p>
                      قد يستغرق الأمر
                      <span class="highlight">30 ثانية فقط</span>
                      ... بنجهز لك شيء يستاهل! 🚀
                    </p>

                    <app-progress-bar
                      :value="progress"
                      :max="30"
                      height="25px"
                      class="my-4"
                      style="width: 100%; max-width: 500px; margin: auto"
                    />

                    <h2 style="margin-top: 30px">🎯 لماذا نأخذ هذا الوقت؟</h2>

                    <p>
                      لأننا نستخدم تقنيات تحليل متقدمة عشان نقدم لك نصائح تناسب
                      <span class="highlight">مستواك تمامًا</span>
                      💡
                    </p>

                    <p class="highlight">
                      🟢 لا تغلق الصفحة، النصائح قادمة خلال لحظات!
                    </p>
                  </div>
                </template>
              </app-overlay>
            </div>
            <app-button
              size="md"
              colorType="blue"
              label="نصائح اختبارات"
              @click="getAdvices()"
            />
          </div>
        </div>
        <div class="cw-info-l chart">
          <client-only>
            <div class="w-full h-full flex flex-col gap-2 relative">
              <span class="__label">تطور أداءك</span>
              <app-overlay
                v-if="isLoadingChartData"
                noWrap
                :style="!windowSize.isMobileSize ? 'height: 250px' : ''"
              />

              <form-select
                v-model:selectedValues="chartForm.period"
                inputId="chart-form-period"
                class="self-end ml-3"
                :list="periodList"
                :placeholder="'المدة'"
                :isMulti="false"
              />
              <component
                :is="apexChartService.apexComponent.value"
                v-if="
                  apexChartService.apexComponent.value &&
                  filterChartData.length > 0
                "
                :key="chartKey"
                :height="'300px'"
                :series="chartLineSeries"
                :options="chartLineOptions"
              />
              <span
                v-else-if="!isLoadingChartData"
                class="no-data"
              >
                لا يوجد نتائج
              </span>
            </div>
          </client-only>
        </div>
      </div>

      <div class="cw-tabs-group">
        <div class="cw-tab full-tab">
          <prime-accordion>
            <prime-accordion-panel
              id="tab-content-full"
              value="fullAnalyticsFilteredData"
            >
              <prime-accordion-header class="custom-acc-header">
                <div class="tab-header w-full">
                  <span class="__label">تفاصيل المهارات في القسم</span>
                </div>
              </prime-accordion-header>
              <prime-accordion-content class="tab-content">
                <template
                  v-if="
                    fullAnalyticsFilteredData &&
                    fullAnalyticsFilteredData.length > 0
                  "
                >
                  <div class="__tab_content_rw_1">
                    <span>اضغط على المهارة لمعرفة مستواك فيها</span>
                  </div>
                  <div class="__tab_content_rw_2">
                    <div class="__tab_cat_filter">
                      <div
                        v-for="cat of fullAnalyticsFilter"
                        :key="`__cat_square_${cat.id}`"
                        class="__cat_square"
                        :class="{
                          active: selectedFullFilterIds.includes(cat.id),
                        }"
                        @click="toggleFullFilter(cat.id)"
                      >
                        <span>{{ cat.name }}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="__tab_content_rw_3">
                  <div class="__cat_table">
                    <template v-if="!windowSize.isMobileSize">
                      <div class="t-head">
                        <span>القسم</span>
                        <span>الأسئلة</span>
                        <span>الإجابات</span>
                        <span>زمن الإجابة/المتوسط</span>
                        <span>التقييم</span>
                        <span>التحكم</span>
                      </div>
                      <div
                        v-if="
                          fullAnalyticsFilteredData &&
                          fullAnalyticsFilteredData.length > 0
                        "
                        class="t-data"
                      >
                        <div
                          v-for="(
                            tableData, index
                          ) of fullAnalyticsFilteredData"
                          :key="`t-col_${index}`"
                          class="t-col"
                        >
                          <div class="to-12">
                            <span class="d-1">
                              <text-slice
                                :length="50"
                                :text="tableData.categoryName"
                              />
                            </span>
                            <span class="d-2">
                              {{ tableData.questionsCount }}
                            </span>
                          </div>

                          <span class="d-3">
                            <span class="t-2-1">
                              {{ tableData.correctAnswersCount }}
                            </span>
                            <span class="t-2-2"></span>
                            <span class="t-2-3">
                              {{ tableData.wrongAnswersCount }}
                            </span>
                          </span>
                          <span class="d-4">
                            <span class="t-2-1">
                              {{
                                secondsToMMSS(tableData.studentTimeTakenRate)
                              }}
                            </span>
                            <span class="t-2-2"></span>
                            <span class="t-2-3">
                              {{
                                secondsToMMSS(
                                  tableData.allStudentsTimeTakenRate
                                )
                              }}
                            </span>
                          </span>
                          <div class="d-5">
                            <span
                              v-if="
                                notEnoughQuestions(
                                  tableData.questionsCount,
                                  tableData.rate
                                )
                              "
                              class="notEnoughText"
                            >
                              عدد الأسئلة غير كاف
                            </span>
                            <template v-else>
                              <app-progress-bar
                                :class="
                                  tableData.rate < 30
                                    ? 'red'
                                    : tableData.rate < 70
                                      ? 'orange'
                                      : 'green'
                                "
                                :max="100"
                                height="18px"
                                :value="tableData.rate"
                              />
                            </template>
                          </div>
                          <div class="d-6">
                            <div class="w-full relative">
                              <app-button
                                :isAnalytics="true"
                                :isDisabled="
                                  notEnoughQuestions(
                                    tableData.questionsCount,
                                    tableData.rate
                                  )
                                "
                                :isLoading="
                                  !!selectedSkillId &&
                                  selectedSkillId == tableData.categoryId
                                "
                                :label="'مهارات لم تتقنها'"
                                @click="openSkillsModal(tableData.categoryId)"
                              />
                            </div>
                            <div class="w-full relative">
                              <app-button
                                :isAnalytics="true"
                                :isLoading="
                                  !!toTrainingId &&
                                  toTrainingId == tableData.categoryId
                                "
                                :label="'تدرب'"
                                @click="toTraining(tableData.categoryId)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else
                        class="no-data"
                      >
                        <span>لا يوجد نتائج</span>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        v-if="
                          fullAnalyticsFilteredData &&
                          fullAnalyticsFilteredData.length > 0
                        "
                        class="t-card"
                      >
                        <div
                          v-for="(tableData, i) of fullAnalyticsFilteredData"
                          :key="`fullAnalyticsFilteredData_${i}`"
                          class="t-col"
                          :class="[{ 'is-disabled': !tableData.isEnabled }]"
                        >
                          <div class="zr-w">
                            <div class="r-1">
                              <span class="d-1">
                                <text-slice
                                  :length="25"
                                  :text="tableData.categoryName"
                                />
                              </span>
                            </div>
                            <div
                              class="flex justify-center justify-self-center w-full"
                            >
                              <template
                                v-if="
                                  notEnoughQuestions(
                                    tableData.questionsCount,
                                    tableData.rate
                                  )
                                "
                              >
                                <span class="zr-w__label-no-enough">
                                  عدد الاسئلة غير كاف
                                </span>
                              </template>
                              <template v-else>
                                <app-progress-bar
                                  :class="
                                    tableData.rate < 30
                                      ? 'red'
                                      : tableData.rate < 70
                                        ? 'orange'
                                        : 'green'
                                  "
                                  :max="100"
                                  height="18px"
                                  :value="tableData.rate"
                                />
                              </template>
                            </div>
                            <div class="dds r-2">
                              <div class="d-2">
                                <span class="label">الأسئلة</span>
                                <span class="info">
                                  {{ tableData.questionsCount }}
                                </span>
                              </div>
                              <div class="d-3">
                                <span class="label">الإجابات</span>
                                <div class="t-group">
                                  <span class="t-2-1">
                                    {{ tableData.correctAnswersCount }}
                                  </span>
                                  <span class="t-2-2"></span>
                                  <span class="t-2-3">
                                    {{ tableData.wrongAnswersCount }}
                                  </span>
                                </div>
                              </div>
                              <div class="d-3">
                                <span class="label">زمنك/المتوسط</span>
                                <div class="t-group">
                                  <span class="t-2-1">
                                    {{
                                      secondsToMMSS(
                                        tableData.studentTimeTakenRate
                                      )
                                    }}
                                  </span>
                                  <span class="t-2-2"></span>
                                  <span class="t-2-3">
                                    {{
                                      secondsToMMSS(
                                        tableData.allStudentsTimeTakenRate
                                      )
                                    }}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="d-5">
                              <div class="w-full relative">
                                <app-button
                                  :isAnalytics="true"
                                  :disable="
                                    notEnoughQuestions(
                                      tableData.questionsCount,
                                      tableData.rate
                                    )
                                  "
                                  :isLoading="
                                    !!selectedSkillId &&
                                    selectedSkillId == tableData.categoryId
                                  "
                                  label="مهارات لم تتقنها"
                                  @click="openSkillsModal(tableData.categoryId)"
                                />
                              </div>
                              <div class="w-full relative">
                                <app-button
                                  :isAnalytics="true"
                                  :isLoading="
                                    !!toTrainingId &&
                                    toTrainingId == tableData.categoryId
                                  "
                                  :label="'تدرب'"
                                  @click="toTraining(tableData.categoryId)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else
                        class="no-data"
                      >
                        <span>لا يوجد نتائج</span>
                      </div>
                    </template>
                  </div>
                </div>
              </prime-accordion-content>
            </prime-accordion-panel>
          </prime-accordion>
        </div>
      </div>

      <div class="cw-notes">
        <span class="__note_1">
          كيف أحسن مستواي في المهارات التي لم أتقنها؟
        </span>
        <span class="__note_2">
          سيقوم ذكاء اختبارات بزيادة الأسئلة في المهارات التي لم تتقنها لنساعدك
          في تحسينها
        </span>
      </div>

      <lazy-prime-dialog
        id="skills-modal"
        v-model:visible="isOpenSkillsModal"
        class="skills-modal"
        contentClass="skills-modal-content"
        :showHeader="false"
        :modal="true"
        :dismissableMask="false"
        @hide="closeSkillsModal"
      >
        <div class="skills-modal-head">
          <span>مهارات لم تتقنها</span>
          <i
            style="cursor: pointer"
            class="fa fa-close"
            @click="closeSkillsModal"
          ></i>
        </div>
        <div
          v-if="skillsModalData && skillsModalData.length > 0"
          class="skills-modal-list"
        >
          <div
            v-for="(skill, index) of skillsModalData"
            :key="`c-skill_${index}`"
            class="c-skill"
          >
            <custom-image
              :folderName="ImagesFolderName.laws"
              :url="skill"
              :size="ImageSize.sd"
              :ext="ImageExt.webp"
              modalContentClasses="laws-card-modal-img-content"
            />
            <hr v-if="index < skillsModalData.length - 1" />
          </div>
        </div>
        <div
          v-else
          class="no-data"
        >
          <p>لايوجد مهارات لاتتقنها</p>
        </div>
      </lazy-prime-dialog>
    </div>
    <lazy-prime-dialog
      id="advices-modal"
      v-model:visible="isOpenAdvicesModal"
      :modal="true"
      class="advices-modal"
      contentClass="advices-modal-content"
      :showHeader="false"
      :dismissableMask="false"
      @hide="closeAdvicesModal"
    >
      <div class="advices-modal-head">
        <span>نصائح اختبارات</span>
        <i
          style="cursor: pointer"
          class="fa fa-close"
          @click="closeAdvicesModal"
        ></i>
      </div>
      <div
        v-if="advicesModalData"
        class="advices-modal-data"
      >
        <div v-html="advicesModalData"></div>
      </div>
      <div
        v-else
        class="no-data"
      >
        <p>لايوجد نصائح لعرضها</p>
      </div>
    </lazy-prime-dialog>
  </div>
  <div
    v-else
    class="__no_data"
  >
    لا يوجد بيانات
  </div>
</template>

<script lang="ts">
import { deepCloneUtil, deepEqualUtil } from '~/main/utils/lodash.utils';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { getRateLabel, sleepUtil } from '~/main/utils/shared-utils';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { dateDayUi, dateUi, secondsToMMSS } from '~/main/utils/date-utils';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { RouteHelper } from '~/main/utils/route-helper';
import { useApexChartService } from '~/main/services/useApexChartService';
import { useGlobalStore } from '~/main/useGlobalStore';
import { ErrorsRecord } from '~/main/constants/errors.enum';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
import { setDefaultImage } from '~/main/utils/set-default-image.util';
import { Progress } from 'ant-design-vue';

export class examForm {
  subjectId: number | string;
  constructor(subjectId: number | string) {
    this.subjectId = subjectId;
  }
  willDo = false;
  withoutStudentEvaluate = false;
  randomLevel = false;
  isOpen = false;
  tagsIds = [];
  takfeelTagsIds = [];
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  randomQuestionsSettings = [
    {
      categoryId: null,
      questionLevel: 0,
      questionsCount: 24,
    },
  ];
  questionsLevelsMin = 0;
  questionsLevelsMax = 10;
}

const periodList = [
  {
    id: 0,
    label: 'اسبوع',
  },
  {
    id: 1,
    label: 'شهر',
  },
  {
    id: 2,
    label: '3 أشهر',
  },
  {
    id: 3,
    label: '6 أشهر',
  },
];

export default {
  components: { 'a-progress': Progress },
  setup() {
    const globalStore = useGlobalStore();
    const apexChartService = useApexChartService();
    const subscriptionsStore = useSubscriptionsStore();
    const runtimeConfig = useRuntimeConfig();
    const form = ref(new examForm(runtimeConfig.public.defaultSubjectId));
    const imageService = useImageUrl();
    const windowSize = useWindowSize();
    return {
      windowSize,
      apexChartService,
      form,
      userCurrentSub: computed(
        () => subscriptionsStore.state.userCurrentSubVal!
      ),
      runtimeConfig,
      imageService,
      globalStore,
      ...useToastMessage(),
      ...useSetupAuth(),
      ...useSetupRoute(),
    };
  },
  data() {
    return {
      mockData: [
        { date: '2024-08-14T00:00:00+02:00', count: 15 },
        { date: '2024-08-14T00:00:00+03:00', count: 18 },
        { date: '2024-08-12T00:00:00+02:00', count: 5 },
        { date: '2024-08-11T00:00:00+02:00', count: 4 },
        { date: '2024-08-10T00:00:00+02:00', count: 18 },
        { date: '2024-08-09T00:00:00+02:00', count: 14 },
        { date: '2024-08-02T00:00:00+02:00', count: 177 },
        { date: '2024-08-02T00:00:00+02:00', count: 23 },
        { date: '2024-08-01T00:00:00+02:00', count: 26 },
      ],
      activeCollapse: [] as any[],
      selectedFullFilterIds: [] as any[],
      selectedSuccessFilterIds: [] as any[],
      selectedFailFilterIds: [] as any[],
      filterChartData: [] as any[],
      loading: false,

      isLoadingChartData: false,
      periodList,
      chartKey: Symbol(),
      chartLineOptions: {
        chart: {
          type: 'line',
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          parentHeightOffset: 0,
          selection: {
            enabled: false,
          },
        },
        tooltip: {
          cssClass: 'a-y-tooltip',
          style: {
            fontSize: '16px',
            colors: ['#3183f7'],
          },
        },
        colors: ['#46008c'],
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
        legend: {
          show: false,
        },
        stroke: {
          curve: 'straight',
          width: 3,
        },
        xaxis: {
          type: 'category',
          categories: [] as any[],
          tickAmount: 4,
          overwriteCategories: [] as any[],
          labels: {
            show: true,
            rotate: 0,
            minHeight: undefined,
            maxHeight: 120,
            style: {
              cssClass: 'a-x-label',
              fontSize: '12px',
              colors: '#757575',
              fontFamily: 'Roboto , sans-serif',
            },
          },
          // tickAmount: 3,
          tooltip: {
            x: {
              format: 'dd MMM yyyy',
            },
            enabled: false,
          },
          crosshairs: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#f0f1f2',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: true,
          showAlways: false,
          labels: {
            show: true,
            align: 'center',
            style: {
              cssClass: 'a-y-label',
              fontSize: '12px',
              colors: '#757575',
              fontFamily: 'Roboto , sans-serif',
            },
            offsetX: -5,
            offsetY: 0,
            formatter: function (val) {
              return val.toFixed(0);
            },
          },
          crosshairs: {
            show: false,
          },
        },
        grid: {
          show: true,
          borderColor: '#d9c9e6',
        },
        responsive: [
          {
            breakpoint: 992,
            options: {
              xaxis: {
                tickAmount: 2,
                labels: {
                  rotate: 110,
                  style: {
                    fontSize: '12px',
                  },
                },
              },
            },
          },
        ],
      },
      chartLineSeries: [
        {
          name: 'العدد',
          data: [] as any[],
        },
      ],
      chartForm: {
        period: 2,
      },
      isOpenSkillsModal: false,
      skillsModalData: null as any[] | null,
      selectedSkillId: null,
      toTrainingId: null,
      forTeacher: false,
      loadingBtn: null,
      loadingAdvice: false,
      progress: 0,
      intervalId: null as any | null,
      isOpenAdvicesModal: false,
      advicesModalData: null,
    };
  },

  computed: {
    ImageExt() {
      return ImageExt;
    },
    ImageSize() {
      return ImageSize;
    },
    ImagesFolderName() {
      return ImagesFolderName;
    },
    mainData() {
      if (this.$store.state.student.studentAnalytics) {
        if (this.studentIdForTeacher) {
          return this.$store.state.student.studentAnalytics.analyzes;
        }
        return this.$store.state.student.studentAnalytics;
      }
      return null;
    },

    infoData() {
      if (this.mainData) {
        return this.mainData[0];
      }
      return null;
    },

    studentInfo() {
      if (
        this.studentIdForTeacher &&
        this.$store.state.student.studentAnalytics
      ) {
        return this.$store.state.student.studentAnalytics;
      }
      return null;
    },

    chartData() {
      if (this.$store.state.student.studentAnalyticsChart) {
        return this.$store.state.student.studentAnalyticsChart;
      }
      return [];
    },

    analyticsData(): any | null {
      if (this.mainData) {
        return this.mainData.filter((res, index) => index > 0);
      }
      return null;
    },

    fullAnalyticsFilter() {
      return this.analyticsData?.map((k) => {
        return { name: k.categoryName, id: k.categoryId };
      });
    },

    successAnalyticsFilter() {
      return this.successAnalyticsData?.map((k) => {
        return { name: k.categoryName, id: k.categoryId };
      });
    },

    successAnalyticsData() {
      return this.analyticsData?.filter((res) => res.rate > 80);
    },

    fullAnalyticsFilteredData() {
      if (this.selectedFullFilterIds.length > 0) {
        return this.analyticsData?.filter((res) =>
          this.selectedFullFilterIds.includes(res.categoryId)
        );
      }
      return this.analyticsData;
    },

    failAnalyticsFilter() {
      return this.failAnalyticsData?.map((k) => {
        return { name: k.categoryName, id: k.categoryId };
      });
    },

    failAnalyticsData() {
      return this.analyticsData?.filter((res) => res.rate <= 80);
    },

    isStudent() {
      return this.appAuth?.user?.role === UserRoles.student;
    },

    formModel() {
      return deepCloneUtil(this.chartForm);
    },
    studentIdForTeacher() {
      return this.$store.state.student.selectedStudentIdForTeacher;
    },

    noteByAnalyticsValue() {
      return this.analyzeProgressNoteByValue(this.chartData);
    },
  },

  watch: {
    formModel: {
      deep: true,
      handler(val, oldVal) {
        if (deepEqualUtil(val, oldVal)) return;
        this.requestChartData();
      },
    },

    loadingAdvice: {
      handler(newVal) {
        if (newVal) {
          this.startProgressBar();
          return;
        }
        if (this.intervalId) clearInterval(this.intervalId);
      },
    },
  },

  mounted() {
    this.apexChartService.initApexChart();
    if (this.infoData) {
      this.initChart();
    }
  },

  methods: {
    setDefaultImage,
    async requestChartData() {
      try {
        await this.$store.dispatch('student/callStudentAnalyticsChart', {
          categoryId: this.mainData[0].categoryId,
          period: this.chartForm.period,
        });
        this.initChart();
      } catch (e) {
        console.log(e);
      }
    },

    async initChart() {
      try {
        this.isLoadingChartData = true;
        this.filterChartData = this.getChartFilterData(this.chartData);
        this.setChartData(this.filterChartData);
        this.isLoadingChartData = false;
      } catch (e) {
        this.isLoadingChartData = false;
        throw e;
      }
    },

    getChartFilterData(fullData) {
      return fullData.filter((k) => {
        return k.count > 0;
      });
    },

    setChartData(data) {
      this.chartLineOptions.xaxis.categories = [];
      this.chartLineOptions.xaxis.overwriteCategories = [];
      this.chartLineSeries[0].data = [];
      data.forEach((val) => {
        this.chartLineOptions.xaxis.categories.push(dateDayUi(val.date));
        this.chartLineOptions.xaxis.overwriteCategories.push(dateUi(val.date));
        this.chartLineSeries[0].data.push(val.count);
      });
      this.chartKey = Symbol();
    },

    onTrainClickStudent(parentId, childId) {
      this.loadingBtn = childId;
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.trainings],
          parentId,
          childId: childId ?? null,
        },
      });
      setTimeout(() => {
        this.loadingBtn = null;
      }, 5000);
    },

    toAnalyticsPage() {
      if (this.studentIdForTeacher) {
        this.appRouter.push('/user-panel?page=teacherPanel');
        return;
      }
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.analytics],
        },
      });
    },

    notEnoughQuestions(qCount, rate) {
      return rate == 0;
    },

    secondsToMMSS(totalSeconds) {
      return secondsToMMSS(totalSeconds);
    },

    toggleFullFilter(id) {
      const _index = this.selectedFullFilterIds.indexOf(id);
      if (_index != -1) {
        this.selectedFullFilterIds.splice(_index, 1);
      } else {
        this.selectedFullFilterIds.push(id);
      }
    },

    toggleSuccessFilter(id) {
      const _index = this.selectedSuccessFilterIds.indexOf(id);
      if (_index != -1) {
        this.selectedSuccessFilterIds.splice(_index, 1);
      } else {
        this.selectedSuccessFilterIds.push(id);
      }
    },

    toggleFailFilter(id) {
      const _index = this.selectedFailFilterIds.indexOf(id);
      if (_index != -1) {
        this.selectedFailFilterIds.splice(_index, 1);
      } else {
        this.selectedFailFilterIds.push(id);
      }
    },

    getRateLabel(rate) {
      return getRateLabel(rate);
    },

    closeSkillsModal() {
      this.isOpenSkillsModal = false;
    },

    closeAdvicesModal() {
      this.isOpenAdvicesModal = false;
    },

    async openSkillsModal(id) {
      try {
        this.selectedSkillId = id;
        await this.$axios
          .get(`dashboard/skillsNotMastered/${id}`)
          .then(({ data: res }) => {
            this.skillsModalData = res;
            this.isOpenSkillsModal = true;
          })
          .catch((e) => {
            console.log('skillsModal: ' + e);
          });
        this.selectedSkillId = null;
      } catch (e) {
        console.log('skillsModalCatch: ' + e);
        this.selectedSkillId = null;
      }
    },

    getImageUrl(url) {
      return this.imageService.staticImageUrl(url);
    },

    analyzeProgressNoteByValue(data) {
      if (
        !data ||
        data.length === 0 ||
        data.every((item) => item.count === 0)
      ) {
        return 'لا يوجد قيم';
      }

      const lastIndex = data.length - 1;
      const lastValue = data[lastIndex].count;

      let previousValue = null;
      for (let i = lastIndex - 1; i >= 0; i--) {
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
    },

    async toTraining(catId) {
      try {
        if (
          this.userCurrentSub.remainTrainingCount <= 0 ||
          this.userCurrentSub.remainTrainingCountPerDay <= 0
        ) {
          this.appRouter.push({ path: RouteHelper.userPanelTraining() });
          return;
        }
        this.toTrainingId = catId;
        this.form.randomQuestionsSettings[0].categoryId = catId;
        try {
          const { data: res } = await this.$axios.post(
            'studentsExam/customFromTags',
            this.form
          );
          if (res) {
            this.$store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', res);
            this.appRouter.push(`/student/training/${res.id}`);
          }
          this.toTrainingId = null;
        } catch (error: any) {
          if (error.response?.status == 400) {
            if (error.response.data.errorType == 6) {
              this.globalStore.patchState({ showBlockModal: true });
            } else {
              this.showError({
                life: 5000,
                summary: ErrorsRecord[error.response.data.errorType],
              });
            }
          } else {
            this.showError();
          }
          this.toTrainingId = null;
        }
      } catch (e) {
        this.showError({
          life: 2500,
          summary: 'عذراً حدث خطأ في إنشاء التدريب ... يرجى إعادة المحاولة',
        });
        await sleepUtil(1000);
        this.toTrainingId = null;
        console.log(e);
      }
    },

    resetExamForm() {
      this.form = new examForm(this.runtimeConfig.public.defaultSubjectId);
    },

    goBack() {
      this.appRouter.go(-1); // أو this.appRouter.back();
    },

    startProgressBar() {
      const duration = 30;
      const step = 0.1;

      this.progress = 0;

      this.intervalId = setInterval(() => {
        this.progress += step;
        if (this.progress >= duration) {
          clearInterval(this.intervalId);
          this.progress = duration;
        }
      }, step * 1000);
    },

    getAdvices() {
      try {
        this.loadingAdvice = true;
        const catId = this.infoData.categoryId;
        this.$axios
          .get(`dashboard/getExamsAdvicesForStudent/${catId}`)
          .then(({ data: res }) => {
            this.advicesModalData = res;
            this.isOpenAdvicesModal = true;
          })
          .catch((e) => {
            console.log('advicesAPI: ' + e);
          })
          .finally(() => {
            this.loadingAdvice = false;
          });
      } catch (e) {
        console.log('advicesAPI: ' + e);
        this.loadingAdvice = false;
      }
    },
  },
};
</script>
<style lang="scss" src="./analytics-id-page.scss" scoped></style>
<style lang="scss">
@import '@/assets/scss/mixin';

#skills-modal {
  max-width: 100vw;
  width: 680px !important;
  max-height: 540px;
  .skills-modal-content {
    border-radius: 15px;
    padding: 18px 0 0;
    .skills-modal-head {
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 20px;
        font-weight: bold;
        color: var(--purple-8c);
      }
      i {
        font-size: 24px;
        color: var(--purple-8c);
        cursor: pointer;
      }
    }
    .skills-modal-list {
      margin-top: 10px;
      display: grid;
      row-gap: 5px;
      padding: 0 6px;
      max-height: 483px;
      overflow: auto;
      img {
        width: 100%;
        height: auto;
      }
      hr {
        margin: 10px;
        border-top: 2px solid #b7b7b7;
      }
    }
    .no-data {
      min-height: 250px;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      p {
        margin: 0;
        font-size: 20px;
        font-weight: bold;
        color: var(--purple-8c);
      }
    }
  }

  @include mobile-down() {
    width: 340px;
    margin-left: auto;
    margin-right: auto;
    .skills-modal-list {
      margin-top: 15px;
      padding: 0 3px;
    }
  }
}

#advices-modal {
  max-width: 100vw;
  width: 680px !important;
  .advices-modal-content {
    border-radius: 15px;
    padding: 18px 0 0;
    .advices-modal-head {
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 20px;
        font-weight: bold;
        color: var(--purple-8c);
      }
      i {
        font-size: 24px;
        color: var(--purple-8c);
        cursor: pointer;
      }
    }
    .advices-modal-data {
      padding: 30px 10px;
    }
    .no-data {
      min-height: 250px;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      p {
        margin: 0;
        font-size: 20px;
        font-weight: bold;
        color: var(--purple-8c);
      }
    }
  }

  @include mobile-down() {
    width: 95vw;
    margin-left: auto;
    margin-right: auto;
  }
}

.a-y-tooltip {
  .apexcharts-tooltip-title {
    padding: 5px;
  }
  .apexcharts-tooltip-series-group {
    justify-content: flex-start;
    padding: 5px;
    column-gap: 5px;
  }
}
</style>
