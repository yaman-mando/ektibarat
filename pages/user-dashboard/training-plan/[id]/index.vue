<template>
  <user-panel-layout contentClass="!pb-0">
    <div class="training-plan-page">
      <template v-if="loadingPage">
        <app-loading-spinner :showSpinner="true" />
      </template>
      <template v-else>
        <template v-if="info && detail">
          <h1 class="text-[24px] text-[#0266D6] font-bold mb-[10px]">
            خطتي التدريبية
          </h1>
          <div class="z-w">
            <accordion-group>
              <disclosure-group
                :defaultOpen="true"
                :onlyOneOpen="true"
                :index="1"
                contentClass="!p-0"
              >
                <template #right>
                  <div
                    class="flex justify-between w-[705px] max-w-[90vw] items-center justify-self-center p-2"
                  >
                    <div class="flex gap-x-[5px] items-center">
                      <img
                        src="/images/calendar.png"
                        alt="icon"
                      />
                      <span class="text-[18px] font-bold text-orange-39">
                        معلومات الخطة
                      </span>
                    </div>
                  </div>
                </template>
                <div class="a-c">
                  <div class="ac-item">
                    <span class="ac-item-l">تاريخ البداية</span>
                    <app-date-picker
                      :startDate="form.startDate!"
                      :singleType="true"
                      class="c-date"
                      :min="today"
                      :isDisabled="true"
                    />
                  </div>
                  <div class="ac-item">
                    <span class="ac-item-l">تاريخ الاختبار المتوقع</span>
                    <app-date-picker
                      :startDate="form.examDate!"
                      :singleType="true"
                      class="c-date"
                      :min="minStartDate"
                      @updateDate="examDateChange($event)"
                    />
                  </div>
                  <div class="ac-item">
                    <span class="ac-item-l">الدرجة المطلوبة</span>
                    <select-number-popover
                      v-model="form.neededDegree!"
                      :start="85"
                      :end="100"
                      :step="1"
                    />
                  </div>
                </div>
                <div class="ac-sep"></div>
                <div class="t-w">
                  <div class="qt-a">
                    <div class="qt-a-lab">
                      <strong>مدة التدريب الأسبوعية</strong>
                      <span>
                        (المتوقعة وفق الخطة)
                        <span class="hidden lg:inline-block">:</span>
                      </span>
                    </div>
                    <div class="qt-a-co">
                      <template v-if="loadingRequiredHours">
                        <app-spinner />
                      </template>
                      <template v-else>
                        <strong>{{ requiredHours }}</strong>
                      </template>
                      <span>ساعة في الأسبوع</span>
                    </div>
                  </div>
                  <app-button
                    class="sa-button"
                    colorType="blue"
                    label="حفظ"
                    :isDisabled="loadingForm"
                    @click="savePlan"
                  />
                </div>
              </disclosure-group>
            </accordion-group>
            <div class="st2">
              <div
                class="bg-white shadow-custom rounded-[8px] p-[20px_15px] grid"
              >
                <!-- First line -->
                <div
                  class="flex items-center justify-between h-[50px] mb-[24px]"
                >
                  <div class="flex flex-col items-start">
                    <span
                      class="text-blue-d6 font-bold text-[16px] 2xl:text-[18px]"
                    >
                      الالتزام بالخطة
                    </span>
                    <span class="flex gap-x-[5px] items-center">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="4"
                          cy="4"
                          r="4"
                          :fill="levelColor"
                        />
                      </svg>
                      <span
                        class="text-[14px] 2xl:text-[16px] font-medium"
                        :style="{ color: levelColor }"
                      >
                        {{ level }}
                      </span>
                    </span>
                  </div>
                  <div class="flex flex-col items-center">
                    <span
                      class="text-[40px] 2xl:text-[48px] leading-[42px] font-bold text-dark-63"
                    >
                      <span>{{ detail.totalPercentage }}</span>
                      <span class="text-[26px] 2xl:text-[30px]">%</span>
                    </span>
                    <span
                      class="text-gray-8f text-[10px] 2xl:text-[12px] font-medium"
                    >
                      {{ formatTime(detail.timeDone) }} |
                      {{ formatTime(detail.timeRequired) }}
                    </span>
                  </div>
                </div>

                <div class="flex">
                  <table class="az-table">
                    <tr>
                      <td>مدة التدريب المــنــجــزة:</td>
                      <td>{{ formatTime(detail.timeDone) }} ساعة</td>
                    </tr>
                    <tr>
                      <td>مدة التدريب المطلوبة:</td>
                      <td>{{ formatTime(detail?.timeRequired) }} ساعة</td>
                    </tr>
                  </table>
                </div>

                <span
                  class="text-start text-[#FF6A39] text-[14px] mt-[10px] font-bold"
                >
                  نسب الالتزام السابقة
                </span>
                <hr class="border-[#BCCCDB] border-t-[2px] mb-[10px]" />
                <div
                  class="flex flex-wrap gap-y-[10px] justify-around items-center h-[30px]"
                >
                  <div
                    class="flex items-center gap-x-[8px] text-right pr-[5px] border-r-[3px] border-r-purple-e0"
                  >
                    <div
                      class="font-bold text-[24px] 2xl:text-[28px] text-dark-63"
                    >
                      {{ detail.lastMonth.percentage }}%
                    </div>
                    <div
                      class="flex flex-col items-center text-[12px] 2xl:text-[14px] font-medium text-gray-8f"
                    >
                      <span>آخر الشهر</span>
                      <span>
                        {{ formatTime(detail.lastMonth.timeDone) }} |
                        {{ formatTime(detail.lastMonth.timeRequired) }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-x-[8px] text-right pr-[5px] border-r-[3px] border-r-purple-e0"
                  >
                    <div
                      class="font-bold text-[24px] 2xl:text-[28px] text-dark-63"
                    >
                      {{ detail.lastWeek.percentage }}%
                    </div>
                    <div
                      class="flex flex-col items-center text-[12px] 2xl:text-[14px] font-medium text-gray-8f"
                    >
                      <span>آخر أسبوع</span>
                      <span>
                        {{ formatTime(detail.lastWeek.timeDone) }} |
                        {{ formatTime(detail.lastWeek.timeRequired) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="items-start bg-white shadow-custom rounded-[8px] p-[20px_15px] grid"
              >
                <div class="flex items-center justify-start gap-[10px]">
                  <img
                    src="/images/commit-icon.png"
                    alt="commit"
                  />
                  <span class="text-[18px] font-bold text-[#0266D6]">
                    مخطط الالتزام
                  </span>
                </div>
                <div
                  class="progress-a-bar mt-[15px] h-[84px] grid items-center relative"
                >
                  <div
                    style="box-shadow: 2px 2px 4px 0px #00000026 inset"
                    class="relative h-[20px] bg-[#F0F0F0]"
                  >
                    <!-- Green bar -->
                    <div
                      style="
                        background: linear-gradient(
                          90deg,
                          #58cc02 0%,
                          #4e9818 100%
                        );
                      "
                      class="absolute top-0 bottom-0 right-0"
                      :style="{ width: `${detail.percentageDone}%` }"
                    ></div>

                    <!-- Orange bar -->
                    <div
                      style="
                        background: linear-gradient(
                          90deg,
                          #fdc830 0%,
                          #ce9800 100%
                        );
                      "
                      class="absolute top-0 bottom-0"
                      :style="{
                        width: `${detail.percentageRequired - detail.percentageDone}%`,
                        right: `${detail.percentageDone}%`,
                      }"
                    ></div>
                  </div>

                  <!-- "You are here" indicator -->
                  <div
                    :style="{
                      right: `calc(${detail.percentageDone}% - 30px)`,
                    }"
                    class="absolute -top-[10px] h-[27px] grid gap-y-[5px] justify-items-center w-[40px]"
                  >
                    <div
                      class="text-[10px] 2xl:text-[12px] text-black font-medium"
                    >
                      أنت هنا
                    </div>
                    <svg
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 14L0 0L16 0L8 14Z"
                        fill="#00C48C"
                      />
                    </svg>
                  </div>

                  <!-- Target indicator -->
                  <div
                    :style="{
                      right: `calc(${detail.percentageRequired}% - 45px)`,
                    }"
                    class="absolute bottom-0 h-[27px] grid gap-y-[5px] justify-items-center w-[80px]"
                  >
                    <svg
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 0L16 14H0L8 0Z"
                        fill="#EAB316"
                      />
                    </svg>
                    <div
                      class="text-[10px] 2xl:text-[12px] h-[8px] text-black font-medium"
                    >
                      الإنجاز المقرر
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section
              id="recommendations"
              class="text-right bg-white dark:bg-gray-800 rounded-[8px] shadow-custom overflow-hidden"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-4 h-[74px] py-[15px]"
              >
                <div class="flex items-center gap-[5px]">
                  <div
                    class="w-[36px] h-[36px] rounded-full flex items-center justify-center"
                    style="background-color: #e3f0ff"
                  >
                    <img
                      src="/images/svg/lightbulb.svg"
                      alt="icon"
                      class="w-[14px] h-auto"
                    />
                  </div>

                  <span
                    class="ml-2 text-orange-39 font-bold text-base md:text-[18px]"
                  >
                    توصيات اختبارات
                  </span>
                </div>
              </div>

              <div
                v-if="isOpenRecommendations"
                class="h-px w-full"
                style="background-color: #bcccdb"
              ></div>

              <transition name="accordion">
                <div
                  v-show="isOpenRecommendations"
                  class="px-[15px] py-[25px]"
                >
                  <div class="mb-[20px]">
                    <h3
                      class="text-blue-d6 dark:text-blue-400 font-bold text-[20px] mb-[15px]"
                    >
                      {{ detail?.recommendations.title }}
                    </h3>
                    <ul
                      class="list-none text-[16px] font-medium text-dark-63 dark:text-gray-100 space-y-1"
                      style="line-height: 28px"
                    >
                      <li
                        v-for="(item, index) in detail?.recommendations.advices"
                        :key="index"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </transition>
            </section>
          </div>
        </template>
      </template>
    </div>
  </user-panel-layout>
