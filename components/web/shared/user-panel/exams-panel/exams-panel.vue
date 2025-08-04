<template>
  <app-overlay v-if="fetchLoading || !staticData">
    <div style="height: 580px"></div>
  </app-overlay>
  <div
    v-else
    class="exams-part relative"
  >
    <app-overlay v-if="examLoading" />
    <div class="w-full flex items-center justify-between">
      <h3 class="t-title">{{ texts.title }}</h3>
      <app-button
        v-if="selectedType != examTypes.exams"
        class="sr-ho-button"
        size="sm"
        label="شرح الاستخدام"
        colorType="success"
        @click="startTour(true)"
      />
    </div>
    <template v-if="showRemainingCount">
      <div
        class="ra-count flex flex-col lg:flex-row items-start justify-start lg:justify-between gap-[10px] my-2 px-[15px] py-[15px] rounded-[8px] border-[#EAB316] bg-[#FFFBEB] border"
      >
        <div class="flex gap-[15px]">
          <img
            src="/images/icons/triangle-exclamation.png"
            alt="warn"
            class="flex items-center justify-center m-auto"
          />
          <div class="flex flex-col gap-[5px]">
            <span class="text-[#92400E] text-[14px] lg:text-[16px] font-bold">
              لديك {{ userCurrentSub.remainTrainingCountPerDay }} محاولات تدريب
              مجانية لهذا اليوم
            </span>
            <span class="text-[#92400E] text-[13px] lg:text-[14]">
              اشترك في باقات اختبارات لتتدرب بلا حدود!
            </span>
          </div>
        </div>
        <nuxt-link
          class="flex items-center justify-center self-center"
          :to="webUserDashboardPlan()"
        >
          <app-button
            class="ra-bu"
            label="اشترك الان"
            iconEndClass="fa fa-chevron-left"
          />
        </nuxt-link>
      </div>
    </template>
    <h4 class="t-text">
      {{ staticData.topText }}
    </h4>

    <div class="w-full flex flex-col relative qwgg">
      <div
        v-if="isExams"
        class="switch swq-qt"
      >
        <custom-switch
          v-model:active="activeSwitch"
          :rightLabel="texts.switchRight"
          :leftLabel="texts.switchLeft"
        />
        <template v-if="userCurrentSub">
          <span
            v-if="showRemainExamCount"
            class="swq-qt__wa"
          >
            باقي لديك {{ userCurrentSub.remainExamsCount }} محاولة مجانية في
            الباقة الأساسية
          </span>
          <template v-else-if="userCurrentSub.remainExamsCount < 1">
            <div class="flex flex-col items-center">
              <div class="swq-qt__qe relative">
                <service-block />
                <service-lock />
                <span class="swq-qt__wa">
                  استنفذت المحاولات المجانية المتاحة
                </span>
              </div>
              <nuxt-link
                class="swq-qt__ll"
                :to="routerHelper.userPanelSubscriptions()"
              >
                ترقية الاشتراك
              </nuxt-link>
            </div>
          </template>
        </template>
      </div>

      <div
        v-if="
          isExams
            ? categoryList && categoryList.length > 0 && activeSwitch
            : categoryList && categoryList.length > 0
        "
        :ref="introService.trainingPanelTour.step1.ref"
        data-step="1"
        :data-disable-interaction="false"
        :data-title="introService.trainingPanelTour.step1.title"
        :data-intro="introService.trainingPanelTour.step1.content"
        class="rw-cards"
      >
        <template
          v-for="(card, index) of categoryList"
          :key="`card_${index}`"
        >
          <div
            v-if="card.children.length > 0"
            class="card"
          >
            <div class="ca-head">
              <em-checkbox
                :ref="`card-checkbox-${index}`"
                :indeterminate="someItemSelected(card.id)"
                :checked="allItemSelected(card.id)"
                @onCheck="onSelectCard($event, card.id)"
              />
              <label @click="checkCard(index)">{{ card.label }}</label>
            </div>
            <div class="ca-contents relative">
              <service-block v-if="!canSelectCardItem()" />
              <div
                v-for="item of card.children"
                :key="item.id"
                class="item"
                :class="{ active: selectedCardRe.some((k) => k === item.id) }"
                @click="selectItem(item.id)"
              >
                <text-slice
                  :length="20"
                  :text="item.label"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="rw-bank w-full">
        <prime-accordion
          v-if="selectedType == examTypes.trainings"
          id="bank-training-collapse"
          :ref="trainingPanelTour.step2.ref"
          :value="examTypes.trainings"
          data-step="2"
          :data-disable-interaction="true"
          :data-title="isXlWindow ? trainingPanelTour.step2.title : null"
          :data-intro="isXlWindow ? trainingPanelTour.step2.content : null"
        >
          <prime-accordion-panel
            :value="examTypes.trainings"
            class="cw-bank"
          >
            <prime-accordion-header class="c-head">
              <div class="flex items-center justify-start"></div>
              <div class="r-part">
                <!--                <i class="ek-icon-sliders-solid"></i>-->
                <span class="r_tt">خصص تدريبك</span>
                <span class="me-t">تحكم بالأسئلة التي تريد أن تتدرب عليها</span>
              </div>
            </prime-accordion-header>
            <prime-accordion-content>
              <div class="__bank">
                <div class="select-items-wrapper">
                  <div class="select-items-wrapper__st">
                    <div class="relative">
                      <service-block
                        v-if="!userServicesState.BANKUSAGE.isActive"
                      />
                      <app-select-card-item
                        title="أحدث 1000 سؤال"
                        iconSvgPath="/images/svg/sparkles_icon.svg"
                        label="تدرب على أحدث الأسئلة والتسريبات فقط"
                        color="blue"
                        :isActive="isRecentQuestionActive"
                        :isDisabled="
                          !userServicesState.ROWNQUESTIONPRACTICE.isActive
                        "
                        @click="onRecentSelect"
                      />
                    </div>
                    <div class="relative">
                      <service-block
                        v-if="!userServicesState.ROWNQUESTIONPRACTICE.isActive"
                      />
                      <app-select-card-item
                        title="الأسئلة التي أخطأت فيها"
                        iconSvgPath="/images/png/sub.png"
                        label="تدرب على الأسئلة التي أخطأت فيها فقط"
                        color="red"
                        :isActive="advancedFilter.onlyWrongQuestions"
                        :isDisabled="
                          !userServicesState.ROWNQUESTIONPRACTICE.isActive
                        "
                        @click="
                          () => (
                            (advancedFilter.onlyWrongQuestions =
                              !advancedFilter.onlyWrongQuestions),
                            (form.onlyWrongQuestions = !form.onlyWrongQuestions)
                          )
                        "
                      />
                    </div>

                    <div class="relative">
                      <service-block
                        v-if="!userServicesState.FAVORITEUSAGE.isActive"
                      />
                      <app-select-card-item
                        title="الأسئلة المميزة بنجمة فقط"
                        iconSvgPath="/images/svg/star-solid.svg"
                        label="تدرب على الأسئلة التي ميزتها بنجمة فقط"
                        color="yellow"
                        :isActive="advancedFilter.onlyFlaggedQuestions"
                        :isDisabled="!userServicesState.FAVORITEUSAGE.isActive"
                        @click="
                          () => (
                            (advancedFilter.onlyFlaggedQuestions =
                              !advancedFilter.onlyFlaggedQuestions),
                            (form.onlyFlaggedQuestions =
                              !form.onlyFlaggedQuestions)
                          )
                        "
                      />
                    </div>

                    <div class="relative">
                      <service-block
                        v-if="!userServicesState.TAKFELATUSAGE.isActive"
                      />
                      <app-select-card-item
                        title="أسئلة التقفيلات فقط"
                        iconSvgPath="/images/svg/hundred-points.svg"
                        label="تدرب على أسئلة التقفيلات فقط"
                        color="green"
                        :isActive="advancedFilter.onlyTakfelQuestions"
                        :isDisabled="!userServicesState.TAKFELATUSAGE.isActive"
                        @click="
                          () =>
                            (advancedFilter.onlyTakfelQuestions =
                              !advancedFilter.onlyTakfelQuestions)
                        "
                      />
                    </div>
                  </div>
                  <div class="relative">
                    <service-block
                      v-if="!userServicesState.LEVELQUESTIONPRACTICE.isActive"
                    />
                    <app-select-card-options
                      title="مستوى الأسئلة"
                      label="تحدى نفسك واختر المستوى الذي تريده لهذا التدريب"
                      iconSvgPath="/images/svg/layer-group-solid.svg"
                      :selectedValues="selectedDifficultValues"
                      :options="levelOptions"
                      @select="onSelectDifficult($event)"
                    />
                  </div>
                </div>
                <div class="qu-count">
                  <span class="la">عدد الأسئلة</span>
                  <form-select
                    v-model:selectedValues="form.questionCount"
                    inputId="questionCount"
                    class="w-[130px] h-[45px]"
                    :list="questionCountOptions"
                    :placeholder="'سؤال'"
                    :isMulti="false"
                    :clearable="false"
                    :searchable="false"
                  />
                </div>
                <!--                <div class="__full-filter">-->
                <!--                  <div-->
                <!--                    v-if="!isTahsele"-->
                <!--                    data-step="3"-->
                <!--                    :data-disable-interaction="true"-->
                <!--                    :data-title="trainingPanelTour.step3.title"-->
                <!--                    :data-intro="trainingPanelTour.step3.content"-->
                <!--                    class="__filter_bank"-->
                <!--                  >-->
                <!--                    <div class="c1-wq">-->
                <!--                      <div class="__c1">-->
                <!--                        <i class="fa fa-folder-open"></i>-->
                <!--                        <span>بنوك الأسئلة</span>-->
                <!--                        <service-lock-->
                <!--                          v-if="!userServicesState.BANKUSAGE.isActive"-->
                <!--                        />-->
                <!--                      </div>-->
                <!--                      <div-->
                <!--                        v-if="userCurrentSub"-->
                <!--                        class="c1-wq__qe"-->
                <!--                      >-->
                <!--                        <span class="c1-wq__la">-->
                <!--                          تم إضافة أسئلة جديدة بتاريخ-->
                <!--                        </span>-->
                <!--                        <span class="c1-wq__la">-->
                <!--                          {{ formatDate(userCurrentSub.lastUpdateDate) }}-->
                <!--                        </span>-->
                <!--                      </div>-->
                <!--                    </div>-->
                <!--                    <div class="__c2 relative">-->
                <!--                      <service-block-->
                <!--                        v-if="!userServicesState.BANKUSAGE.isActive"-->
                <!--                      />-->
                <!--                      <range-slider-->
                <!--                        v-if="isCreated"-->
                <!--                        v-model:minValue="advancedFilter.oBankMinValue"-->
                <!--                        v-model:maxValue="advancedFilter.oBankMaxValue"-->
                <!--                        :max="maxBank"-->
                <!--                        :min="minBank"-->
                <!--                        :minLabel="'أقدم'"-->
                <!--                        :maxLabel="'أحدث'"-->
                <!--                        :step="1"-->
                <!--                        :rangeMargin="1"-->
                <!--                        @onUpdateValue="UpdateBankValues"-->
                <!--                      />-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                  <div class="__filter_level">-->
                <!--                    <div class="__c1 qwe">-->
                <!--                      <i class="fa fa-line-chart"></i>-->
                <!--                      <span v-if="isTahsele">صعوبة الأسئلة (قريباً)</span>-->
                <!--                      <span v-else>صعوبة الأسئلة</span>-->
                <!--                      <service-lock-->
                <!--                        v-if="!userServicesState.LEVELQUESTIONPRACTICE.isActive"-->
                <!--                      />-->
                <!--                    </div>-->
                <!--                    <div class="__c2 relative">-->
                <!--                      <service-block-->
                <!--                        v-if="!userServicesState.LEVELQUESTIONPRACTICE.isActive"-->
                <!--                      />-->
                <!--                      <range-slider-->
                <!--                        v-if="isCreated"-->
                <!--                        v-model:minValue="advancedFilter.oLevelMinValue"-->
                <!--                        v-model:maxValue="advancedFilter.oLevelMaxValue"-->
                <!--                        :disableBoxes="true"-->
                <!--                        :max="10"-->
                <!--                        :min="0"-->
                <!--                        :step="5"-->
                <!--                        :rangeMargin="1"-->
                <!--                        :isDisable="isTahsele"-->
                <!--                        :minLabel="'أسهل'"-->
                <!--                        :maxLabel="'أصعب'"-->
                <!--                      />-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                  <div class="__options">-->
                <!--                    <div class="flex items-baseline gap-2">-->
                <!--                      <service-lock-->
                <!--                        v-if="-->
                <!--                          !userServicesState.ROWNQUESTIONPRACTICE.isActive ||-->
                <!--                          !userServicesState.FAVORITEUSAGE.isActive ||-->
                <!--                          !userServicesState.TAKFELATUSAGE.isActive-->
                <!--                        "-->
                <!--                      />-->
                <!--                      <span class="__t">تخصيص الأسئلة</span>-->
                <!--                    </div>-->
                <!--                    <div class="__groups">-->
                <!--                      <div-->
                <!--                        data-step="4"-->
                <!--                        :data-disable-interaction="true"-->
                <!--                        :data-title="trainingPanelTour.step4.title"-->
                <!--                        :data-intro="trainingPanelTour.step4.content"-->
                <!--                        class="__group wrong-question"-->
                <!--                      >-->
                <!--                        <div class="__c1">-->
                <!--                          <div class="__r1">-->
                <!--                            <i class="fa fa-times"></i>-->
                <!--                            <span>التي أخطات فيها</span>-->
                <!--                          </div>-->
                <!--                          <div class="__r2">فقط التي لم تجب عليها</div>-->
                <!--                        </div>-->
                <!--                        <div class="__c2 relative">-->
                <!--                          <service-block-->
                <!--                            v-if="-->
                <!--                              !userServicesState.ROWNQUESTIONPRACTICE.isActive-->
                <!--                            "-->
                <!--                          />-->
                <!--                          <prime-toggle-switch-->
                <!--                            :disabled="-->
                <!--                              !userServicesState.ROWNQUESTIONPRACTICE.isActive-->
                <!--                            "-->
                <!--                            :modelValue="advancedFilter.onlyWrongQuestions"-->
                <!--                            @update:modelValue="-->
                <!--                              (val) => (-->
                <!--                                (advancedFilter.onlyWrongQuestions = val),-->
                <!--                                (form.onlyWrongQuestions = val)-->
                <!--                              )-->
                <!--                            "-->
                <!--                          />-->
                <!--                        </div>-->
                <!--                      </div>-->
                <!--                      <div-->
                <!--                        data-step="5"-->
                <!--                        :data-disable-interaction="true"-->
                <!--                        :data-title="trainingPanelTour.step5.title"-->
                <!--                        :data-intro="trainingPanelTour.step5.content"-->
                <!--                        class="__group starred"-->
                <!--                      >-->
                <!--                        <div class="__c1">-->
                <!--                          <div class="__r1">-->
                <!--                            <i class="fa fa-star"></i>-->
                <!--                            <span>المميزة بنجمة</span>-->
                <!--                          </div>-->
                <!--                          <div class="__r2">فقط التي ميزتها بنجمة</div>-->
                <!--                        </div>-->
                <!--                        <div class="__c2 relative">-->
                <!--                          <service-block-->
                <!--                            v-if="!userServicesState.FAVORITEUSAGE.isActive"-->
                <!--                          />-->
                <!--                          <prime-toggle-switch-->
                <!--                            :disabled="-->
                <!--                              !userServicesState.FAVORITEUSAGE.isActive-->
                <!--                            "-->
                <!--                            :modelValue="advancedFilter.onlyFlaggedQuestions"-->
                <!--                            @update:modelValue="-->
                <!--                              (val) => (-->
                <!--                                (advancedFilter.onlyFlaggedQuestions = val),-->
                <!--                                (form.onlyFlaggedQuestions = val)-->
                <!--                              )-->
                <!--                            "-->
                <!--                          />-->
                <!--                        </div>-->
                <!--                      </div>-->
                <!--                      <div-->
                <!--                        v-if="!isTahsele"-->
                <!--                        data-step="6"-->
                <!--                        :data-disable-interaction="true"-->
                <!--                        :data-title="trainingPanelTour.step6.title"-->
                <!--                        :data-intro="trainingPanelTour.step6.content"-->
                <!--                        class="__group takfel"-->
                <!--                      >-->
                <!--                        <div class="__c1">-->
                <!--                          <div class="__r1">-->
                <!--                            <i class="fa fa-lock"></i>-->
                <!--                            <span>أسئلة التقفيلات</span>-->
                <!--                          </div>-->
                <!--                          <div class="__r2">فقط أسئلة التقفيلات</div>-->
                <!--                        </div>-->
                <!--                        <div class="__c2 relative">-->
                <!--                          <service-block-->
                <!--                            v-if="!userServicesState.TAKFELATUSAGE.isActive"-->
                <!--                          />-->
                <!--                          <prime-toggle-switch-->
                <!--                            :disabled="-->
                <!--                              !userServicesState.TAKFELATUSAGE.isActive-->
                <!--                            "-->
                <!--                            :modelValue="advancedFilter.onlyTakfelQuestions"-->
                <!--                            @update:modelValue="-->
                <!--                              (val) =>-->
                <!--                                (advancedFilter.onlyTakfelQuestions = val)-->
                <!--                            "-->
                <!--                          />-->
                <!--                        </div>-->
                <!--                      </div>-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                </div>-->
                <!--                <div class="__reset">-->
                <!--                  <app-button-->
                <!--                    variant="outline"-->
                <!--                    colorType="warn"-->
                <!--                    size="md"-->
                <!--                    label="إعادة تعيين"-->
                <!--                    @click="resetFilterBankValue()"-->
                <!--                  />-->
                <!--                </div>-->
              </div>
            </prime-accordion-content>
          </prime-accordion-panel>
        </prime-accordion>

        <prime-accordion
          v-if="isExams && !isTahsele"
          id="bank-exam-collapse"
          value="exams"
        >
          <prime-accordion-panel
            value="exams"
            class="cw-bank"
          >
            <prime-accordion-header class="c-head">
              <div class="r-part">
                <i class="ek-icon-sliders-solid"></i>
                <span>خيارات متقدمة</span>
              </div>
            </prime-accordion-header>
            <prime-accordion-content>
              <div class="__bank">
                <div class="__filter">
                  <div class="c1-wq">
                    <div class="__c1">
                      <i class="fa fa-folder-open"></i>
                      <span>بنوك الأسئلة</span>
                      <service-lock
                        v-if="!userServicesState.BANKUSAGE.isActive"
                      />
                    </div>
                    <div
                      v-if="userCurrentSub"
                      class="c1-wq__qe"
                    >
                      <span class="c1-wq__la">تم إضافة أسئلة جديدة بتاريخ</span>
                      <span class="c1-wq__la">
                        {{ formatDate(userCurrentSub.lastUpdateDate) }}
                      </span>
                    </div>
                  </div>
                  <div class="__c2 relative">
                    <service-block
                      v-if="!userServicesState.BANKUSAGE.isActive"
                    />
                    <range-slider
                      v-if="isCreated"
                      v-model:minValue="advancedFilter.oBankMinValue"
                      v-model:maxValue="advancedFilter.oBankMaxValue"
                      :max="maxBank"
                      :min="minBank"
                      :minLabel="'أقدم'"
                      :maxLabel="'أحدث'"
                      :step="1"
                      :rangeMargin="1"
                      @onUpdateValue="UpdateBankValues"
                    />
                  </div>
                </div>
                <div class="__reset">
                  <app-button
                    variant="outline"
                    colorType="warn"
                    size="md"
                    label="إعادة تعيين"
                    @click="resetFilterBankValue()"
                  />
                </div>
              </div>
            </prime-accordion-content>
          </prime-accordion-panel>
        </prime-accordion>
      </div>

      <div
        v-if="!activeSwitch && isExams"
        class="rw-info"
      >
        <span class="i-title">{{ texts.infoTitle }}</span>
        <template v-if="publicExam">
          <div class="i-items">
            <template v-if="!isTahsele">
              <div class="i-item hide-to-tablet">
                <span class="i-label">كمي</span>
                <span class="i-info">كامل القسم</span>
              </div>

              <div class="i-item hide-to-tablet">
                <span class="i-label">لفظي</span>
                <span class="i-info">كامل القسم</span>
              </div>
            </template>

            <div class="i-item">
              <span class="i-label">عدد الأسئلة</span>
              <span class="i-info">{{ publicExam.questionsCount }}</span>
            </div>
            <div class="i-item">
              <span class="i-label">{{ texts.timeText }}</span>
              <span class="i-info">
                {{ minutesToHHMM(publicExam.duration) }}
              </span>
            </div>
          </div>
          <div
            v-if="activeAdvanced && advancedText && advancedText != ''"
            class="i-items"
          >
            <div class="i-item">
              <span class="i-label">خيارات متقدمة</span>
              <span class="i-info">
                {{ advancedText }}
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="i-items">
            <template v-if="!isTahsele">
              <div class="i-item hide-to-tablet">
                <span class="i-label">كمي</span>
                <span class="i-info">-</span>
              </div>

              <div class="i-item hide-to-tablet">
                <span class="i-label">لفظي</span>
                <span class="i-info">-</span>
              </div>
            </template>

            <div class="i-item">
              <span class="i-label">عدد الأسئلة</span>
              <span class="i-info">-</span>
            </div>
            <div class="i-item">
              <span class="i-label">{{ texts.timeText }}</span>
              <span class="i-info">-</span>
            </div>
          </div>
        </template>
        <service-block
          v-if="
            !activeSwitch &&
            selectedType === examTypes.exams &&
            (!userServicesState.FULLEXAM.isActive ||
              !userCurrentSub.remainExamsCount)
          "
        />
        <app-button
          class="!mt-3"
          :isDisabled="!publicExam"
          :label="texts.btnText"
          @click="checkAndStart('full')"
        />
      </div>

      <!--      <div-->
      <!--        v-else-->
      <!--        :ref="trainingPanelTour.stepLast.ref"-->
      <!--        class="rw-info training-case"-->
      <!--        :class="{ all: activeSwitch }"-->
      <!--        data-step="7"-->
      <!--        :data-disable-interaction="true"-->
      <!--        :data-position="isXlWindow ? 'right' : 'bottom'"-->
      <!--        :data-title="trainingPanelTour.stepLast.title"-->
      <!--        :data-intro="trainingPanelTour.stepLast.content"-->
      <!--      >-->
      <!--        <span class="i-title">{{ texts.infoTitle }}</span>-->
      <!--        <template v-if="selectedLists.length > 0">-->
      <!--          <div class="i-items">-->
      <!--            <template v-if="categoryList && categoryList.length > 0">-->
      <!--              <template-->
      <!--                v-for="(card, index) of categoryList"-->
      <!--                :key="`${card.label}_${index}`"-->
      <!--              >-->
      <!--                <div-->
      <!--                  v-if="card.children.length > 0"-->
      <!--                  class="i-item hide-to-tablet"-->
      <!--                >-->
      <!--                  <span class="i-label">{{ card.label }}</span>-->
      <!--                  <span class="i-info">-->
      <!--                    {{ getSelectPartCount(card.children) }}-->
      <!--                  </span>-->
      <!--                </div>-->
      <!--              </template>-->
      <!--            </template>-->
      <!--            <div class="i-item">-->
      <!--              <span class="i-label">عدد الأسئلة</span>-->
      <!--              <span class="i-info">{{ getQuestionCount }}</span>-->
      <!--            </div>-->
      <!--            <div class="i-item">-->
      <!--              <span class="i-label">{{ texts.timeText }}</span>-->
      <!--              <span class="i-info">{{ getTotalTime }}</span>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div-->
      <!--            v-if="activeAdvanced && advancedText && advancedText != ''"-->
      <!--            class="i-items"-->
      <!--          >-->
      <!--            <div class="i-item">-->
      <!--              <span class="i-label">خيارات متقدمة</span>-->
      <!--              <span class="i-info">-->
      <!--                {{ advancedText }}-->
      <!--              </span>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--        <span-->
      <!--          v-else-->
      <!--          class="i-no-selected-note"-->
      <!--        >-->
      <!--          {{ texts.noSelectedNote }}-->
      <!--        </span>-->
      <!--        <app-button-->
      <!--          class="!mt-3"-->
      <!--          data-disable-interaction="false"-->
      <!--          :isDisabled="selectedLists.length === 0 || getQuestionCount == 0"-->
      <!--          :label="texts.btnText"-->
      <!--          @click="checkAndStart"-->
      <!--        />-->
      <!--      </div>-->
    </div>
    <div
      class="pa-fo"
      :style="{ width: usContentWidth }"
    >
      <div class="pa-fo-wrapper">
        <div class="pa-fo__st">
          <div class="pa-fo-met">
            <img
              src="/images/svg/Icons8_flat_clock.svg"
              alt="icon"
            />
            <span>الزمن المتوقع</span>
          </div>
          <span class="pg-t">{{ getTotalTime }}</span>
        </div>
        <div class="pa-fo__en">
          <app-button
            v-if="!isExams"
            :isDisabled="selectedLists.length === 0 || getQuestionCount == 0"
            :label="texts.btnText"
            colorType="blue"
            iconEndClass="fa fa-chevron-left"
            @click="checkAndStart"
          />
        </div>
      </div>
    </div>

    <service-block-modal ref="block_modal_ref" />
  </div>
