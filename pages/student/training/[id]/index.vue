<template>
  <div>test</div>
</template>
<script lang="ts" setup>
import {
  checkElementIsOverFlowParent,
  getMetaTitle,
} from '~/main/utils/shared-utils';
import { useStudentsExamStore } from '~/main/modules/students-exam/services/useStudentsExamStore';
import type {
  StudentsExamDataModel,
  StudentsExamPartQuestionDataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';
import { useTimeSpanService } from '~/main/services/useTimeSpanService';
import { useStudentsExamStorageService } from '~/main/modules/students-exam/services/useStudentsExamStorageService';
import type { StudentsExamQuestionDataModel } from '~/main/modules/students-exam/data-access/models/students-exam-question.model';
import { useTrainPointService } from '~/main/services/useTrainPointService';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import type { StudentsExamAnswerDataModel } from '~/main/modules/students-exam/data-access/models/students-exam-answer.model';
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

type TimeSpanModel = ReturnType<typeof useTimeSpanService>;

//composable
const router = useRouter();
const route = useRoute();
const toastMessage = useToastMessage();
const globalStore = useGlobalStore();
const subscriptionsStore = useSubscriptionsStore();
const windowSize = useWindowSize();
const studentsExamStore = useStudentsExamStore();
const examInterval = useTimeSpanService();
const studentsExamStorageService = useStudentsExamStorageService();

//data
const examDetail = ref<StudentsExamDataModel | null>(null);
const isLoadingPage = ref(true);
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

//computed
const userServicesState = computed(
  () => subscriptionsStore.state.userServicesState
);

const passedAllowedUnderMinAnswerMsg = computed(
  () => 'لقد تم الإجابة بشكل متسرع على عدة اسئلة، سوف يتم انهاء الامتحان'
);

const staticLocales = computed(() => globalStore.staticState.locales);

const questionTitleModel = computed(() => activePartModel.value.title);

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
  () => store.state.student.fetching.answer || isApplyAnswerLoading.value
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
    currentQuestionAnswerId.value &&
    activeQuestionModel.value.questionState === QuestionStateEnum.initial
);

const showCanTryAnswerHelp = computed(
  () =>
    currentQuestionDetailModel.value.questionState ===
      questionStateEnum.value.initial &&
    !trainingStorageState.value?.questionsState[
      currentQuestionDetailModel.value.id
    ]?.isHelpAnswer
);

const canTryAnswerHelp = computed(
  () =>
    trainingStorageState.value?.countOfTryHelpAnswer <
      APP_CONFIG.allowedAnswerHelpTry || !trainingStorageState.value
);

const showCanTryRemoveButton = computed(
  () =>
    currentQuestionDetailModel.value.questionState ===
      questionStateEnum.value.initial && currentAnswersModel.value.length === 4
);

const canTryRemoveAnswerModel = computed(
  () =>
    !trainingStorageState.value?.questionsState[
      currentQuestionDetailModel.value.id
    ]?.isRemoveAnswerUsed
);

const canRemoveAnswerModel = computed(
  () => showCanTryRemoveButton.value && canTryRemoveAnswerModel.value
);

const isLoadingRemoverAnswer = computed(
  () => store.state.student.fetching.removeAnswerHelp
);

const canShowAnswerHelpModel = computed(
  () => showCanTryAnswerHelp.value && canTryAnswerHelp.value
);

const currentAnswersModel = computed(() => {
  if (trainingStorageState.value.removedAnswerIdList.length) {
    return currentQuestionDetailModel.value.answers.filter(
      (a) => !trainingStorageState.value.removedAnswerIdList.includes(a.id)
    );
  }
  return currentQuestionDetailModel.value.answers;
});

const activeExamPartInterval = computed(
  () => examPartsInterval[activePartModel.value.id]
);

const activeExamQuestionInterval = computed(
  () => examQuestionsInterval[activeQuestionModel.value.id]
);

const questionStateEnum = computed(() => QuestionStateEnum);

const activePartModel = computed(
  () => examDetail.value!.examParts[activePartIndex.value]
);

