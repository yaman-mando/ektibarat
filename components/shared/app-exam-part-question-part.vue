<template>
  <div
    class="exam-question relative"
    :class="[
      isTrain ? 'is-train' : 'is-exam',
      { 'is-media-question': isMediaQuestionModel },
      { 'is-text-question': questionTypeModel == questionTypeEnum.text },
      { hasReviewTime: hasReviewTime },
    ]"
  >
    <lazy-app-overlay v-if="isReview && isLoadingReview" />
    <div
      class="block w-full exam-question-wrapper"
      :class="[
        { hasTags: withTags },
        { 'is-seo': isSeo },
        { 'is-animation': isAnimation },
      ]"
    >
      <div class="exq-i">
        <div
          class="flex items-center gap-2 text-white text-[16px] xl:text-[30px] q-label"
        >
          <template v-if="questionNumber">
            <span>{{ staticLocales.trainPage.questionLabel }}:</span>
            <span>({{ questionNumber }})</span>
          </template>
          <template v-else>
            <span>{{ mainTitle }}</span>
          </template>
        </div>
        <slot name="header"></slot>
        <template v-if="!isAnimation">
          <template v-if="isReview">
            <div class="flex items-center gap-4">
              <i
                class="fa-solid fa-image text-white text-[16px] xl:text-[30px] cursor-pointer"
                @click="navToQuestionToday()"
              ></i>
              <i
                class="fa-solid fa-gem text-white text-[16px] xl:text-[30px] cursor-pointer"
                @click="onClickRecord(questionModel.questionGuid)"
              ></i>
              <i
                class="fa-solid fa-trash text-danger text-[16px] xl:text-[30px] cursor-pointer"
                @click="onDelete(questionModel.id)"
              ></i>
              <i
                class="fa-solid fa-pie-chart text-white text-[16px] xl:text-[30px] cursor-pointer"
                @click="showAnalytics"
              ></i>
              <i
                class="fa-solid fa-eye text-white text-[16px] xl:text-[30px] cursor-pointer"
                @click="navToQuestionDetail()"
              ></i>
              <nuxt-link
                :to="{
                  path: routeHelper.adminQuestionEditWithFilter(
                    questionModel.id,
                    filterData
                  ),
                }"
                class="flex items-baseline gap-2 text-white text-[16px] xl:text-[30px]"
              >
                <i class="fa-solid fa-edit"></i>
              </nuxt-link>
              <!--            <nuxt-link
                  :to="{ path: routeHelper.adminQuestionEdit(questionModel.id) }"
                  class="flex items-baseline gap-2 text-white text-[16px] xl:text-[30px]"
                >
                  <i class="fa-solid fa-edit"></i>
                </nuxt-link>-->
              <div class="flex items-center !gap-">
                <lazy-prime-toggle-switch
                  v-model="questionModel.isChecked"
                  inputId="review-check"
                  @update:modelValue="onReviewAction"
                />
                <label for="review-check">تم التدقيق</label>
              </div>

              <lazy-prime-checkbox
                :value="isChecked"
                @change="onSelect"
              />
            </div>
          </template>
          <template v-else>
            <div
              v-if="hasComplainAction"
              style="display: flex; column-gap: 10px; align-items: center"
            >
              <div
                v-if="hasOnlyEdit"
                class="flex items-center gap-4"
              >
                <nuxt-link
                  target="_blank"
                  :to="{
                    path: routeHelper.adminQuestionEditWithFilter(
                      questionModel.questionId,
                      filterData
                    ),
                  }"
                  class="flex items-baseline gap-2 text-white text-[16px] xl:text-[30px]"
                >
                  <i class="fa-solid fa-edit"></i>
                </nuxt-link>
              </div>
              <img
                class="cursor-pointer comp-img"
                alt="complain"
                src="/images/icons/warn-gray.svg"
                @click="showComplainForm"
              />
            </div>
            <template v-else>
              <div
                v-if="isSeo"
                style="flex: 1"
              >
                <client-only>
                  <nuxt-img
                    v-if="!windowSize.isMobileSize"
                    width="163"
                    height="45"
                    src="/images/ekhtibara-logo-ar.png"
                    alt="شعار اختبارات - منصة الاختبارات الإلكترونية"
                    title="شعار منصة اختبارات - اختبارات إلكترونية متنوعة"
                    loading="lazy"
                    format="webp"
                    quality="80"
                    preload
                    fetchpriority="high"
                    decoding="async"
                    style="width: 163px; height: auto"
                  />
                </client-only>
              </div>
              <div
                v-else
                class="flex items-center justify-end"
              >
                <div
                  v-if="showFeature"
                  v-prime-tooltip="
                    'عند إضافة سؤال إلى المفضلة يمكنك إعادة التدريب به واختيار الأسئلة المعلمة بنجمة'
                  "
                  class="__q-feature"
                  :class="[{ 'is-featured': isFeatured }]"
                  @click="onFeatureClick"
                >
                  <div class="__q-fe-w">
                    <i class="fa fa-star"></i>
                    <span>{{ isFeatured ? 'مميز' : 'تمييز بنجمة' }}</span>
                  </div>
                </div>
                <div
                  v-if="!hideCounter"
                  class="cd-co-w"
                >
                  <i class="ek-icon-Icon-material-update"></i>
                  <span class="cd-co">{{ counterModel }}</span>
                </div>
                <div
                  v-if="showFlag"
                  class="__q-flag"
                  :class="[{ 'is-flagged': isFlagged }]"
                  @click="onFlagClick"
                >
                  <div class="__q-fw">
                    <i class="ek-icon-flag"></i>
                    <span>مراجعة</span>
                  </div>
                </div>
                <app-button
                  v-if="isSelectMode"
                  label="اختيار السؤال"
                  size="sm"
                  @click="onSelect"
                />
              </div>
            </template>
          </template>
          <template v-if="showTopAction">
            <div class="seo-title">
              <app-button
                class="outline-btn"
                variant="outline"
                colorType="success"
                label="طريقة الحل"
                @click.stop="openAnswerHelpModal"
              />
              <client-only>
                <div
                  style="cursor: pointer"
                  class="warning-square"
                  @click.stop="isOpenComplaintForm = true"
                >
                  <img
                    width="28"
                    height="25"
                    src="/images/png/warning-red.png"
                    alt="اختبارات"
                  />
                </div>
              </client-only>
            </div>
          </template>
        </template>
      </div>

      <div
        v-if="withCat || withLaws"
        class="rw-cat-laws"
      >
        <div
          v-if="withCat"
          class="cat-part"
        >
          <span class="title">الأقسام:</span>
          <lazy-select-list
            ref="catQuestionList"
            name="أختر قسم"
            :showSelectedItem="true"
            :erasable="true"
            :options="catOptions"
            :selectedItem="selectedCat"
            @update:selectedItem="onSelectedCat"
          />
          <div
            v-if="catList && catList.length > 0"
            class="cat-items"
          >
            <div
              v-for="cat of catList"
              :key="cat.id"
              class="cat-item"
              :class="{
                active: questionModel.categories.some((k) => k.id == cat.id),
              }"
              @click="selectCat(cat.id)"
            >
              {{ cat.label }}
            </div>
          </div>
        </div>
        <div
          v-if="withLaws"
          class="cl-laws"
        >
          <div
            v-for="law of questionModel.categoriesGroupsWithLaws"
            :key="law.title"
            class="law-item"
          >
            <span>{{ law.title }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="withTags"
        class="tag-group"
      >
        <hr class="tag-line" />
        <div class="tag-items">
          <span class="title">التاغات:</span>
          <template
            v-for="tag of tagsOptions"
            :key="tag.id"
          >
            <div
              v-if="questionModel.tagsIds.some((k) => k == tag.id)"
              class="tag-item"
              :class="{
                active: questionModel.tagsIds.some((k) => k == tag.id),
              }"
              @click="selectTag(tag.id)"
            >
              {{ tag.label }}
            </div>
          </template>
          <button
            class="showTagBtn"
            @click="openTagsModal"
          >
            عرض الكل
          </button>
        </div>
        <hr class="tag-line" />
      </div>
      <div class="asd-wrap">
        <div
          class="asd-w"
          :class="{
            withBg: withBg,
            withCompare: compareDataModal,
          }"
        >
          <div
            v-if="isAnimation || (withBg && !windowSize.isMobileSize)"
            class="flex justify-center absolute"
            style="width: 100%; height: 100%"
          >
            <nuxt-img
              width="auto"
              height="100%"
              src="/images/ekhtibaratLogo-2.png"
              alt="شعار اختبارات - منصة الاختبارات الإلكترونية"
              title="شعار منصة اختبارات - اختبارات إلكترونية متنوعة"
              loading="lazy"
              format="webp"
              quality="80"
              class="bg-logo"
            />
          </div>
          <slot name="mainContent"></slot>
          <div
            v-if="compareDataModal"
            class="w-full block"
          >
            <div class="s-title">
              <div class="aq-compare-wrapper">
                <div class="aq-compare-wrapper__hero">
                  <lazy-app-math-text-html
                    :key="questionTitleModal"
                    :noPopover="true"
                    :text="questionTitleModal"
                  />
                  <div
                    v-if="isMediaQuestionModel"
                    class="aq-compare-wrapper__media"
                  >
                    <lazy-app-view-media-files
                      v-if="isPhotoQuestion"
                      :url="questionModel.contentUrl"
                      :requestType="pictureTypesEnum.questions"
                      :mediaType="questionTypeEnum.photo"
                      :defaultType="questionTypeEnum.photo"
                      :defaultUrl="questionModel.contentUrl"
                      radius="5"
                      :withModal="true"
                    />
                  </div>
                </div>
                <lazy-app-math-text-html
                  v-if="compareDataModal"
                  :key="compareDataModal"
                  class="s-compare-c"
                  :isCompare="true"
                  :noPopover="true"
                  :text="compareDataModal"
                />
              </div>
            </div>
          </div>
          <template v-else>
            <span class="s-title">
              <lazy-app-math-text-html
                :key="questionTitleModal"
                :noPopover="true"
                :text="questionTitleModal"
              />
            </span>

            <span
              v-if="questionDescriptionModel"
              class="s-desc"
            >
              <lazy-app-math-text-html
                :noPopover="true"
                :text="questionDescriptionModel"
              />
            </span>

            <div class="aq-ww">
              <div
                v-if="isMediaQuestionModel"
                class="aq-content"
              >
                <lazy-app-view-media-files
                  v-if="isPhotoQuestion"
                  :url="questionModel.contentUrl"
                  :requestType="pictureTypesEnum.questions"
                  :mediaType="questionTypeEnum.photo"
                  :defaultType="questionTypeEnum.photo"
                  :defaultUrl="questionModel.contentUrl"
                  radius="5"
                  :withModal="true"
                />
                <lazy-app-view-media-files
                  v-if="isVideoQuestion"
                  :url="questionModel.contentUrl"
                  :requestType="pictureTypesEnum.questions"
                  :mediaType="questionTypeEnum.video"
                  :defaultType="questionTypeEnum.video"
                  :defaultUrl="questionModel.contentUrl"
                  radius="5"
                />
                <lazy-app-view-media-files
                  v-if="isAudioQuestion"
                  :url="questionModel.contentUrl"
                  :requestType="pictureTypesEnum.questions"
                  :mediaType="questionTypeEnum.audio"
                  :defaultType="questionTypeEnum.audio"
                  :defaultUrl="questionModel.contentUrl"
                  radius="5"
                />
              </div>
            </div>
          </template>

          <div
            v-if="hasReviewTime"
            class="s-time-w"
          >
            <div class="st-i">
              <span>{{ staticLocales.trainPage.answerTime }}:</span>
              <span>
                {{ dateHelper.convertSecondsToLabel_mm_ss(studentTimeTaken) }}
              </span>
            </div>
            <div
              v-if="!pointsCount"
              class="st-i"
            >
              <span>{{ staticLocales.trainPage.average }}:</span>
              <span>
                {{
                  dateHelper.convertSecondsToLabel_mm_ss(allStudentsTimeTaken)
                }}
              </span>
            </div>

            <div
              v-else
              class="st-i"
            >
              <span>{{ staticLocales.trainPage.pointsCount }}:</span>
              <span>
                {{ pointsCount }}
              </span>
            </div>

            <div
              v-if="showHelpType"
              class="st-i"
            >
              <span>{{ staticLocales.trainPage.helpType }}:</span>
              <span>
                {{ answerHelpType[questionModel.answerType] }}
              </span>
            </div>
          </div>

          <template v-if="questionAnimateConfigModel.showClockTicking">
            <img
              class="clock-image"
              src="/images/clock-ticking.gif"
              alt="clock image"
            />
          </template>
        </div>
        <div class="a-answer-w">
          <slot></slot>
        </div>
      </div>
    </div>
    <lazy-web-complaint-modal
      v-if="hasComplainAction"
      v-model:isOpen="isOpenComplaintForm"
      :questionId="questionModel.id"
      :examId="examId"
    />

    <lazy-web-complaint-modal
      v-if="isSeo"
      v-model:isOpen="isOpenComplaintForm"
      :isSeo="true"
      :questionId="questionModel.questionGuid"
    />

    <lazy-admin-tags-modal
      v-if="withTags"
      v-model:isOpen="isOpenModalTags"
      :tagsList="tagsOptions"
      :selectedTags="questionModel.tagsIds"
      :modalId="questionModel.id"
      @selectTag="selectTag"
    />

    <lazy-web-answer-help-modal
      ref="answerHelpModalRef"
      v-model:isOpen="isOpenHelpAnswerModal"
      :isTahsele="isSeo ? isTahsele : false"
      :htmlContent="questionModel.feedbackInCorrectAnswer"
      @toTraining="appEvents.emitToTraining()"
    />
  </div>
