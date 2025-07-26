<template>
  <user-panel-layout contentClass="!pb-0">
    <div class="training-plan-page">
      <template v-if="loadingPage">
        <app-loading-spinner :showSpinner="true" />
      </template>
      <template v-else>
        <template v-if="info && detail">
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
