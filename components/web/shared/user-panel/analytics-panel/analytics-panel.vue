<template>
  <div class="analytics-page">
    <app-overlay
      v-if="createLoading || isLoadingData"
      :msg="
        createLoading
          ? 'يرجى الانتظار ريثما يتم توليد تدريب مناسب ... شكراً'
          : 'يتم تحميل البيانات ...'
      "
      :fullScreen="true"
    />
    <div
      v-if="(forTeacher || forTrainingStudent) && analyticsData"
      class="student-info"
    >
      <div class="r-part">
        <img
          :src="
            imageUrlService.getUrl(
              ImagesFolderName.Users,
              analyticsData.pictureUrl,
              ImageSize.original,
              ImageExt.jpg
            )
          "
          alt=""
          @error="setDefaultImage"
        />
        <div class="__info">
          <span class="_t1">
            <template v-if="forTrainingStudent">سجل تدريب الطالب</template>
            <template v-else>تحليلات الطالب</template>
          </span>
          <span class="_t2">
            {{
              analyticsData.fullName ? analyticsData.fullName : 'لا يوجد اسم'
            }}
          </span>
          <span class="_t3">
            {{
              analyticsData.userName ? analyticsData.userName : 'لا يوجد اسم'
            }}
          </span>
        </div>
      </div>
      <div class="l-part">
        <app-button
          v-if="forTrainingStudent"
          label="التحليلات"
          size="md"
          iconStartClass="fa fa-solid fa-chart-simple"
          @click="backToMain"
        />
        <app-button
          v-if="forTeacher"
          size="md"
          label="سجل التدريب"
          iconStartClass="fa fa-solid fa-chart-simple"
          @click="toTrainingStudent"
        />
        <app-button
          class="exit-btn"
          variant="outline"
          label="رجوع"
          iconStartClass="fa fa-solid fa-right-from-bracket"
          @click="backToMain"
        />
      </div>
    </div>
    <div
      v-else
      class="analytics-head"
    >
      <span
        class="main-label"
        @click="isDev ? startTour(true) : null"
      >
        تحليلاتي
      </span>
      <div class="d-flex align-items-center gap-2">
        <app-button
          v-if="canStartTour"
          class="sr-ho-button"
          size="sm"
          label="كيف أستخدمها؟"
          colorType="success"
          @click="startTour(true)"
        />
      </div>
    </div>
    <!--  NO DATA   -->
    <div
      v-if="!analyticsData"
      class="b-overly"
    >
      <app-overlay />
    </div>

    <!-- HAS DATA    -->
    <template v-else>
      <template v-if="forTrainingStudent">
        <div class="analytics-data is-training">
          <div
            v-for="(group, index1) of reAnalyticsData"
            :key="`analyticsData_${index1}`"
            class="analytics-group"
          >
            <!--  g-info main toggle  -->
            <div
              :class="{
                'no-child': !hasChild1(group.analayzeStudentCategories),
              }"
              class="g-info"
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
                      {{ secondsToHHMMSS(group.totalTime) }}
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
                    activeCollapse.includes(
                      `analytics-group-accordion-${index}`
                    )
                      ? 'fa-chevron-up'
                      : 'fa-chevron-down'
                  "
                  class="fa collapse-icon"
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
                          {{ secondsToHHMMSS(catGroup.totalTime) }}
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
                          <text-slice
                            :length="12"
                            :text="catGroup.categoryName"
                          />
                        </div>
                        <div class="r-2">
                          <div class="c-3">
                            <span class="t-1">مدة التدريب</span>
                            <span class="t-2">
                              {{ secondsToHHMMSS(catGroup.totalTime) }}
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
                      <template v-if="!windowSize.isMobileSize">
                        <div class="t-head">
                          <span>المهارة</span>
                          <span>الأسئلة</span>
                          <span>الإجابات</span>
                          <span>زمن الإجابة/المتوسط</span>
                          <span>زمن التدريب</span>
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
                                    secondsToMMSS(
                                      tableData.studentTimeTakenRate
                                    )
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
                                {{ secondsToHHMMSS(tableData.totalTime) }}
                              </span>
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
                                    <text-slice
                                      :length="25"
                                      :text="tableData.categoryName"
                                    />
                                  </span>
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
                                      {{ secondsToHHMMSS(tableData.totalTime) }}
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
      <template v-else>
        <div class="analytics-data">
          <div
            v-for="(group, index1) of reAnalyticsData"
            :key="`analyticsData_${index1}`"
            class="analytics-group"
          >
            <!--  g-info main toggle  -->
            <div
              :class="{
                'no-child': !hasChild1(group.analayzeStudentCategories),
              }"
              class="g-info"
            >
              <div class="r-part">
                <div class="rw-1">
                  <text-slice
                    :length="20"
                    :text="group.subjectName"
                  />
                </div>
                <div
                  :data-title="
                    analyticsPanelTour ? analyticsPanelTour.step0.title : null
                  "
                  :data-intro="
                    analyticsPanelTour ? analyticsPanelTour.step0.content : null
                  "
                  class="rw-2"
                >
                  <div class="info-group">
                    <span class="t-1">ترتيبك</span>
                    <span class="t-2">{{ group.studentSort }}</span>
                  </div>
                  <div class="info-group">
                    <span class="t-1">نقاطك</span>
                    <span class="t-2">{{ group.studentPoints }}</span>
                  </div>
                  <div class="info-group">
                    <span class="t-1">الأسئلة</span>
                    <span class="t-2">{{ group.questionsCount }}</span>
                  </div>
                  <div class="info-group">
                    <span class="t-1">النسبة</span>
                    <template v-if="hasAnalyzeService">
                      <template v-if="group.studentRate > 0">
                        <span class="t-2">{{ group.studentRate }}%</span>
                      </template>
                      <template v-else>
                        <span class="t-2">عدد الاسئلة غير كافي</span>
                      </template>
                    </template>
                    <template v-else>
                      <div class="relative">
                        <service-block />
                        <subs-only-block />
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="l-part">
                <div
                  :data-title="
                    analyticsPanelTour ? analyticsPanelTour.step1.title : null
                  "
                  :data-intro="
                    analyticsPanelTour ? analyticsPanelTour.step1.content : null
                  "
                  class="flex flex-column relative items-center gap-3"
                >
                  <service-block v-if="!hasAnalyzeService" />
                  <div class="r-1">
                    <div class="flex items-baseline !gap-1 justify-center">
                      <service-lock v-if="!hasAnalyzeService" />
                      <span>الدرجة المتوقعة</span>
                    </div>
                    <span>في الاختبار الحقيقي</span>
                  </div>
                  <div class="r-2">
                    <template v-if="hasAnalyzeService">
                      <template v-if="group.studentRate">
                        <span class="t-1">%</span>
                        <span class="t-2">
                          {{ getPredictedMark(group.studentRate) }}
                        </span>
                      </template>
                      <template v-else>
                        <span class="te-g-label red">عدد الأسئلة غير كاف</span>
                      </template>
                    </template>
                    <template v-else>
                      <span class="te-g-label">للمشتركين فقط</span>
                    </template>
                  </div>
                </div>
                <i
                  :class="
                    activeCollapse.includes(
                      `analytics-group-accordion-${index}`
                    )
                      ? 'fa-chevron-up'
                      : 'fa-chevron-down'
                  "
                  class="fa collapse-icon"
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
                      <div class="c-2">
                        <app-button
                          :isLoading="
                            !!loading && loading == catGroup.examDefaultId
                          "
                          :isDisabled="
                            !!loading && loading !== catGroup.examDefaultId
                          "
                          size="md"
                          label="تدرب"
                          @click.stop="
                            isStudent
                              ? onTrainClickStudent(catGroup.categoryId)
                              : goTraining(
                                  catGroup.examDefaultId,
                                  catGroup.categoryId
                                )
                          "
                        />
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
                      <div
                        :data-title="
                          index === 0 ? analyticsPanelTour.step2.title : null
                        "
                        :data-intro="
                          index === 0 ? analyticsPanelTour.step2.content : null
                        "
                        class="qw-e"
                      >
                        <div class="c-3 qw">
                          <span class="t-1">التقييم</span>
                          <span class="t-2">
                            {{ getRateLabel(catGroup.rate) }}
                          </span>
                        </div>
                        <div
                          class="c-6"
                          :class="[{ 'no-sub': !hasAnalyzeService }]"
                        >
                          <template v-if="!hasAnalyzeService">
                            <service-block />
                            <service-lock />
                          </template>
                          <a-progress
                            :width="66"
                            type="circle"
                            :percent="catGroup.rate"
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
                                <span
                                  style="
                                    font-size: 16px;
                                    margin-inline-end: 2px;
                                  "
                                >
                                  %
                                </span>
                                <span>{{ percent }}</span>
                              </span>
                            </template>
                          </a-progress>
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
                    <template v-else>
                      <div class="cl-1">
                        <div class="c-1">
                          <text-slice
                            :length="12"
                            :text="catGroup.categoryName"
                          />
                        </div>
                        <div class="c-2">
                          <app-button
                            size="md"
                            :isLoading="
                              !!loading && loading == catGroup.examDefaultId
                            "
                            :isDisabled="
                              !!loading && loading !== catGroup.examDefaultId
                            "
                            label="تدرب"
                            @click.stop="
                              isStudent
                                ? onTrainClickStudent(catGroup.categoryId)
                                : goTraining(
                                    catGroup.examDefaultId,
                                    catGroup.categoryId
                                  )
                            "
                          />
                        </div>
                        <div class="r-2">
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
                      <div
                        :data-title="
                          index === 0 ? analyticsPanelTour.step2.title : null
                        "
                        :data-intro="
                          index === 0 ? analyticsPanelTour.step2.content : null
                        "
                        class="cl-2"
                      >
                        <div
                          class="c-6"
                          :class="[{ 'no-sub': !hasAnalyzeService }]"
                        >
                          <template v-if="!hasAnalyzeService">
                            <service-block />
                            <service-lock />
                          </template>
                          <a-progress
                            :width="66"
                            type="circle"
                            :percent="catGroup.rate"
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
                                <span
                                  style="
                                    font-size: 16px;
                                    margin-inline-end: 2px;
                                  "
                                >
                                  %
                                </span>
                                <span>{{ percent }}</span>
                              </span>
                            </template>
                          </a-progress>
                        </div>
                        <div class="c-3 qw">
                          <span class="t-1">التقييم</span>
                          <span class="t-2">
                            {{ getRateLabel(catGroup.rate) }}
                          </span>
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
                      <template v-if="!windowSize.isMobileSize">
                        <div class="t-head">
                          <span>المهارة</span>
                          <span>الأسئلة</span>
                          <span>الإجابات</span>
                          <span>زمن الإجابة/المتوسط</span>
                          <span>التقييم</span>
                          <span>التدريب</span>
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
                              <div
                                :data-title="
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step3.title
                                    : null
                                "
                                :data-intro="
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step3.content
                                    : null
                                "
                                class="to-12"
                              >
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
                                <span
                                  :data-title="
                                    i === 0 && index === 0
                                      ? analyticsPanelTour.step4.title
                                      : null
                                  "
                                  :data-intro="
                                    i === 0 && index === 0
                                      ? analyticsPanelTour.step4.content
                                      : null
                                  "
                                  class="t-2-1"
                                >
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
                                <span
                                  :data-title="
                                    i === 0 && index === 0
                                      ? analyticsPanelTour.step6.title
                                      : null
                                  "
                                  :data-intro="
                                    i === 0 && index === 0
                                      ? analyticsPanelTour.step6.content
                                      : null
                                  "
                                  class="t-2-1"
                                >
                                  {{
                                    secondsToMMSS(
                                      tableData.studentTimeTakenRate
                                    )
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
                              <div
                                :data-title="
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step8.title
                                    : null
                                "
                                :data-intro="
                                  i === 0 && index === 0
                                    ? analyticsPanelTour.step8.content
                                    : null
                                "
                                class="d-5"
                              >
                                <template v-if="tableData.isEnabled">
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
                                  <app-progress-bar
                                    v-else
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
                                <template v-else>
                                  <div class="w-full relative">
                                    <service-block />
                                    <subs-only-block />
                                  </div>
                                </template>
                              </div>
                              <div class="d-6 relative">
                                <app-overlay
                                  v-if="
                                    !!loading &&
                                    loading == tableData.examDefaultId
                                  "
                                />

                                <div class="w-full relative">
                                  <service-block v-if="!tableData.isEnabled" />
                                  <app-button
                                    v-if="
                                      tableData.hasLawAnalyze &&
                                      !notEnoughQuestions(
                                        tableData.questionsCount,
                                        tableData.rate
                                      )
                                    "
                                    size="md"
                                    :class="[
                                      {
                                        'opacity-60': !tableData.isEnabled,
                                      },
                                    ]"
                                    label="حلل نتيجتي"
                                    @click.stop="
                                      toMyAnalytics(tableData.categoryId)
                                    "
                                  >
                                    <template
                                      v-if="!tableData.isEnabled"
                                      #iconStart
                                    >
                                      <service-lock />
                                    </template>
                                  </app-button>
                                  <app-button
                                    v-else
                                    size="md"
                                    label="تدرب"
                                    @click.stop="
                                      isStudent
                                        ? onTrainClickStudent(
                                            catGroup.categoryId,
                                            tableData.categoryId
                                          )
                                        : goTraining(
                                            tableData.examDefaultId,
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
                          >
                            <div
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
                                  :data-title="
                                    i === 0 && index === 0
                                      ? analyticsPanelTour.step8.title
                                      : null
                                  "
                                  :data-intro="
                                    i === 0 && index === 0
                                      ? analyticsPanelTour.step8.content
                                      : null
                                  "
                                  class="flex justify-center justify-self-center w-full"
                                >
                                  <template v-if="!tableData.isEnabled">
                                    <div class="relative">
                                      <service-block />
                                      <subs-only-block />
                                    </div>
                                  </template>
                                  <template v-else>
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
                                  </template>
                                </div>
                                <div class="dds r-2">
                                  <div
                                    :data-title="
                                      i === 0 && index === 0
                                        ? analyticsPanelTour.step3.title
                                        : null
                                    "
                                    :data-intro="
                                      i === 0 && index === 0
                                        ? analyticsPanelTour.step3.content
                                        : null
                                    "
                                    class="d-2"
                                  >
                                    <span class="label">الأسئلة</span>
                                    <span class="info">
                                      {{ tableData.questionsCount }}
                                    </span>
                                  </div>
                                  <div class="d-3">
                                    <span class="label">الإجابات</span>
                                    <div class="t-group">
                                      <span
                                        :data-title="
                                          i === 0 && index === 0
                                            ? analyticsPanelTour.step4.title
                                            : null
                                        "
                                        :data-intro="
                                          i === 0 && index === 0
                                            ? analyticsPanelTour.step4.content
                                            : null
                                        "
                                        class="t-2-1"
                                      >
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
                                    </div>
                                  </div>
                                  <div class="d-3">
                                    <span class="label">زمنك/المتوسط</span>
                                    <div class="t-group">
                                      <span
                                        :data-title="
                                          i === 0 && index === 0
                                            ? analyticsPanelTour.step6.title
                                            : null
                                        "
                                        :data-intro="
                                          i === 0 && index === 0
                                            ? analyticsPanelTour.step6.content
                                            : null
                                        "
                                        class="t-2-1"
                                      >
                                        {{
                                          secondsToMMSS(
                                            tableData.studentTimeTakenRate
                                          )
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
                                    </div>
                                  </div>
                                </div>
                                <div class="d-5 relative">
                                  <app-overlay
                                    v-if="
                                      !!loading &&
                                      loading == tableData.examDefaultId
                                    "
                                  />

                                  <div class="w-full relative">
                                    <service-block
                                      v-if="!tableData.isEnabled"
                                    />
                                    <app-button
                                      v-if="
                                        tableData.hasLawAnalyze &&
                                        !notEnoughQuestions(
                                          tableData.questionsCount,
                                          tableData.rate
                                        )
                                      "
                                      :class="[
                                        {
                                          'opacity-60': !tableData.isEnabled,
                                        },
                                      ]"
                                      label="حلل نتيجتي"
                                      size="md"
                                      @click.stop="
                                        toMyAnalytics(tableData.categoryId)
                                      "
                                    >
                                      <template
                                        v-if="!tableData.isEnabled"
                                        #iconStart
                                      >
                                        <service-lock />
                                      </template>
                                    </app-button>
                                    <app-button
                                      v-else
                                      label="تدرب"
                                      size="md"
                                      @click.stop="
                                        isStudent
                                          ? onTrainClickStudent(
                                              catGroup.categoryId,
                                              tableData.categoryId
                                            )
                                          : goTraining(
                                              tableData.examDefaultId,
                                              tableData.categoryId
                                            )
                                      "
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </template>
                    </div>

                    <!--  second child of first child of main info -->
                    <template
                      v-if="
                        getChildData(
                          group.analayzeStudentCategories,
                          catGroup.categoryId
                        ).length > 0
                      "
                    >
                      <div
                        v-for="(child, i) of getChildData(
                          group.analayzeStudentCategories,
                          catGroup.categoryId
                        )"
                        class="g-collapse-group child"
                        style="margin-top: 10px"
                      >
                        <!-- toggle of second child  -->
                        <div
                          :class="{
                            'no-child': !hasChild2(
                              group.analayzeStudentCategories,
                              child.categoryId
                            ),
                          }"
                          class="g-collapse-info"
                        >
                          <template v-if="!windowSize.isMobileSize">
                            <div class="c-1">
                              <text-slice
                                :length="15"
                                :text="child.categoryName"
                              />
                            </div>
                            <div class="c-2 relative">
                              <app-overlay
                                v-if="
                                  !!loading && loading == child.examDefaultId
                                "
                              />
                              <app-button
                                size="md"
                                :isDisabled="
                                  !!loading && loading !== child.examDefaultId
                                "
                                label="تدرب"
                                @click.stop="
                                  isStudent
                                    ? onTrainClickStudent(
                                        catGroup.categoryId,
                                        child.categoryId
                                      )
                                    : goTraining(
                                        child.examDefaultId,
                                        child.categoryId
                                      )
                                "
                              />
                            </div>
                            <div class="c-3">
                              <span class="t-1">الأسئلة</span>
                              <span class="t-2">
                                {{ child.questionsCount }}
                              </span>
                            </div>
                            <div class="c-4">
                              <span class="t-1">الإجابات</span>
                              <span class="t-2">
                                <span class="t-2-1">
                                  {{ child.correctAnswersCount }}
                                </span>
                                <span class="t-2-2"></span>
                                <span class="t-2-3">
                                  {{ child.wrongAnswersCount }}
                                </span>
                              </span>
                            </div>
                            <div class="c-3 qw">
                              <span class="t-1">التقييم</span>
                              <span class="t-2">
                                {{ getRateLabel(child.rate) }}
                              </span>
                            </div>

                            <div class="c-6">
                              <a-progress
                                :width="66"
                                type="circle"
                                :percent="child.rate"
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
                                    <span
                                      style="
                                        font-size: 16px;
                                        margin-inline-end: 2px;
                                      "
                                    >
                                      %
                                    </span>
                                    <span>{{ percent }}</span>
                                  </span>
                                </template>
                              </a-progress>
                            </div>
                            <i
                              v-if="
                                hasChild2(
                                  group.analayzeStudentCategories,
                                  child.categoryId
                                )
                              "
                              :class="
                                activeCollapse.includes(
                                  `g-group-accordion-child-${i}`
                                )
                                  ? 'fa-chevron-up'
                                  : 'fa-chevron-down'
                              "
                              class="fa collapse-icon"
                            ></i>
                          </template>
                          <template v-else>
                            <div class="cl-1">
                              <div class="c-1">
                                <text-slice
                                  :length="12"
                                  :text="child.categoryName"
                                />
                              </div>
                              <div class="c-2">
                                <app-button
                                  :isLoading="
                                    !!loading && loading == child.examDefaultId
                                  "
                                  :isDisabled="
                                    !!loading && loading !== child.examDefaultId
                                  "
                                  size="md"
                                  label="تدرب"
                                  @click.stop="
                                    isStudent
                                      ? onTrainClickStudent(
                                          catGroup.categoryId,
                                          child.categoryId
                                        )
                                      : goTraining(
                                          child.examDefaultId,
                                          child.categoryId
                                        )
                                  "
                                />
                              </div>
                              <div class="r-2">
                                <div class="c-3">
                                  <span class="t-1">الأسئلة</span>
                                  <span class="t-2">
                                    {{ child.questionsCount }}
                                  </span>
                                </div>
                                <div class="c-4">
                                  <span class="t-1">الإجابات</span>
                                  <span class="t-2">
                                    <span class="t-2-1">
                                      {{ child.correctAnswersCount }}
                                    </span>
                                    <span class="t-2-2"></span>
                                    <span class="t-2-3">
                                      {{ child.wrongAnswersCount }}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="cl-2">
                              <div
                                class="c-6"
                                :class="[{ 'no-sub': !hasAnalyzeService }]"
                              >
                                <template v-if="!hasAnalyzeService">
                                  <service-block />
                                  <service-lock />
                                </template>
                                <a-progress
                                  :width="66"
                                  type="circle"
                                  :percent="child.rate"
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
                                      <span
                                        style="
                                          font-size: 16px;
                                          margin-inline-end: 2px;
                                        "
                                      >
                                        %
                                      </span>
                                      <span>{{ percent }}</span>
                                    </span>
                                  </template>
                                </a-progress>
                              </div>
                              <div class="c-3 qw">
                                <span class="t-1">التقييم</span>
                                <span class="t-2">
                                  {{ getRateLabel(child.rate) }}
                                </span>
                              </div>
                            </div>
                            <i
                              v-if="
                                hasChild2(
                                  group.analayzeStudentCategories,
                                  child.categoryId
                                )
                              "
                              :class="
                                activeCollapse.includes(
                                  `g-group-accordion-${index}`
                                )
                                  ? 'fa-chevron-up'
                                  : 'fa-chevron-down'
                              "
                              class="fa collapse-icon"
                            ></i>
                          </template>
                        </div>

                        <!--  second child collapse of first child collapse -->
                        <b-collapse
                          v-if="
                            hasChild2(
                              group.analayzeStudentCategories,
                              child.categoryId
                            )
                          "
                          :id="`g-group-accordion-child-${i}`"
                          visible
                          class="g-group-accordion-child"
                          role="tabpanel"
                        >
                          <!--    tables of second child  -->
                          <div
                            v-if="
                              getTableData(
                                group.analayzeStudentCategories,
                                child.categoryId
                              ).length > 0
                            "
                            class="g-collapse-table"
                          >
                            <div class="t-head">
                              <span>المهارة</span>
                              <span>الأسئلة</span>
                              <span>الإجابات</span>
                              <span>زمن الإجابة/المتوسط</span>
                              <span>التقييم</span>
                              <span>التدريب</span>
                            </div>
                            <div class="t-data">
                              <div
                                v-for="(tableData, i) of getTableData(
                                  group.analayzeStudentCategories,
                                  child.categoryId
                                )"
                                class="t-col"
                                :class="[
                                  { 'is-disabled': !tableData.isEnabled },
                                ]"
                              >
                                <span class="d-1">
                                  <text-slice
                                    :length="20"
                                    :text="tableData.categoryName"
                                  />
                                </span>
                                <span class="d-2">
                                  {{ tableData.questionsCount }}
                                </span>
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
                                  <app-progress-bar
                                    v-else
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
                                </div>
                                <div class="d-6 relative">
                                  <app-overlay
                                    v-if="
                                      !!loading &&
                                      loading == child.examDefaultId
                                    "
                                  />
                                  <div class="w-full relative">
                                    <service-block
                                      v-if="!tableData.isEnabled"
                                    />
                                    <app-button
                                      size="md"
                                      label="تدرب"
                                      @click.stop="
                                        isStudent
                                          ? onTrainClickStudent(
                                              catGroup.categoryId,
                                              child.categoryId
                                            )
                                          : goTraining(
                                              child.examDefaultId,
                                              child.categoryId
                                            )
                                      "
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <template
                            v-if="
                              getChildData(
                                group.analayzeStudentCategories,
                                child.categoryId
                              ).length > 0
                            "
                          >
                            <div
                              v-for="(child, i) of getChildData(
                                group.analayzeStudentCategories,
                                child.categoryId
                              )"
                              class="g-collapse-group child"
                              style="margin-top: 10px"
                            >
                              <!-- toggle of second child  -->
                              <div class="g-collapse-info">
                                <template v-if="!windowSize.isMobileSize">
                                  <div class="c-1">
                                    <text-slice
                                      :length="15"
                                      :text="child.categoryName"
                                    />
                                  </div>
                                  <div class="c-2">
                                    <app-button
                                      :isLoading="
                                        !!loading &&
                                        loading == child.examDefaultId
                                      "
                                      :isDisabled="
                                        !!loading &&
                                        loading !== child.examDefaultId
                                      "
                                      size="md"
                                      label="تدرب"
                                      @click.stop="
                                        isStudent
                                          ? onTrainClickStudent(
                                              catGroup.categoryId,
                                              child.categoryId
                                            )
                                          : goTraining(
                                              child.examDefaultId,
                                              child.categoryId
                                            )
                                      "
                                    />
                                  </div>
                                  <div class="c-3">
                                    <span class="t-1">الأسئلة</span>
                                    <span class="t-2">
                                      {{ child.questionsCount }}
                                    </span>
                                  </div>
                                  <div class="c-4">
                                    <span class="t-1">الإجابات</span>
                                    <span class="t-2">
                                      <span class="t-2-1">
                                        {{ child.correctAnswersCount }}
                                      </span>
                                      <span class="t-2-2"></span>
                                      <span class="t-2-3">
                                        {{ child.wrongAnswersCount }}
                                      </span>
                                    </span>
                                  </div>
                                  <div class="c-3 qw">
                                    <span class="t-1">التقييم</span>
                                    <span class="t-2">
                                      {{ getRateLabel(child.rate) }}
                                    </span>
                                  </div>
                                  <div
                                    class="c-6"
                                    :class="[{ 'no-sub': !hasAnalyzeService }]"
                                  >
                                    <template v-if="!hasAnalyzeService">
                                      <service-block />
                                      <service-lock />
                                    </template>
                                    <a-progress
                                      :width="66"
                                      type="circle"
                                      :percent="child.rate"
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
                                          <span
                                            style="
                                              font-size: 16px;
                                              margin-inline-end: 2px;
                                            "
                                          >
                                            %
                                          </span>
                                          <span>{{ percent }}</span>
                                        </span>
                                      </template>
                                    </a-progress>
                                  </div>
                                </template>
                                <template v-else>
                                  <div class="cl-1">
                                    <div class="c-1">
                                      <text-slice
                                        :length="12"
                                        :text="child.categoryName"
                                      />
                                    </div>
                                    <div class="c-2">
                                      <app-button
                                        :isLoading="
                                          !!loading &&
                                          loading == child.examDefaultId
                                        "
                                        :isDisabled="
                                          !!loading &&
                                          loading !== child.examDefaultId
                                        "
                                        label="تدرب"
                                        size="md"
                                        @click.stop="
                                          isStudent
                                            ? onTrainClickStudent(
                                                catGroup.categoryId,
                                                child.categoryId
                                              )
                                            : goTraining(
                                                child.examDefaultId,
                                                child.categoryId
                                              )
                                        "
                                      />
                                    </div>
                                    <div class="r-2">
                                      <div class="c-3">
                                        <span class="t-1">الأسئلة</span>
                                        <span class="t-2">
                                          {{ child.questionsCount }}
                                        </span>
                                      </div>
                                      <div class="c-4">
                                        <span class="t-1">الإجابات</span>
                                        <span class="t-2">
                                          <span class="t-2-1">
                                            {{ child.correctAnswersCount }}
                                          </span>
                                          <span class="t-2-2"></span>
                                          <span class="t-2-3">
                                            {{ child.wrongAnswersCount }}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="cl-2">
                                    <div
                                      class="c-6"
                                      :class="[
                                        { 'no-sub': !hasAnalyzeService },
                                      ]"
                                    >
                                      <template v-if="!hasAnalyzeService">
                                        <service-block />
                                        <service-lock />
                                      </template>
                                      <a-progress
                                        :width="66"
                                        type="circle"
                                        :percent="child.rate"
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
                                            <span
                                              style="
                                                font-size: 16px;
                                                margin-inline-end: 2px;
                                              "
                                            >
                                              %
                                            </span>
                                            <span>{{ percent }}</span>
                                          </span>
                                        </template>
                                      </a-progress>
                                    </div>
                                    <div class="c-3 qw">
                                      <span class="t-1">التقييم</span>
                                      <span class="t-2">
                                        {{ getRateLabel(child.rate) }}
                                      </span>
                                    </div>
                                  </div>
                                </template>
                              </div>
                            </div>
                          </template>
                        </b-collapse>
                      </div>
                    </template>
                  </b-collapse>
                </div>
              </template>
            </b-collapse>
          </div>
          <div class="analytics-group">
            <div class="chart-collapse-group">
              <div class="ch-header">
                <span class="ch-title">تطور أدائك في المنصة</span>
                <i
                  :class="
                    activeCollapse.includes(`analytics-chart-accordion`)
                      ? 'fa-chevron-up'
                      : 'fa-chevron-down'
                  "
                  class="fa collapse-icon"
                ></i>
              </div>
              <b-collapse
                :id="`analytics-chart-accordion`"
                visible
                class="analytics-group-collapse g-group-collapse"
                role="tabpanel"
              >
                <div
                  v-if="hasAnalyzeService"
                  class="ch-content"
                >
                  <client-only>
                    <div class="w-full h-full flex flex-col gap-2 relative">
                      <app-overlay
                        v-if="isLoadingChartData"
                        msg="⏳ جاري تحميل بيانات المخطط ..."
                        :style="'height: 250px'"
                      />
                      <div
                        class="d-flex align-items-center justify-content-lg-end justify-content-center gap-2"
                      >
                        <form-select
                          v-model:selectedValues="selectedChartSub"
                          inputId="selectedChartSub"
                          class="align-self-end"
                          style="width: 150px"
                          :list="parentFilterList"
                          :clearable="false"
                          :label="'القسم'"
                          :placeholder="'القسم'"
                          :isMulti="false"
                        />
                        <form-select
                          v-model:selectedValues="selectedChartPeriod"
                          inputId="selectedChartPeriod"
                          class="align-self-end"
                          style="width: 150px"
                          :clearable="false"
                          :list="chartPeriodList"
                          :label="'المدة'"
                          :placeholder="'المدة'"
                          :isMulti="false"
                        />
                      </div>
                      <template v-if="!isLoadingChartData">
                        <component
                          :is="apexComponent"
                          v-if="apexComponent && filterChartData.length > 0"
                          :key="chartKey"
                          :height="'300px'"
                          :series="chartLineSeries"
                          :options="chartLineOptions"
                        />
                        <span
                          v-else-if="!isLoadingChartData"
                          class="no-data"
                        >
                          لم تتدرب بشكل كافي ضمن الفترة الزمنية المختارة
                        </span>
                      </template>
                    </div>
                  </client-only>
                </div>

                <div
                  v-else
                  class="mt-2"
                >
                  <div
                    class="relative"
                    style="cursor: pointer"
                  >
                    <img
                      width="100%"
                      height="auto"
                      src="/images/png/no-chart.png"
                      alt="no-chart"
                    />
                    <service-block />
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
        </div>
        <template v-if="checkedExam">
          <exam-action-modal
            v-model:isOpen="isOpenModal"
            :lastDate="checkedExam.lastDate"
            @onReset="examReset"
            @onComplement="examComplement"
          />
        </template>
      </template>
    </template>

    <delete-modal
      v-model:isOpen="isOpenResetAnalyticsModalModal"
      :isReject="resetAnalyticsModalTexts.isReject"
      :msg="resetAnalyticsModalTexts.msg"
      :label="resetAnalyticsModalTexts.label"
      :exLabel="resetAnalyticsModalTexts.exLabel"
      @onConfirm="confirmResetAnalytics()"
    />
  </div>
