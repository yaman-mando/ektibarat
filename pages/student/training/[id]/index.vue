<template>
  <client-only>
    <div class="student-exam-details">
      <template v-if="isLoadingPage">
        <div class="flex items-start justify-center relative">
          <lazy-app-spinner class="my-3" />
        </div>
      </template>
      <template v-else>
        <template
          v-if="examDetail && currentQuestionDetailModel && currentAnswersModel"
        >
          <div class="sed-w">
            <div class="w-full flex flex-col sed-p1 w-container">
              <div class="st-h">
                <app-button
                  class="e-bu"
                  label="إنهاء التدريب"
                  variant="outline"
                  iconStartClass="ek-icon-exit-door"
                  @click="exitPage"
                />
                <img
                  alt="Ekhtibarat"
                  src="/images/EkhtibaratLogoColor.webp"
                />
                <div class="ec-po">
                  <img
                    src="/images/svg/star-orange.svg"
                    alt="star point"
                  />
                  <span>{{ Number(2988).toLocaleString() }}</span>
                </div>
              </div>
              <div class="st-progress-w">
                <app-progress-bar
                  :max="allQuestions.length"
                  :value="allAnsweredQuestionCounts"
                  :showLabel="false"
                  :height="12"
                />
                <div class="st-res">
                  <div
                    class="flex items-center justify-center gap-1 text-green-8c"
                  >
                    <i
                      class="fa-solid fa-check text-xs !flex items-center justify-center text-white rounded-[50%] w-[20px] h-[20px] bg-green-8c"
                    ></i>
                    <span class="">{{ correctAnswerCount }}</span>
                  </div>
                  <div class="tp-sep"></div>
                  <div
                    class="flex items-center justify-center gap-1 text-red-63"
                  >
                    <i
                      class="fa-solid fa-xmark text-xs !flex items-center justify-center text-white rounded-[50%] w-[20px] h-[20px] bg-red-63"
                    ></i>
                    <span class="">{{ wrongAnswerCount }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="sed-p2">
              <div class="w-container">
                <!--            <client-only>-->
                <!--              <div-->
                <!--                v-if="$isDev"-->
                <!--                class="bg-red-100"-->
                <!--              >-->
                <!--                <lazy-prime-button-->
                <!--                  size="small"-->
                <!--                  @click="confirmContinueOrExitTrain"-->
                <!--                >-->
                <!--                  end-->
                <!--                </lazy-prime-button>-->
                <!--                <lazy-prime-button-->
                <!--                  size="small"-->
                <!--                  @click="prevQuestion"-->
                <!--                >-->
                <!--                  prev-->
                <!--                </lazy-prime-button>-->
                <!--                <lazy-prime-button-->
                <!--                  size="small"-->
                <!--                  @click="nextQuestion"-->
                <!--                >-->
                <!--                  next-->
                <!--                </lazy-prime-button>-->
                <!--              </div>-->
                <!--            </client-only>-->
                <app-overlay v-if="loadingPage" />
                <div class="t-hero-m">
                  <app-button
                    label="إنهاء"
                    variant="clear"
                    size="sm"
                    iconStartClass="ek-icon-exit-door"
                    @click="exitPage"
                  />
                  <!--              <app-train-part-answers-status-->
                  <!--                v-if="windowSize.isMobileSize && !!activePartModel"-->
                  <!--                ref="answer_status_ref"-->
                  <!--                class="w-mobile-only"-->
                  <!--                :isMobile="true"-->
                  <!--                :canRemoveAnswer="canRemoveAnswerModel"-->
                  <!--                :isLoadingRemoveAnswer="isLoadingRemoverAnswer"-->
                  <!--                :correctAnswerCount="correctAnswerCount"-->
                  <!--                :wrongAnswerCount="wrongAnswerCount"-->
                  <!--                :totalPointsCount="totalPointsCount"-->
                  <!--                :questionMinSecond="currentQuestionDetailModel.questionMinTime"-->
                  <!--                :questionMaxSecond="currentQuestionDetailModel.questionMaxTime"-->
                  <!--                :questionPointsSetting="activePartModel.pointsSettings"-->
                  <!--                :questionId="currentQuestionDetailModel.questionId"-->
                  <!--                :canShowLaw="-->
                  <!--                  currentQuestionDetailModel.isBelongToLaw &&-->
                  <!--                  userCurrentSub.trainingLawWatchingCount > 0-->
                  <!--                "-->
                  <!--                @showLawsAction="onShowLaws"-->
                  <!--                @removeAction="removeAnswersTry"-->
                  <!--                @showAnswerAction="onAnswerHelpAction"-->
                  <!--              />-->
                </div>
                <app-exam-part-article
                  v-if="
                    !!activePartModel?.isCategoryText &&
                    !!activeQuestionModel?.articleUi
                  "
                  :text="activeQuestionModel.articleUi"
                />
                <div class="aqs-w">
                  <lazy-app-exam-part-question-part
                    ref="examPartQuestionRef"
                    :mainTitle="questionTitleModel"
                    :isTrain="true"
                    :counterValue="currentQuestionPassedSecond"
                    :question="currentQuestionDetailModel"
                    :showFeature="true"
                  >
                    <lazy-app-answer-select
                      v-if="!!activeQuestionModel"
                      :correctAnswerIdsList="viewCorrectAnswerIds"
                      :disableImgModal="true"
                      :selectedValue="currentQuestionAnswerId"
                      :answers="currentAnswersModel"
                      :questionState="activeQuestionModel.questionState"
                      :isDisabled="
                        activeQuestionModel.questionState !==
                        questionStateEnum.initial
                      "
                      :showTakfeelat="
                        activeQuestionModel.questionState !=
                        questionStateEnum.initial
                      "
                      @onAnswerChange="onAnswerChange($event)"
                    />
                  </lazy-app-exam-part-question-part>
                  <div class="tpa-w w-mobile-only">
                    <lazy-app-train-part-actions
                      ref="trainPartMobileRef"
                      class="w-container"
                      :isActiveNext="canSelectNextQuestion"
                      :isActiveConfirm="canConfirmAnswerModel"
                      @confirmAction="onSelectAnswer(currentQuestionAnswerId)"
                      @nextAction="nextQuestion"
                      @complainAction="onComplaint"
                    />
                  </div>
                  <!--              <app-train-part-answers-status-->
                  <!--                v-if="!windowSize.isMobileSize && !!activePartModel"-->
                  <!--                ref="answer_status_ref"-->
                  <!--                class="w-web-up-only"-->
                  <!--                :canRemoveAnswer="canRemoveAnswerModel"-->
                  <!--                :isLoadingRemoveAnswer="isLoadingRemoverAnswer"-->
                  <!--                :correctAnswerCount="correctAnswerCount"-->
                  <!--                :wrongAnswerCount="wrongAnswerCount"-->
                  <!--                :totalPointsCount="totalPointsCount"-->
                  <!--                :questionMinSecond="currentQuestionDetailModel.questionMinTime"-->
                  <!--                :questionMaxSecond="currentQuestionDetailModel.questionMaxTime"-->
                  <!--                :questionPointsSetting="activePartModel.pointsSettings"-->
                  <!--                :questionId="currentQuestionDetailModel.questionId"-->
                  <!--                :canShowLaw="-->
                  <!--                  currentQuestionDetailModel.isBelongToLaw &&-->
                  <!--                  userCurrentSub.trainingLawWatchingCount > 0-->
                  <!--                "-->
                  <!--                @removeAction="removeAnswersTry"-->
                  <!--                @showAnswerAction="onAnswerHelpAction"-->
                  <!--                @showLawsAction="onShowLaws"-->
                  <!--              />-->
                </div>

                <lazy-train-part-mobile-actions
                  :questionId="currentQuestionDetailModel.questionId"
                  :canShowLaw="
                    currentQuestionDetailModel.isBelongToLaw &&
                    userCurrentSub.trainingLawWatchingCount > 0
                  "
                  :canRemoveAnswer="canRemoveAnswerModel"
                  :isLoadingRemoveAnswer="isLoadingRemoverAnswer"
                  @showLawsAction="onShowLaws"
                  @removeAction="removeAnswersTry"
                  @showAnswerAction="onAnswerHelpAction"
                  @complaintAction="onComplaint"
                />
                <lazy-modal-answer-feedback
                  v-if="!!activeQuestionModel"
                  v-model:isOpen="isOpenFeedbackModal"
                  :isCorrect="
                    activeQuestionModel.questionState ===
                    questionStateEnum.correct
                  "
                  :msg="feedbackMsg"
                  :feedbackType="feedbackType"
                  :mediaUrl="feedbackMediaUrl"
                />

                <web-answer-help-modal
                  v-model:isOpen="isOpenHelpAnswerModal"
                  :htmlContent="
                    currentQuestionDetailModel.feedbackInCorrectAnswer
                  "
                />
                <web-complaint-modal
                  v-model:isOpen="isOpenComplaintForm"
                  :questionId="currentQuestionDetailModel.id"
                  :examId="examDetail.id"
                />
              </div>
            </div>
            <div class="tpa-w w-web-up-only">
              <lazy-app-train-part-actions
                ref="trainPartWebRef"
                class="w-container"
                :isActiveNext="canSelectNextQuestion"
                :isActiveConfirm="canConfirmAnswerModel"
                @confirmAction="onSelectAnswer(currentQuestionAnswerId)"
                @nextAction="nextQuestion"
                @complainAction="onComplaint"
                @endAction="exitPage"
              />
            </div>
          </div>
          <exam-confirm-exit ref="confirm_exit_ref" />
          <lazy-web-train-end-modal
            ref="train_end_modal_ref"
            :isLoadingContinue="isLoadingContinue"
            @onContinue="onContinueTrain"
            @onEnd="exitWithoutConfirm"
          />
          <client-only>
            <lazy-web-train-question-warn-modal
              ref="questionWarnModalRef"
              :refTo="
                windowSize.isMobileSize
                  ? $refs['trainPartMobileRef']
                  : $refs['trainPartWebRef']
              "
              :refX="windowSize.isMobileSize ? null : $refs.examPartQuestionRef"
            />
            <lazy-web-warn-modal
              ref="warnModalRef"
              :hideClose="true"
              :msg="passedAllowedUnderMinAnswerMsg"
            />
          </client-only>
        </template>
      </template>
    </div>
  </client-only>
</template>
<script lang="ts" setup>
import {
  checkElementIsOverFlowParent,
  getMetaTitle,
  IS_PRODUCTION_APP,
} from '~/main/utils/shared-utils';
import { useStudentsExamStore } from '~/main/modules/students-exam/services/useStudentsExamStore';
import type {
  StudentsExamAnalyzeDataModel,
  StudentsExamCustomFromTagsDTODataModel,
  StudentsExamDataModel,
  StudentsExamPartDataModel,
  StudentsExamPartQuestionDataModel,
  StudentsExamRemoveAnswerDTODataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';
import {
  type TimeSpanModel,
  useTimeSpanService,
} from '~/main/services/useTimeSpanService';
import { useStudentsExamStorageService } from '~/main/modules/students-exam/services/useStudentsExamStorageService';
import type {
  StudentsExamQuestionDataModel,
  StudentsExamQuestionParamsDataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam-question.model';
import { useTrainPointService } from '~/main/services/useTrainPointService';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import type { StudentsExamAnswerDTODataModel } from '~/main/modules/students-exam/data-access/models/students-exam-answer.model';
import { AnswerStateTypeEnum } from '~/main/modules/students-exam/data-access/constats/answer-state-type.enum';
import {
  webErrorPathUtil,
  webStudentTrainingPathUtil,
  webUserPanelTraining,
} from '~/main/utils/web-routes.utils';
import { StudentExamStateEnum } from '~/main/modules/students-exam/data-access/constats/student-exam-state.enum';
import { mapExamDetailModelToUi } from '~/main/modules/students-exam/data-access/parsers/students-exam.parser';
import { QuestionStateEnum } from '~/main/modules/students-exam/data-access/constats/question-state.enum';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { APP_CONFIG } from 'public/constants/app-config';
import { TRAIN_MODAL_WARN_CASE } from '~/main/constants/train-modal-warn-case.enum';
import { useTypedLazyRequest } from '~/composables/useTypedLazyRequest';
import { firstValueFrom, of } from 'rxjs';
import { useStore } from 'vuex';

const $isDev = !IS_PRODUCTION_APP;
//composable
const router = useRouter();
const route = useRoute();
const toastMessage = useToastMessage();
const store = useStore();
const globalStore = useGlobalStore();
const subscriptionsStore = useSubscriptionsStore();
const windowSize = useWindowSize();
const studentsExamStore = useStudentsExamStore();
const examInterval = useTimeSpanService();
const studentsExamStorageService = useStudentsExamStorageService();

//data
const examDetail = ref<StudentsExamDataModel | null>(null);
const isLoadingPage = ref(false);
const questionTrackInterval = ref<ReturnType<typeof setInterval> | null>(null);
const warnState = ref({
  showHelpRemoveAnswerWarn: true,
  showHelpCorrectAnswerWarn: true,
  showMaxTimeWarn: true,
  showMinTimeWarn: true,
});
const isLoadingContinue = ref(false);
const isOpenComplaintForm = ref(false);
const isOpenHelpAnswerModal = ref(false);
const totalPointsCount = ref(0);
const skipRouteLeave = ref(false);
const confirmNavigate = ref(false);
const loadingPage = ref(false);
const isLoadingQuestionDetail = ref(false);
const activePartIndex = ref(0);
const activeQuestionIndex = ref(0);
const counter = ref<number | null>(null);
const counterInterval = ref<ReturnType<typeof setInterval> | null>(null);
const remainTimeInterval = ref(null);
const isOpenFeedbackModal = ref(false);
const examPartsInterval = reactive<Record<string, TimeSpanModel>>({});
const examQuestionsInterval = reactive<Record<string, TimeSpanModel>>({});
const trainingStorageState = ref(
  studentsExamStorageService.getDefaultTrainingState()
);
const questionsAnswersMap = ref<{ [key: string]: number } | null>(null);
const currentQuestionPassedSecond = ref<number>(0);
const isApplyAnswerLoading = ref<boolean>(false);
const questionsDetailRecord = ref<{
  [key: string]: StudentsExamQuestionDataModel;
}>({});
const examPartsPointsSettingsRecord = reactive<
  Record<string, ReturnType<typeof useTrainPointService>>
>({});
const answerUnderMinTimeCount = ref<number>(0);
const confirmExitRef = useTemplateRef('confirm_exit_ref');
//@ts-expect-error ignore ref access value
const answerStatusRef = useTemplateRef('answer_status_ref');
const questionWarnModalRefProp = useTemplateRef('questionWarnModalRef');
const warnModal = useTemplateRef('warnModalRef');
const trainEndModalRef = useTemplateRef('train_end_modal_ref');

//fetch
const answerData = ref<StudentsExamAnswerDTODataModel | null>(null);
const answerRequest = useLazyAsyncData(
  'answer-request',
  () => {
    return studentsExamStore.applyAnswer(answerData.value!);
  },
  {
    immediate: false,
  }
);

const callAnswerApi = async (data: StudentsExamAnswerDTODataModel) => {
  answerData.value = data;
  await answerRequest.execute();
  return answerRequest.data.value;
};

const questionDetailParams = ref<StudentsExamQuestionParamsDataModel | null>(
  null
);
const questionDetailRequest = useLazyAsyncData(
  'exam-question-detail-request',
  () => {
    return studentsExamStore.getQuestionDetailByExamIdAndQuestionId(
      questionDetailParams.value!
    );
  },
  {
    immediate: false,
  }
);

const getExamQuestionApi = async (
  data: StudentsExamQuestionParamsDataModel
) => {
  questionDetailParams.value = data;
  await questionDetailRequest.execute();
  return questionDetailRequest.data.value;
};

const { callApi: analyzeApi } = useTypedLazyRequest<
  string,
  StudentsExamAnalyzeDataModel
>('analyze-request', (param) =>
  studentsExamStore.getAvailableExamCategoryForAnalyzeDetails(param)
);

const { callApi: customFromTagsApi } = useTypedLazyRequest<
  StudentsExamCustomFromTagsDTODataModel,
  StudentsExamDataModel
>('custom-from-tags', (param) => studentsExamStore.getCustomFromTags(param));

const { request: removeAnswerRequest, callApi: removeAnswerApi } =
  useTypedLazyRequest<StudentsExamRemoveAnswerDTODataModel, number>(
    'remove-answer-request',
    (param) => studentsExamStore.removeAnswer(param)
  );

//computed
const passedAllowedUnderMinAnswerMsg = computed(
  () => 'لقد تم الإجابة بشكل متسرع على عدة اسئلة، سوف يتم انهاء الامتحان'
);

const staticLocales = computed(() => globalStore.staticState.locales);

const questionTitleModel = computed(() => activePartModel.value?.title ?? '');

const correctAnswerCount = computed(() => {
  let count = 0;
  if (examDetail.value) {
    examDetail.value.examParts.forEach((part) => {
      count += part.studentsQuestion.filter(
        (q) => q.questionState === QuestionStateEnum.correct
      ).length;
    });
  }
  return count;
});

const wrongAnswerCount = computed(() => {
  let count = 0;
  if (examDetail.value) {
    examDetail.value.examParts.forEach((part) => {
      count += part.studentsQuestion.filter(
        (q) => q.questionState === QuestionStateEnum.wrong
      ).length;
    });
  }
  return count;
});

const isLoadingConfirm = computed(
  () => answerRequest.status.value === 'pending' || isApplyAnswerLoading.value
);

const isDisabledAnswer = computed(
  () => activeQuestionModel.value?.questionState !== QuestionStateEnum.initial
);

const currentQuestionAnswerId = computed(() => {
  if (!questionsAnswersMap.value || !activeQuestionModel.value) return null;
  return questionsAnswersMap.value[activeQuestionModel.value.id];
});

const canConfirmAnswerModel = computed(
  () =>
    !!currentQuestionAnswerId.value &&
    activeQuestionModel.value?.questionState === QuestionStateEnum.initial
);

const showCanTryAnswerHelp = computed(
  () =>
    currentQuestionDetailModel.value?.questionState ===
      questionStateEnum.value.initial &&
    !trainingStorageState.value?.questionsState[
      currentQuestionDetailModel.value?.id
    ]?.isHelpAnswer
);

const canTryAnswerHelp = computed(
  () =>
    trainingStorageState.value?.countOfTryHelpAnswer <
      APP_CONFIG.allowedAnswerHelpTry || !trainingStorageState.value
);

const showCanTryRemoveButton = computed(
  () =>
    currentQuestionDetailModel.value?.questionState ===
      questionStateEnum.value.initial && currentAnswersModel.value?.length === 4
);

const canTryRemoveAnswerModel = computed(
  () =>
    !!currentQuestionDetailModel.value &&
    !trainingStorageState.value?.questionsState[
      currentQuestionDetailModel.value.id
    ]?.isRemoveAnswerUsed
);

const canRemoveAnswerModel = computed(
  () => showCanTryRemoveButton.value && canTryRemoveAnswerModel.value
);

const isLoadingRemoverAnswer = computed(
  () => removeAnswerRequest.status.value === 'pending'
);

const canShowAnswerHelpModel = computed(
  () => showCanTryAnswerHelp.value && canTryAnswerHelp.value
);

const currentAnswersModel = computed(() => {
  if (trainingStorageState.value.removedAnswerIdList.length) {
    return currentQuestionDetailModel.value?.answers.filter(
      (a) => !trainingStorageState.value.removedAnswerIdList.includes(a.id)
    );
  }
  return currentQuestionDetailModel.value?.answers;
});

const activeExamPartInterval = computed(() =>
  activePartModel.value ? examPartsInterval[activePartModel.value.id] : null
);

const activeExamQuestionInterval = computed(() =>
  activeQuestionModel.value
    ? examQuestionsInterval[activeQuestionModel.value.id]
    : null
);

const questionStateEnum = computed(() => QuestionStateEnum);

const activePartModel = computed(
  () => examDetail.value?.examParts[activePartIndex.value]
);

const activeQuestionListModel = computed(() =>
  activePartModel.value ? activePartModel.value.studentsQuestion : null
);

const activeQuestionModel = computed(() =>
  activeQuestionListModel.value
    ? activeQuestionListModel.value[activeQuestionIndex.value]
    : null
);

const currentQuestionDetailModel = computed(() =>
  activeQuestionModel.value
    ? questionsDetailRecord.value[activeQuestionModel.value.id]
    : null
);

const viewCorrectAnswerIds = computed(() => {
  if (!correctAnswerIds.value.length) return [];
  return currentQuestionDetailModel.value?.questionState ===
    QuestionStateEnum.initial
    ? []
    : correctAnswerIds.value;
});

const correctAnswerIds = computed(() =>
  currentQuestionDetailModel.value
    ? currentQuestionDetailModel.value.correctAnswerId
    : []
);

const previousQuestionModel = computed(() => {
  if (isFirstQuestion.value && hasPrevPart.value) {
    return examDetail.value?.examParts[activePartIndex.value - 1]
      .studentsQuestion[0];
  }
  return activeQuestionListModel.value![activeQuestionIndex.value - 1];
});

const nextQuestionModel = computed(() => {
  if (isLastQuestion.value && hasNextPart.value) {
    return examDetail.value?.examParts[activePartIndex.value + 1]
      .studentsQuestion[0];
  }
  if (!activeQuestionListModel.value) return null;
  return activeQuestionListModel.value[activeQuestionIndex.value + 1];
});

const currentPartQuestionsCountModel = computed(
  () => activeQuestionListModel.value!.length
);

const isFirstQuestion = computed(() => activeQuestionIndex.value === 0);

const isLastQuestion = computed(() => {
  if (!activeQuestionListModel.value?.length) return false;
  return activeQuestionIndex.value === activeQuestionListModel.value.length - 1;
});

const canPassQuestion = computed(() =>
  isLastQuestion.value && !hasNextPart.value
    ? false
    : activeQuestionModel.value?.questionState ===
      questionStateEnum.value.initial
);

const hasNextQuestion = computed(
  () => activeQuestionIndex.value < activeQuestionListModel.value!.length - 1
);

const hasPrevPart = computed(() => activePartIndex.value > 0);

const hasNextPart = computed(
  () =>
    !!examDetail.value &&
    examDetail.value.examParts.length > activePartIndex.value + 1
);

const isEndQuestion = computed(
  () => isLastQuestion.value && !hasNextPart.value
);

const canSelectNextQuestion = computed(
  () =>
    activeQuestionModel.value?.questionState !== QuestionStateEnum.initial &&
    (hasNextQuestion.value || hasNextPart.value)
);

const canSelectPrevQuestion = computed(
  () => activeQuestionIndex.value > 0 || hasPrevPart.value
);

const canShowFeedback = computed(
  () =>
    activeQuestionModel.value?.questionState ===
      questionStateEnum.value.correct ||
    activeQuestionModel.value?.questionState === questionStateEnum.value.wrong
);

const isCorrectActiveQuestion = computed(
  () =>
    activeQuestionModel.value?.questionState === questionStateEnum.value.correct
);

const feedbackMsg = computed(() =>
  isCorrectActiveQuestion.value
    ? currentQuestionDetailModel.value?.feedbackCorrectAnswer
    : currentQuestionDetailModel.value?.feedbackInCorrectAnswer
);

const feedbackType = computed(() =>
  isCorrectActiveQuestion.value
    ? currentQuestionDetailModel.value?.typeFeedbackCorrect
    : currentQuestionDetailModel.value?.typeFeedbackInCorrect
);

const feedbackMediaUrl = computed(() =>
  isCorrectActiveQuestion.value
    ? currentQuestionDetailModel.value?.feedbackCorrectUrl
    : currentQuestionDetailModel.value?.feedbackInCorrectUrl
);

const counterModel = computed({
  get: () => counter.value! * 60,
  set: (value) => {
    counter.value = value / 60;
  },
});

const userCurrentSub = computed(
  () => subscriptionsStore.state.userCurrentSubVal!
);

//method
function getAllQuestionsInExam(
  exam: StudentsExamDataModel
): StudentsExamPartQuestionDataModel[] {
  const allQuestions: StudentsExamPartQuestionDataModel[] = [];

  function collectQuestionsInPart(part: StudentsExamPartDataModel): void {
    if (part.studentsQuestion.length) {
      allQuestions.push(...part.studentsQuestion);
    }

    if (part.children.length) {
      part.children.forEach((child) => collectQuestionsInPart(child));
    }
  }

  if (exam.examParts.length) {
    exam.examParts.forEach((part) => collectQuestionsInPart(part));
  }

  return allQuestions;
}

const getCurrentQuestionStorageState = () => {
  return trainingStorageState.value.questionsState[
    currentQuestionDetailModel.value!.id
  ];
};

const initPage = async () => {
  try {
    isLoadingPage.value = true;
    await globalStore.getLocalesJsonStatic();
    let currentExam = store.state.student.currentExamTrainPageData;
    if (!currentExam) {
      const examDetailRes = await studentsExamStore.getById(
        route.params.id as string
      );
      currentExam = examDetailRes;
    }

    const detail = mapExamDetailModelToUi(deepCloneUtil(currentExam));

    //if exam state is done redirect to exams page
    if (detail.state === StudentExamStateEnum.done) {
      return router.replace(webUserPanelTraining());
    }
    let counterVal;
    //will do exam
    if (detail.state === StudentExamStateEnum.willDo) {
      counterVal = detail.duration;
    }
    //process exam
    if (detail.state === StudentExamStateEnum.precessing) {
      counterVal = detail.remainTime;
    }
    //process exam but with remain time not started yet
    if (
      detail.state === StudentExamStateEnum.precessing &&
      !detail.remainTime
    ) {
      counterVal = detail.duration;
    }
    //on page initial if exam is in process set active part and question from api
    let activePartIndexVal = 0;
    let activeQuestionIndexVal = 0;

    activePartIndexVal = detail.examParts.findIndex(
      (part) => !!part.id && part.id === detail.currentPartId
    );

    //check is active part is category text
    if (activePartIndexVal < 0) {
      detail.examParts.forEach((part, partIndex) => {
        if (part.isCategoryText) {
          if (part.children.some((item) => item.id === detail.currentPartId)) {
            activePartIndexVal = partIndex;
          }
        }
      });
    }

    if (activePartIndexVal >= 0) {
      if (detail.examParts[activePartIndexVal].isCategoryText) {
        activeQuestionIndexVal = detail.currentQuestionId
          ? detail.examParts[
              activePartIndexVal
            ].children[0].studentsQuestion.findIndex(
              (item) => item.id === detail.currentQuestionId
            )
          : 0;
      } else {
        activeQuestionIndexVal = detail.examParts[
          activePartIndexVal
        ].studentsQuestion.findIndex(
          (question) => question.id === detail.currentQuestionId
        );
      }
    } else {
      activePartIndexVal = 0;
    }

    let questionId: string | null = null;

    //in case backend issue question exist in currentQuestionId but not in list
    if (activeQuestionIndexVal === -1) {
      activeQuestionIndexVal = 0;
    }
    if (detail.examParts[activePartIndexVal].isCategoryText) {
      questionId =
        detail.examParts[activePartIndexVal].children[0].studentsQuestion[
          activeQuestionIndexVal
        ].id;
    } else {
      questionId =
        detail.examParts[activePartIndexVal].studentsQuestion[
          activeQuestionIndexVal
        ].id;
    }

    //get current question detail by part id and question id
    const currentQuestionDetailRes = await getExamQuestionApi({
      examId: detail.id,
      questionId,
    });
    if (!currentQuestionDetailRes) return;

    //init part points settings record
    detail.examParts.forEach((part) => {
      examPartsPointsSettingsRecord[part.id] = useTrainPointService(
        part.pointsSettings
      );
    });

    examDetail.value = deepCloneUtil(detail);
    counter.value = counterVal ?? null;
    activePartIndex.value = activePartIndexVal;
    activeQuestionIndex.value = activeQuestionIndexVal;
    updateQuestionsDetailRecordState(questionId, currentQuestionDetailRes);
    totalPointsCount.value = examDetail.value.totalPoints;

    startCounter();
    initTimeSpan();
    trainingStorageState.value = studentsExamStorageService.getTrainingState(
      examDetail.value.id
    );

    isLoadingPage.value = false;
  } catch (e) {
    console.error(e);
    navigateTo(webErrorPathUtil());
  }
};

const allQuestions = computed(() => {
  const detail = examDetail.value;
  if (detail) {
    return getAllQuestionsInExam(detail);
  }
  return [];
});

const allAnsweredQuestionCounts = computed(() => {
  const questions = allQuestions.value;
  if (questions.length) {
    return questions.filter(
      (q) => q.questionState !== QuestionStateEnum.initial
    ).length;
  }
  return 0;
});

const onComplaint = () => {
  isOpenComplaintForm.value = true;
};

const setActivePartIndexAndQuestionIndex = (
  partIndex: number,
  questionIndex: number
) => {
  activeExamQuestionInterval.value?.pauseTime();
  activeExamPartInterval.value?.pauseTime();
  [activePartIndex.value, activeQuestionIndex.value] = [
    partIndex,
    questionIndex,
  ];
  activeExamPartInterval.value?.startTime();
  activeExamQuestionInterval.value?.startTime();
  if (nextQuestionModel.value) {
    getQuestionApiAndUpdateRecord(nextQuestionModel.value.id);
  }
};

const setActiveQuestionIndex = (index: number) => {
  activeExamQuestionInterval.value?.pauseTime();
  activeQuestionIndex.value = index;
  activeExamQuestionInterval.value?.startTime();
  if (nextQuestionModel.value) {
    getQuestionApiAndUpdateRecord(nextQuestionModel.value.id);
  }
};

const checkAvailableAnalytics = async () => {
  try {
    const availableAnalyzeDetails = await analyzeApi(examDetail.value!.id);

    return availableAnalyzeDetails?.isAllowed &&
      availableAnalyzeDetails?.categoryId
      ? availableAnalyzeDetails.categoryId
      : false;
  } catch (e) {
    console.error('Error fetching analytics:', e);
    return false;
  }
};

const beforePageUnload = async () => {
  try {
    loadingPage.value = true;
    stopTimers();
    await studentsExamStore.submitExam({ id: examDetail.value!.id });
    studentsExamStore.patchState({ detail: null });
  } catch (e) {
    loadingPage.value = false;
    toastMessage.showError();
  }
};

const startCounter = () => {
  if (counterModel.value) {
    counterModel.value++;
    counterInterval.value = setInterval(() => {
      counterModel.value++;
    }, 1000);
  }
};

const endCounter = () => {
  if (counterInterval.value) {
    clearInterval(counterInterval.value);
    counterInterval.value = null;
  }
};

const endUpdateRemainTime = () => {
  if (remainTimeInterval.value) {
    clearInterval(remainTimeInterval.value);
    remainTimeInterval.value = null;
  }
};

const nextQuestion = () => {
  if (hasNextPart.value && isLastQuestion.value) {
    setActivePartIndexAndQuestionIndex(activePartIndex.value + 1, 0);
    return;
  }
  setActiveQuestionIndex(activeQuestionIndex.value + 1);
};

const prevQuestion = async () => {
  if (hasPrevPart.value && isFirstQuestion) {
    setActivePartIndexAndQuestionIndex(
      activePartIndex.value - 1,
      activeQuestionListModel.value!.length - 1
    );
    return;
  }
  setActiveQuestionIndex(activeQuestionIndex.value - 1);
};

const showWarnModalAnsweredBeforeMinTime = () => {
  questionWarnModalRefProp.value?.showModalWarn(
    TRAIN_MODAL_WARN_CASE.beforeMinTime
  );
};

const beforeAnswerHook = async () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    //case asked before min time
    if (
      currentQuestionPassedSecond.value <
        currentQuestionDetailModel.value!.questionMinTime &&
      warnState.value.showMinTimeWarn
    ) {
      stopCurrentQuestionTimer();
      answerUnderMinTimeCount.value++;

      //check if passed allowed count for under min time answer
      if (
        answerUnderMinTimeCount.value >
        APP_CONFIG.maxAllowedAnswerCountUnderMinimumTime
      ) {
        warnModal.value?.showModal();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await exitWithoutConfirm();
        return resolve(false);
      }

      showWarnModalAnsweredBeforeMinTime();
      const confirm = await firstValueFrom(
        questionWarnModalRefProp.value?.onActionSub ?? of(true)
      );
      resolve(confirm);
      return;
    }
    //case asked after max time
    if (
      currentQuestionPassedSecond.value >
        currentQuestionDetailModel.value!.questionMaxTime &&
      warnState.value.showMaxTimeWarn
    ) {
      warnState.value.showMaxTimeWarn = false;
      questionWarnModalRefProp.value?.showModalWarn(
        TRAIN_MODAL_WARN_CASE.afterMaxTime
      );
      const confirm = await firstValueFrom(
        questionWarnModalRefProp.value?.onActionSub ?? of(true)
      );
      resolve(confirm);
      return;
    }

    resolve(true);
    return;
  });
};