</template>
<script lang="ts">
import { useIntroService } from '~/main/services/useIntroService';
import EmCheckbox from '~/components/shared/em-checkbox.vue';
import RangeSlider from '~/components/shared/range-slider.vue';
import {
  calculateSumFromArray,
  getStoredCatArray,
  getUuid,
  setStoredCatArray,
  sleepUtil,
} from '~/main/utils/shared-utils';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { AppLocalStorage } from '~/main/utils/app-storage';
import { concat, delay, of, repeat, take, takeWhile, tap } from 'rxjs';
import { dateUi, minutesToHHMM } from '~/main/utils/date-utils';
import { GlobalTypes } from '~/main/constants/global-types';
import { useGlobalStore } from '~/main/useGlobalStore';
import {
  UserPanelItems,
  UserPanelItemsRecord,
} from '~/main/constants/user-panel-items';
import type { ServiceBlockModal } from '#components';
import { debounceUtil } from '~/main/utils/lodash.utils';
import { RouteHelper } from '~/main/utils/route-helper';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { appEvents } from '~/main/shared/events/app.events';
import AppSelectCardItem from '~/components/web/shared/app-select-card-item.vue';
import { webUserDashboardPlan } from '~/main/utils/web-routes.utils';

const SIMULATE_START_DELAY = 600;
const TOGGLE_DELAY_GAP = 500;