</template>
<script lang="ts">
import { Progress } from 'ant-design-vue';
import { useIntroService } from '~/main/services/useIntroService';
import { ImagesFolderName } from '~/main/constants/images-folder-name';
import { ImageSize } from '~/main/constants/image-size';
import { ImageExt } from '~/main/constants/image-ext';
import { setDefaultImage } from '~/main/utils/set-default-image.util';
import { getRateLabel, IS_PRODUCTION_APP } from '~/main/utils/shared-utils';
import { RouteHelper } from '~/main/utils/route-helper';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { useGlobalStore } from '~/main/useGlobalStore';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { GlobalTypes } from '~/main/constants/global-types';
import { deepEqualUtil } from '~/main/utils/lodash.utils';
import {
  dateDayUi,
  dateUi,
  secondsToHHMMSS,
  secondsToMMSS,
} from '~/main/utils/date-utils';
import { APP_CONFIG } from 'public/constants/app-config';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import { AppLocalStorage } from '~/main/utils/app-storage';
import { appEvents } from '~/main/shared/events/app.events';
import { take } from 'rxjs';
import { useApexChartService } from '~/main/services/useApexChartService';

class examForm {
  subjectId: number | string;
  willDo = false;
  withoutStudentEvaluate = false;
  randomLevel = false;
  isOpen = false;
  tagsIds = [];
  takfeelTagsIds = [];
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  randomQuestionsSettings = [];
  constructor(subjectId: number | string) {
    this.subjectId = subjectId;
  }
}