</template>
<script lang="ts">
import UserPanelLayout from '~/layouts/user-panel-layout.vue';
import type {
  TrainingPlanDetailDataModel,
  TrainingPlanInfoDataModel,
} from '~/main/modules/training-plan/data-access/training-plan.model';
import { addDays } from 'date-fns';
import { webUserTrainingPlan } from '~/main/utils/web-routes.utils';

export default {
  components: { UserPanelLayout },
  data() {
    return {
      isOpenRecommendations: true,
      loadingRequiredHours: false,
      requiredHours: null as null | number,
      loadingPage: true,
      info: null as null | TrainingPlanInfoDataModel,
      detail: null as null | TrainingPlanDetailDataModel,
      form: {
        startDate: null as string | null,
        examDate: null as string | null,
        neededDegree: null as number | null,
      },
      loadingForm: false,
    };
  },
  computed: {
    levelColor() {
      switch (this.level) {
        case 'جيد':
        case 'ممتاز':
          return '#58CC02';
        case 'متوسط':
          return '#EAB316';
        case 'ضعيف':
          return '#F04438';
        default:
          return '#999999';
      }
    },
    level() {
      if (!this.detail) return '';
      if (this.detail.percentageDone >= 95) return 'ممتاز';
      if (this.detail.percentageDone >= 80) return 'جيد';
      if (this.detail.percentageDone >= 50) return 'متوسط';
      return 'ضعيف';
    },
    minStartDate() {
      if (!this.form.startDate) return null;
      return addDays(this.form.startDate, 10);
    },
    today() {
      return new Date();
    },
  },
  mounted() {
    this.initPage();
  },
  methods: {
    formatTime(minutes) {
      const hrs = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    },
    async savePlan() {
      try {
        this.loadingForm = true;
        const res = await this.$axios.put('trainingPlansInfo', {
          startDate: this.form.startDate,
          examDate: this.form.examDate,
          neededDegree: this.form.neededDegree,
        });
      } finally {
        this.loadingForm = false;
      }
    },
    async getRequiredHours() {
      try {
        this.loadingRequiredHours = true;
        const res = await this.$axios.post(`trainingPlansInfo/requiredHours`, {
          startDate: this.form.startDate,
          examDate: this.form.examDate,
        });
        this.requiredHours = res.data.requiredHours;
      } finally {
        this.loadingRequiredHours = false;
      }
    },
    examDateChange(e: any) {
      this.form.examDate = e;
      this.getRequiredHours();
    },
    async initPage() {
      try {
        this.loadingPage = true;
        const { data: info } = await this.$axios.get('trainingPlansInfo');
        const { data: detail } = await this.$axios.get(
          'trainingPlansInfo/details'
        );

        this.info = info;
        this.detail = detail;

        this.form.startDate = this.info?.startDate ?? null;
        this.form.examDate = this.info?.examDate ?? null;
        this.form.neededDegree = this.info?.neededDegree ?? null;
        this.requiredHours = this.info?.requiredHours ?? null;
      } finally {
        this.loadingPage = false;
      }
    },
  },
};
</script>
<style lang="scss" src="./training-plan-id.scss"></style>