const updateQuestionsDetailRecordState = (
  questionId: string,
  model: Partial<StudentsExamQuestionDataModel>
) => {
  const current = questionsDetailRecord.value[questionId];
  questionsDetailRecord.value[questionId] = {
    ...(current ?? {}),
    ...model,
  };
};

const updateExamPartQuestion = (
  partIndex: number,
  questionIndex: number,
  model: Partial<StudentsExamPartQuestionDataModel>
) => {
  const detail = deepCloneUtil(examDetail.value)!;
  const currentState =
    detail.examParts[partIndex].studentsQuestion[questionIndex];
  detail.examParts[partIndex].studentsQuestion[questionIndex] = {
    ...currentState,
    ...model,
  };

  examDetail.value = detail;
};

const onSelectAnswer = async (answerId: any) => {
  try {
    const result = await beforeAnswerHook();
    if (!result) return false;

    const questionStorageState =
      trainingStorageState.value.questionsState[
        currentQuestionDetailModel.value!.id
      ];
    let answerStateType = AnswerStateTypeEnum.None;
    if (questionStorageState?.isHelpAnswer) {
      answerStateType = AnswerStateTypeEnum.ShowCorrectAnswer;
    }
    if (questionStorageState?.isShowLaws) {
      answerStateType = AnswerStateTypeEnum.ShowLaws;
    }
    if (questionStorageState?.isRemoveAnswerUsed) {
      answerStateType = AnswerStateTypeEnum.DeleteOneAnswer;
    }
    if (questionStorageState?.showLawsUsed) {
      answerStateType = AnswerStateTypeEnum.ShowLaws;
    }

    isApplyAnswerLoading.value = true;
    stopCurrentQuestionTimer();
    callAnswerApi({
      answerId: answerId,
      answerType: answerStateType,
      studentQuestionId: activeQuestionModel.value!.id,
      nextStudentQuestionId: nextQuestionModel.value?.id ?? null,
      studentExamTimeSpan: examInterval.state.currentTime,
      studentExamPartTimeSpan: activeExamPartInterval.value!.state.currentTime,
      questionTimeSpan: activeExamQuestionInterval.value!.state.currentTime,
    });

    const isCorrectAnswer =
      correctAnswerIds.value.includes(answerId) &&
      !getCurrentQuestionStorageState()?.isHelpAnswer;
    //get points and assign on correct
    if (isCorrectAnswer) {
      const currentPointManager =
        examPartsPointsSettingsRecord[activePartModel.value!.id];
      const points = currentPointManager.getPoints({
        timeSpanSecond: currentQuestionPassedSecond.value,
        questionMaxTimeSecond:
          currentQuestionDetailModel.value!.questionMaxTime,
        questionMinTimeSecond:
          currentQuestionDetailModel.value!.questionMinTime,
        hasUsedDeleteHelp: !canTryRemoveAnswerModel.value,
        hasUsedShowAnswerHelp:
          getCurrentQuestionStorageState()?.isHelpAnswer ?? false,
      });
      if (points) {
        totalPointsCount.value += points;
        answerStatusRef.value?.setPoint(totalPointsCount.value, points);
      }
    }

    if (isCorrectAnswer) {
      onCorrectAnswer();
    } else {
      onWrongAnswer();
    }

    //for each correct answer update
    updateQuestionsDetailRecordState(currentQuestionDetailModel.value!.id, {
      questionState: isCorrectAnswer
        ? QuestionStateEnum.correct
        : QuestionStateEnum.wrong,
    });
    updateExamPartQuestion(activePartIndex.value, activeQuestionIndex.value, {
      questionState: isCorrectAnswer
        ? QuestionStateEnum.correct
        : QuestionStateEnum.wrong,
    });

    if (isEndQuestion.value) {
      if (route.query?.isFilteredTraining) {
        exitWithoutConfirm();
      } else {
        await subscriptionsStore.getCurrentSub(
          globalStore.state.globalTypeUserValue!
        );
        if (
          userCurrentSub.value!.remainTrainingCount - 1 > 0 &&
          userCurrentSub.value!.remainTrainingCountPerDay - 1 > 0
        ) {
          await confirmContinueOrExitTrain();
          return;
        }
        await exitWithoutConfirm();
      }
    }
    isApplyAnswerLoading.value = false;
  } catch (e) {
    console.error(e);
    isApplyAnswerLoading.value = false;
  }
};