const levels = [
  { name: 'سهل', min: 0, max: 3 },
  { name: 'متوسط', min: 4, max: 6 },
  { name: 'صعب', min: 7, max: 10 },
];

const mockData = [
  {
    name: 'القسم الكمي',
    subId: 1,
    items: [
      { id: 101, label: 'المسائل الحسابية' },
      { id: 102, label: 'المسائل الهندسية' },
      { id: 103, label: 'المسائل الجبرية' },
      { id: 104, label: 'التحليل والإحصاء' },
    ],
  },
  {
    name: 'القسم اللفظي',
    subId: 2,
    items: [
      { id: 201, label: 'الخطأ السياقي' },
      { id: 202, label: 'إكمال الجمل' },
      { id: 203, label: 'المسائل الجبرية' },
      { id: 204, label: 'التحليل والإحصاء' },
      { id: 205, label: 'الخطأ السياقي' },
      { id: 206, label: 'إكمال الجمل' },
    ],
  },
];

const examTypes = {
  exams: 1,
  trainings: 2,
};

const examTexts = {
  title: 'محاكي الاختبار',
  switchRight: 'اختبار كامل',
  switchLeft: 'اختبار جزئي',
  btnText: 'ابدأ الاختبار',
  infoTitle: 'معلومات الاختبار',
  timeText: 'الزمن المتوقع',
  noSelectedNote: 'يرجى اختيار قسم واحد على الأقل لبدء الاختبار',
};