</template>
<script lang="ts">
import { answerHelpType } from '~/main/constants/answer-help-type';
import {
  QUESTION_ANIMATE_DEFAULT_CONFIG,
  type QuestionAnimateConfigModel,
} from '~/main/utils/question-animate.utils';
import type { StudentsExamQuestionDataModel } from '~/main/modules/students-exam/data-access/models/students-exam-question.model';
import { questionTypes } from '~/main/modules/questions/data-access/constats/question-types';
import { pictureTypes } from '~/main/constants/picture-types';
import { DateHelper } from '~/main/utils/date-utils';
import { useGlobalStore } from '~/main/useGlobalStore';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import { sleepUtil } from '~/main/utils/shared-utils';
import { RouteHelper } from '~/main/utils/route-helper';
import { GlobalTypes } from '~/main/constants/global-types';
import { appEvents } from '~/main/shared/events/app.events';

export default {
  inject: {
    questionAnimateConfig: {
      from: 'questionAnimateConfig',
      default: QUESTION_ANIMATE_DEFAULT_CONFIG,
    },
  },
  props: {
    isSelectMode: Boolean,
    examId: String,
    mainTitle: {
      type: String,
    },
    isTrain: Boolean,
    isReview: Boolean,
    hasOnlyEdit: Boolean,
    isSeo: Boolean,
    isAnimation: Boolean,
    isQuestionToday: Boolean,
    questionNumber: Number,
    counterValue: Number as PropType<number | null>,
    hideCounter: Boolean,
    question: {
      type: Object as () => StudentsExamQuestionDataModel,
    },
    hasComplainAction: Boolean,
    showFlag: Boolean,
    showFeature: Boolean,
    studentTimeTaken: {
      type: Number,
    },
    allStudentsTimeTaken: {
      type: Number,
    },
    pointsCount: {
      type: Number,
    },
    showHelpType: {
      type: Boolean,
      default: false,
    },
    withBg: {
      type: Boolean,
    },
    isChecked: Boolean,
    withTags: Boolean,
    tagsOptions: { type: Array as () => any[], default: () => [] },
    withCat: Boolean,
    withLaws: Boolean,
    catOptions: { type: Array as () => any[], default: () => [] },
    allCat: { type: Array as () => any[], default: () => [] },
  },
  emits: [
    'showAnalytics',
    'selectTag',
    'selectCat',
    'answerChanged',
    'afterReviewAction',
    'deleteChanged',
    'onSelect',
    'onFlageChange',
    'onFeatureChange',
  ],
  setup() {
    const router = useRouter();
    const route = useRoute();
    const windowSize = useWindowSize();
    const globalStore = useGlobalStore();
    const runtimeConfig = useRuntimeConfig();
    globalStore.getLocalesJsonStatic();

    return {
      appRouter: router,
      appRoute: route,
      staticLocales: globalStore.staticState.locales!,
      windowSize,
      appEvents,
      runtimeConfig,
    };
  },
  data() {
    return {
      isOpenComplaintForm: false,
      isLoadingReview: false,
      answerHelpType,
      selectedCat: null as string | number | null,
      isFeatured: false,
      isFlagged: false,
      isOpenModalTags: false,
      isOpenHelpAnswerModal: false,
      widthWindow: null as number | null,
      questionTitle: this.question?.title,
      compareData: null as string | null,
    };
  },
  computed: {
    questionAnimateConfigModel() {
      return this.questionAnimateConfig as QuestionAnimateConfigModel;
    },
    showTopAction() {
      return (
        this.isSeo &&
        !this.questionAnimateConfigModel?.hideQuestionTopActions &&
        !this.isQuestionToday
      );
    },
    routeHelper() {
      return RouteHelper;
    },
    hasCompareContent() {
      return this.questionModel?.title.includes('csssDiv');
    },
    compareDataModal() {
      return this.compareData;
    },
    questionTitleModal() {
      return this.questionTitle;
    },
    dateHelper() {
      return DateHelper();
    },

    counterModel() {
      if (this.counterValue) {
        return this.dateHelper.convertSecondTo_hh_mm_ss(this.counterValue);
      }
      return '00:00';
    },
    hasReviewTime() {
      return this.studentTimeTaken && this.allStudentsTimeTaken;
    },
    pictureTypesEnum() {
      return pictureTypes;
    },
    questionTypeEnum() {
      return questionTypes;
    },
    questionModel() {
      return this.question as StudentsExamQuestionDataModel;
    },
    questionDescriptionModel() {
      return (
        this.questionModel.description ?? this.questionModel.shortDescription
      );
    },

    questionTypeModel() {
      return this.questionModel.questionsType[0];
    },
    isPhotoQuestion() {
      return this.questionModel.questionsType.some(
        (val) => val === questionTypes.photo
      );
    },
    isVideoQuestion() {
      return this.questionModel.questionsType.some(
        (val) => val === questionTypes.video
      );
    },
    isAudioQuestion() {
      return this.questionModel.questionsType.some(
        (val) => val === questionTypes.audio
      );
    },
    isMediaQuestionModel() {
      return (
        this.isPhotoQuestion || this.isVideoQuestion || this.isAudioQuestion
      );
    },
    catSmallList() {
      const list: any[] = [];
      this.allCat[0]?.children?.forEach((k) => {
        k.children?.forEach((t) => {
          if (!t.isText) {
            list.push(t);
          }
        });
      });
      return list;
    },
    catList() {
      if (
        this.selectedCat &&
        this.catSmallList.filter((k) => k.id == this.selectedCat).length > 0
      ) {
        return this.catSmallList.filter((k) => k.id == this.selectedCat)[0]
          .children;
      } else {
        return [];
      }
    },
    filterData() {
      return this.$store.state.admin.questionFilter;
    },
    isTahsele() {
      return this.questionModel.grade == GlobalTypes.tahsele;
    },
  },
  watch: {
    questionModel: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.isFeatured = val.isFeatured;
          this.isFlagged = val.isFlagged;
          this.questionTitleProcess();
        }
      },
    },
  },

  async mounted() {
    this.$nextTick(() => {
      this.widthWindow = window.innerWidth;
    });
    if (this.withCat) {
      await sleepUtil(2000);
      this.getSelectedId();
    }
  },
  methods: {
    async onClickRecord(guid) {
      try {
        const root = this.runtimeConfig.public.websiteUrl;
        const payload = {
          stopFunctionName: QUESTION_ANIMATE_DEFAULT_CONFIG.stopFunctionName,
          url: `${root}/question-animate/${guid}`,
          selector: '.question-animate-page',
        };
        const domain = {
          live: 'https://keen-beaver.37-27-63-239.plesk.page',
          render: 'https://ek-timecut-node.onrender.com',
          local: 'http://localhost:3000',
          local_3800: 'http://localhost:3800',
        };
        const axiosConfig = { baseURL: `${domain.local_3800}/na` };
        await this.$axios.post(`/record/${guid}`, payload, axiosConfig);
      } catch (error) {
        console.error('Capture failed:', error);
      }
    },
    openAnswerHelpModal() {
      this.isOpenHelpAnswerModal = true;
      /*if(this.isSeo && this.$store.state.showSeoAdModalStart != false){
        this.$store.commit('SET_SEO_AD_MODAL_TEMP_START',Math.floor(Math.random() * 1000000))
      }*/
    },
    async onFlagClick() {
      this.isFlagged = !this.isFlagged;
      this.$emit('onFlageChange', this.isFlagged);
      await this.$store.dispatch('student/callQuestionFlag', {
        questionId: this.questionModel.questionId,
        studentQuestionId: this.questionModel.id,
      });
    },
    async onFeatureClick() {
      this.isFeatured = !this.isFeatured;
      this.$emit('onFeatureChange', this.isFeatured);
      await this.$store.dispatch('student/callQuestionFeature', {
        questionId: this.questionModel.questionId,
        studentQuestionId: this.questionModel.id,
      });
    },
    async onSelect() {
      try {
        this.$emit('onSelect', this.questionModel);
      } catch (e) {
        console.log(e);
      }
    },
    onDelete(questionId) {
      this.$emit('deleteChanged', questionId);
    },
    onAnswerChange(answerId) {
      this.$emit('answerChanged', answerId);
    },
    showComplainForm() {
      this.isOpenComplaintForm = true;
    },
    showAnalytics() {
      this.$emit('showAnalytics', this.questionModel.id);
    },
    async onReviewAction(val) {
      this.isLoadingReview = true;
      await this.$store.dispatch('admin/callQuestionCheck', {
        id: this.questionModel.id,
        isChecked: val,
      });
      this.$emit('afterReviewAction', val);
      this.isLoadingReview = false;
    },
    async navToQuestionDetail() {
      const _route = this.appRouter.resolve({
        path: RouteHelper.webExamQuestionDetailById(
          this.questionModel.questionGuid
        ),
      });
      window.open(_route.href);
    },

    async navToQuestionToday() {
      const _route = this.appRouter.resolve({
        path: RouteHelper.webExamQuestionToday(
          this.questionModel.questionGuid,
          [],
          true
        ),
      });
      window.open(_route.href);
    },

    selectTag(id) {
      this.$emit('selectTag', { qId: this.questionModel.id, tagId: id });
    },

    openTagsModal() {
      this.isOpenModalTags = true;
    },

    onSelectedCat(id) {
      this.selectedCat = id;
      this.$emit('selectCat', {
        qId: this.questionModel.id,
        catId: id,
        isParent: true,
      });
    },
    selectCat(id) {
      this.$emit('selectCat', {
        qId: this.questionModel.id,
        catId: id,
        isParent: false,
      });
    },
    getSelectedId() {
      if (this.questionModel.categories.length > 0) {
        this.catSmallList.forEach((k) => {
          if (this.questionModel.categories.some((s) => s.id == k.id)) {
            this.selectedCat = k.id;
          }
          if (k.children && k.children.length > 0) {
            for (let i = 0; i < k.children.length; i++) {
              if (
                this.questionModel.categories.some(
                  (s) => s.id == k.children[i].id
                )
              ) {
                this.selectedCat = k.children[i].parentId;
                break;
              }
            }
          }
        });
      }
    },

    questionTitleProcess() {
      const title = this.questionModel.title;
      const compareContent = null;
      if (import.meta.client) {
        if (this.hasCompareContent) {
          this.compareProcessData();
        } else {
          this.questionTitle = title;
          this.compareData = null;
        }
      } else {
        this.questionTitle = title;
        this.compareData = compareContent;
      }
    },

    async compareProcessData() {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = deepCloneUtil(this.questionModel.title);
        const removableChild = Array.from(
          tempDiv.getElementsByClassName('csssDiv')
        );
        const cDiv = document.createElement('div');
        await sleepUtil(200);
        removableChild?.forEach((item) => {
          item.remove();
          cDiv.innerHTML += item.innerHTML;
        });
        this.questionTitle = tempDiv.innerHTML;
        this.compareData = cDiv.innerHTML;
      } catch (e) {
        console.log('compareProcessData: ' + e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@use '@/assets/scss/mixin' as *;

@mixin exam-part-img() {
  ::v-deep {
    img {
      width: 300px;
      max-width: none !important;
      max-height: none !important;
      height: auto;
      padding: 5px;

      @include web-desktop-up() {
      }
    }
  }
}

.exam-question {
  width: 100%;
  height: 100%;

  .aq-compare-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &__hero {
      width: 100%;
      display: grid;
      align-items: flex-start;
      gap: 10px;
      justify-content: flex-start;

      @include web-desktop-up() {
        grid-template-columns: minmax(0, 1fr) auto;
      }
    }

    &__media {
      @include exam-part-img();
    }
  }

  &.is-exam,
  &.is-train {
    &.is-media-question {
      @include web-desktop-up {
        .asd-w {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;

          &.withCompare {
            grid-template-columns: 1fr;
            row-gap: 10px;
            margin-bottom: 10px;
          }
        }

        .aq-content {
          margin-bottom: 0;
        }
      }
    }
  }

  .asd-wrap {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    background-color: var(--white-ff);

    @include web-mobile-only() {
      grid-template-rows: auto 1fr;
    }

    @include web-desktop-up() {
      grid-template-rows: minmax(40%, 1fr) auto;
    }
  }

  .asd-w {
    position: relative;
    width: 100%;
    display: flex;
    align-items: flex-start;
    background-color: var(--white-ff);
    flex-direction: column;
    justify-content: center;
    min-height: max-content;

    &.withBg {
      //align-items: center;
      justify-items: center;

      .bg-logo {
        position: absolute;
        opacity: 0.15;
        width: auto;
        height: 100%;
      }
    }

    @include web-desktop-up() {
      min-height: 218px;
    }

    .aq-content {
      padding: 0;
    }
  }

  .s-categoryDescription {
    padding: 10px 15px;
    font-size: 24px;
    display: flex;
  }

  .s-title,
  .s-desc {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: normal;
    font-size: 14px;
    padding: 10px;

    ::v-deep {
      strong,
      math,
      mstyle,
      mfrac {
        font-weight: normal;
        //font-size: 14px !important;
      }

      div,
      p,
      span,
      strong {
        font-weight: normal;
        //font-size: 14px;
      }

      span {
        font-size: unset;
      }

      p {
        margin: 0;
      }

      .s-compare-c {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        border: 1px solid var(--dark-63);
        border-radius: 10px;
        overflow: hidden;
        width: 100%;
        margin-top: 15px;

        div {
          padding: 0.7rem !important;
          max-width: inherit;
          display: flex;
          align-items: center;
          justify-content: center;

          &:nth-child(1) {
            background-color: var(--dark-63) !important;
          }

          &:nth-child(2) {
            grid-column: 1/2;
            grid-row: 2/3;
            border-left: 1px solid var(--dark-63);
            background-color: var(--gray-fa);
          }

          &:nth-child(3) {
            background-color: var(--dark-63) !important;
          }

          &:nth-child(4) {
            background-color: var(--gray-fa) !important;
          }
        }

        @include mobile-down() {
          grid-template-columns: 1fr;
        }
      }
    }

    @include web-desktop-up() {
      padding: 10px 113px 10px 10px;
      font-size: 24px;
      /*::v-deep {
        div,
        p,
        strong,
        math,
        mstyle,
        mfrac {
          font-size: 24px !important;
        }
        span {
          font-size: unset;
        }
      }*/
    }
  }

  @include web-desktop-up() {
    .asd-w.withCompare {
      min-height: 300px;

      .s-title,
      .s-desc {
        padding: 10px 92px;
      }
    }
  }

  &.is-train {
    --padding-x: 10px;

    @media (min-width: 960px) {
      --padding-x: 20px;
    }

    @include web-xl-up() {
      --padding-x: 32px;
    }

    .s-title,
    .s-desc {
      @include web-desktop-up() {
        padding: 10px var(--padding-x);
      }
    }

    .aq-content {
      padding: 0 var(--padding-x);
    }
  }

  .exam-question-wrapper {
    @include web-desktop-up() {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100%;
      border-radius: 15px;
      box-shadow: 0 0 15px #00000033;
      overflow: hidden;

      &.hasTags {
        grid-template-rows: auto auto auto 1fr;
      }
    }

    .exq-i {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--dark-63);
      padding: 14px 10px;
      max-height: 50px;

      @include tablet-up() {
        padding: 20px;
        max-height: 80px;
      }

      @include mobile-down() {
        max-height: unset;
        flex-wrap: wrap;
        row-gap: 15px;
      }

      .cd-co-w {
        line-height: 1;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 5px;
        border: 1px solid #fff;
        border-radius: 8px;
        justify-content: center;
        font-size: 24px;
        width: 100px;
        height: 37px;

        @include web-desktop-up() {
          width: 120px;
          height: 48px;
          font-size: 30px;
        }

        i {
          font-size: 18px;
        }

        .cd-co {
          width: auto;
          margin-bottom: -7px;

          @include web-desktop-up() {
            width: 70px;
            margin-bottom: -5px;
          }

          display: block;
          font-weight: bold;
          text-align: center;
        }
      }

      .__q-flag {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 37px;
        height: 37px;
        border: 1px solid #fff;
        border-radius: 8px;

        img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 21px;
          height: 18px;
        }
      }

      .__q-feature {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #fff;
        border-radius: 8px;
        margin-inline-end: 12px;
        color: #fff;
        cursor: pointer;
        transition: ease-in-out background-color 0.1s;

        &:hover {
          --hover-color: var(--yellow-30);
          background-color: var(--hover-color);
          border-color: var(--hover-color);
        }

        width: 37px;
        height: 37px;

        @include web-desktop-up() {
          justify-content: flex-start;
          width: 130px;
          height: 48px;
        }

        .__q-fe-w {
          display: flex;
          align-items: center;
          justify-content: center;

          @include web-desktop-up() {
            justify-content: flex-start;
          }

          i {
            font-size: 18px;

            @include web-desktop-up() {
              font-size: 28px;
              margin-inline-start: 9px;
            }
          }

          span {
            display: none;
            font-weight: bold;

            @include web-desktop-up() {
              display: block;
              font-size: 18px;
              margin-inline-start: 24px;
            }
          }
        }

        &.is-featured {
          background-color: transparent;
          border-color: #fff;

          i {
            color: var(--yellow-30);
          }
        }
      }

      .__q-flag {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #fff;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        transition: ease-in-out background-color 0.1s;

        &:hover {
          --hover-color: var(--red-5e);
          background-color: var(--hover-color);
          border-color: var(--hover-color);
        }

        width: 37px;
        height: 37px;

        @include web-desktop-up() {
          justify-content: flex-start;
          width: 130px;
          height: 48px;
        }

        .__q-fw {
          display: flex;
          align-items: center;
          justify-content: center;

          @include web-desktop-up() {
            justify-content: flex-start;
          }

          i {
            font-size: 18px;

            @include web-desktop-up() {
              font-size: 28px;
              margin-inline-start: 9px;
            }
          }

          span {
            display: none;
            font-weight: bold;

            @include web-desktop-up() {
              display: block;
              font-size: 18px;
              margin-inline-start: 15px;
            }
          }
        }

        &.is-flagged {
          background-color: transparent;
          border-color: #fff;

          i {
            color: var(--red-5e);
          }
        }
      }

      .seo-title {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 12px;
        align-items: center;

        span {
          font-size: 30px;
          color: #f5f7fa;
          white-space: nowrap; // منع كسر النص وتغيير التخطيط
        }

        .warning-square {
          border: 1px solid var(--red-5e);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          min-width: 48px; // تحديد حجم ثابت
          min-height: 48px;

          i {
            color: var(--red-5e);
            font-size: 28px;
            flex-shrink: 0; // منع تغيير الحجم عند التحميل
          }
        }

        @include tablet-down() {
          span {
            font-size: 16px;
          }

          .warning-square {
            padding: 8.5px;
            min-width: 32px; // تأكيد عدم تغيير الحجم المفاجئ
            min-height: 32px;

            i {
              font-size: 18px;
            }
          }
        }
      }
    }

    &.is-seo {
      box-shadow: 6px 5px 15px -6px rgba(0, 0, 0, 0.2);
      border-radius: 0 0 15px 15px;

      .exq-i {
        width: 100%;
        background-image: url('/images/png/seo-head-q.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-color: #fefeff;
        padding: 6px 15px 26px;

        .q-label {
          margin-top: 20px;

          @include tablet-up() {
            flex: 0.8;
          }
        }
      }

      @include outline-btn(var(--green-8c)) {
        border-radius: 8px;
        width: 150px;
        height: 48px;
        border-width: 1px !important;
        font-size: 20px;
        font-weight: 500;
      }

      @include tablet-down() {
        box-shadow: none;
      }

      @include mobile-down() {
        .exq-i {
          background-size: 149% 119%;
          background-repeat: no-repeat;
          background-color: #fefeff;
          padding: 6px 10px 26px;
          background-position: 100% 0;
          height: 50px;

          .q-label {
            margin-top: 5px;
          }
        }

        .outline-btn {
          width: 84px;
          height: 30px;
          padding: 0;

          ::v-deep span {
            font-size: 14px !important;
          }
        }

        .warning-square {
          width: 32px;
          height: 32px;

          img {
            width: 17px;
          }
        }
      }
    }

    &.is-animation {
      height: 100%;

      .s-title,
      .s-desc {
        font-size: 45px !important;
        height: auto !important;

        * {
          height: auto !important;
          font-size: 45px !important;
        }
      }

      .exq-i {
        span {
          font-size: 24px !important;
        }
      }
    }
  }

  .aq-ww {
    display: block;
    width: 100%;
  }

  .aq-content {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    padding: 15px 0;
    margin-bottom: 10px;

    @include web-desktop-up() {
      margin-bottom: 15px;
    }

    @include exam-part-img();
  }

  &.is-text-question {
    .asd-wrap {
      grid-template-rows: auto min-content;
    }
  }

  &.hasReviewTime {
    .aq-ww {
      margin-bottom: calc(12px + 17px + 11px);

      @include web-desktop-up() {
        margin-bottom: calc(12px + 22px + 15px);
      }
    }
  }

  .a-answer-w {
    display: grid;
    align-content: center;
    width: 100%;
    background-color: var(--white-ff);
    border-top: 5px solid #dcddde;

    @include tablet-down() {
      border-bottom: 5px solid #dcddde;
    }
  }

  .s-time-w {
    position: absolute;
    left: 10px;
    bottom: 11px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 20px;

    @include web-desktop-up() {
      bottom: 15px;
      left: 25px;
      column-gap: 40px;
    }

    .st-i {
      color: var(--gray-8f);
      font-weight: 500;
      font-size: 12px;

      @include web-desktop-up() {
        font-size: 16px;
      }
    }
  }

  .comp-img {
    @include web-mobile-only() {
      width: 20px;
    }
  }

  .ad-rr {
    ::v-deep {
      .vue-js-switch {
        &.toggled {
          .v-switch-button {
            transform: translate3d(calc(30px * 0.6), 3px, 0px) !important;
          }
        }
      }

      .v-switch-core {
        width: calc(64px * 0.6) !important;
        height: calc(37px * 0.6) !important;
      }

      .v-switch-button {
        width: calc(31px * 0.5) !important;
        height: calc(31px * 0.5) !important;
      }

      .text {
        color: var(--white-ff) !important;
      }
    }
  }

  .rw-cat-laws {
    display: flex;
    align-items: baseline;
    column-gap: 10px;
    background: white;

    .cat-part {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      column-gap: 10px;
      background: white;
      flex-wrap: wrap;
      padding-top: 10px;
      padding-inline-start: 10px;
      padding-bottom: 15px;
      flex-shrink: 0;

      .title {
        font-size: 18px;
        font-weight: bold;
      }

      .cat-items {
        display: flex;
        flex-wrap: wrap;
        background: white;

        .cat-item {
          cursor: pointer;
          background: var(--gray-63);
          color: white;
          border-radius: 1rem;
          text-decoration: none;
          font-size: 16px !important;
          padding: 5px 20px;
          height: 35px;
          margin: 5px !important;
          opacity: 0.7;

          &.active {
            opacity: 1;
            background: var(--purple-8c);
            box-shadow: 0 1px 2px 0 #000000;
          }
        }
      }
    }

    .cl-laws {
      display: flex;
      column-gap: 5px;
      align-items: center;
      row-gap: 10px;
      flex-wrap: wrap;
      flex: 1;
      margin: 0 0 10px 10px;

      .law-item {
        border-radius: 1rem;
        padding: 5px 10px;
        background: var(--purple-8c);

        span {
          color: white;
          font-size: 13px;
        }
      }
    }

    @include mobile-down() {
      display: grid;

      .cl-laws {
        margin: 0 10px 10px 10px;
      }
    }
  }

  .tag-group {
    .tag-line {
      border: 2px solid rgba(186, 188, 190, 0.50196);
      margin: 0;
    }

    .tag-items {
      display: flex;
      flex-wrap: wrap;
      background: white;
      padding-inline-start: 10px;
      align-items: center;
      justify-content: flex-start;
      padding: 10px 0;

      .title {
        font-size: 18px;
        font-weight: bold;
      }

      .tag-item {
        cursor: pointer;
        background: var(--gray-63);
        color: white;
        border-radius: 1rem;
        text-decoration: none;
        font-size: 16px !important;
        padding: 5px 20px;
        height: 35px;
        margin: 5px !important;
        opacity: 0.7;

        &.active {
          opacity: 1;
          background: var(--purple-8c);
          box-shadow: 0 1px 2px 0 #000000;
        }
      }

      .showTagBtn {
        background: var(--red-5e);
        border-color: var(--red-5e);
      }
    }
  }
}
</style>