const confirmContinueOrExitTrain = async () => {
  trainEndModalRef.value?.showModal();
};

const onContinueTrain = async () => {
  isLoadingContinue.value = true;
  loadingPage.value = true;
  stopTimers();
  await studentsExamStore.submitExam({
    id: examDetail.value!.id,
    wantProceed: true,
  });
  const customTrainRes = await customFromTagsApi({
    studentExamId: examDetail.value!.id,
  });
  studentsExamStore.patchState({ detail: deepCloneUtil(customTrainRes) });
  router.replace(webStudentTrainingPathUtil(customTrainRes!.id));
};

const exitPage = async () => {
  if (confirmNavigate.value) return;
  await router.replace(webUserPanelTraining());
};

const exitWithoutConfirm = async () => {
  skipRouteLeave.value = true;
  await exitPage();
};

const onAnswerChange = async (answerId: number | null) => {
  if (!answerId) return;

  if (!questionsAnswersMap.value) {
    questionsAnswersMap.value = {};
  }
  questionsAnswersMap.value[activeQuestionModel.value!.id] = answerId;
  questionsAnswersMap.value = { ...questionsAnswersMap.value };
};

const onCorrectAnswer = () => {
  const audio = new Audio('/media/correct-sound.mp3');
  audio.volume = 0.2;
  audio.play();
  // showToastSuccess($bvToast, null, 'اجابة صحيحة');
};

