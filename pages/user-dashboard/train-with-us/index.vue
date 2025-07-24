<template>
  <user-panel-layout contentClass="!pb-0">
    <template #top-right>
      <app-button
        label="رجوع للخلف"
        iconStartClass="fa fa-chevron-right"
        variant="clear"
        size="md"
      />
    </template>

    <div class="train-with-us space-y-10">
      <div
        v-if="!showStepsSection"
        class="qw"
      >
        <h1>كيف تبي تتدرب معنا؟</h1>
        <div class="qd-grid">
          <div
            class="qd-item"
            @click="smartClick"
          >
            <img
              class="qd-badge"
              src="/images/badge.png"
              alt=""
            />
            <div class="qd-item__img">
              <img
                src="/images/robot-head.png"
                alt=""
              />
            </div>
            <div class="qd-item__content">
              <span class="qd-item-m1">مدربك الذكي</span>
              <span class="qd-item-m2">
                روبوت ذكي خاص فيك يخاويك ويفهمك ويضبط لك خطة تدريب ويتابعك فيها
                لتحصل على أعلى درجة في أقل وقت
              </span>
            </div>
          </div>
          <div class="qd-item blue">
            <img
              class="qd-badge"
              src="/images/badge-blue.png"
              alt=""
            />
            <div class="qd-item__img">
              <img
                src="/images/self-train.png"
                alt=""
              />
            </div>
            <div class="qd-item__content">
              <span class="qd-item-m1">التدريب الشخصي</span>
              <span class="qd-item-m2">
                درب نفسك بنفسك بإمكانك اختيار الأقسام وتخصيص الأسئلة تقدمك يعتمد
                على التزامك واجتهادك
              </span>
            </div>
          </div>
          <div class="qd-item orange">
            <img
              class="qd-badge hidden"
              src="/images/badge-blue.png"
              alt=""
            />
            <div class="qd-item__img">
              <img
                src="/images/simu.png"
                alt=""
              />
            </div>
            <div class="qd-item__content">
              <span class="qd-item-m1">محاكي الاختبار</span>
              <span class="qd-item-m2">
                اختبار مشابه لاختبارك الحقيقي في قياس يحتوي على 120 سؤال في
                اللفظي والكمي مدة الاختبار: 120 دقيقة
              </span>
            </div>
          </div>
        </div>
      </div>
      <template v-if="showStepsSection">
        <div class="st-q">
          <!--        top-->
          <div class="st-q-top">
            <i
              class="fa fa-chevron-right st-q-icon"
              @click="previousStep"
            ></i>
            <app-progress-bar
              height="12px"
              :showLabel="false"
              :max="maxSteps"
              :value="form.currentStep"
            />
          </div>
          <!--        content-->
          <div class="st-q-content">
            <!--          date content-->
            <div class="st-q-date-content">
              <template v-if="form.currentStep === 1">
                <h1 class="st-q-title">متى أوّل يوم بتبدأ فيه دراسة؟</h1>
                <app-date-picker
                  :startDate="form.date!"
                  :singleType="true"
                  class="c-date"
                  :min="today"
                  @updateDate="dateChange($event)"
                />
                <span
                  v-if="dateMessage"
                  class="st-q-note"
                >
                  {{ dateMessage }}
                </span>
                <app-button
                  label="التالي"
                  iconEndClass="fa fa-chevron-left"
                  colorType="blue"
                  :isDisabled="!form.date"
                  @click="submitFirst"
                />
              </template>
              <template v-if="form.currentStep === 2">
                <h1 class="st-q-title step-2">
                  متى تتوقع تاريخ اختبارك الجاي؟
                </h1>
                <span class="st-q-title-meta">
                  بنستخدم هذا التاريخ عشان نحدد مدة دراستك
                </span>
                <app-date-picker
                  :startDate="form.examDate!"
                  :singleType="true"
                  class="c-date"
                  :min="minStartDate"
                  @updateDate="examDateChange($event)"
                />
                <span
                  v-if="dateMessage"
                  class="st-q-note"
                >
                  {{ requiredHoursMessage }}
                </span>
                <app-button
                  label="التالي"
                  iconEndClass="fa fa-chevron-left"
                  colorType="blue"
                  :isDisabled="!form.examDate"
                  :isLoading="loadingRequiredHours"
                  @click="submit2"
                />
              </template>
              <template v-if="form.currentStep === 3">
                <h1 class="st-q-title step-2">كم الدرجة اللي تطمح تجيبها؟</h1>
                <span class="st-q-title-meta">
                  بنعلمك متى تصير جاهز تختبر وتجيب الدرجة اللي تبيها
                </span>
                <select-number-popover
                  v-model="form.neededDegree!"
                  :start="85"
                  :end="100"
                  :step="1"
                />
                <app-button
                  label="التالي"
                  iconEndClass="fa fa-chevron-left"
                  colorType="blue"
                  :isDisabled="!form.neededDegree"
                  @click="submit3"
                />
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </user-panel-layout>
</template>
<script lang="ts">
import UserPanelLayout from '~/layouts/user-panel-layout.vue';
import { addDays, isToday } from 'date-fns';
import { dateUi } from '~/main/utils/date-utils';
export default {
  components: {
    UserPanelLayout,
  },
  data() {
    return {
      showStepsSection: true,
      requiredHours: null as number | null,
      loadingRequiredHours: false,
      form: {
        currentStep: 1,
        date: null as string | null,
        examDate: null as string | null,
        neededDegree: null as number | null,
      },
    };
  },
  computed: {
    requiredHoursMessage() {
      if (!this.requiredHours) return null;
      return `تحتاج تتدرب معنا (${this.requiredHours}) ساعات كل أسبوع`;
    },
    maxSteps() {
      return 4;
    },
    minStartDate() {
      if (!this.form.date) return null;
      return addDays(this.form.date, 10);
    },
    today() {
      return new Date();
    },
    dateMessage() {
      if (!this.form.date) return null;

      const val = isToday(this.form.date) ? 'اليوم' : dateUi(this.form.date);

      return `ستبدأ خطتك من: ${val}`;
    },
  },
  methods: {
    submit3() {},
    async getRequiredHours() {
      try {
        this.loadingRequiredHours = true;
        const res = await this.$axios.post(`trainingPlansInfo/requiredHours`, {
          startDate: this.form.date,
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
    previousStep() {
      if (this.form.currentStep > 1) {
        this.form.currentStep--;
      }
    },
    submitFirst() {
      this.form.currentStep++;
    },
    submit2() {
      this.form.currentStep++;
    },
    dateChange(e: any) {
      this.form.date = e;
      this.form.examDate = null;
    },
    smartClick() {
      this.showStepsSection = true;
    },
  },
};
</script>
<style lang="scss" src="./train-with-us.scss"></style>
