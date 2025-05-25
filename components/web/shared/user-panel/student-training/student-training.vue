<template>
  <div class="student-training-page">
    <div class="w-full flex items-center justify-between pb-2">
      <span class="main-label">سجل التدريب</span>
    </div>
    <!--  NO DATA   -->
    <app-overlay
      v-if="isLoadingData"
      :msg="
        createLoading
          ? 'يرجى الانتظار ريثما يتم توليد تدريب مناسب ... شكراً'
          : 'يتم تحميل البيانات ...'
      "
      :fullScreen="true"
    />

    <!-- HAS DATA    -->
    <template v-if="analyticsData">
      <div class="analytics-data is-training">
        <div
          v-for="(group, index1) of analyticsData"
          :key="`analyticsData_${index1}`"
          class="analytics-group"
        >
          <lazy-prime-accordion>
            <template #expandicon>
              <i class="fa fa-solid fa-chevron-down c_icon"></i>
            </template>
            <template #collapseicon>
              <i class="fa fa-solid fa-chevron-up c_icon"></i>
            </template>
            <lazy-prime-accordion-panel :value="`analyticsData_${index1}`">
              <lazy-prime-accordion-header class="custom-panel-header">
                <div
                  :class="{
                    'no-child': !hasChild1(group.analayzeStudentCategories),
                  }"
                  class="g-info"
                  @click.stop.prevent
                >
                  <div class="r-part">
                    <div class="rw-1">
                      <text-slice
                        :length="20"
                        :text="group.subjectName"
                      />
                    </div>
                    <div class="rw-2">
                      <div class="info-group">
                        <span class="t-1">الأسئلة</span>
                        <span class="t-2">{{ group.questionsCount }}</span>
                      </div>
                      <div class="info-group">
                        <span class="t-1">إجمالي الزمن</span>
                        <span class="t-2">
                          {{ secondsToHHMM(group.totalTime) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="l-part">
                    <div class="c-period">
                      <p class="p-text">الفترة الزمنية</p>
                      <select-list
                        v-model:selectedItem="selectedPeriod"
                        name="التصنيف الرئيسي"
                        :options="periodList"
                        class="sec a"
                        :isMulti="false"
                        :showSelectedItem="true"
                      />
                    </div>
                    <!--                    <i-->
                    <!--                      :class="-->
                    <!--                        activeCollapse.includes(-->
                    <!--                          `analytics-group-accordion-${index1}`-->
                    <!--                        )-->
                    <!--                          ? 'fa-chevron-up'-->
                    <!--                          : 'fa-chevron-down'-->
                    <!--                      "-->
                    <!--                      class="fa collapse-icon"-->
                    <!--                    ></i>-->
                  </div>
                </div>
              </lazy-prime-accordion-header>
              <lazy-prime-accordion-content>
                <template
                  v-for="(catGroup, index2) of group.analayzeStudentCategories"
                  :key="`group.analayzeStudentCategories_${index2}`"
                >
                  <lazy-prime-accordion
                    v-if="
                      getTableData(
                        group.analayzeStudentCategories,
                        catGroup.categoryId
                      ).length > 0
                    "
                    class="child-custom-acc"
                  >
                    <lazy-prime-accordion-panel
                      :value="`group.analayzeStudentCategories_${index2}`"
                    >
                      <lazy-prime-accordion-header class="custom-panel-header">
                        <div
                          :class="[
                            {
                              'no-child': !hasChild2(
                                group.analayzeStudentCategories,
                                catGroup.categoryId
                              ),
                            },
                            {
                              'not-complete': hasNotCompletePart(
                                group.analayzeStudentCategories,
                                catGroup.categoryId
                              ),
                            },
                          ]"
                          class="g-collapse-info"
                        >
                          <template v-if="!windowSize.isMobileSize">
                            <div class="c-1">
                              <text-slice
                                :length="15"
                                :text="catGroup.categoryName"
                              />
                              <span class="notCompleteParts">
                                {{
                                  hasNotCompletePart(
                                    group.analayzeStudentCategories,
                                    catGroup.categoryId
                                  )
                                }}
                              </span>
                            </div>
                            <div class="c-3">
                              <span class="t-1">مدة التدريب</span>
                              <span class="t-2">
                                {{ secondsToHHMM(catGroup.totalTime) }}
                              </span>
                            </div>
                            <div class="c-3">
                              <span class="t-1">الأسئلة</span>
                              <span class="t-2">
                                {{ catGroup.questionsCount }}
                              </span>
                            </div>
                            <div class="c-4">
                              <span class="t-1">الإجابات</span>
                              <span class="t-2">
                                <span class="t-2-1">
                                  {{ catGroup.correctAnswersCount }}
                                </span>
                                <span class="t-2-2"></span>
                                <span class="t-2-3">
                                  {{ catGroup.wrongAnswersCount }}
                                </span>
                              </span>
                            </div>
                          </template>
                          <template v-else>
                            <div class="cl-1">
                              <div class="c-1">
                                <text-slice
                                  :length="12"
                                  :text="catGroup.categoryName"
                                />
                              </div>
                              <div class="r-2">
                                <div class="c-3">
                                  <span class="t-1">مدة التدريب</span>
                                  <span class="t-2">
                                    {{ secondsToHHMM(catGroup.totalTime) }}
                                  </span>
                                </div>
                                <div class="c-3">
                                  <span class="t-1">الأسئلة</span>
                                  <span class="t-2">
                                    {{ catGroup.questionsCount }}
                                  </span>
                                </div>
                                <div class="c-4">
                                  <span class="t-1">الإجابات</span>
                                  <span class="t-2">
                                    <span class="t-2-1">
                                      {{ catGroup.correctAnswersCount }}
                                    </span>
                                    <span class="t-2-2"></span>
                                    <span class="t-2-3">
                                      {{ catGroup.wrongAnswersCount }}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </lazy-prime-accordion-header>
                      <lazy-prime-accordion-content>
                        <div class="g-collapse-table">
                          <template v-if="!windowSize.isMobileSize">
                            <div class="t-head">
                              <span>المهارة</span>
                              <span>الأسئلة</span>
                              <span>الإجابات</span>
                              <span>زمن الإجابة/المتوسط</span>
                              <span>زمن التدريب</span>
                              <span>تدرب</span>
                            </div>
                            <div class="t-data">
                              <template
                                v-for="(tableData, i) of getTableData(
                                  group.analayzeStudentCategories,
                                  catGroup.categoryId
                                )"
                                :key="`catGroup.categoryId_${i}`"
                              >
                                <div
                                  class="t-col"
                                  :class="[
                                    { 'is-disabled': !tableData.isEnabled },
                                  ]"
                                >
                                  <div class="to-12">
                                    <span class="d-1">
                                      <text-slice
                                        :length="30"
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
                                    <span
                                      :data-title="
                                        i === 0 && index2 === 0
                                          ? introService.analyticsPanelTour
                                              .step5.title
                                          : null
                                      "
                                      :data-intro="
                                        i === 0 && index2 === 0
                                          ? introService.analyticsPanelTour
                                              .step5.content
                                          : null
                                      "
                                      class="t-2-3"
                                    >
                                      {{ tableData.wrongAnswersCount }}
                                    </span>
                                  </span>
                                  <span class="d-4">
                                    <span class="t-2-1">
                                      {{
                                        secondsToMMSS(
                                          tableData.studentTimeTakenRate
                                        )
                                      }}
                                    </span>
                                    <span class="t-2-2"></span>
                                    <span
                                      :data-title="
                                        i === 0 && index2 === 0
                                          ? introService.analyticsPanelTour
                                              .step7.title
                                          : null
                                      "
                                      :data-intro="
                                        i === 0 && index2 === 0
                                          ? introService.analyticsPanelTour
                                              .step7.content
                                          : null
                                      "
                                      class="t-2-3"
                                    >
                                      {{
                                        secondsToMMSS(
                                          tableData.allStudentsTimeTakenRate
                                        )
                                      }}
                                    </span>
                                  </span>
                                  <span class="d-5">
                                    {{ secondsToHHMM(tableData.totalTime) }}
                                  </span>
                                  <div class="d-6">
                                    <div class="w-full relative">
                                      <app-button
                                        size="md"
                                        :isLoading="
                                          loading &&
                                          loading == tableData.examDefaultId
                                        "
                                        label="تدرب"
                                        @click.stop="
                                          onTrainClickStudent(
                                            catGroup.categoryId,
                                            tableData.categoryId
                                          )
                                        "
                                      />
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </template>
                          <template v-else>
                            <div class="t-card">
                              <template
                                v-for="(tableData, i) of getTableData(
                                  group.analayzeStudentCategories,
                                  catGroup.categoryId
                                )"
                                :key="`group.analayzeStudentCategories_${index}_${i}`"
                              >
                                <div
                                  class="t-col"
                                  :class="[
                                    { 'is-disabled': !tableData.isEnabled },
                                  ]"
                                >
                                  <div class="zr-w">
                                    <div class="r-1">
                                      <span class="d-1">
                                        <text-slice
                                          :length="25"
                                          :text="tableData.categoryName"
                                        />
                                      </span>
                                      <div class="d-6">
                                        <app-button
                                          size="md"
                                          label="تدرب"
                                          @click.stop="
                                            onTrainClickStudent(
                                              catGroup.categoryId,
                                              tableData.categoryId
                                            )
                                          "
                                        />
                                      </div>
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
                                      <div class="d-2">
                                        <span class="label">زمن التدريب</span>
                                        <span class="info">
                                          {{
                                            secondsToHHMM(tableData.totalTime)
                                          }}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </template>
                        </div>
                      </lazy-prime-accordion-content>
                    </lazy-prime-accordion-panel>
                  </lazy-prime-accordion>
                </template>
              </lazy-prime-accordion-content>
            </lazy-prime-accordion-panel>
          </lazy-prime-accordion>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { setDefaultImage } from '~/main/utils/set-default-image.util';