const trainingTexts = {
  title: 'تدرب بذكاء',
  switchRight: 'تدريب كامل',
  switchLeft: 'تدريب جزئي',
  btnText: 'ابدأ التدريب',
  infoTitle: 'معلومات التدريب',
  timeText: 'الزمن المتوقع',
  noSelectedNote: 'يرجى اختيار قسم واحد على الأقل لبدء التدريب',
};

export class examForm {
  subjectId: number | string;

  constructor(subjectId: number | string) {
    this.subjectId = subjectId;
  }
  willDo = false;
  withoutStudentEvaluate = false;
  randomLevel = false;
  isOpen = false;
  tagsIds = [] as any[];
  takfeelTagsIds = [] as any[];
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  randomQuestionsSettings = [] as any[];
  questionsLevelsMin = 0;
  questionCount: null | number = 10;
  questionsLevelsMax = 10;
  customerId: any | null = null;
  sessionId: any | null = null;
}

export class customExamCountsForm {
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  takfeelTagsIds = [] as any[];
  tagsIds = [] as any[];
  randomQuestionsSettings = [] as any[];
}

export class advancedFilterForm {
  oBankMinValue = 0;
  oBankMaxValue = 1;
  oLevelMinValue = 0;
  oLevelMaxValue = 10;
  onlyWrongQuestions = false;
  onlyFlaggedQuestions = false;
  onlyTakfelQuestions = false;
}

const levelOptionsEnum = Object.freeze({
  easy: 0,
  middle: 5,
  hard: 10,
});

