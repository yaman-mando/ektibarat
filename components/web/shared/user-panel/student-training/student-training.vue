<template>
  <div class="student-training-page">
    <div class="w-full flex items-center justify-content-between pb-2">
      <span class="main-label">سجل التدريب</span>
    </div>
    <!--  NO DATA   -->
    <b-overlay
      opacity="0.9"
      :noWrap="true"
      :show="isLoadingData"
    >
      <template #overlay>
        <div class="text-center">
          <b-icon
            style="color: purple"
            icon="stopwatch"
            fontScale="3"
            animation="cylon"
          />
          <p
            id="cancel-label"
            style="
              width: 90vw;
              max-width: 800px;
              font-size: 28px;
              color: purple;
              margin-top: 20px;
              line-height: 40px;
              font-weight: bold;
              text-align: center;
            "
          >
            <template v-if="createLoading">
              يرجى الانتظار ريثما يتم توليد تدريب مناسب ... شكراً
            </template>
            <template v-else>يتم تحميل البيانات ...</template>
            <b-spinner type="grow" />
          </p>
        </div>
      </template>
    </b-overlay>

    <!-- HAS DATA    -->
    <template v-if="analyticsData">
      <div class="analytics-data is-training">
        <div
          v-for="(group, index) of analyticsData"
          class="analytics-group"
        >
          <!--  g-info main toggle  -->
          <div
            :class="{
              'no-child': !hasChild1(group.analayzeStudentCategories),
            }"
            class="g-info"
            @click.self="
              hasChild1(group.analayzeStudentCategories)
                ? toggle(`analytics-group-accordion-${index}`)
                : {}
            "
          >
            <div class="r-part">
              <div class="rw-1">
                <mx-g-text-slice
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
              <i
                :class="
                  activeCollapse.includes(`analytics-group-accordion-${index}`)
                    ? 'fa-chevron-up'
                    : 'fa-chevron-down'
                "
                class="fa collapse-icon"
                @click.self="
                  hasChild1(group.analayzeStudentCategories)
                    ? toggle(`analytics-group-accordion-${index}`)
                    : {}
                "
              ></i>
            </div>
          </div>

          <!--  g-info items main accordion     -->
          <b-collapse
            v-if="hasChild1(group.analayzeStudentCategories)"
            :id="`analytics-group-accordion-${index}`"
            visible
            class="analytics-group-collapse"
            role="tabpanel"
          >
            <!--  first child toggle -->
            <template
              v-for="(catGroup, index) of group.analayzeStudentCategories"
            >
              <div
                v-if="catGroup.parentId == null"
                class="g-collapse-group"
              >
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
                  @click="
                    hasChild2(
                      group.analayzeStudentCategories,
                      catGroup.categoryId
                    )
                      ? toggle(`g-group-accordion-${index}`)
                      : {}
                  "
                >
                  <template v-if="$mq != 'mobile'">
                    <div class="c-1">
                      <mx-g-text-slice
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
                      <span class="t-2">{{ catGroup.questionsCount }}</span>
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
                    <i
                      v-if="
                        hasChild2(
                          group.analayzeStudentCategories,
                          catGroup.categoryId
                        )
                      "
                      :class="
                        activeCollapse.includes(`g-group-accordion-${index}`)
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      "
                      class="fa collapse-icon"
                    ></i>
                  </template>
                  <template v-else>
                    <div class="cl-1">
                      <div class="c-1">
                        <mx-g-text-slice
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
                    <i
                      v-if="
                        hasChild2(
                          group.analayzeStudentCategories,
                          catGroup.categoryId
                        )
                      "
                      :class="
                        activeCollapse.includes(`g-group-accordion-${index}`)
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      "
                      class="fa collapse-icon"
                    ></i>
                  </template>
                </div>
                <!--  first child collapse -->
                <b-collapse
                  v-if="
                    hasChild2(
                      group.analayzeStudentCategories,
                      catGroup.categoryId
                    )
                  "
                  :id="`g-group-accordion-${index}`"
                  visible
                  class="g-group-collapse"
                  role="tabpanel"
                >
                  <!--  tables first child collapse  -->
                  <div
                    v-if="
                      getTableData(
                        group.analayzeStudentCategories,
                        catGroup.categoryId
                      ).length > 0
                    "
                    class="g-collapse-table"
                  >
                    <template v-if="$mq != 'mobile'">
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
                        >
                          <div
                            class="t-col"
                            :class="[{ 'is-disabled': !tableData.isEnabled }]"
                          >
                            <div class="to-12">
                              <span class="d-1">
                                <mx-g-text-slice
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
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step5.title
                                    : null
                                "
                                :data-intro="
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step5.content
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
                                  secondsToMMSS(tableData.studentTimeTakenRate)
                                }}
                              </span>
                              <span class="t-2-2"></span>
                              <span
                                :data-title="
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step7.title
                                    : null
                                "
                                :data-intro="
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step7.content
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
                              <b-overlay
                                :show="
                                  loading && loading == tableData.examDefaultId
                                "
                              >
                                <div class="w-full relative">
                                  <app-button
                                    label="تدرب"
                                    @click.native.stop="
                                      onTrainClickStudent(
                                        catGroup.categoryId,
                                        tableData.categoryId
                                      )
                                    "
                                  />
                                </div>
                              </b-overlay>
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
                        >
                          <div
                            class="t-col"
                            :class="[{ 'is-disabled': !tableData.isEnabled }]"
                          >
                            <div class="zr-w">
                              <div class="r-1">
                                <span class="d-1">
                                  <mx-g-text-slice
                                    :length="25"
                                    :text="tableData.categoryName"
                                  />
                                </span>
                                <div class="d-6">
                                  <app-button
                                    label="تدرب"
                                    @click.native.stop="
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
                                    {{ secondsToHHMM(tableData.totalTime) }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </b-collapse>
              </div>
            </template>
          </b-collapse>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Progress } from 'ant-design-vue';