import { RouteHelper } from '~/main/utils/route-helper';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { useGlobalStore } from '~/main/useGlobalStore';
import { GlobalTypes } from '~/main/constants/global-types';
import { deepEqualUtil } from '~/main/utils/lodash.utils';
import { getRateLabel } from '~/main/utils/shared-utils';
import { secondsToHHMMSS, secondsToMMSS } from '~/main/utils/date-utils';
import { APP_CONFIG } from 'public/constants/app-config';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useIntroService } from '~/main/services/useIntroService';

const periodList = [
  { id: 0, label: 'كامل المدة' },
  { id: 4, label: 'اليوم' },
  { id: 1, label: 'الأمس' },
  { id: 2, label: 'الأسبوع الماضي' },
  { id: 3, label: 'الشهر الماضي' },
];

export default {
  // components: { 'a-progress': Progress },

  setup() {
    const subscriptionsStore = useSubscriptionsStore();
    const globalStore = useGlobalStore();
    const introService = useIntroService();
    return {
      introService,
      windowSize: useWindowSize(),
      ...useSetupAuth(),
      ...useSetupRoute(),
      userCurrentSub: computed(
        () => subscriptionsStore.state.userCurrentSubVal
      ),
      userServicesState: computed(
        () => subscriptionsStore.state.userServicesStateVal
      ),
      globalTypeUser: computed(() => globalStore.state.globalTypeUserValue),
    };
  },
  data() {
    return {
      selectedValue: null as any,
      analyticsData: null as any | null,
      activeCollapse: [] as string[],
      checkedExam: null,
      isOpenModal: false,
      createLoading: false,
      selectedExamId: null,
      loading: false,
      isLoadingData: false,
      periodList: periodList,
      selectedPeriod: periodList[0].id,
    };
  },
  computed: {
    routerHelper() {
      return RouteHelper;
    },
    hasAnalyzeService() {
      return this.userServicesState.ANALAZEDEGRE.isActive;
    },
    isStudent() {
      return this.appAuth?.user?.role === UserRoles.student;
    },

    isTahsele() {
      return this.globalTypeUser == GlobalTypes.tahsele;
    },
  },
  watch: {
    globalTypeUser: {
      deep: true,
      handler(newVal) {
        this.requestTrainingData();
      },
    },

    selectedPeriod: {
      handler(newVal, oldVal) {
        if (!deepEqualUtil(newVal, oldVal)) {
          this.requestTrainingData();
        }
      },
    },
  },

  mounted() {
    this.requestTrainingData();
  },

  methods: {
    setDefaultImage,
    async requestTrainingData() {
      try {
        this.isLoadingData = true;
        this.$axios
          .post(`/dashboard/studentPartOfMainAnalyze`, {
            period: this.selectedPeriod,
            grade: this.globalTypeUser,
          })
          .then(({ data: res }) => {
            this.analyticsData = res;
          })
          .finally(() => (this.isLoadingData = false));
      } catch (e) {
        this.isLoadingData = false;
        console.log(e);
      }
    },

    getRateLabel(rate) {
      if (!this.hasAnalyzeService) {
        return 'للمشتركين';
      }
      return getRateLabel(rate);
    },

    getTableData(allData, pId) {
      const list: any[] = [];
      allData.forEach((res) => {
        if (
          res.parentId == pId &&
          !allData.some((k) => k.parentId == res.categoryId)
        ) {
          list.push(res);
        }
      });
      return list;
    },

    getChildData(allData, pId) {
      const list: any[] = [];
      allData.forEach((res) => {
        if (
          res.parentId == pId &&
          allData.some((k) => k.parentId == res.categoryId)
        ) {
          list.push(res);
        }
      });
      return list;
    },

    secondsToMMSS(totalSeconds) {
      return secondsToMMSS(totalSeconds);
    },

    secondsToHHMM(totalSeconds) {
      return secondsToHHMMSS(totalSeconds);
    },
    hasChild1(data) {
      return data && data.length > 0;
    },

    hasChild2(group, catId) {
      return group.some((k) => k.parentId == catId);
    },

    hasNotCompletePart(group, catId) {
      let count = 0;
      if (group.some((k) => k.parentId == catId)) {
        group.forEach((t) => {
          if (
            t.parentId == catId &&
            t.questionsCount < APP_CONFIG.analyticsMinQuestion
          ) {
            count++;
          }
        });
      }
      if (count == 0) {
        return null;
      }
      return `لم تكمل التدريب في ${count} أقسام`;
    },

    notEnoughQuestions(qCount, rate) {
      return APP_CONFIG.analyticsMinQuestion > qCount || rate == 0;
    },

    getPredictedMark(mark) {
      if (mark < 86) {
        return mark + '-' + Number(mark + 5);
      } else if (mark > 90) {
        return mark + '-' + Number(mark + 2);
      } else {
        return mark;
      }
    },

    onTrainClickStudent(parentId, childId) {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.trainings],
          parentId,
          childId: childId ?? null,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped src="./student-training.scss"></style>
