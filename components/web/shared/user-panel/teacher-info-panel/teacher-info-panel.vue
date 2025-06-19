<template>
  <div v-if="file1PanelStatic">
    <div
      v-if="activePart === panelParts.main"
      class="teachers-part relative"
    >
      <app-overlay v-if="isLoadingData" />
      <!-- web ui    -->
      <span class="m-title">لوحة المدرب</span>

      <div class="co-code">
        <div class="r-part">
          <span class="t-1">
            الكود الخاص بي
            <span class="__red">{{ appAuth.user.id }}</span>
          </span>
        </div>
        <div
          v-if="file1PanelStatic"
          class="l-part"
        >
          <span>
            {{ file1PanelStatic['tb-t1'] }}
            <br />
            {{ file1PanelStatic['tb-t2'] }}
            <br />
            {{ file1PanelStatic['tb-t3'] }}
          </span>
        </div>
      </div>

      <!--  co-processing-student info  -->

      <prime-accordion v-model:value="expandState">
        <prime-accordion-panel
          v-if="prStudentData.length > 0"
          class="co-processing-student st-tab"
          :value="expandStateValues.prStudentCollapse"
        >
          <prime-accordion-header>
            <div class="tab-header">
              <span class="">
                طلاب قيد المتابعة (
                <span class="__red">{{ prStudentData.length }}</span>
                )
              </span>
            </div>
          </prime-accordion-header>
          <prime-accordion-content class="pr-student-collapse">
            <div class="tab-contents">
              <template v-if="!windowSize.isMobileSize">
                <prime-data-table
                  style="margin-top: 23px"
                  :value="prStudentData"
                  responsiveLayout="scroll"
                  stripedRows
                  class="students-table"
                >
                  <prime-column
                    v-for="field in fields"
                    :key="field.key"
                    :field="field.key"
                    :header="field.label"
                    :bodyClass="field.key"
                  >
                    <!-- Answers Column -->
                    <template
                      v-if="field.key === 'answers'"
                      #body="{ data }"
                    >
                      <div class="__ans">
                        <span class="answer-co">
                          {{ data.statistics.correctQuestionsCount }}
                        </span>
                        <span class="hr"></span>
                        <span class="answer-wr __red">
                          {{ data.statistics.wrongQuestionsCount }}
                        </span>
                      </div>
                    </template>

                    <!-- Rate Column -->
                    <template
                      v-else-if="field.key === 'rate'"
                      #body="{ data }"
                    >
                      <template v-if="data.statistics.showRate">
                        <app-progress-bar
                          v-if="data.statistics.rate > 0"
                          :value="data.statistics.rate"
                        />
                        <span v-else>عدد الاسئلة غير كافي</span>
                      </template>
                      <div
                        v-else
                        class="is-locked"
                      >
                        <service-lock />
                        <span>مغلق</span>
                      </div>
                    </template>

                    <!-- Control Column -->
                    <template
                      v-else-if="field.key === 'control'"
                      #body="{ data }"
                    >
                      
                        <app-button
                          v-if="data.id"
                          size="md"
                          variant="outline"
                          class="outline-btn action"
                          label="تحليل"
                          @click="toAnalytics(data.studentId)"
                        />
                        <app-button
                          size="sm"
                          variant="clear"
                          colorType="warn"
                          :noLabel="true"
                          label=""
                          class="outline-btn trash"
                          iconStartClass="fa fa-trash"
                          @click="toDelete(data.id)"
                        />
                        <app-button
                          v-if="data.phoneNumber"
                          label=""
                          variant="clear"
                          :noLabel="true"
                          class="outline-btn whatsapp"
                          iconStartClass="fa fab fa-whatsapp"
                          size="sm"
                          colorType="success"
                          @click="toWhatsApp(data.phoneNumber)"
                        />
                      
                    </template>
                  </prime-column>
                </prime-data-table>
              </template>
              <template v-else>
                <div class="rw-data">
                  <div
                    v-for="item of prStudentData"
                    :key="item.id"
                    class="cl-item"
                  >
                    <div class="rw-1">
                      <span class="cl-r">{{ item.fullName }}</span>
                      <div class="cl-l">
                        <template v-if="item.statistics.showRate">
                          <app-progress-bar
                            v-if="item.statistics.rate > 0"
                            :value="item.statistics.rate"
                          />
                          <span v-else>عدد الاسئلة غير كافي</span>
                        </template>
                        <div
                          v-else
                          class="is-locked"
                        >
                          <service-lock font-size="12" />
                          <span>التقييم مغلق</span>
                        </div>
                      </div>
                    </div>
                    <div class="rw-2">
                      <div class="__item">
                        <span class="__label">الأسئلة</span>
                        <span class="__data">
                          {{ item.statistics.totalQuestionsCount }}
                        </span>
                      </div>
                      <div class="__item">
                        <span class="__label">الإجابات</span>
                        <div class="__ans">
                          <span class="answer-co">
                            {{ item.statistics.correctQuestionsCount }}
                          </span>
                          <span class="hr"></span>
                          <span class="answer-wr __red">
                            {{ item.statistics.wrongQuestionsCount }}
                          </span>
                        </div>
                      </div>
                      <div class="__item">
                        <span class="__label">الباقة</span>
                        <span class="__data __bold">
                          {{ item.statistics.subscriptionName }}
                        </span>
                      </div>
                      <div class="flex items-center justify-center gap-1">
                        <app-button
                          v-if="item.id"
                          size="md"
                          variant="outline"
                          label="تحليل"
                          @click="toAnalytics(item.studentId)"
                        />
                        <app-button
                          size="sm"
                          variant="clear"
                          colorType="warn"
                          iconStartClass="fa fa-trash"
                          label=""
                          @click="toDelete(item.id)"
                        />
                        <app-button
                          v-if="item.phoneNumber"
                          size="sm"
                          variant="clear"
                          class="whatsapp"
                          label=""
                          iconStartClass="fa fab fa-whatsapp"
                          colorType="success"
                          @click="toWhatsApp(item.phoneNumber)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </prime-accordion-content>
        </prime-accordion-panel>
        <prime-accordion-panel
          v-if="waitStudentData.length > 0"
          class="co-waiting-student st-tab"
          :value="expandStateValues.waitStudentCollapse"
        >
          <prime-accordion-header>
            <div class="tab-header">
              <span class="">
                طلاب بانتظار الموافقة (
                <span class="__red">{{ waitStudentData.length }}</span>
                )
              </span>
            </div>
          </prime-accordion-header>
          <prime-accordion-content class="wait-student-collapse">
            <div class="tab-contents">
              <template v-if="!windowSize.isMobileSize">
                <prime-data-table
                  style="margin-top: 23px"
                  :value="waitStudentData"
                  responsiveLayout="scroll"
                  stripedRows
                  class="students-table"
                >
                  <prime-column
                    v-for="field in fields"
                    :key="field.key"
                    :field="field.key"
                    :header="field.label"
                    :bodyClass="field.key"
                  >
                    <!-- Answers Column -->
                    <template
                      v-if="field.key === 'answers'"
                      #body="{ data }"
                    >
                      <div class="__ans">
                        <span class="answer-co">
                          {{ data.statistics.correctQuestionsCount }}
                        </span>
                        <span class="hr"></span>
                        <span class="answer-wr __red">
                          {{ data.statistics.wrongQuestionsCount }}
                        </span>
                      </div>
                    </template>

                    <!-- Rate Column -->
                    <template
                      v-else-if="field.key === 'rate'"
                      #body="{ data }"
                    >
                      <template v-if="data.statistics.showRate">
                        <app-progress-bar
                          v-if="data.statistics.rate > 0"
                          :value="data.statistics.rate"
                        />
                        <span v-else>عدد الاسئلة غير كافي</span>
                      </template>
                      <div
                        v-else
                        class="is-locked"
                      >
                        <service-lock />
                        <span>مغلق</span>
                      </div>
                    </template>

                    <!-- Control Column -->
                    <template
                      v-else-if="field.key === 'control'"
                      #body="{ data }"
                    >
                      <div class="flex items-center justify-center gap-1">
                        <app-button
                          v-if="data.id"
                          label="قبول"
                          size="md"
                          variant="outline"
                          colorType="success"
                          @click="requestAgree(data.id, 1)"
                        />
                        <app-button
                          size="sm"
                          variant="clear"
                          colorType="warn"
                          iconStartClass="fa fa-trash"
                          label=""
                          @click="toReject(data.id)"
                        />
                        <app-button
                          v-if="data.phoneNumber"
                          label=""
                          class="whatsapp"
                          iconStartClass="fa fab fa-whatsapp"
                          size="sm"
                          variant="clear"
                          colorType="success"
                          @click="toWhatsApp(data.phoneNumber)"
                        />
                      </div>
                    </template>
                  </prime-column>
                </prime-data-table>
              </template>
              <template v-else>
                <div
                  v-if="waitStudentData.length > 0"
                  class="rw-data"
                >
                  <div
                    v-for="item of waitStudentData"
                    :key="item.id"
                    class="cl-item"
                  >
                    <div class="rw-1">
                      <span class="cl-r">{{ item.fullName }}</span>
                      <div class="cl-l">
                        <template v-if="item.statistics.showRate">
                          <app-progress-bar
                            v-if="item.statistics.rate > 0"
                            :value="item.statistics.rate"
                          />
                          <span v-else>عدد الاسئلة غير كافي</span>
                        </template>
                        <div
                          v-else
                          class="is-locked"
                        >
                          <service-lock font-size="12" />
                          <span>التقييم مغلق</span>
                        </div>
                      </div>
                    </div>
                    <div class="rw-2">
                      <div class="__item">
                        <span class="__label">الأسئلة</span>
                        <span class="__data">
                          {{ item.statistics.totalQuestionsCount }}
                        </span>
                      </div>
                      <div class="__item">
                        <span class="__label">الإجابات</span>
                        <div class="__ans">
                          <span class="answer-co">
                            {{ item.statistics.correctQuestionsCount }}
                          </span>
                          <span class="hr"></span>
                          <span class="answer-wr __red">
                            {{ item.statistics.wrongQuestionsCount }}
                          </span>
                        </div>
                      </div>
                      <div class="__item">
                        <span class="__label">الباقة</span>
                        <span class="__data __bold">
                          {{ item.statistics.subscriptionName }}
                        </span>
                      </div>
                      <div class="flex items-center justify-center gap-1">
                        <app-button
                          v-if="item.id"
                          class="outline-btn action"
                          variant="outline"
                          colorType="success"
                          size="md"
                          label="قبول"
                          @click="requestAgree(item.id, 1)"
                        />
                        <app-button
                          size="sm"
                          colorType="warn"
                          variant="clear"
                          class="trash"
                          iconStartClass="fa fa-trash"
                          label=""
                          @click="toDelete(item.id)"
                        />
                        <app-button
                          v-if="item.phoneNumber"
                          class="whatsapp"
                          size="sm"
                          variant="clear"
                          iconStartClass="fa fab fa-whatsapp"
                          label=""
                          colorType="success"
                          @click="toWhatsApp(item.phoneNumber)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </prime-accordion-content>
        </prime-accordion-panel>
        <prime-accordion-panel
          v-if="teachersFinancials && teachersFinancials.details"
          class="co-financial st-tab"
          :value="expandStateValues.financialCollapse"
        >
          <prime-accordion-header>
            <div
              class="tab-header"
              @click="financialCollapse = !financialCollapse"
            >
              <div class="head-r">
                <span class="t1">المشتركين عبر الكود الخاص بي</span>
                <span class="t2">
                  عدد المشتركين
                  <span class="__green">
                    {{ teachersFinancials.subscriptionsCount }}
                  </span>
                </span>
                <span class="t3">
                  الرصيد الحالي
                  <span class="__green">{{ currentBalance }} ريال</span>
                </span>
              </div>
            </div>
          </prime-accordion-header>
          <prime-accordion-content class="financial-collapse">
            <div class="tab-contents">
              <div class="table-scroll">
                <prime-data-table
                  style="margin-top: 23px"
                  :value="teachersFinancials.details"
                  responsiveLayout="scroll"
                  stripedRows
                  class="financial-table"
                >
                  <prime-column
                    v-for="field in financialFields"
                    :key="field.key"
                    :field="field.key"
                    :header="field.label"
                    :bodyClass="field.key"
                  >
                    <!-- Student Name Column -->
                    <template
                      v-if="field.key === 'studentName'"
                      #body="{ data }"
                    >
                      <span :class="{ noPacket: !data.subscriptionName }">
                        {{ data[field.key] }}
                      </span>
                    </template>

                    <!-- Teacher Amount Column -->
                    <template
                      v-else-if="field.key === 'teacherAmount'"
                      #body="{ data }"
                    >
                      <div
                        style="direction: ltr"
                        class="__amount"
                        :class="{ __red: data.teacherAmount < 0 }"
                      >
                        {{ data.teacherAmount }}
                      </div>
                    </template>

                    <!-- Default Column (for non-custom fields) -->
                    <template
                      v-else
                      #body="{ data }"
                    >
                      {{ data[field.key] }}
                    </template>
                  </prime-column>
                </prime-data-table>
              </div>

              <div class="financial-square">
                <div class="fi-cl rw-1">
                  <span class="acc-label">
                    إجمالي المكافآت (
                    {{ subscriptionsCount }}
                    )
                  </span>
                  <span class="acc-numbers">{{ totalTransfers }}</span>
                </div>
                <div class="fi-cl rw-2">
                  <span class="acc-label">إجمالي المصروفات</span>
                  <span class="acc-numbers">{{ totalExpenses }}</span>
                </div>
                <div class="fi-cl rw-3">
                  <span class="acc-label">
                    الرصيد المتبقي
                    <app-button
                      size="md"
                      :disabled="total <= 0"
                      label="طلب تحويل"
                      @click="toRequestTransfer"
                    />
                  </span>
                  <span
                    class="acc-numbers"
                    style="direction: ltr"
                    :class="{ __red: total < 0 }"
                  >
                    {{ total }}
                  </span>
                </div>
              </div>
            </div>
          </prime-accordion-content>
        </prime-accordion-panel>
      </prime-accordion>

      <delete-modal
        ref="delete-modal"
        v-model:isOpen="isOpenDeleteModal"
        :isReject="deleteMsg.isReject"
        :msg="deleteMsg.msg"
        :label="deleteMsg.label"
        :exLabel="deleteMsg.exLabel"
        @onConfirm="
          deleteMsg.isReject ? requestAgree(toDeleteId, 2) : deleteConfirm()
        "
      />
    </div>

    <div
      v-if="activePart === panelParts.analytics"
      class="analytics-student-part"
    >
      <analytics-panel
        key="analytics"
        :studentId="toAnalyticsId"
        :forTeacher="true"
        @backToMain="backToMain"
        @toTraining="toTraining"
      />
    </div>

    <div
      v-if="activePart === panelParts.trainings"
      class="analytics-student-part"
    >
      <analytics-panel
        key="trainings"
        :studentId="toAnalyticsId"
        :forTrainingStudent="true"
        @backToMain="toAnalytics(toAnalyticsId)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { sleepUtil, toWhatsApp } from '~/main/utils/shared-utils';