//TODO-z add fcmClarityMixin
export default {
  components: { AppSelectCardItem, RangeSlider, EmCheckbox },
  setup() {
    const blockModalRef =
      useTemplateRef<InstanceType<typeof ServiceBlockModal>>('block_modal_ref');
    const introService = useIntroService();
    const windowSize = useWindowSize();
    const runtimeConfig = useRuntimeConfig();
    const form = ref(new examForm(runtimeConfig.public.defaultSubjectId));
    const globalStore = useGlobalStore();
    const subscriptionsStore = useSubscriptionsStore();

    useHead({
      htmlAttrs: {
        class: 'zoom-wrapper',
      },
    });

    const levelOptions = [
      {
        key: levelOptionsEnum.easy,
        description: 'سهلة',
      },
      {
        key: levelOptionsEnum.middle,
        description: 'متوسطة',
      },
      {
        key: levelOptionsEnum.hard,
        description: 'صعبة',
      },
    ];

    const questionCountOptions = [
      {
        id: 10,
        label: '10',
      },
      {
        id: 24,
        label: '24',
      },
      {
        id: 50,
        label: '50',
      },
    ];

    const usContentWidth = ref('0px');
    onMounted(() => {
      if (import.meta.client) {
        nextTick(() => {
          const el = document.getElementsByClassName('us-content')[0];
          usContentWidth.value = window.getComputedStyle(el).width;
        });

        window.addEventListener('resize', () => {
          const el = document.getElementsByClassName('us-content')[0];
          if (el) {
            usContentWidth.value = window.getComputedStyle(el).width;
          }
        });
      }
    });

    const cssVars = computed(() => {
      return {
        '--us-content-width': usContentWidth.value,
      };
    });
    return {
      usContentWidth,
      cssVars,
      questionCountOptions,
      levelOptions,
      userServicesState: computed(
        () => subscriptionsStore.state.userServicesStateVal
      ),
      userCurrentSub: computed(
        () => subscriptionsStore.state.userCurrentSubVal!
      ),
      blockModalRef,
      form,
      introService,
      windowSize,
      runtimeConfig,
      trainingPanelTour: computed(() => introService.trainingPanelTour),
      isXlWindow: computed(() => windowSize.isXlWindow),
      globalTypeUser: computed(() => globalStore.state.globalTypeUserValue),
      ...useSetupAuth(),
      ...useSetupRoute(),
      ...useToastMessage(),
    };
  },
  data() {
    return {
      selectedDifficultValues: [] as any[],
      isRecentQuestionActive: false,
      cards: mockData,
      selectedCard: [] as any[],
      activeSwitch: false,
      examTypes: examTypes,
      selectedType: examTypes.exams,
      categoryList: [] as any[],
      fetchLoading: false,
      examLoading: false,
      publicExam: null as any | null,
      tagsList: [] as any[],
      advancedFilter: new advancedFilterForm(),
      activeAdvanced: false,
      customQuestionsCount: null as any | null,
      isCreated: false,
      tourModel: {
        isShownOnce: false,
        isActive: false,
      },
      openModalsCount: 0,
      fromSimulation: false,
    };
  },

  async created() {
    if (this.isTahsele) {
      await this.requestsForTahsele();
    } else {
      await this.requestsForQudrat();
    }
    if (this.selectedType == examTypes.trainings) {
      this.selectPrimaryCat();
    }
  },

  beforeUnmount() {
    this.exitTour();
  },

  methods: {
    webUserDashboardPlan,
    onSelectDifficult(val: string | number) {
      const set = new Set(this.selectedDifficultValues);
      if (set.size === 2 && !set.has(val)) return;

      if (set.has(val)) {
        set.delete(val);
      } else {
        set.add(val);
      }

      this.selectedDifficultValues = Array.from(set);
      this.selectedDifficultValues.sort((a, b) => a - b);
      const val1 = this.selectedDifficultValues[0];
      const val2 = this.selectedDifficultValues[1];
      const min =
        val1 >= 0 && val2 >= 0 ? val1 : (val1 ?? levelOptionsEnum.easy);
      const max =
        val1 >= 0 && val2 >= 0 ? val2 : (val1 ?? levelOptionsEnum.hard);
      this.advancedFilter.oLevelMinValue = min;
      this.advancedFilter.oLevelMaxValue = max;
    },
    onRecentSelect() {
      this.isRecentQuestionActive = !this.isRecentQuestionActive;

      if (this.isRecentQuestionActive) {
        this.advancedFilter.oBankMinValue =
          this.advancedFilter.oBankMaxValue - 9;
        this.UpdateBankValues();
      } else {
        this.advancedFilter.oBankMinValue = 1;
        this.form.tagsIds = [];
      }
    },
    async selectPrimaryCat() {
      try {
        this.selectedCard = [];
        await sleepUtil(800);
        const newArr = this.categoryList.flatMap((category) =>
          category.children.map((child) => child.id)
        );
        if (getStoredCatArray(this.isTahsele)) {
          const arr = getStoredCatArray(this.isTahsele);
          if (newArr.some((k) => arr.includes(k))) {
            arr.forEach((id) => this.selectItem(id, true));
            return;
          }
        }

        const shuffledArray = this.getRandomSubset(newArr, 1);

        shuffledArray.forEach((id) => this.selectItem(id, true));
      } catch (e) {
        console.log(e);
      }
    },

    getRandomSubset(
      array,
      size = Math.floor(Math.random() * array.length) + 1
    ) {
      return array.sort(() => Math.random() - 0.5).slice(0, size);
    },

    async requestsForTahsele() {
      try {
        this.fetchLoading = true;
        this.isCreated = false;
        const cat = await this.$store.dispatch(
          'admin/callCategoriesBySubjects',
          {
            subjects: [this.runtimeConfig.public.defaultSubjectIdTahsele],
            status: true,
          }
        );
        this.categoryList = cat.data[0].children;
        this.fetchLoading = false;
        if (this.selectedType == examTypes.exams) {
          this.selectedAllItem();
          await this.requestPublicExam();
        }
        this.isCreated = true;
      } catch (e) {
        this.fetchLoading = false;
        console.log(e);
      }
    },

    async requestsForQudrat() {
      try {
        this.fetchLoading = true;
        this.isCreated = false;
        const cat = await this.$store.dispatch(
          'admin/callCategoriesBySubjects',
          {
            subjects: [this.runtimeConfig.public.defaultSubjectId],
            status: true,
          }
        );
        this.categoryList = cat.data[0].children;
        this.fetchLoading = false;
        if (this.selectedType == examTypes.exams) {
          this.selectedAllItem();
          await this.requestPublicExam();
        }
        const { data } = await this.$axios.get(
          `tagsForQuestions/listForStudent`
        );
        this.tagsList = data;
        this.advancedFilter.oBankMaxValue = this.maxBankValue;
        this.advancedFilter.oBankMinValue = this.minBankValue;
        this.isCreated = true;
      } catch (e) {
        this.fetchLoading = false;
        console.log(e);
      }
    },

    async startTour(forceShow = false) {
      if (!this.canStartTour) return;

      this.$nextTick(async () => {
        const userId = this.appAuth.user.id;
        const tourState = AppLocalStorage.getTourState(userId).trainingPanel;
        if (tourState.isShown && !forceShow) return;

        //set to shown and trigger
        AppLocalStorage.setIntroState(userId, {
          trainingPanel: {
            isShown: true,
          },
        });
        await this.introService.introInstanceState.lib
          ?.setOptions({
            ...this.introService.tourConfig,
            disableInteraction: false,
            scrollPadding: -100,
          })
          .start();
        this.tourModel.isActive = true;

        //apply style while tour
        this.introService.introInstanceState.lib?.onbeforeexit(() => {
          this.resetSimulate();
          this.tourModel.isActive = false;
          return true;
        });

        //apply first step simulate
        if (!this.tourModel.isShownOnce) {
          this.tourModel.isShownOnce = true;
          this.simulateStep1(0);
        }

        this.introService.introInstanceState.lib?.onafterchange((currentEl) => {
          const stepIndex = Number(currentEl.getAttribute('data-step')!) - 1;
          switch (stepIndex) {
            case 0:
              this.simulateStep1(stepIndex);
              break;
            case 2:
              this.simulateStep3(stepIndex);
              break;
            case 3:
              this.simulateStep4(stepIndex);
              break;
            case 4:
              this.simulateStep5(stepIndex);
              break;
            case 5:
              this.simulateStep6(stepIndex);
              break;
          }
        });
      });
    },
    async exitTour() {
      this.introService.introInstanceState.lib?.exit(true);
    },

    requestPublicExam() {
      try {
        this.$axios
          .get(`exam/public?grade=${this.globalTypeUser}`)
          .then(({ data: res }) => {
            this.publicExam = res;
          })
          .catch((err) => {
            this.publicExam = null;
          });
      } catch (e) {
        this.publicExam = null;
      }
    },

    resetSimulate() {
      this.resetStep1Simulate();
      this.resetStep3Simulate();
      this.resetStep4Simulate();
      this.resetStep5Simulate();
      this.resetStep6Simulate();
    },
    async simulateStep1(stepIndex) {
      this.fromSimulation = true;
      this.resetStep1Simulate();
      this.fromSimulation = true;

      await sleepUtil(400);
      const ref = this.$refs[this.trainingPanelTour.step1.ref] as HTMLElement;
      const DELAY_BETWEEN_ACTIONS_MS = 600;

      const allItems = Array.from(ref!.querySelectorAll(`.ca-contents .item`));
      const items = [allItems[0], allItems[5]];

      const source$ = concat(
        ...items.map((el) =>
          of(el).pipe(
            delay(DELAY_BETWEEN_ACTIONS_MS),
            tap((el) => el.dispatchEvent(new Event('click')))
          )
        ),
        of('selectAll').pipe(
          delay(DELAY_BETWEEN_ACTIONS_MS),
          tap(() => this.onSelectCard(true, this.categoryList[0].id))
        )
      );

      source$
        .pipe(
          delay(SIMULATE_START_DELAY),
          // finalize(() => this.resetStep1Simulate()),
          takeWhile(
            () =>
              !!this.tourModel.isActive &&
              this.introService.introInstanceState.lib?._currentStep ===
                stepIndex
          )
        )
        .subscribe();
    },
    resetStep1Simulate() {
      this.selectedCard = [];
      this.selectPrimaryCat();
      this.fromSimulation = false;
    },
    async simulateStep3(stepIndex) {
      this.resetStep3Simulate();

      const rangeGap = 2;
      const delayGap = 150;
      const repeatCount = 5;

      const source$ = concat(
        of('changeMinRange').pipe(
          delay(delayGap),
          tap(() => {
            this.advancedFilter.oBankMinValue =
              this.advancedFilter.oBankMinValue + rangeGap;
          }),
          repeat(repeatCount)
        ),
        of('changeMaxRange').pipe(
          delay(delayGap),
          tap(() => {
            this.advancedFilter.oBankMaxValue =
              this.advancedFilter.oBankMaxValue - rangeGap;
          }),
          repeat(repeatCount)
        )
      );

      source$
        .pipe(
          delay(SIMULATE_START_DELAY),
          takeWhile(
            () =>
              !!this.tourModel.isActive &&
              this.introService.introInstanceState.lib?._currentStep ===
                stepIndex
          )
        )
        .subscribe();
    },
    async resetStep3Simulate() {
      this.resetFilterBankValue();
    },
    async simulateStep4(stepIndex) {
      this.resetStep4Simulate();

      const source$ = concat(
        of('toggleWrong').pipe(
          delay(TOGGLE_DELAY_GAP),
          tap(() => {
            this.advancedFilter.onlyWrongQuestions = true;
          })
        )
      );

      source$
        .pipe(
          delay(SIMULATE_START_DELAY),
          takeWhile(
            () =>
              !!this.tourModel.isActive &&
              this.introService.introInstanceState.lib?._currentStep ===
                stepIndex
          )
        )
        .subscribe();
    },
    async resetStep4Simulate() {
      this.advancedFilter.onlyWrongQuestions = false;
    },
    async simulateStep5(stepIndex) {
      this.resetStep5Simulate();

      const source$ = concat(
        of('toggleFlagged').pipe(
          delay(TOGGLE_DELAY_GAP),
          tap(() => {
            this.advancedFilter.onlyFlaggedQuestions = true;
          })
        )
      );

      source$
        .pipe(
          delay(SIMULATE_START_DELAY),
          takeWhile(
            () =>
              !!this.tourModel.isActive &&
              this.introService.introInstanceState.lib?._currentStep ===
                stepIndex
          )
        )
        .subscribe();
    },
    async resetStep5Simulate() {
      this.advancedFilter.onlyFlaggedQuestions = false;
    },
    async simulateStep6(stepIndex) {
      this.resetStep6Simulate();

      const source$ = concat(
        of('toggleTakfeelat').pipe(
          delay(TOGGLE_DELAY_GAP),
          tap(() => {
            this.advancedFilter.onlyTakfelQuestions = true;
          })
        )
      );

      source$
        .pipe(
          delay(SIMULATE_START_DELAY),
          takeWhile(
            () =>
              !!this.tourModel.isActive &&
              this.introService.introInstanceState.lib?._currentStep ===
                stepIndex
          )
        )
        .subscribe();
    },
    async resetStep6Simulate() {
      this.advancedFilter.onlyTakfelQuestions = false;
    },
    formatDate(date) {
      return dateUi(new Date(date));
    },
    UpdateBankValues(e?) {
      //this.advancedFilter.oBankMinValue = e.minValue;
      //this.advancedFilter.oBankMaxValue = e.maxValue;
      this.form.tagsIds = [];
      this.tagsList.forEach((res) => {
        if (
          res.bankNumber >= this.advancedFilter.oBankMinValue &&
          res.bankNumber <= this.advancedFilter.oBankMaxValue &&
          res.bankType == 1
        ) {
          this.form.tagsIds.push(res.id);
        }
      });
    },
    canSelectCardItem() {
      if (this.selectedType === examTypes.exams) {
        return this.userServicesState.EXAMBYCATEGORY.isActive;
      } else {
        return this.userServicesState.TRAININGBYCATEGORY.isActive;
      }
    },
    selectItem(id, isRandom = false) {
      const canSelect = this.canSelectCardItem();
      if (!canSelect && !this.tourModel.isActive) return;

      const arr = this.selectedCard;
      if (arr.includes(id)) {
        this.selectedCard = arr.filter((el) => el !== id);
      } else {
        this.selectedCard = [...arr, id];
      }
      if (!isRandom && !this.fromSimulation) {
        setStoredCatArray(this.selectedCard, this.isTahsele);
      }
    },

    async onSelectCard(isSelect, id) {
      try {
        if (isSelect) {
          this.categoryList
            .filter((k) => k.id == id)[0]
            .children.forEach((r) => {
              this.selectedCard = [...this.selectedCard, r.id];
            });
        } else {
          this.categoryList
            .filter((k) => k.id == id)[0]
            .children.forEach((r) => {
              const _index = this.selectedCard.findIndex((i) => i == r.id);
              if (_index !== -1) {
                this.selectedCard.splice(_index, 1);
              }
            });
        }
        if (!this.fromSimulation) {
          setStoredCatArray(this.selectedCard, this.isTahsele);
        }
      } catch (e) {
        console.log(e);
      }
    },

    checkCard(index) {
      this.$refs[`card-checkbox-${index}`]?.[0].onSelect();
    },

    selectedAllItem() {
      this.categoryList?.forEach((k) => {
        k.children.forEach((n) => {
          if (!this.selectedCard.includes(n.id)) {
            this.selectedCard = [...this.selectedCard, n.id];
          }
        });
      });
    },
    unSelectedAllItem() {
      this.selectedCard = [];
    },

    allItemSelected(id) {
      const selectedCard = this.categoryList.filter((k) => k.id === id)[0];
      return !selectedCard.children.some(
        (k) => !this.selectedCard.includes(k.id)
      );
    },

    someItemSelected(id) {
      const selectedCard = this.categoryList.filter((k) => k.id === id)[0];
      const oneIsSelected = selectedCard.children.some((k) =>
        this.selectedCard.includes(k.id)
      );
      const oneIsNotSelected = selectedCard.children.some(
        (k) => !this.selectedCard.includes(k.id)
      );
      return oneIsSelected && oneIsNotSelected;
    },

    resetFilterBankValue() {
      this.advancedFilter = new advancedFilterForm();
      setTimeout(() => {
        this.advancedFilter.oBankMaxValue = this.maxBank;
        this.advancedFilter.oLevelMaxValue =
          new advancedFilterForm().oLevelMaxValue;
        this.form.tagsIds = [];
        setTimeout(() => {
          this.activeAdvanced = false;
        }, 100);
      }, 200);
    },

    getSelectPartCount(item) {
      if (item.some((k) => !this.selectedCard.includes(k.id))) {
        let _index = 0;
        item.forEach((n) => {
          if (this.selectedCard.includes(n.id)) {
            _index++;
          }
        });
        if (_index == 0) {
          return 'لا يوجد';
        }
        if (_index == 1) {
          return 'قسم واحد';
        }
        if (_index == 2) {
          return 'قسمين';
        }
        return _index + ' أقسام';
      }
      return 'كامل القسم';
    },

    randomQuestionsSettingsList() {
      const list: any[] = [];
      this.selectedLists.forEach((k) => {
        list.push({
          categoryId: k.id,
          questionLevel: 0,
          questionsCount: this.form.questionCount,
        });
      });
      return list;
    },

    createForm() {
      this.form.randomQuestionsSettings = this.randomQuestionsSettingsList();
      this.form.questionsLevelsMin = this.advancedFilter.oLevelMinValue;
      this.form.questionsLevelsMax = this.advancedFilter.oLevelMaxValue;
      if (this.selectedType === examTypes.exams) {
        this.form.randomLevel = true;
        this.form.withoutStudentEvaluate = true;
      }
    },

    resetForm() {
      this.form = new examForm(this.runtimeConfig.public.defaultSubjectId);
    },

    resetAll() {
      this.resetFilterBankValue();
      this.resetForm();
    },

    async changeGlobalType(type) {
      this.resetAll();
      if (type == GlobalTypes.tahsele) {
        await this.requestsForTahsele();
      } else {
        await this.requestsForQudrat();
      }
      if (this.selectedType == examTypes.trainings) {
        this.selectPrimaryCat();
      }
    },

    goToExam(id, query) {
      if (this.selectedType === examTypes.exams) {
        this.appRouter.push(`/student/exams/${id}`);
      } else {
        let query = null as any | null;
        if (
          this.advancedFilter.onlyTakfelQuestions ||
          this.advancedFilter.onlyFlaggedQuestions ||
          this.advancedFilter.onlyWrongQuestions
        ) {
          query = {
            isFilteredTraining: true,
          };
        }
        this.appRouter.push({
          path: `/student/training/${id}`,
          query,
        });
      }
    },

    async handleButtonClick() {
      if (this.tourModel.isActive) {
        await this.exitTour();
      }

      this.checkAndStart();
    },

    checkAndStart(type: string | null = null) {
      if (!this.userCurrentSub.endDate) {
        this.appRouter.push({
          path: '/user-panel',
          query: {
            page: UserPanelItemsRecord[UserPanelItems.subscriptionList],
          },
        });
      } else {
        if (type == 'full') {
          this.startFullExam();
        } else {
          if (!this.isExams) {
            if (
              this.userCurrentSub.remainTrainingCount <= 0 ||
              this.userCurrentSub.remainTrainingCountPerDay <= 0
            ) {
              this.blockModalRef!.showModal();
              return;
            }
          }
          this.startExam();
        }
      }
    },

    async handleClarityData() {
      try {
        //eslint-disable-next-line
        return new Promise(async (resolve, reject) => {
          if (!window['clarity']) {
            resolve(null);
            return null;
          }
          const custom_session_id = getUuid();

          const result = await window['clarity'](
            'identify',
            this.appAuth.user.email,
            this.appAuth.user.id + '_' + custom_session_id
          );
          this.form.customerId = result?.userId;
          this.form.sessionId = result?.sessionId;
          resolve(result);
        });
      } catch (e) {
        console.log(e);
        return null;
      }
    },

    async startExam() {
      try {
        this.examLoading = true;
        if (this.runtimeConfig.public.currentEnv === 'dev') {
          await this.handleClarityData();
        }
        this.createForm();
        const url = 'studentsExam/customFromTags';
        this.form.subjectId = this.isTahsele
          ? this.runtimeConfig.public.defaultSubjectIdTahsele
          : this.runtimeConfig.public.defaultSubjectId;
        const { data: res } = await this.$axios
          .post(url, this.form)
          .finally(() => {
            this.examLoading = false;
          });
        if (res) {
          this.$store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', res);
          this.goToExam(res.id, undefined);
        }
        //this.examLoading = false;
      } catch (e) {
        this.showError({
          life: 2500,
          summary: 'عذراً حدث خطأ في إنشاء امتحانكم ... يرجى إعادة المحاولة',
        });
        await sleepUtil(1000);
        this.examLoading = false;
        console.log(e);
      }
    },

    async startFullExam() {
      try {
        this.examLoading = true;
        let clarityData = null as any | null;
        if (this.runtimeConfig.public.currentEnv === 'dev') {
          clarityData = await this.handleClarityData();
        }
        const { data: res } = await this.$axios
          .post(`studentsExam`, {
            examId: this.publicExam.id,
            willDo: true,
            tagsIds: this.form.tagsIds,
            customerId: clarityData?.userId ?? null,
            sessionId: clarityData?.sessionId ?? null,
          })
          .finally(() => {
            this.examLoading = false;
          });
        if (res) {
          this.$store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', res);
          this.goToExam(res.id, undefined);
        }
        //this.examLoading = false;
      } catch (e) {
        this.showError({
          life: 2500,
          summary: 'عذراً حدث خطأ في إنشاء امتحانكم ... يرجى إعادة المحاولة',
        });
        await sleepUtil(1000);
        this.examLoading = false;
        console.log(e);
      }
    },

    requestStaticData() {
      if (this.selectedType == examTypes.exams) {
        this.$store.dispatch('getExamsPanelStatic');
      } else {
        this.$store.dispatch('getTrainingsPanelStatic');
      }
    },

    minutesToHHMM(minutes) {
      return minutesToHHMM(minutes);
    },

    debounceCustomCount: debounceUtil(
      function () {
        //@ts-expect-error access debounce
        this.getCustomCount();
      },
      800,
      { leading: true, trailing: true }
    ),

    async getCustomCount() {
      try {
        const _formData = new customExamCountsForm();
        _formData.onlyFlaggedQuestions = this.form.onlyFlaggedQuestions;
        _formData.onlyWrongQuestions = this.form.onlyWrongQuestions;
        _formData.takfeelTagsIds = this.form.takfeelTagsIds;
        _formData.tagsIds = this.form.tagsIds;
        _formData.randomQuestionsSettings = this.randomQuestionsSettingsList();
        const { data: res } = await this.$axios.post(
          `studentsExam/customExamQuestionsCount`,
          _formData
        );
        this.customQuestionsCount = this.calcQuestionsCount(res);
      } catch (e) {
        console.log(e);
      }
    },

    calcQuestionsCount(arr) {
      let count = 0;
      /*arr.forEach((k) => {
        if (k.questionsCount > 10) {
          count += 10;
        } else {
          count += k.questionsCount;
        }
      });*/
      arr.forEach((k) => {
        count += k.questionsCount;
      });
      return count;
    },

    onChangeAdvanced() {
      if (
        this.selectedType == examTypes.trainings &&
        this.isActiveAdvancedFilter
      ) {
        this.debounceCustomCount();
      }
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

    findLevel(value) {
      return levels.find((level) => value >= level.min && value <= level.max);
    },

    getLevelText(minValue, maxValue) {
      const _default = new advancedFilterForm();

      if (
        maxValue !== _default.oLevelMaxValue ||
        minValue !== _default.oLevelMinValue
      ) {
        const minLevel = this.findLevel(minValue)!;
        const maxLevel = this.findLevel(maxValue)!;

        if (minLevel === maxLevel) {
          return ` المستوى ${minLevel.name}`;
        }

        return ` المستوى من ${minLevel.name} إلى ${maxLevel.name}`;
      }
      return null;
    },
    getBankText(minValue, maxValue) {
      if (maxValue !== this.maxBankValue || minValue !== this.minBankValue) {
        if (maxValue === minValue) {
          return `رقم البنك: ${minValue}`;
        } else {
          return `البنوك: من ${minValue} إلى ${maxValue}`;
        }
      }
      return null;
    },
  },

  computed: {
    showRemainingCount() {
      return (
        !this.isExams && this.userCurrentSub.remainTrainingCountPerDay < 100
      );
    },
    canStartTour() {
      return (
        this.introService.isIntroLibReady &&
        !this.fetchLoading &&
        this.selectedType == examTypes.trainings
      );
    },
    showRemainExamCount() {
      if (!this.userCurrentSub) return false;
      const count = this.userCurrentSub.remainExamsCount;
      return !!count && count > 0 && count <= 3;
    },
    routerHelper() {
      return RouteHelper;
    },
    categoryListModel() {
      return this.categoryList;
    },
    caQueryModel() {
      return {
        list: this.categoryListModel,
        query: this.appRoute.query,
      };
    },
    texts() {
      if (this.isExams) {
        return examTexts;
      }
      return trainingTexts;
    },

    isExams() {
      return this.selectedType == this.examTypes.exams;
    },

    getQuestionCount() {
      const realQuestionCount = calculateSumFromArray(
        this.selectedLists,
        'defaultQuestionsCount'
      );
      if (
        this.isExams ||
        !this.activeAdvanced ||
        !this.isActiveAdvancedFilter
      ) {
        return realQuestionCount;
      } else {
        return this.customQuestionsCount;
        /*if (realQuestionCount <= this.customQuestionsCount) {
          return realQuestionCount;
        } else {
          return this.customQuestionsCount;
        }*/
      }
    },

    getTotalTime() {
      const realMinutes = calculateSumFromArray(
        this.selectedLists,
        'defaultDuration'
      );
      const realQuestionCount = calculateSumFromArray(
        this.selectedLists,
        'defaultQuestionsCount'
      );

      let totalMinutes;
      if (
        this.isExams ||
        !this.activeAdvanced ||
        !this.isActiveAdvancedFilter
      ) {
        totalMinutes = realMinutes;
      } else {
        if (realQuestionCount <= this.customQuestionsCount) {
          totalMinutes = realMinutes;
        } else {
          totalMinutes = Number(this.customQuestionsCount);
        }
      }

      if (totalMinutes < 60) {
        return `${totalMinutes} دقيقة`;
      } else {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (minutes === 0) {
          return `${hours} ساعة`;
        } else {
          return `${hours} ساعة و ${minutes} دقيقة`;
        }
      }
    },

    selectedLists() {
      const list = [] as any[];
      this.selectedCard.forEach((k) => {
        this.categoryList.forEach((n) => {
          n.children.forEach((items) => {
            if (items.id == k) {
              list.push(items);
            }
          });
        });
      });
      return list;
    },

    staticData() {
      if (this.selectedType == examTypes.exams) {
        return this.$store.state.examsPanelStatic;
      }
      return this.$store.state.trainingsPanelStatic;
    },

    minBank() {
      let min = this.tagsList[0]?.bankNumber;
      this.tagsList.forEach((k) => {
        if (k.bankNumber < min) {
          min = k.bankNumber;
        }
      });
      return 1;
    },

    maxBank() {
      let max = this.tagsList[0]?.bankNumber;
      this.tagsList.forEach((k) => {
        if (k.bankNumber > max) {
          max = k.bankNumber;
        }
      });
      return Number(max);
    },

    minBankValue() {
      /*if (this.tagsList && this.tagsList.length > 0) {
        return this.tagsList[0].bankNumber;
      }
      return 0;*/
      return this.minBank;
    },

    maxBankValue() {
      /*if (this.tagsList && this.tagsList.length > 0) {
        return this.tagsList[this.tagsList.length - 1].bankNumber;
      }
      return 1;*/
      return this.maxBank;
    },

    isActiveAdvancedFilter() {
      return (
        this.advancedFilter.onlyFlaggedQuestions ||
        this.advancedFilter.onlyWrongQuestions ||
        this.advancedFilter.onlyTakfelQuestions
      );
    },

    isTahsele() {
      return this.globalTypeUser == GlobalTypes.tahsele;
    },

    advancedText() {
      const parts = [] as string[];
      if (!this.isTahsele) {
        const bankText = this.getBankText(
          this.advancedFilter.oBankMinValue,
          this.advancedFilter.oBankMaxValue
        );
        if (bankText) parts.push(bankText);
      }
      if (this.selectedType === examTypes.trainings) {
        const levelText = this.getLevelText(
          this.advancedFilter.oLevelMinValue,
          this.advancedFilter.oLevelMaxValue
        );
        if (levelText) parts.push(levelText);
        if (this.advancedFilter.onlyWrongQuestions)
          parts.push('الأسئلة التي أخطأت فيها');
        if (this.advancedFilter.onlyFlaggedQuestions)
          parts.push('الأسئلة المميزة بنجمة');
        if (this.advancedFilter.onlyTakfelQuestions)
          parts.push('أسئلة التقفيلات');
      }
      return parts.join(' - ');
    },

    rePublicExam() {
      return this.publicExam;
    },

    selectedCardRe() {
      return this.selectedCard;
    },
  },
  watch: {
    'appRoute.query.page': {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.selectedType = examTypes[newVal];
        this.activeSwitch = false;
        if (
          newVal == UserPanelItemsRecord[UserPanelItems.trainings] ||
          newVal == UserPanelItemsRecord[UserPanelItems.exams]
        ) {
          this.requestStaticData();
        }
        if (newVal == UserPanelItemsRecord[UserPanelItems.exams]) {
          this.selectedAllItem();
          this.requestPublicExam();
        } else {
          //this.selectedCard = [];
        }
      },
    },
    caQueryModel: {
      immediate: true,
      deep: true,
      handler({ list, query }) {
        if (list?.length && query && import.meta.client) {
          const parentId = Number(query.parentId);
          const childId = Number(query.childId);
          if (parentId) {
            if (childId) {
              this.selectItem(childId);
            } else {
              this.onSelectCard(true, parentId);
            }
          }
        }
      },
    },
    activeSwitch: {
      handler(newVal, oldVal) {
        if (!newVal) {
          if (this.selectedType == examTypes.exams) {
            this.selectedAllItem();
          }
        } else {
          this.unSelectedAllItem();
        }
      },
    },
    'advancedFilter.onlyTakfelQuestions': {
      deep: true,
      handler(newVal, oldVal) {
        this.form.takfeelTagsIds = [];
        if (newVal) {
          this.tagsList.forEach((res) => {
            if (res.bankType == 2) {
              this.form.takfeelTagsIds.push(res.id);
            }
          });
        }
      },
    },
    advancedFilter: {
      deep: true,
      handler() {
        this.activeAdvanced = true;
        this.onChangeAdvanced();
      },
    },

    selectedLists: {
      handler(newVal, oldVal) {
        if (
          this.isActiveAdvancedFilter &&
          this.activeAdvanced &&
          this.selectedType == this.examTypes.trainings
        ) {
          this.onChangeAdvanced();
        }
      },
    },
    openModalsCount(newVal) {
      if (newVal === 0) {
        this.startTour();
      }
    },
    canStartTour: {
      deep: true,
      handler(val) {
        if (val) {
          this.checkOpenModals();
        }
      },
    },
    globalTypeUser: {
      deep: true,
      handler(newVal) {
        this.changeGlobalType(newVal);
      },
    },
  },
};
</script>
<style lang="scss" src="./exams-panel.scss" scoped></style>
<style lang="scss">
@import '@/assets/scss/lib/intro-lib';
</style>
