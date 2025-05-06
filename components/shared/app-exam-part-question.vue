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
    <b-overlay
      v-if="isReview"
      :show="isLoadingReview"
      noWrap
    />
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
              <form-toggle
                class="ad-rr"
                :label="'تم التدقيق'"
                :value="questionModel.isChecked"
                @update:value="onReviewAction"
              />
              <b-checkbox
                class="cu-check"
                :checked="isChecked"
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
                    v-if="widthWindow > 991 && $mq != 'mobile' && $mq != 'ipad'"
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
                  v-b-tooltip.hover.focus.bottom="
                    'عند إضافة سؤال إلى المفضلة يمكنك إعادة التدريب به واختيار الأسئلة المعلمة بنجمة'
                  "
                  class="__q-feature"
                  :class="[{ 'is-featured': isFeatured }]"
                  @click="onFeatureClick"
                >
                  <div class="__q-fe-w">
                    <i class="fa fa-star"></i>
                    <span>{{ isFeatured ? 'مميز' : 'تمييز' }}</span>
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
                  @click.native="onSelect"
                />
              </div>
            </template>
          </template>
          <template v-if="showTopAction">
            <div class="seo-title">
              <b-button
                class="outline-btn"
                @click.stop="openAnswerHelpModal"
              >
                طريقة الحل
              </b-button>
              <client-only>
                <div
                  style="cursor: pointer"
                  class="warning-square"
                  @click.stop="isOpenComplaintForm = true"
                >
                  <img
                    width="100%"
                    height="100%"
                    src="~assets/png/warning-red.png"
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
          <mx-select-list
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
              class="cat-item"
              :class="{
                active: question.categories.some((k) => k.id == cat.id),
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
          <template v-for="tag of tagsOptions">
            <div
              v-if="question.tagsIds.some((k) => k == tag.id)"
              class="tag-item"
              :class="{
                active: question.tagsIds.some((k) => k == tag.id),
              }"
              @click="selectTag(tag.id)"
            >
              {{ tag.label }}
            </div>
          </template>
          <b-button
            class="showTagBtn"
            @click="openTagsModal"
          >
            عرض الكل
          </b-button>
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
            v-if="
              isAnimation ||
              (withBg && widthWindow > 991 && $mq != 'mobile' && $mq != 'ipad')
            "
            class="d-flex justify-content-center w-100 h-100 position-absolute"
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
            <span class="s-title">
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
            </span>
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
                {{ answerHelpType[question.answerType] }}
              </span>
            </div>
          </div>

          <template v-if="questionAnimateConfig.showClockTicking">
            <img
              class="clock-image"
              src="~assets/images/clock-ticking.gif"
            />
          </template>
        </div>
        <div class="a-answer-w">
          <slot></slot>
        </div>
      </div>
    </div>
    <web-complaint-modal
      v-if="hasComplainAction"
      v-model:isOpen="isOpenComplaintForm"
      :questionId="questionModel.id"
      :examId="examId"
    />

    <web-complaint-modal
      v-if="isSeo"
      v-model:isOpen="isOpenComplaintForm"
      :isSeo="true"
      :questionId="questionModel.questionGuid"
    />

    <mx-admin-tags-modal
      v-if="withTags"
      v-model:isOpen="isOpenModalTags"
      :tagsList="tagsOptions"
      :selectedTags="question.tagsIds"
      :modalId="question.id"
      @selectTag="selectTag"
    />

    <web-answer-help-modal
      ref="answerHelpModalRef"
      v-model:isOpen="isOpenHelpAnswerModal"
      :isTahsele="isSeo ? isTahsele : false"
      :htmlContent="questionModel.feedbackInCorrectAnswer"
      @toTraining="$root.$emit('toTraining')"
    />
  </div>
</template>
<script lang="ts" setup>
import { QUESTION_ANIMATE_DEFAULT_CONFIG } from '~/main/utils/question-animate.utils';
import type { StudentsExamQuestionDataModel } from '~/main/modules/students-exam/data-access/models/students-exam-question.model';
import { useGlobalStore } from '~/main/useGlobalStore';

const questionAnimateConfig = inject(
  'questionAnimateConfig',
  QUESTION_ANIMATE_DEFAULT_CONFIG
);

const props = withDefaults(
  defineProps<{
    isSelectMode?: boolean;
    examId?: string;
    mainTitle?: string;
    isTrain?: boolean;
    isReview?: boolean;
    hasOnlyEdit?: boolean;
    isSeo?: boolean;
    isAnimation?: boolean;
    isQuestionToday?: boolean;
    questionNumber?: boolean;
    counterValue?: number;
    hideCounter?: boolean;
    question?: StudentsExamQuestionDataModel;
    hasComplainAction?: boolean;
    showFlag?: boolean;
    showFeature?: boolean;
    studentTimeTaken?: number;
    allStudentsTimeTaken?: number;
    pointsCount?: number;
    showHelpType?: boolean;
    withBg?: boolean;
    isChecked?: boolean;
    withTags?: boolean;
    tagsOptions?: any[];
    withCat?: boolean;
    withLaws?: boolean;
    catOptions?: any[];
    allCat?: any[];
  }>(),
  {}
);

//composable
const windowSize = useWindowSize();
const globalStore = useGlobalStore();

//data
const isOpenComplaintForm = ref(false);
const isLoadingReview = ref(false);
const selectedCat = ref(null);
const isFeatured = ref(false);
const isFlagged = ref(false);
const isOpenModalTags = ref(false);
const questionTitle = ref(props.question?.title);
const compareData = ref(null);

//computed
const staticLocales = computed(() => globalStore.staticState.locales);
</script>
<style lang="scss" scoped>
@import '@/assets/scss/mixin';

@mixin exam-part-img() {
  :deep(img) {
    width: 300px;
    max-width: none !important;
    max-height: none !important;
    height: auto;
    padding: 5px;
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
    /*&.withBg:before {
      content: '';
      background-image: url('~assets/png/ekhtibaratLogo-2.png');
      background-position: center;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-repeat: no-repeat;
      //filter: opacity(0.15);
      opacity: 0.15;
      margin: 10px;
      background-size: contain;
    }*/
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
      mstyle {
        //direction: ltr;
      }

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
          font-size: 14px;
          padding: 0;
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
      .aq-content {
        //margin-top: 100px;
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
    .aq-content {
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
            box-shadow: 0px 1px 2px 0px #000000;
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
          box-shadow: 0px 1px 2px 0px #000000;
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
