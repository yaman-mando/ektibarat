<template>
  <user-panel-wrapper contentClass="!pb-0">
    <!--    <template #top-right>-->
    <!--      <app-button-->
    <!--        label="رجوع للخلف"-->
    <!--        iconStartClass="fa fa-chevron-right"-->
    <!--        variant="clear"-->
    <!--        size="md"-->
    <!--      />-->
    <!--    </template>-->

    <div class="train-with-us space-y-10">
      <div
        v-if="!showStepsSection"
        class="qw w-full lg:w-[min(1060px,100vw)]"
      >
        <h1>كيف تبي تتدرب معنا؟</h1>
        <div class="qd-grid">
          <div
            class="qd-item"
            @click="smartClick"
          >
            <template v-if="appAuth.notSubscribedUser">
              <service-block />
              <img
                class="absolute w-[24px] top-[10px] left-[10px]"
                src="/images/icons/lock-icon.png"
                alt="lock"
              />
            </template>

            <img
              class="qd-badge"
              src="/images/badge.png"
              alt=""
            />
            <span
              class="absolute right-[0px] top-[15px] rotate-[45deg] text-[12px] text-[#fff]"
            >
              الافضل
            </span>
            <div class="qd-item__img">
              <img
                src="/images/robot-head.png"
                alt=""
              />
            </div>
            <div class="qd-item__content">
              <span class="qd-item-m1">مدربك الذكي</span>
              <span class="qd-item-m2">
                روبوت ذكي خاص فيك يخاويك ويفهمك
                <br />
                ويضبط لك خطة تدريب ويتابعك فيها
                <br />
                لتحصل على أعلى درجة في أقل وقت
              </span>
            </div>
          </div>
          <nuxt-link
            :to="webUserPanelTraining()"
            class="qd-item blue"
          >
            <img
              class="qd-badge"
              src="/images/badge-blue.png"
              alt=""
            />
            <span
              class="absolute right-[4px] top-[14px] rotate-[45deg] text-[12px] text-[#fff]"
            >
              مجاني
            </span>
            <div class="qd-item__img">
              <img
                src="/images/self-train.png"
                alt=""
              />
            </div>
            <div class="qd-item__content">
              <span class="qd-item-m1">التدريب الشخصي</span>
              <span class="qd-item-m2">
                درب نفسك بنفسك
                <br />
                بإمكانك اختيار الأقسام وتخصيص الأسئلة
                <br />
                تقدمك يعتمد على التزامك واجتهادك
              </span>
            </div>
          </nuxt-link>
          <nuxt-link
            :to="userPanelExamPath"
            class="qd-item orange"
          >
            <template v-if="appAuth.notSubscribedUser">
              <service-block />
              <img
                class="absolute w-[24px] top-[10px] left-[10px]"
                src="/images/icons/lock-icon.png"
                alt="lock"
              />
            </template>
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
                اختبار مشابه لاختبارك الحقيقي في قياس
                <br />
                يحتوي على 120 سؤال في اللفظي والكمي
                <br />
                مدة الاختبار: 120 دقيقة
              </span>
            </div>
          </nuxt-link>
        </div>
      </div>
      <template v-if="showStepsSection">
        <div class="st-q">
          <!--        top-->
          <div class="st-q-top">
            <i
              class="fa fa-arrow-right st-q-icon"
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
            <div :class="`st-q-date-content relative step-${form.currentStep}`">
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
                  @click="submitRequiredDegree"
                />
                <div class="hidden absolute lg:flex bottom-[0px] left-[20px]">
                  <span
                    class="flex !text-center relative -left-[50px] -top-[50px] w-[220px] h-[90px] items-center justify-center text-[18px] rounded-[8px] bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.15)]"
                  >
                    كفو يا بطل! هذا الطموح
                    <br />
                    ولا بلاش
                  </span>
                  <img
                    class="flex z-10 w-[155px] h-[155px] justify-center items-center flex-shrink-0 aspect-[1/1]"
                    src="/images/robot-target.png"
                    alt="target"
                  />
                </div>
              </template>
              <template v-if="form.currentStep === 3">
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
                  @click="submit3"
                />
              </template>
              <template v-if="form.currentStep === 4">
                <h1 class="st-q-title step-2">معلومات خطتك</h1>
                <span class="st-q-title-meta q1">
                  تقدر تعدل خطتك الآن بالرجوع للخلف، أو تعدلها بعدين من خلال
                  بيانات الخطة
                </span>
                <table class="plan-tb">
                  <tbody>
                    <tr>
                      <td>تاريخ بداية الخطة</td>
                      <td>{{ dateUi(form.date) }}</td>
                    </tr>
                    <tr>
                      <td>تاريخ الاختبار المتوقع</td>
                      <td>{{ dateUi(form.examDate) }}</td>
                    </tr>
                    <tr>
                      <td>الدرجة المطلوبة</td>
                      <td>{{ form.neededDegree }}</td>
                    </tr>
                    <tr>
                      <td>ساعات التدريب الأسبوعية تقديريا</td>
                      <td>{{ requiredHours }} ساعات</td>
                    </tr>
                  </tbody>
                </table>
                <app-button
                  label="تثبيت الخطة"
                  colorType="blue"
                  :isLoading="loadingForm"
                  @click="showConfirm"
                />
              </template>
            </div>
          </div>
        </div>
      </template>
      <confirm-plan
        v-model:show="isShownConfirm"
        @continue="submit4"
      />
    </div>
  </user-panel-wrapper>