const onWrongAnswer = () => {
  const audio = new Audio('/media/wrong-sound.mp3');
  audio.volume = 0.5;
  audio.play();
  // showToastError($bvToast, { title: '' }, 'اجابة خاطئة');
};

const stopTimers = () => {
  endUpdateRemainTime();
  endCounter();
  examInterval.pauseTime();
  activeExamPartInterval.value?.pauseTime();
  stopCurrentQuestionTimer();
};

const stopCurrentQuestionTimer = () => {
  activeExamQuestionInterval.value!.pauseTime();
};

const getQuestionApiAndUpdateRecord = async (questionId: string) => {
  try {
    isLoadingQuestionDetail.value = true;
    const questionDetailResponse = await getExamQuestionApi({
      examId: examDetail.value!.id,
      questionId,
    });
    if (!questionDetailResponse) return;

    updateQuestionsDetailRecordState(questionId, questionDetailResponse);
    isLoadingQuestionDetail.value = false;
  } catch (e) {
    console.error(e);
    isLoadingQuestionDetail.value = false;
    toastMessage.showError();
  }
};

const initTimeSpan = () => {
  examDetail.value!.examParts.forEach((part) => {
    examPartsInterval[part.id] = useTimeSpanService();
    part.studentsQuestion.forEach((question) => {
      examQuestionsInterval[question.id] = useTimeSpanService();
    });
  });

  examInterval.startTime();
  activeExamPartInterval.value?.startTime();
  activeExamQuestionInterval.value!.startTime();
  startQuestionTimeTracker();
};

