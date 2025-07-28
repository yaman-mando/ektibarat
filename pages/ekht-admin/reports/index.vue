<template>
  <section class="default-admin-page admin-reports-page">
    <h1>التقارير</h1>
    <client-only>
      <div class="re-wrapper">
        <report-student-count-chart
          :reportType="reportChartType.studentCountToTrain"
        />
        <report-student-count-chart
          :reportType="reportChartType.questionCountInPeriod"
        />
        <report-student-count-chart
          :reportType="reportChartType.studentCompletedRegCount"
        />
        <report-student-count-chart
          :reportType="reportChartType.studentNotCompletedRegCount"
        />
      </div>
    </client-only>
    <div class="trainings-report">
      <span class="__title">تقرير تدريبات الطلاب</span>
      <div class="__filter">
        <form-input
          v-model:inputValue="trainingsFilterForm.trainingCount"
          class="!w-[300px]"
          inputId="trainingCount"
          inputPlaceholder="أدخل عدد التدريبات"
          label="أدخل عدد التدريبات"
          :hideLabel="true"
        />
        <app-date-picker
          placeHolder="التاريخ"
          :startDate="trainingsFilterForm.from!"
          :endDate="trainingsFilterForm.to"
          @updateDate="
            (e) => {
              trainingsFilterForm.from = e.startDate;
              trainingsFilterForm.to = e.endDate;
            }
          "
        />

        <app-button
          size="md"
          label="ابحث"
          @click="getTrainingFilterData"
        />

        <span v-if="trainingsTableData && trainingsTableData.length > 0">
          عدد الطلاب : {{ trainingsTableData.length }}
        </span>
      </div>

      <template v-if="trainingsTableData">
        <div
          v-if="trainingsTableData.length > 0"
          class="__table"
        >
          <prime-data-table
            style="margin-top: 20px"
            :value="trainingsTableData"
            :loading="trainingsTableLoading"
            responsiveLayout="scroll"
            stripedRows
            bordered
            class="trainings-report"
            tableStyle="white-space: nowrap"
          >
            <prime-column
              field="userId"
              header="رقم المستخدم"
              :sortable="false"
            />
            <prime-column
              field="userName"
              header="اسم المستخدم"
              :sortable="false"
            />
            <prime-column
              field="email"
              header="البريد الالكتروني"
              :sortable="false"
            />
          </prime-data-table>
        </div>

        <div
          v-else
          class="no-data"
        >
          <span>لا يوجد نتائج</span>
        </div>
      </template>
    </div>
  </section>
</template>
<script lang="ts">
import { ADMIN_REPORT_CHART_TYPE } from '~/main/constants/admin-report-chart-type.enum';

export default {
  setup() {
    definePageMeta({
      layout: 'admin-layout',
    });
    return {};
  },
  data() {
    return {
      trainingsFilterForm: {
        trainingCount: null,
        grade: null,
        from: null,
        to: null,
      },
      trainingsTableData: null as any[] | null,
      trainingsTableLoading: false,
      fields: [
        { key: 'userId', label: 'رقم المستخدم' },
        { key: 'userName', label: 'اسم المستخدم' },
        { key: 'email', label: 'البريد الالكتروني' },
      ],
    };
  },
  computed: {
    reportChartType() {
      return ADMIN_REPORT_CHART_TYPE;
    },
  },
  mounted() {},

  methods: {
    async getTrainingFilterData() {
      try {
        this.trainingsTableLoading = true;
        this.trainingsFilterForm.grade = this.$store.state.globalType;
        await this.$axios
          .post(`dashboard/analyzeActiveStudents`, this.trainingsFilterForm)
          .then(({ data: res }) => {
            this.trainingsTableData = res;
          });
        this.trainingsTableLoading = false;
      } catch (e) {
        this.trainingsTableLoading = false;
        console.log('trainingFilter: ' + e);
      }
    },
  },
};
</script>
<style lang="scss" src="./admin-reports.scss"></style>