const mockData = {
  subscriptionsCount: 5,
  details: [
    {
      createdDate: '2024/12/22',
      studentName: 'عبد العزيز عبد الله',
      subscriptionName: 'الفضية',
      studentPaidAmount: 349,
      teacherAmount: 34.9,
    },
    {
      createdDate: '2024/12/25',
      studentName: 'عبد العزيز عبد الله',
      subscriptionName: 'الفضية',
      studentPaidAmount: 815,
      teacherAmount: 33.18,
    },
    {
      createdDate: '2024/12/25',
      studentName: 'عبد العزيز عبد الله',
      subscriptionName: 'الفضية',
      studentPaidAmount: 115,
      teacherAmount: 11.19,
    },
    {
      createdDate: '2024/12/23',
      studentName: 'تحويل بنكي إلى العميل (SA13000000050304920)',
      subscriptionName: null,
      studentPaidAmount: null,
      teacherAmount: -33.18,
    },
  ],
};

const deleteTexts = {
  msg: 'بحذف هذا الطالب؟',
  label: 'لن تتمكن من متابعة هذا الطالب',
  exLabel: 'أو التواصل معه كمعلم بعد حذفك له',
  isReject: false,
};

const rejectTexts = {
  msg: 'عدم قبول هذا الطالب؟',
  label: 'لن تتمكن من متابعة هذا الطالب',
  exLabel: 'أو التواصل معه كمعلم',
  isReject: true,
};