const activeQuestionListModel = computed(() =>
  activePartModel.value ? activePartModel.value.studentsQuestion : null
);

const activeQuestionModel = computed(
  () => activeQuestionListModel.value![activeQuestionIndex.value]
);

const currentQuestionDetailModel = computed(
  () => questionsDetailRecord.value[activeQuestionModel.value?.id]
);

const viewCorrectAnswerIds = computed(() => {
  if (!correctAnswerIds.value.length) return [];
  return currentQuestionDetailModel.value.questionState ===
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
  return activeQuestionListModel.value![activeQuestionIndex.value + 1];
});

const currentPartQuestionsCountModel = computed(
  () => activeQuestionListModel.value!.length
);

const isFirstQuestion = computed(() => activeQuestionIndex.value === 0);

const isLastQuestion = computed(
  () => activeQuestionIndex.value === activeQuestionListModel.value!.length - 1
);

const canPassQuestion = computed(() =>
  isLastQuestion.value && !hasNextPart.value
    ? false
    : activeQuestionModel.value.questionState ===
      questionStateEnum.value.initial
);

const hasNextQuestion = computed(
  () => activeQuestionIndex.value < activeQuestionListModel.value!.length - 1
);

const hasPrevPart = computed(() => activePartIndex.value > 0);

const hasNextPart = computed(
  () => examDetail.value?.examParts?.length ?? 0 > activePartIndex.value + 1
);

const isEndQuestion = computed(
  () => isLastQuestion.value && !hasNextPart.value
);

const canSelectNextQuestion = computed(
  () =>
    activeQuestionModel.value.questionState !== QuestionStateEnum.initial &&
    (hasNextQuestion.value || hasNextPart.value)
);

const canSelectPrevQuestion = computed(
  () => activeQuestionIndex.value > 0 || hasPrevPart.value
);

const canShowFeedback = computed(
  () =>
    activeQuestionModel.value.questionState ===
      questionStateEnum.value.correct ||
    activeQuestionModel.value.questionState === questionStateEnum.value.wrong
);

const isCorrectActiveQuestion = computed(
  () =>
    activeQuestionModel.value.questionState === questionStateEnum.value.correct
);

const feedbackMsg = computed(() =>
  isCorrectActiveQuestion.value
    ? currentQuestionDetailModel.value.feedbackCorrectAnswer
    : currentQuestionDetailModel.value.feedbackInCorrectAnswer
);

const feedbackType = computed(() =>
  isCorrectActiveQuestion.value
    ? currentQuestionDetailModel.value.typeFeedbackCorrect
    : currentQuestionDetailModel.value.typeFeedbackInCorrect
);

const feedbackMediaUrl = computed(() =>
  isCorrectActiveQuestion.value
    ? currentQuestionDetailModel.value.feedbackCorrectUrl
    : currentQuestionDetailModel.value.feedbackInCorrectUrl
);

const counterModel = computed({
  get: () => counter.value! * 60,
  set: (value) => {
    counter.value = value / 60;
  },
});

const userCurrentSub = computed(() => subscriptionsStore.state.userCurrentSub);

//method
const getCurrentQuestionStorageState = () => {
  return trainingStorageState.value.questionsState[
    currentQuestionDetailModel.value.id
  ];
};

