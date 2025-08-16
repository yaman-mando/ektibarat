<template>
  <div
    class="answer-select-wrapper relative"
    style="min-height: 230px"
    :class="[
      `type-${answers[0].answerType}`,
      { 'is-disabled': isDisabled },
      { withBg: withBg },
      { 'is-exam': isExam },
      { 'is-animation': isAnimation },
    ]"
  >
    <lazy-app-overlay v-if="fetchingApi" />
    <template
      v-for="item in answers"
      :key="`asc-${item.id}`"
    >
      <div
        class="a-select-item"
        :class="[
          { active: isActiveItem(item.id) },
          getStateClass(item.id),
          getItemClass(item.id),
          getAnswerTypeClass(item),
          { 'has-takfeelat': getShowTakfeelat(item.isTakfeelat) },
        ]"
        @click="onSelectItem(item.id)"
      >
        <!--      text-->
        <template v-if="item.answerType == questionTypes.text">
          <lazy-app-math-text-html
            :noPopover="true"
            :text="item.title"
          />
        </template>
        <!--      end text-->
        <!--      photo video audio-->
        <template v-else>
          <div class="media-wrapper">
            <lazy-app-view-media-files
              v-if="item.answerType == questionTypes.photo"
              :key="`media-${item.id}`"
              :url="item.contentUrl"
              :requestType="pictureTypes.answers"
              :mediaType="questionTypes.photo"
              :defaultType="item.answerType"
              :defaultUrl="item.contentUrl"
              maxHeight="120px"
              maxWidth="120px"
              radius="5"
              :withModal="!disableImgModal"
              style="width: 120px; height: 120px; aspect-ratio: 1/1"
            />
            <lazy-app-view-media-files
              v-if="item.answerType == questionTypes.video"
              :key="`media-video-${item.id}`"
              :url="item.contentUrl"
              :requestType="pictureTypes.answers"
              :mediaType="questionTypes.video"
              :defaultType="item.answerType"
              :defaultUrl="item.contentUrl"
              maxHeight="120px"
              maxWidth="120px"
              radius="5"
            />
            <lazy-app-view-media-files
              v-if="item.answerType == questionTypes.audio"
              :key="`media-audio-${item.id}`"
              :url="item.contentUrl"
              :requestType="pictureTypes.answers"
              :defaultType="item.answerType"
              :defaultUrl="item.contentUrl"
              :mediaType="questionTypes.audio"
              width="250px"
            />
          </div>
        </template>
        <!--      end photo video audio-->

        <lazy-app-popover-wrapper>
          <template #trigger="{ bindTrigger }">
            <i
              class="ek-icon-100-text takfeelat-icon"
              v-bind="bindTrigger"
            ></i>
          </template>
          <template #content>
            <div class="w-full flex flex-col gap-2">
              <div class="flex gap-2 items-center justify-center">
                <i class="fa-solid fa-lock"></i>
                <span class="font-bold text-lg">تقفيلات</span>
              </div>
              <div class="flex items-center gap-2">
                <span>اختار طالب حصل على</span>
                <span>100%</span>
              </div>
              <span>في اختبار القدرات هذه الإجابة</span>
            </div>
          </template>
        </lazy-app-popover-wrapper>

        <!--  Selected Answer Badger shown After Answered   -->
        <template v-if="showSelectedAnswerBadge(item.id)">
          <app-popover-wrapper>
            <template #trigger="{ bindTrigger }">
              <div
                class="selected-badge-q"
                v-bind="bindTrigger"
              ></div>
            </template>
            <template #content>
              <span>الإجابة المختارة</span>
            </template>
          </app-popover-wrapper>
        </template>

        <!--        animation rect-->
        <template
          v-if="
            questionAnimateConfig.showAnswerRect && correctIds.includes(item.id)
          "
        >
          <svg :class="questionAnimateConfig.classes.answerRect">
            <rect
              fill="transparent"
              stroke="#01c48c"
              stroke-width="2"
            />
          </svg>
        </template>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { QUESTION_ANIMATE_DEFAULT_CONFIG } from '~/main/utils/question-animate.utils';