const periodList = [
  { id: 0, label: 'كامل المدة' },
  { id: 4, label: 'اليوم' },
  { id: 1, label: 'الأمس' },
  { id: 2, label: 'الأسبوع الماضي' },
  { id: 3, label: 'الشهر الماضي' },
];

export default {
  components: { 'a-progress': Progress },

  props: {},

  data() {
    return {
      analyticsData: null,
      activeCollapse: [],
      checkedExam: null,
      isOpenModal: false,
      createLoading: false,
      selectedExamId: null,
      loading: false,
      setDefaultImage,
      imageUrl,
      ImagesFolderName,
      imagesSize,
      imagesExt,
      isLoadingData: false,
      periodList: periodList,
      selectedPeriod: periodList[0].id,
    };
  },
  computed: {
    routerHelper() {
      return RouteHelper;
    },
    /**@type {SubUserCurrentModel}*/
    userCurrentSub() {
      return this.$store.state.userCurrentSub;
    },
    /**@type {UserServicesStateUi}*/
    userServicesState() {
      return this.$store.state.userServicesState;
    },
    hasAnalyzeService() {
      return this.userServicesState.ANALAZEDEGRE.isActive;
    },
    isStudent() {
      return this.$auth?.user?.role === roles.student;
    },

    globalTypeUser() {
      return this.$store.state.globalTypeUser;
    },

    isTahsele() {
      return this.globalTypeUser == globalTypesEnum.tahsele;
    },
  },
  watch: {
    '$store.state.globalTypeUser': {
      deep: true,
      handler(newVal) {
        this.requestTrainingData();
      },
    },

    selectedPeriod: {
      handler(newVal, oldVal) {
        if (!CommonUtils.isEqual(newVal, oldVal)) {
          this.requestTrainingData();
        }
      },
    },
  },

  mounted() {
    this.requestTrainingData();

    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (isJustShown) {
        this.activeCollapse.push(collapseId);
      } else {
        const index = this.activeCollapse.findIndex((k) => k == collapseId);
        if (index !== -1) {
          this.activeCollapse.splice(index, 1);
        }
      }
    });
  },

  methods: {
    async requestTrainingData() {
      try {
        this.isLoadingData = true;
        this.$axios
          .$post(`/dashboard/studentPartOfMainAnalyze`, {
            period: this.selectedPeriod,
            grade: this.globalTypeUser,
          })
          .then((res) => {
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
      const list = [];
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
      const list = [];
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

    toggle(collapseId) {
      this.$root.$emit('bv::toggle::collapse', collapseId);
    },

    secondsToMMSS(totalSeconds) {
      return secondsToMMSS(totalSeconds);
    },

    secondsToHHMM(totalSeconds) {
      return secondsToHHMM(totalSeconds);
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
      this.$router.push({
        path: '/user-panel',
        query: {
          page: userPanelItemsEnum[userPanelItems.trainings],
          parentId,
          childId: childId ?? null,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped src="./student-training.scss"></style>