const initPage = async () => {
  try {
    isLoadingPage.value = true;
    let currentExam = $store.state.student.currentExamTrainPageData;
    if (!currentExam) {
      const examDetailRes = await $store.dispatch(
        'student/getStudentExamDetail',
        { id: route.params.id }
      );
      currentExam = examDetailRes.data;
    }

    const detail = mapExamDetailModelToUi(currentExam);

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
    //on page initial if exam if in process set active part and question from api
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

    let questionId = null;

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
    const currentQuestionDetailRes = await $store.dispatch(
      'student/getQuestionDetailByExamIdAndQuestionId',
      {
        examId: detail.id,
        questionId,
      }
    );

    //init part points settings record
    detail.examParts.forEach((part) => {
      examPartsPointsSettingsRecord[part.id] = useTrainPointService(
        part.pointsSettings
      );
    });

    examDetail.value = detail;
    counter.value = counterVal ?? null;
    activePartIndex.value = activePartIndexVal;
    activeQuestionIndex.value = activeQuestionIndexVal;
    updateQuestionsDetailRecordState(questionId, currentQuestionDetailRes.data);
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

const onComplaint = () => {
  isOpenComplaintForm.value = true;
};

const setActivePartIndexAndQuestionIndex = (
  partIndex: number,
  questionIndex: number
) => {
  activeExamQuestionInterval.value.pauseTime();
  activeExamPartInterval.value.pauseTime();
  [activePartIndex.value, activeQuestionIndex.value] = [
    partIndex,
    questionIndex,
  ];
  activeExamPartInterval.value.startTime();
  activeExamQuestionInterval.value.startTime();
  if (nextQuestionModel.value) {
    getQuestionApiAndUpdateRecord(nextQuestionModel.value.id);
  }
};

const setActiveQuestionIndex = (index: number) => {
  activeExamQuestionInterval.value.pauseTime();
  activeQuestionIndex.value = index;
  activeExamQuestionInterval.value.startTime();
  if (nextQuestionModel.value) {
    getQuestionApiAndUpdateRecord(nextQuestionModel.value.id);
  }
};

const checkAvailableAnalytics = async () => {
  try {
    const availableAnalyzeDetails = await $axios.$get(
      `/studentsExam/${examDetail.value!.id}/availableExamCategoryForAnalyzeDetails`
    );

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
    // if (!$isDev) {
    await $store.dispatch('student/callStudentExamDone', {
      id: examDetail.value!.id,
    });
    $store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', null);
  } catch (e) {
    loadingPage.value = false;
    toastMessage.showError();
  }
};

const startCounter = () => {
  if (counterModel.value) {
    //TODO to be replaced with --
    counterModel.value++;
    counterInterval.value = setInterval(() => {
      //TODO to be replaced with --
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
  if (hasNextPart.value && isLastQuestion) {
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
  $refs.questionWarnModalRef.showModalWarn(TRAIN_MODAL_WARN_CASE.beforeMinTime);
};

const beforeAnswerHook = async () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    //case asked before min time
    if (
      currentQuestionPassedSecond.value <
        currentQuestionDetailModel.value.questionMinTime &&
      warnState.value.showMinTimeWarn
    ) {
      stopCurrentQuestionTimer();
      answerUnderMinTimeCount.value++;

      //check if passed allowed count for under min time answer
      if (
        answerUnderMinTimeCount.value >
        APP_CONFIG.maxAllowedAnswerCountUnderMinimumTime
      ) {
        $refs.warnModal.showModal();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        exitWithoutConfirm();
        return resolve(false);
      }

      showWarnModalAnsweredBeforeMinTime();
      $refs.questionWarnModalRef.$once('onAction', async (confirm) => {
        return resolve(!!confirm);
      });
      return;
    }
    //case asked after max time
    if (
      currentQuestionPassedSecond.value >
        currentQuestionDetailModel.value.questionMaxTime &&
      warnState.value.showMaxTimeWarn
    ) {
      warnState.value.showMaxTimeWarn = false;
      $refs.questionWarnModalRef.showModalWarn(
        TRAIN_MODAL_WARN_CASE.afterMaxTime
      );
      $refs.questionWarnModalRef.$once('onAction', async (confirm) => {
        return resolve(!!confirm);
      });
      return;
    }

    resolve(true);
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

const applyAnswer = async (answerId: number) => {
  try {
    const result = await beforeAnswerHook();
    if (!result) return false;

    const questionStorageState =
      trainingStorageState.value.questionsState[
        currentQuestionDetailModel.value.id
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
    callAnswerApi(answerId, answerStateType);

    const isCorrectAnswer =
      correctAnswerIds.value.includes(answerId) &&
      !getCurrentQuestionStorageState()?.isHelpAnswer;
    //get points and assign on correct
    if (isCorrectAnswer) {
      const currentPointManager =
        examPartsPointsSettingsRecord[activePartModel.value.id];
      const points = currentPointManager.getPoints({
        timeSpanSecond: currentQuestionPassedSecond.value,
        questionMaxTimeSecond: currentQuestionDetailModel.value.questionMaxTime,
        questionMinTimeSecond: currentQuestionDetailModel.value.questionMinTime,
        hasUsedDeleteHelp: !canTryRemoveAnswerModel.value,
        hasUsedShowAnswerHelp:
          getCurrentQuestionStorageState()?.isHelpAnswer ?? false,
      });
      if (points) {
        totalPointsCount.value += points;
        $refs?.answerStatusRef?.setPoint(totalPointsCount, points);
      }
    }

    if (isCorrectAnswer) {
      onCorrectAnswer();
    } else {
      onWrongAnswer();
    }

    //for each correct answer update
    updateQuestionsDetailRecordState(currentQuestionDetailModel.value.id, {
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
          globalStore.state.globalTypeUser!
        );
        if (
          userCurrentSub.value!.remainTrainingCount - 1 > 0 &&
          userCurrentSub.value!.remainTrainingCountPerDay - 1 > 0
        ) {
          confirmContinueOrExitTrain();
          return;
        }
        exitWithoutConfirm();
      }
    }
    isApplyAnswerLoading.value = false;
  } catch (e) {
    console.error(e);
    isApplyAnswerLoading.value = false;
  }
};

const confirmContinueOrExitTrain = async () => {
  $refs.trainEndModal.showModal();
};

const onContinueTrain = async () => {
  isLoadingContinue.value = true;
  loadingPage.value = true;
  stopTimers();
  await $store.dispatch('student/callStudentExamDone', {
    id: examDetail.value!.id,
    wantProceed: true,
  });
  const url = 'studentsExam/customFromTags';
  const customTrainRes = await $axios.$post(url, {
    studentExamId: examDetail.value!.id,
  });
  router.replace(webStudentTrainingPathUtil(customTrainRes.id)).then(() => {
    $store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', customTrainRes);
    initPage();
    isLoadingContinue.value = false;
  });
};

const exitPage = async () => {
  if (confirmNavigate.value) return;
  router.replace(webUserPanelTraining());
};

const exitWithoutConfirm = async () => {
  skipRouteLeave.value = true;
  exitPage();
};

const onAnswerChange = async (answerId: number) => {
  if (!questionsAnswersMap.value) {
    questionsAnswersMap.value = {};
  }
  questionsAnswersMap.value[activeQuestionModel.value.id] = answerId;
  questionsAnswersMap.value = { ...questionsAnswersMap.value };
};

const callAnswerApi = async (
  answerId: number,
  answerStateType = AnswerStateTypeEnum.None
) => {
  try {
    const res: StudentsExamAnswerDataModel = await $store.dispatch(
      'student/callStudentExamAnswer',
      {
        studentQuestionId: activeQuestionModel.value.id,
        nextStudentQuestionId: nextQuestionModel.value?.id,
        answerId,
        timeSpan: currentQuestionPassedSecond,
        answerType: answerStateType,
        studentExamTimeSpan: examInterval.currentTime,
        studentExamPartTimeSpan: activeExamPartInterval.value.currentTime,
        questionTimeSpan: activeExamQuestionInterval.value.currentTime,
      }
    );
    return res;
  } catch (e) {
    console.error(e);
    toastMessage.showError();
  }
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
  activeExamPartInterval.value.pauseTime();
  stopCurrentQuestionTimer();
};

const stopCurrentQuestionTimer = () => {
  activeExamQuestionInterval.value.pauseTime();
};

const getQuestionApiAndUpdateRecord = async (questionId: string) => {
  try {
    isLoadingQuestionDetail.value = true;
    const questionDetailResponse = await $store.dispatch(
      'student/getQuestionDetailByExamIdAndQuestionId',
      {
        examId: examDetail.value!.id,
        questionId,
      }
    );
    updateQuestionsDetailRecordState(questionId, questionDetailResponse.data);
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
  activeExamPartInterval.value.startTime();
  activeExamQuestionInterval.value.startTime();
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
    currentQuestionDetailModel.value.id,
    { showLawsUsed: true }
  );
  trainingStorageState.value = studentsExamStorageService.getTrainingState(
    examDetail.value!.id
  );
};

const onAnswerHelpAction = async () => {
  if (
    activeQuestionModel.value.questionState !== QuestionStateEnum.initial ||
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
  $refs.questionWarnModalRef.showModalWarn(
    TRAIN_MODAL_WARN_CASE.showAnswerHelp
  );

  $refs.questionWarnModalRef.$once('onAction', async (confirm) => {
    if (!confirm) return;

    setQuestionStorageStateToHelpAnswer();
    isOpenHelpAnswerModal.value = true;
  });
};

const setQuestionStorageStateToHelpAnswer = () => {
  trainingStorageState.value.countOfTryHelpAnswer++;
  studentsExamStorageService.setTrainingState(
    examDetail.value!.id,
    trainingStorageState.value
  );
  studentsExamStorageService.setTrainingQuestionState(
    examDetail.value!.id,
    currentQuestionDetailModel.value.id,
    { isHelpAnswer: true }
  );
  trainingStorageState.value = studentsExamStorageService.getTrainingState(
    examDetail.value!.id
  );
};

const removeAnswerApiAndUpdateStorageState = async () => {
  const removedAnswerId = await $store.dispatch('student/removeAnswersTry', {
    studentQuestionId: activeQuestionModel.value.id,
  });
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
    currentQuestionDetailModel.value.id,
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
  $refs.questionWarnModalRef.showModalWarn(
    TRAIN_MODAL_WARN_CASE.deleteAnswerHelp
  );

  $refs.questionWarnModalRef.$once('onAction', async (confirm) => {
    if (!confirm) return;
    removeAnswerApiAndUpdateStorageState();
  });
};

const getCurrentQuestionTimer = () => {
  if (
    examQuestionsInterval &&
    activeQuestionModel &&
    examQuestionsInterval[activeQuestionModel.value.id]
  ) {
    return examQuestionsInterval[activeQuestionModel.value.id].currentTime
      .value;
  }
  return 0;
};

//watch
watch(
  () => activeQuestionIndex.value,
  () => {
    if (import.meta.client && examDetail && activeQuestionModel) {
      const element = checkElementIsOverFlowParent(
        'aqt',
        `qt-${activeQuestionModel.value.id}`
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
    if (import.meta.client && examDetail && activePartModel) {
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
    const analyticsId = await checkAvailableAnalytics();
    if (analyticsId) {
      const targetPath = `/student/analytics/${analyticsId}`;
      if (to.fullPath === targetPath) {
        confirmNavigate.value = true;
        return next();
      }
      confirmNavigate.value = true;
      return next({ path: targetPath });
    }
    confirmNavigate.value = true;
    return next();
  }

  if (confirmExitRef.value?.isOpen) {
    return next(false);
  }

  confirmExitRef?.showModal();

  const onActionHandler = async (confirm: boolean) => {
    if (!confirm) {
      const { href } = router.resolve(route);
      window.history.replaceState({}, null as any, href);
      return next(false);
    }

    await beforePageUnload();
    const analyticsId = await checkAvailableAnalytics();
    if (analyticsId) {
      confirmNavigate.value = true;
      return next({ path: `/student/analytics/${analyticsId}` });
    }
    confirmNavigate.value = true;
    return next();
  };
  //todo-z rx
  const unwatch = confirmExitRef.value?.$on('onAction', (data) => {
    onActionHandler(data);
    unwatch();
  });
});

onMounted(async () => {
  await initPage();
  if (nextQuestionModel.value) {
    getQuestionApiAndUpdateRecord(nextQuestionModel.value.id);
  }
});

//meta
definePageMeta({
  layout: 'exam-layout',
  middleware: ['user-services-middleware'],
});
useHead({
  title: getMetaTitle(examDetail.value?.title ?? ''),
  htmlAttrs: {
    dir: 'rtl',
    class: 'app-light no-menu zoom-wrapper',
  },
});
</script>
<style lang="scss" src="./training-id.scss"></style>