const panelParts = {
  main: 0,
  analytics: 1,
  trainings: 2,
};

export default {
  setup() {
    const windowSize = useWindowSize();
    const globalStore = useGlobalStore();
    globalStore.getFile1JsonStatic();
    return {
      windowSize,
      file1PanelStatic: computed(() => globalStore.staticState.file1Json),
      globalTypeUser: computed(() => globalStore.state.globalTypeUserValue),
      ...useSetupAuth(),
      ...useSetupRoute(),
      ...useToastMessage(),
    };
  },
  data() {
    return {
      studentData: null as any | null,
      teachersFinancials: null as any | null,
      teachersFinancials2: mockData,
      Data: [],
      isLoadingData: false,
      fields: [
        { key: 'fullName', label: 'اسم الطالب', class: 'fullName' },
        { key: 'statistics.totalQuestionsCount', label: 'الأسئلة' },
        { key: 'answers', label: 'الإجابات', class: 'answers' },
        { key: 'statistics.subscriptionName', label: 'الباقة' },
        { key: 'rate', label: 'التقييم', class: 'rate' },
        { key: 'control', label: 'إجراءات', class: 'control' },
      ],
      financialFields: [
        { key: 'createdDate', label: 'التاريخ' },
        { key: 'studentName', label: 'اسم المستخدم', class: 'userName' },
        { key: 'subscriptionName', label: 'الباقة' },
        { key: 'studentPaidAmount', label: 'السعر' },
        { key: 'teacherAmount', label: 'مكافآت وتحويلات' },
      ],
      toDeleteId: null,
      toAnalyticsId: null,
      isOpenDeleteModal: false,
      isOpenTeacherModal: false,
      showTeacherModal: false,
      prStudentCollapse: false,
      waitStudentCollapse: false,
      financialCollapse: false,
      deleteMsg: deleteTexts,
      isAnalyticsStudent: false,
      panelParts: panelParts,
      activePart: panelParts.main,
      expandState: null as
        | null
        | 'prStudentCollapse'
        | 'waitStudentCollapse'
        | 'financialCollapse',
    };
  },

  computed: {
    expandStateValues() {
      return {
        prStudentCollapse: 'prStudentCollapse',
        waitStudentCollapse: 'waitStudentCollapse',
        financialCollapse: 'financialCollapse',
      };
    },
    studentList() {
      if (this.studentData) {
        return this.studentData.studentsList;
      }
      return null;
    },
    prStudentData() {
      if (this.studentList) {
        return this.studentList.filter((k) => k.state === 1);
      }
      return [];
    },
    waitStudentData() {
      if (this.studentList) {
        return this.studentList.filter((k) => k.state === 0);
      }
      return [];
    },

    isAnalyticsRoute() {
      return this.appRoute.query.studentId !== undefined;
    },
    totalTransfers() {
      if (!this.teachersFinancials) return 0;
      if (
        !this.teachersFinancials?.details ||
        this.teachersFinancials?.details?.length === 0
      ) {
        return 0;
      }
      return this.teachersFinancials.details
        .reduce((sum, item) => {
          return item.teacherAmount > 0 ? sum + item.teacherAmount : sum;
        }, 0)
        .toFixed(2);
    },
    totalExpenses() {
      if (!this.teachersFinancials) return 0;
      if (
        !this.teachersFinancials?.details ||
        this.teachersFinancials?.details?.length === 0
      ) {
        return 0;
      }
      return this.teachersFinancials.details
        .reduce((sum, item) => {
          return item.teacherAmount < 0
            ? sum + Math.abs(item.teacherAmount)
            : sum;
        }, 0)
        .toFixed(2);
    },
    total() {
      if (!this.teachersFinancials) return 0;
      if (
        !this.teachersFinancials?.details ||
        this.teachersFinancials?.details?.length === 0
      ) {
        return 0;
      }
      return this.teachersFinancials.details
        .reduce((sum, item) => {
          return sum + item.teacherAmount;
        }, 0)
        .toFixed(2);
    },

    subscriptionsCount() {
      if (!this.teachersFinancials) return 0;
      if (
        !this.teachersFinancials?.details ||
        this.teachersFinancials?.details?.length === 0
      ) {
        return 0;
      }
      return this.teachersFinancials.details.filter(
        (k) => k.subscriptionName != null
      ).length;
    },

    currentBalance() {
      if (!this.teachersFinancials) return 0;
      if (
        !this.teachersFinancials?.details ||
        this.teachersFinancials?.details?.length === 0
      ) {
        return 0;
      }
      return this.teachersFinancials.details
        .reduce((sum, item) => {
          return sum + Math.abs(item.teacherAmount);
        }, 0)
        .toFixed(2);
    },

    whatsAppMessage() {
      const userName = this.appAuth.user.userName;
      const total = this.total.toString();
      const message = `\u200Fمرحبًا، أنا المدرس (${userName}) أطلب تحويل المبلغ الرصيد لدي (${total}).`;
      return encodeURIComponent(message);
    },

    whatsAppLink() {
      return `https://wa.me/966570380975?text=${this.whatsAppMessage}`;
    },
  },

  watch: {
    isOpenTeacherModal: {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.resetModal();
        }
      },
    },

    globalTypeUser: {
      deep: true,
      handler(newVal) {
        this.getStudentData();
      },
    },
  },

  beforeMount() {
    this.checkPageAndRequests();
  },

  mounted() {},

  methods: {
    async checkPageAndRequests() {
      try {
        if (this.$store.state.student.selectedStudentIdForTeacher) {
          this.toAnalytics(
            this.$store.state.student.selectedStudentIdForTeacher
          );
          this.$store.commit('student/SET_STUDENT_ID_FOR_TEACHER', null);
          return;
        }
        await this.getStudentData();
        await this.getTeachersFinancial();
        this.processCollapse();
      } catch (e) {
        console.log(e);
      }
    },

    async getStudentData() {
      try {
        this.isLoadingData = true;
        this.$axios
          .get(`teachersStudents/list?grade=${this.globalTypeUser}`)
          .then(({ data: res }) => {
            this.studentData = res;
            this.isLoadingData = false;
          })
          .catch((e) => {
            this.showError();
            this.isLoadingData = false;
          });
      } catch (e) {
        this.isLoadingData = false;
        console.log('teachersData: ' + e);
      }
    },

    async getTeachersFinancial() {
      try {
        this.isLoadingData = true;
        this.$axios
          .get('teachersFinancial/all')
          .then(({ data: res }) => {
            this.teachersFinancials = res;
            this.isLoadingData = false;
          })
          .catch((e) => {
            this.showError();
            this.isLoadingData = false;
          });
      } catch (e) {
        this.isLoadingData = false;
        console.log('teachersData: ' + e);
      }
    },

    processCollapse() {
      if (this.prStudentData) {
        this.expandState = 'prStudentCollapse';
        return;
      }
      if (this.waitStudentData) {
        this.expandState = 'waitStudentCollapse';
      }
    },

    toWhatsApp(phoneNum) {
      toWhatsApp(phoneNum);
    },

    async toAnalytics(id) {
      try {
        this.toAnalyticsId = id;
        this.activePart = panelParts.analytics;
      } catch (e) {
        this.toAnalyticsId = null;
        console.log('toAnalyticsPage: ' + e);
      }
    },

    async toTraining() {
      try {
        this.activePart = panelParts.trainings;
      } catch (e) {
        this.toAnalyticsId = null;
        console.log('toAnalyticsPage: ' + e);
      }
    },

    backToMain() {
      if (!this.studentList) {
        this.getStudentData();
        this.getTeachersFinancial();
      }
      this.activePart = panelParts.main;
    },

    toDelete(id) {
      this.deleteMsg = deleteTexts;
      this.toDeleteId = id;
      this.isOpenDeleteModal = true;
    },

    toReject(id) {
      this.deleteMsg = rejectTexts;
      this.toDeleteId = id;
      this.isOpenDeleteModal = true;
    },

    requestAgree(id, state) {
      try {
        this.$axios
          .post(`teachersStudents/accept`, {
            id: id,
            state: state,
          })
          .then(({ data: res }) => {
            if (res) {
              this.getStudentData();
              this.showSuccess();
            }
          })
          .catch((e) => {
            this.showError();
          });
      } catch (e) {
        console.log('requestAgree: ' + e);
      }
    },

    deleteConfirm() {
      try {
        this.$axios
          .delete(`/teachersStudents/${this.toDeleteId}`)
          .then(({ data: res }) => {
            if (res.isDeleted) {
              this.showSuccess();
              this.getStudentData();
              this.getTeachersFinancial();
            }
          })
          .catch((e) => {
            this.showError();
          });
      } catch (e) {
        console.log('deleteStudent: ' + e);
      }
    },

    addTeacher() {
      this.showTeacherModal = true;
      this.isOpenTeacherModal = true;
    },

    toRequestTransfer() {
      window.open(this.whatsAppLink, '_blank');
    },

    async resetModal() {
      await sleepUtil(200);
      this.showTeacherModal = false;
    },
  },
};
</script>
<style src="./teacher-info-panel.scss" lang="scss" scoped></style>