import type { StudentsExamQuestionAnswerDataModel } from '~/main/modules/students-exam/data-access/models/students-exam-question.model';
import { questionTypes } from '~/main/modules/questions/data-access/constats/question-types';
import { pictureTypes } from '~/main/constants/picture-types';
import { QuestionStateEnum } from '~/main/modules/students-exam/data-access/constats/question-state.enum';

const questionAnimateConfig = inject(
  'questionAnimateConfig',
  QUESTION_ANIMATE_DEFAULT_CONFIG
);

const emit = defineEmits<{
  (e: 'update:selectedValue' | 'onAnswerChange', val: number | null): void;
}>();
const props = withDefaults(
  defineProps<{
    answers: StudentsExamQuestionAnswerDataModel[];
    isExam?: boolean;
    selectedValue?: any | null;
    questionState?: number | null;
    fetchingApi?: boolean;
    isSeo?: boolean;
    isDisabled?: boolean;
    isAnimation?: boolean;
    showTakfeelat?: boolean;
    withBg?: boolean;
    correctAnswerId?: number | string;
    correctAnswerIdsList?: number[];
    disableImgModal?: boolean;
  }>(),
  {
    selectedValue: null,
  }
);

//data
const selectedData = ref<number | null>(null);
const selectedAnswer = ref<boolean>(false);
const selectedAnswerId = ref<number | null>(null);

//computed
const isCorrectAnswerAvailable = computed(() => {
  return !!correctIds.value.length;
});

const correctIds = computed(() => {
  const set = new Set();
  if (props.correctAnswerId) {
    set.add(props.correctAnswerId);
  }
  if (props.correctAnswerIdsList?.length) {
    props.correctAnswerIdsList.forEach((id) => set.add(id));
  }
  return [...set.values()];
});

const hasMultipleCorrectAnswers = computed(() => {
  return isCorrectAnswerAvailable.value && correctIds.value.length > 1;
});

const selectedValueModel = computed({
  get() {
    return props.selectedValue;
  },
  set(val) {
    emit('update:selectedValue', val ?? null);
  },
});

//method
function showSelectedAnswerBadge(id: number) {
  return (
    isActiveItem(id) &&
    hasMultipleCorrectAnswers &&
    props.questionState !== QuestionStateEnum.initial
  );
}
function isActiveItem(id: number) {
  return selectedData.value == id;
}
function getItemClass(id: number) {
  if (!isCorrectAnswerAvailable.value) return '';

  if (props.isSeo) {
    if (!selectedAnswer.value) {
      return;
    }
    if (correctIds.value.includes(id)) {
      return 'correct-answer';
    }
    if (selectedAnswerId.value == id && !correctIds.value.includes(id)) {
      return 'wrong-answer';
    }
    return;
  }

  if (props.isDisabled) {
    if (correctIds.value.includes(id)) {
      return 'correct-answer';
    }
    return;
  }

  if (correctIds.value.includes(id)) {
    if (id == selectedValueModel.value) {
      return 'correct-answer__selected';
    } else {
      return 'correct-answer';
    }
  }

  if (isActiveItem(id) && !correctIds.value.includes(id)) {
    return 'wrong-answer';
  }
}
function getStateClass(id: number) {
  if (props.fetchingApi) {
    return 'is-loading';
  } else {
    if (isActiveItem(id)) {
      if (props.questionState == QuestionStateEnum.correct) {
        return 'is-correct';
      }
      if (props.questionState == QuestionStateEnum.wrong) {
        return 'is-wrong';
      }
    }
  }
  return '';
}
function getAnswerTypeClass(item: StudentsExamQuestionAnswerDataModel) {
  const list = {
    [questionTypes.video]: 'media video',
    [questionTypes.photo]: 'media photo',
    [questionTypes.audio]: 'media audio',
  };
  return list[item.answerType];
}
async function onSelectItem(id: number) {
  if (props.isSeo) {
    selectedAnswer.value = true;
    if (!selectedAnswerId.value) {
      selectedAnswerId.value = id;
    }

    return;
  }
  if (props.isDisabled) {
    return;
  }

  if (isActiveItem(id)) return;

  selectedData.value = null;
  emit('onAnswerChange', id);
}