</template>
<script lang="ts">
import { addDays, isToday } from 'date-fns';
import { dateUi } from '~/main/utils/date-utils';
import ConfirmPlan from '~/components/user/confirm-plan.vue';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import {
  webUserPanelTraining,
  webUserPanelTrainingWithQuery,
  webUserSteps,
  webUserTrainingPlan,
} from '~/main/utils/web-routes.utils';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { UserPlanSubscribedEnum } from '~/core/auth/constants/user-plan-subscribed.enum';
export default {
  components: {
    ConfirmPlan,
  },
  setup() {
    definePageMeta({
      layout: 'empty-layout',
    });
    return {
      ...useSetupRoute(),
      ...useSetupAuth(),
    };
  },
  data() {
    return {
      isShownConfirm: false,
      showStepsSection: false,
      requiredHours: null as number | null,
      loadingRequiredHours: false,
      loadingForm: false,
      form: {
        currentStep: 1,
        date: new Date().toISOString() as string | null,
        examDate: null as string | null,
        neededDegree: null as number | null,
      },
    };
  },
  computed: {
    userPanelExamPath() {
      return webUserPanelTrainingWithQuery({
        page: UserPanelItemsRecord[UserPanelItems.exams],
      });
    },
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
    webUserPanelTraining,
    dateUi,
    async submitRequiredDegree() {
      this.form.currentStep++;
    },
    showConfirm() {
      this.isShownConfirm = true;
    },
    async submit4() {
      try {
        this.loadingForm = true;
        const res = await this.$axios.put('trainingPlansInfo', {
          startDate: this.form.date,
          examDate: this.form.examDate,
          neededDegree: this.form.neededDegree,
        });
        this.isShownConfirm = false;
        const id = res.data.id;
        this.appRouter.push(webUserTrainingPlan());
      } finally {
        this.loadingForm = false;
      }
    },
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
      } else {
        this.showStepsSection = false;
      }
    },
    submitFirst() {
      this.form.currentStep++;
    },
    submit3() {
      this.form.currentStep++;
    },
    dateChange(e: any) {
      this.form.date = e;
      this.form.examDate = null;
    },
    smartClick() {
      if (
        [
          UserPlanSubscribedEnum.Finished,
          UserPlanSubscribedEnum.Subscribed,
        ].some((val) => val === this.appAuth.user.planSubscribed)
      ) {
        this.appRouter.push(webUserSteps());
      }

      if (
        this.appAuth.user.planSubscribed ===
        UserPlanSubscribedEnum.NotSubscribed
      ) {
        this.showStepsSection = true;
      }
    },
  },
};
</script>
<style lang="scss" src="./train-with-us.scss"></style>