const startQuestionTimeTracker = () => {
  if (questionTrackInterval.value) return;

  questionTrackInterval.value = setInterval(() => {
    currentQuestionPassedSecond.value = getCurrentQuestionTimer();
  }, 300);
};

const onShowLaws = async () => {
  studentsExamStorageService.setTrainingQuestionState(
    examDetail.value!.id,
    currentQuestionDetailModel.value!.id,
    { showLawsUsed: true }
  );
  trainingStorageState.value = studentsExamStorageService.getTrainingState(
    examDetail.value!.id
  );
};

const onAnswerHelpAction = async () => {
  if (
    activeQuestionModel.value!.questionState !== QuestionStateEnum.initial ||
    !warnState.value.showHelpCorrectAnswerWarn
  ) {
    setQuestionStorageStateToHelpAnswer();
    isOpenHelpAnswerModal.value = true;
    return;
  }

  if (!canTryAnswerHelp.value) {
    toastMessage.showError({ summary: 'لقد تجاوزت عدد المحاولات المتاح' });
    return;
  }

  warnState.value.showHelpCorrectAnswerWarn = false;
  questionWarnModalRefProp.value?.showModalWarn(
    TRAIN_MODAL_WARN_CASE.showAnswerHelp
  );

  const confirm = await firstValueFrom(
    questionWarnModalRefProp.value?.onActionSub ?? of(true)
  );
  if (!confirm) return;

  setQuestionStorageStateToHelpAnswer();
  isOpenHelpAnswerModal.value = true;
};