function getShowTakfeelat(isTakfeelat: boolean) {
  if (!isTakfeelat) {
    return false;
  }

  if (!props.showTakfeelat) {
    return false;
  }

  if (props.isDisabled) {
    return true;
  }

  return selectedAnswer;
}

//watch
watch(
  () => props.answers,
  () => {
    selectedAnswer.value = false;
    selectedAnswerId.value = null;
  },
  { immediate: true }
);
watch(
  () => selectedValueModel.value,
  (val) => {
    selectedData.value = val ?? null;
  },
  { immediate: true }
);
</script>
<style lang="scss">
@use '@/assets/scss/mixin' as *;

.answer-select-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  padding: 15px 10px !important;
  justify-items: center;
  justify-content: center;
  @include web-desktop-up() {
    padding: 25px 20px !important;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    column-gap: 17px;
    row-gap: 25px;
  }

  &.is-exam {
    @include web-desktop-up() {
      column-gap: 48px;
    }

    &.type-0 {
      @include web-desktop-up() {
        grid-template-columns: 1fr 1fr;
      }
      @include web-xl-up() {
        grid-template-columns: repeat(2, 502px);
      }
    }
  }

  &.is-disabled {
    .a-select-item {
      cursor: default;
    }
  }

  &.is-animation {
    .math-text {
      font-size: 45px;
      * {
        font-size: 45px !important;
      }
    }
    .a-select-item {
      border: none;
    }
  }

  &.type-0 {
    grid-template-columns: 1fr;
    @include web-desktop-up() {
      grid-template-columns: 1fr 1fr;
    }
    @include web-xl-up() {
      grid-template-columns: repeat(2, 393.5px);
    }

    .a-select-item {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 50px;
      width: 100%;
      @include web-desktop-up() {
        min-height: 70px;
      }
    }
  }

  .a-select-item {
    .math-text {
      p {
        margin-bottom: 0;
      }
    }
    &.correct-answer {
      border-color: var(--green-8c);
      border-width: 1px;
    }
    &.wrong-answer {
      border-color: var(--red-63);
      border-width: 1px;
    }

    &.active {
      &.is-correct {
        border-color: var(--green-8c);
      }
      &.is-wrong {
        border-color: var(--red-63);
      }
      &.is-loading {
        background: var(--white);
      }
    }

    &.media {
      width: 115px;
      height: 115px;
      padding: 5px;
      @include web-desktop-up() {
        width: 100%;
        max-width: 185px;
        height: auto;
      }
      img {
        width: 95px;
        height: 95px;
        object-fit: contain;
        aspect-ratio: 1 / 1;
        @include web-desktop-up() {
          height: 150px;
          width: 150px;
          max-width: 150px !important;
        }
      }
    }
  }

  .a-select-item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid var(--gray-d1);
    border-radius: 10px;
    cursor: pointer;
    background: var(--gray-fa);
    padding: 10px;
    .takfeelat-icon {
      width: 20px;
      height: 20px;
      display: inline-block;
      visibility: hidden;
      color: #e9b317;
      position: absolute;
      left: 15px;
      font-size: 20px;
    }
    &.has-takfeelat {
      .takfeelat-icon {
        visibility: visible;
      }
    }

    &.active {
      color: var(--purple-af);
      border-color: var(--purple-af);
      border-width: 1px;
      background-color: #f8f3ff;
    }

    .media-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      //margin-top: 25px;
    }

    .selected-badge-q {
      position: absolute;
      left: 5px;
      top: 5px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: var(--green);
    }
  }
}
</style>