const periodList = [
  { id: 0, label: 'كامل المدة' },
  { id: 1, label: 'البارحة' },
  { id: 2, label: 'الأسبوع الماضي' },
  { id: 3, label: 'الشهر الماضي' },
];

const chartPeriodList = [
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

const resetAnalyticsModalTexts = {
  msg: 'بتصفير بيانات التحليل؟',
  label: 'سيتم مسح بيانات التحليل الحالية',
  exLabel: 'لن تتمكن من استعادتها',
  isReject: false,
};

export default {
  components: { 'a-progress': Progress },

  props: {
    forTeacher: Boolean,
    forTrainingStudent: Boolean,
    studentId: Number as PropType<number | null>,
  },
  setup() {
    const globalStore = useGlobalStore();
    const introService = useIntroService();
    const windowSize = useWindowSize();
    const runtimeConfig = useRuntimeConfig();
    const form = ref(new examForm(runtimeConfig.public.defaultSubjectId));
    const imageUrl = useImageUrl();
    const subscriptionsStore = useSubscriptionsStore();
    return {
      apexChartService: useApexChartService(),
      runtimeConfig,
      ...useSetupAuth(),
      ...useSetupRoute(),
      ...useToastMessage(),
      globalTypeUser: computed(() => globalStore.state.globalTypeUserValue),
      userServicesState: computed(
        () => subscriptionsStore.state.userServicesStateVal
      ),
      userCurrentSub: computed(
        () => subscriptionsStore.state.userCurrentSubVal
      ),
      analyticsPanelTour: computed(() => introService.analyticsPanelTour),
      introService,
      windowSize,
      form,
      imageUrlService: imageUrl,
      isDev: !IS_PRODUCTION_APP,
    };
  },

  data() {
    return {
      mockData: [
        { date: '2024-08-14T00:00:00+02:00', count: 21 },
        { date: '2024-08-14T00:00:00+03:00', count: 21 },
        { date: '2024-08-12T00:00:00+02:00', count: 20 },
        { date: '2024-08-11T00:00:00+02:00', count: 22 },
        { date: '2024-08-10T00:00:00+02:00', count: 30 },
        { date: '2024-08-09T00:00:00+02:00', count: 31 },
        { date: '2024-08-02T00:00:00+02:00', count: 29 },
        { date: '2024-08-02T00:00:00+02:00', count: 28 },
        { date: '2024-08-01T00:00:00+02:00', count: 27 },
      ],
      analyticsData: null as any | null,
      activeCollapse: [] as any[],
      checkedExam: null as any | null,
      isOpenModal: false,
      createLoading: false,
      selectedExamId: null,
      loading: false as boolean | number | null,
      tourModel: {
        isShownOnce: false,
        isActive: false,
      },
      openModalsCount: 0,
      isLoadingData: false,
      periodList: periodList,
      selectedPeriod: periodList[0].id,
      resetAnalyticsModalTexts: resetAnalyticsModalTexts,
      isOpenResetAnalyticsModalModal: false,
      chartPeriodList,
      selectedChartPeriod: chartPeriodList[0].id,
      selectedChartSub: 0 as null | number,
      isLoadingChartData: false,
      apexComponent: null,
      filterChartData: [],
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
          width: 2,
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
      isMobile: false,
    };
  },
  computed: {
    stateModel() {
      return [this.selectedChartPeriod, this.selectedChartSub];
    },
    ImageExt() {
      return ImageExt;
    },
    ImageSize() {
      return ImageSize;
    },
    ImagesFolderName() {
      return ImagesFolderName;
    },
    reAnalyticsData() {
      if (this.forTeacher || this.forTrainingStudent) {
        return this.analyticsData.analyzes;
      }
      return this.analyticsData;
    },

    parentFilterList() {
      if (!Array.isArray(this.reAnalyticsData))
        return [{ id: 0, label: 'الكل' }];

      const result = this.reAnalyticsData.flatMap((res) =>
        Array.isArray(res?.analayzeStudentCategories)
          ? res.analayzeStudentCategories
              .filter((k) => k?.parentId == null)
              .map((k) => ({
                id: k.categoryId,
                label: k.categoryName,
              }))
          : []
      );

      return [{ id: 0, label: 'الكل' }, ...result];
    },

    canStartTour() {
      return (
        this.introService.isIntroLibReady &&
        !this.createLoading &&
        !!this.analyticsData
      );
    },
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
    chartApiUrl() {
      if (this.forTeacher) {
        return `/dashboard/totalAnalyzeDetailsForStudentForTeacher/${this.studentId}`;
      }
      return '/dashboard/totalAnalyzeDetailsForStudent';
    },
    chartApiBody() {
      return {
        grade: this.globalTypeUser,
        period: this.selectedChartPeriod,
        ...(this.forTeacher
          ? {}
          : {
              parentId:
                this.selectedChartSub == 0 ? null : this.selectedChartSub,
            }),
      };
    },
  },
  watch: {
    stateModel: {
      deep: true,
      handler([newPeriod, newSub], [oldPeriod, oldSub]) {
        if (
          !deepEqualUtil(newPeriod, oldPeriod) ||
          !deepEqualUtil(newSub, oldSub)
        ) {
          if (
            (!this.forTrainingStudent && newSub === undefined) ||
            this.forTrainingStudent
          ) {
            return;
          }
          this.requestChartData();
        }
      },
    },
    canStartTour: {
      deep: true,
      handler(val) {
        if (val) {
          this.checkOpenModals();
        }
      },
    },
    openModalsCount(newVal) {
      if (newVal === 0) {
        this.startTour();
      }
    },

    globalTypeUser: {
      deep: true,
      handler(newVal) {
        this.requestData();
      },
    },

    selectedPeriod: {
      handler(newVal, oldVal) {
        if (!deepEqualUtil(newVal, oldVal)) {
          this.requestData();
        }
      },
    },
  },

  mounted() {
    this.requestData();

    if (!this.forTrainingStudent) {
      this.loadChartApex();
    }
  },
  beforeUnmount() {
    this.exitTour();
  },

  methods: {
    setDefaultImage,
    backToMain() {
      this.$emit('backToMain');
    },

    toTrainingStudent() {
      this.$emit('toTraining');
    },

    requestData() {
      if (this.studentId) {
        if (this.forTeacher) {
          this.requestStudentData();
        }
        if (this.forTrainingStudent) {
          this.requestTrainingData();
        }
      } else {
        this.requestUserData();
      }
      if (!this.forTrainingStudent) {
        if (this.selectedChartSub) {
          this.selectedChartSub = null;
          return;
        }
        this.requestChartData();
      }
    },

    async requestUserData() {
      try {
        this.isLoadingData = true;
        const { data } = await this.$axios.get(
          `/dashboard/analyzeStudentPage?grade=${this.globalTypeUser}`
        );
        data.forEach((k) => {
          k.analayzeStudentCategories.sort((a, b) => {
            return a.sort - b.sort;
          });
        });
        this.analyticsData = data;
        this.isLoadingData = false;
      } catch (e) {
        this.isLoadingData = false;
        console.log(e);
      }
    },

    async requestStudentData() {
      try {
        this.isLoadingData = true;
        const { data } = await this.$axios.get(
          `/dashboard/studentMainAnalyzeForTeacher/${this.studentId}?grade=${this.globalTypeUser}`
        );
        data.analyzes.forEach((k) => {
          k.analayzeStudentCategories.sort((a, b) => {
            return a.sort - b.sort;
          });
        });
        this.analyticsData = data;
        this.isLoadingData = false;
      } catch (e) {
        this.isLoadingData = false;
        console.log(e);
      }
    },

    async requestTrainingData() {
      try {
        this.isLoadingData = true;
        this.$axios
          .post(`dashboard/studentPartOfMainAnalyzeForTeacher`, {
            period: this.selectedPeriod,
            studentId: this.studentId,
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

    requestChartData() {
      try {
        this.isLoadingChartData = true;
        this.$axios
          .post(this.chartApiUrl, this.chartApiBody)
          .then(({ data: res }) => {
            this.initChart(res);
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            this.isLoadingChartData = false;
          });
      } catch (e) {
        this.isLoadingChartData = false;
        console.log(e);
      }
    },

    async initChart(data) {
      try {
        this.filterChartData = this.getChartFilterData(data);
        //this.filterChartData = this.getChartFilterData(this.mockData);
        this.setChartData(this.filterChartData);
      } catch (e) {
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

    getRateLabel(rate) {
      if (!this.hasAnalyzeService) {
        return 'للمشتركين';
      }
      return getRateLabel(rate);
    },

    reBuildData() {
      this.reAnalyticsData.forEach((res) => {
        res.analayzeStudentCategories.forEach((k, index) => {
          if (k.parentId == null) {
            res.analayzeStudentCategories[index].push({ isParent: true });
          }
        });
      });
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

    secondsToHHMMSS(totalSeconds) {
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

    resetForm() {
      this.form = new examForm(this.runtimeConfig.public.defaultSubjectId);
    },

    isChild(catId) {
      return new Promise((resolve) => {
        this.reAnalyticsData.forEach((dataList) => {
          dataList.analayzeStudentCategories.forEach((res) => {
            if (res.categoryId == catId) {
              if (res.parentId == null) {
                resolve(false);
              }
              resolve(true);
            }
          });
        });
      });
    },

    createRandomQuestionsSettings(catId) {
      //eslint-disable-next-line
      return new Promise(async (resolve) => {
        let list: any[] = [];
        if (await this.isChild(catId)) {
          list = [{ categoryId: catId, questionLevel: 0, questionsCount: 0 }];
        } else {
          this.reAnalyticsData.forEach((dataList) => {
            dataList.analayzeStudentCategories.forEach((res) => {
              if (res.parentId && res.parentId == catId) {
                list.push({
                  categoryId: res.categoryId,
                  questionLevel: 0,
                  questionsCount: 0,
                });
              }
            });
          });
        }
        resolve(list);
      });
    },

    onTrainClickStudent(parentId, childId = null) {
      this.appRouter.push({
        path: '/user-panel',
        query: {
          page: UserPanelItemsRecord[UserPanelItems.trainings],
          parentId,
          childId: childId ?? null,
        },
      });
    },

    toMyAnalytics(id) {
      if (this.studentId) {
        this.appRouter.push({
          path: `/student/analytics/${this.studentId}?catId=${id}`,
        });
        return;
      }
      this.appRouter.push({
        path: `/student/analytics/${id}`,
      });
    },

    async goTraining(examId, catId) {
      try {
        if (!this.userCurrentSub?.endDate) {
          this.appRouter.push({
            path: '/user-panel',
            query: {
              page: UserPanelItemsRecord[UserPanelItems.subscriptionList],
            },
          });
        } else {
          this.appRouter.push({
            path: '/user-panel',
            query: {
              page: UserPanelItemsRecord[UserPanelItems.trainings],
            },
          });
          /*this.loading = examId;
          //this.createLoading = true;
          this.form.randomQuestionsSettings =
            await this.createRandomQuestionsSettings(catId);
          this.form.subjectId = this.isTahsele
            ? process.env.defaultSubjectIdTahsele
            : process.env.defaultSubjectId;
          const url =
            process.env.currentEnv === 'dev'
              ? 'studentsExam/customFromTags'
              : 'studentsExam/custom';
          const res = await this.$axios.$post(url, this.form);
          //this.createLoading = false;
          if (res.id) {
            await this.$router.push(`/student/training/${res.id}`);
            this.loading = null;
          }
          this.checkedExam = await this.checkExam(examId);
          if (this.checkedExam.hasExam) {
            this.selectedExamId = examId;
            this.examReset();
          } else {
            this.createLoading = true;
            const res = await this.$axios.$post('/studentsExam', {
              examId: examId,
              willDo: false,
            });
            if (res.id) {
              await this.$router.push(`/student/training/${res.id}`);
            }
            this.createLoading = false;
          }
          this.loading = null*/
        }
      } catch (e) {
        this.loading = null;
        this.createLoading = false;
        this.showError();
      }
    },

    async checkExam(id) {
      const { data } = await this.$axios.get(`/studentsExam/checkExam/${id}`);
      return data;
    },

    async examReset() {
      try {
        this.createLoading = true;
        const { data: res } = await this.$axios.post(
          `/studentsExam/submit/${this.checkedExam.examId}`
        );
        if (res) {
          const { data: createdExam } = await this.$axios.post(
            '/studentsExam',
            {
              examId: this.selectedExamId,
              willDo: false,
            }
          );
          this.createLoading = false;
          await this.appRouter.push(`/student/training/${createdExam.id}`);
        }
      } catch (e) {
        this.createLoading = false;
        console.log(e);
      }
    },

    async examComplement() {
      try {
        await this.appRouter.push(
          `/student/training/${this.checkedExam.examId}`
        );
      } catch (e) {
        console.log(e);
      }
    },

    notEnoughQuestions(qCount, rate) {
      return APP_CONFIG.analyticsMinQuestion > qCount || rate == 0;
    },

    getPredictedMark(mark) {
      const numericMark = Number(mark);
      if (numericMark >= 100) {
        return 100;
      }
      const increaseMark = numericMark + 5;
      const cappedMark = increaseMark > 100 ? 100 : increaseMark;
      return `${numericMark}-${cappedMark}`;
    },

    async startTour(forceShow = false) {
      this.$nextTick(async () => {
        const userId = this.appAuth.user.id;
        const tourState = AppLocalStorage.getTourState(userId).analyticsPanel;
        if (tourState.isShown && !forceShow) return;

        //set to shown and trigger
        AppLocalStorage.setIntroState(userId, {
          analyticsPanel: {
            isShown: true,
          },
        });
        await this.introService.introInstanceState?.lib
          ?.setOptions({
            ...this.introService.tourConfig,
            scrollToElement: this.windowSize.isMobileSize,
          })
          .start();
        this.tourModel.isActive = true;

        //apply style while tour
        this.introService.introInstanceState.lib?.onbeforeexit(() => {
          this.tourModel.isActive = false;
          return true;
        });

        //apply first step simulate
        if (!this.tourModel.isShownOnce) {
          this.tourModel.isShownOnce = true;
        }
      });
    },
    async exitTour() {
      this.introService.introInstanceState.lib?.exit(true);
    },

    checkOpenModals() {
      if (import.meta.client) {
        if (
          this.appAuth.loggedIn &&
          localStorage.getItem(`firstRegister_${this.appAuth.user.id}`)
        ) {
          this.openModalsCount++; // المودال الأول مفتوح

          appEvents.helloModal$.pipe(take(1)).subscribe(() => {
            this.openModalsCount--; // تقليل العدد عند الإغلاق
          });
        }

        if (!sessionStorage.getItem('adModalShown')) {
          this.openModalsCount++; // المودال الثاني مفتوح

          appEvents.pannerModalHidden$.pipe(take(1)).subscribe(() => {
            this.openModalsCount--; // تقليل العدد عند الإغلاق
          });
        }

        // إذا لم يكن هناك أي مودال مفتوح، نبدأ الجولة فورًا
        if (this.openModalsCount === 0) {
          this.startTour();
        }
      }
    },

    toResetAnalytics() {
      this.isOpenResetAnalyticsModalModal = true;
    },

    confirmResetAnalytics() {
      try {
        this.$axios
          .delete(`/dashboard/removeAllStudentAnalyzeData`)
          .then(({ data: res }) => {
            if (res && res.isDeleted) {
              this.requestData();
              this.showSuccess();
              return;
            }
            this.showError();
          })
          .catch((e) => {
            this.showError();
          })
          .finally(() => (this.isOpenResetAnalyticsModalModal = false));
      } catch (e) {
        console.error(e);
      }
    },

    async loadChartApex() {
      await this.apexChartService.initApexChart();
    },
  },
};
</script>
<style lang="scss" scoped src="./analytics-panel.scss"></style>