const setQuestionStorageStateToHelpAnswer = () => {
  trainingStorageState.value.countOfTryHelpAnswer++;
  studentsExamStorageService.setTrainingState(
    examDetail.value!.id,
    trainingStorageState.value
  );
  studentsExamStorageService.setTrainingQuestionState(
    examDetail.value!.id,
    currentQuestionDetailModel.value!.id,
    { isHelpAnswer: true }
  );
  trainingStorageState.value = studentsExamStorageService.getTrainingState(
    examDetail.value!.id
  );
};

const removeAnswerApiAndUpdateStorageState = async () => {
  const removedAnswerId = await removeAnswerApi({
    studentQuestionId: activeQuestionModel.value!.id,
  });
  if (!removedAnswerId) return;
  trainingStorageState.value.countOfTryRemoveAnswer++;
  trainingStorageState.value.removedAnswerIdList = Array.from(
    new Set([
      ...trainingStorageState.value.removedAnswerIdList,
      ...[removedAnswerId],
    ])
  );

  studentsExamStorageService.setTrainingState(
    examDetail.value!.id,
    trainingStorageState.value
  );
  studentsExamStorageService.setTrainingQuestionState(
    examDetail.value!.id,
    currentQuestionDetailModel.value!.id,
    { isRemoveAnswerUsed: true }
  );
  trainingStorageState.value = studentsExamStorageService.getTrainingState(
    examDetail.value!.id
  );
};

const removeAnswersTry = async () => {
  if (!canTryRemoveAnswerModel.value) {
    toastMessage.showError({ summary: 'لقد تجاوزت عدد المحاولات المتاح' });
    return;
  }

  if (!warnState.value.showHelpRemoveAnswerWarn) {
    await removeAnswerApiAndUpdateStorageState();
    return;
  }

  warnState.value.showHelpRemoveAnswerWarn = false;
  questionWarnModalRefProp.value?.showModalWarn(
    TRAIN_MODAL_WARN_CASE.deleteAnswerHelp
  );

  const confirm = await firstValueFrom(
    questionWarnModalRefProp.value?.onActionSub ?? of(true)
  );
  if (!confirm) return;
  await removeAnswerApiAndUpdateStorageState();
};

const getCurrentQuestionTimer = () => {
  if (
    examQuestionsInterval &&
    activeQuestionModel.value &&
    examQuestionsInterval[activeQuestionModel.value!.id]
  ) {
    return examQuestionsInterval[activeQuestionModel.value!.id].state
      .currentTime;
  }
  return 0;
};

//watch
watch(
  () => activeQuestionIndex.value,
  () => {
    if (import.meta.client && !!examDetail.value && activeQuestionModel) {
      const element = checkElementIsOverFlowParent(
        'aqt',
        `qt-${activeQuestionModel.value?.id}`
      );
      if (element) {
        element.scrollIntoView();
      }
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => activePartIndex.value,
  () => {
    if (import.meta.client && !!activePartModel.value && activePartModel) {
      const element = checkElementIsOverFlowParent(
        'apt',
        `pt-${activePartModel.value.id}`
      );
      if (element) {
        element.scrollIntoView();
      }
    }
  },
  {
    immediate: true,
  }
);

//hook
onBeforeRouteLeave(async (to, from, next) => {
  if (confirmNavigate.value) {
    return next();
  }

  if (skipRouteLeave.value) {
    await beforePageUnload();
    // const analyticsId = await checkAvailableAnalytics();
    // if (analyticsId) {
    //   const targetPath = `/student/analytics/${analyticsId}`;
    //   if (to.fullPath === targetPath) {
    //     confirmNavigate.value = true;
    //     return next();
    //   }
    //   confirmNavigate.value = true;
    //   return next({ path: targetPath });
    // }
    confirmNavigate.value = true;
    return next();
  }

  if (confirmExitRef.value?.isOpen) {
    return next(false);
  }

  confirmExitRef.value?.showModal();

  const onActionHandler = async (
    confirm: boolean
  ): Promise<{ proceed: boolean; path?: string }> => {
    if (!confirm) {
      confirmNavigate.value = true;
      await router.replace(from.fullPath);
      confirmNavigate.value = false;
      return { proceed: false };
    }

    await beforePageUnload();
    // const analyticsId = await checkAvailableAnalytics();
    // if (analyticsId) {
    //   confirmNavigate.value = true;
    //   return { proceed: true, path: `/student/analytics/${analyticsId}` };
    // }
    confirmNavigate.value = true;
    return { proceed: true };
  };
  const data = await firstValueFrom(
    confirmExitRef.value?.onActionSub ?? of(true)
  );
  const result = await onActionHandler(data);
  if (result.proceed) {
    return result.path ? next({ path: result.path }) : next(true);
  } else {
    return next(false);
  }
});

onMounted(async () => {
  await initPage();
  if (nextQuestionModel.value) {
    getQuestionApiAndUpdateRecord(nextQuestionModel.value.id);
  }
});

const pageTitle = computed(() => {
  return `${getMetaTitle(examDetail.value?.title ?? '')} - ${allQuestions.value.length}`;
});

//meta
definePageMeta({
  layout: 'training-layout',
  middleware: ['user-services-middleware'],
});
useHead({
  title: pageTitle,
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light no-menu',
  },
});
</script>
<style lang="scss" src="./training-id.scss"></style>
