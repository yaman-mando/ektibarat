<template>
  <client-only>
    <div class="student-exam-details">
      <template v-if="isLoadingPage">
        <div class="flex items-start justify-center relative">
          <lazy-app-spinner class="my-3" />
        </div>
      </template>
      <template v-else>
        <div class="sc-container">
          <div v-if="isDev">
            <lazy-app-button
              size="sm"
              label="end"
              @click="confirmEndExam"
            />
          </div>
          <!--      <div-->
          <!--        v-if="$isDev"-->
          <!--        class="d-flex flex-column"-->
          <!--      >-->
          <!--        <span>exam : {{ examInterval.currentTime }}</span>-->
          <!--        <span v-if="examPartsInterval[activePartModel.id]">-->
          <!--          active part : {{ examPartsInterval[activePartModel.id].currentTime }}-->
          <!--        </span>-->
          <!--        <span v-if="examQuestionsInterval[activeQuestionModel.id]">-->
          <!--          active question :-->
          <!--          {{ examQuestionsInterval[activeQuestionModel.id].currentTime }}-->
          <!--        </span>-->
          <!--      </div>-->
          <lazy-app-overlay v-if="loadingPage" />
          <div class="s-hero">
            <div
              v-if="!!examDetail?.examParts && !!examDetail.examParts.length"
              class="s-end"
            >
              <div class="w-container">
                <div class="at-w">
                  <div class="at-t">
                    <lazy-exam-part-nav
                      v-model:activePartIndex="activePartIndex"
                      :subjectName="examDetail.subjectName"
                      :examParts="examDetail.examParts"
                      :examTitle="examDetail.title"
                      @indexChanged="selectPart"
                    />
                    <lazy-counter-part :counterValue="counterModel" />
                  </div>
                  <lazy-exam-part-nav-children
                    v-if="activeQuestionListModel"
                    v-model:activeItemIndex="activeQuestionIndex"
                    :list="activeQuestionListModel"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="w-container">
            <lazy-app-exam-part-article
              v-if="activeQuestionModel?.articleUi"
              :text="activeQuestionModel.articleUi"
            />
            <div class="w-full aa-q">
              <lazy-app-overlay v-if="isLoadingQuestionDetail" />
              <lazy-app-exam-part-question-part
                v-if="currentQuestionDetail"
                ref="examPartQuestionRef"
                :questionNumber="activeQuestionIndex + 1"
                :selectedAnswerId="currentQuestionDetail.answerId"
                :question="currentQuestionDetail"
                :showFlag="true"
                :showFeature="true"
                :hideCounter="true"
                @onFlageChange="onFlagChange"
                @onFeatureChange="onFeatureChange"
              >
                <lazy-app-answer-select
                  :isExam="true"
                  :selectedValue="currentQuestionDetail.answerId"
                  :answers="currentQuestionDetail.answers"
                  :questionState="null"
                  :disableImgModal="true"
                  @onAnswerChange="onAnswerChange($event)"
                />
              </lazy-app-exam-part-question-part>
            </div>
          </div>

          <exam-part-prev-next
            ref="examBottomActionRef"
            :showPrev="canSelectPrevQuestion"
            :showNext="canSelectNextQuestion"
            :showEndExam="showEndExamButton"
            @prevAction="prevQuestion"
            @nextAction="nextQuestion"
            @endAction="confirmEndExam"
          />
          <exam-confirm-exit ref="confirmExitRef" />
          <exam-confirm-exit
            ref="confirmEndModalRef"
            :isEndAction="true"
          />
          <exam-confirm-select-part-modal
            ref="nextPartConfirmModal"
            :unAnsweredCount="unAnsweredQuestionCountMsg"
            :flaggedCount="currentPartFlaggedQuestionCount"
            :isPartAnswered="isAllPartQuestionAnswered"
          />
          <lazy-modal-answer-feedback
            v-if="activeQuestionModel"
            v-model:isOpen="isOpenFeedbackModal"
            :isCorrect="
              activeQuestionModel.questionState === questionStateEnum.correct
            "
            :msg="feedbackMsg"
            :feedbackType="feedbackType"
            :mediaUrl="feedbackMediaUrl"
          />
          <lazy-modal-request-form
            v-if="currentQuestionDetail"
            :modalId="noteModalId"
            :type="'note'"
            :text="currentQuestionDetail.note"
            @onSubmit="onAddNote"
          />
          <lazy-modal-request-form
            :modalId="complainModalId"
            :type="'complain'"
            @onSubmit="onAddComplain"
          />
        </div>
        <client-only>
          <web-train-question-warn-modal
            ref="questionWarnModalRef"
            :refTo="$refs.examBottomActionRef"
            :refX="
              windowSize.isMobileSize.value ? null : $refs.examPartQuestionRef
            "
          />
          <web-warn-modal
            ref="warnModal"
            :hideClose="true"
            :msg="passedAllowedUnderMinAnswerMsg"
          />
        </client-only>
      </template>
      <template v-if="isOpenCompleteInfoModal">
        <lazy-add-watsapp-modal
          :key="completeInfoModalKey"
          v-model:isOpen="isOpenCompleteInfoModal"
          @onConfirm="onCompleteInfo"
        />
      </template>
    </div>
  </client-only>
</template>
<script lang="ts">
import {
  checkElementIsOverFlowParent,
  getMetaTitle,
  IS_PRODUCTION_APP,
} from '~/main/utils/shared-utils';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import {
  type TimeSpanModel,
  useTimeSpanService,
} from '~/main/services/useTimeSpanService';
import type {
  StudentsExamDataModel,
  StudentsExamPartQuestionDataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';
import type { StudentsExamQuestionDataModel } from '~/main/modules/students-exam/data-access/models/students-exam-question.model';
import { QuestionStateEnum } from '~/main/modules/students-exam/data-access/constats/question-state.enum';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { mapExamDetailModelToUi } from '~/main/modules/students-exam/data-access/parsers/students-exam.parser';
import { StudentExamStateEnum } from '~/main/modules/students-exam/data-access/constats/student-exam-state.enum';
import { RouteHelper } from '~/main/utils/route-helper';
import { APP_CONFIG } from 'public/constants/app-config';
import { TRAIN_MODAL_WARN_CASE } from '~/main/constants/train-modal-warn-case.enum';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import { firstValueFrom, of } from 'rxjs';

export default {
  beforeRouteLeave: async function (to, from, next) {
    window.removeEventListener('beforeunload', this.windowBeforeUnload);

    if (this.skipRouteLeave) {
      await this.beforePageUnload();
      return next();
    }

    //@ts-expect-error access ref prop
    if (this.$refs.confirmExitRef?.isOpen) {
      return;
    }
    //@ts-expect-error access ref prop
    this.$refs.confirmExitRef?.showModal();

    const onActionHandler = async (confirm) => {
      if (!confirm) {
        this.confirmNavigate = true;
        await this.appRouter.replace(from.fullPath);
        this.confirmNavigate = false;
        return false;
      }

      this.skipRouteLeave = true;

      await this.beforePageUnload();
      return true;
    };
    const confirm = await firstValueFrom(
      //@ts-expect-error access ref prop
      this.$refs.confirmExitRef?.onActionSub ?? of(true)
    );
    const proceed = await onActionHandler(confirm);
    return proceed ? next() : next(false);
  },
  setup() {
    const windowSize = useWindowSize();
    const subscriptionsStore = useSubscriptionsStore();
    const userCurrentSub = computed(
      () => subscriptionsStore.state.userCurrentSub!
    );
    const examDetail = ref<StudentsExamDataModel | null>(null);

    definePageMeta({
      layout: 'exam-layout',
    });
    useHead({
      title: getMetaTitle(examDetail.value?.title ?? ''),
      htmlAttrs: {
        dir: 'rtl',
        class: 'app-light no-menu zoom-wrapper',
      },
    });

    return {
      examDetail,
      isDev: !IS_PRODUCTION_APP,
      windowSize,
      ...useSetupRoute(),
      ...useSetupAuth(),
      userCurrentSub,
      ...useToastMessage(),
    };
  },
  data() {
    return {
      confirmNavigate: false,
      isLoadingPage: true,
      skipRouteLeave: false,
      loadingPage: false,
      isLoadingQuestionDetail: false,
      questionsDetailRecord: {} as {
        [key: string]: StudentsExamQuestionDataModel;
      },
      currentQuestionDetail: null as StudentsExamQuestionDataModel | null,
      activePartIndex: 0,
      activeQuestionIndex: 0,
      counterInterval: null as ReturnType<typeof setInterval> | null,
      remainTimeInterval: null,
      isOpenFeedbackModal: false,
      noteForm: {
        studentsQuestionId: null as string | null,
        note: null as string | null,
      },
      complainForm: {
        text: null as string | null,
        id: null as number | null,
      },
      examInterval: useTimeSpanService(),
      examPartsInterval: {} as Record<string, TimeSpanModel>,
      examQuestionsInterval: {} as Record<string, TimeSpanModel>,
      currentQuestionPassedSecond: 0,
      timeSpanInterval: null as ReturnType<typeof setInterval> | null,
      isPartPassedMaxTime: false,
      partCountersByIndex: {} as Record<number, number>,
      answerUnderMinTimeCount: 0,
      isOpenCompleteInfoModal: false,
      completeInfoModalKey: 1,
    };
  },
  computed: {
    passedAllowedUnderMinAnswerMsg() {
      return ` لقد تم الإجابة بشكل متسرع على عدة اسئلة، سوف يتم انهاء الامتحان`;
    },
    unAnsweredQuestionCountMsg() {
      const unAnsweredQuestion = this.activePartModel?.studentsQuestion?.filter(
        (question) =>
          question.questionState == QuestionStateEnum.initial ||
          question.questionState == QuestionStateEnum.pass
      );
      return unAnsweredQuestion?.length ?? 0;
    },
    currentPartFlaggedQuestionCount() {
      return (
        this.activePartModel?.studentsQuestion?.filter((item) => item.isFlagged)
          ?.length ?? 0
      );
    },
    isAllPartQuestionAnswered() {
      return (
        this.activePartModel?.studentsQuestion.every(
          (item) => item.questionState !== QuestionStateEnum.initial
        ) ?? false
      );
    },
    activeExamPartInterval() {
      if (!this.activePartModel) return null;
      return this.examPartsInterval[this.activePartModel.id];
    },
    activeExamQuestionInterval() {
      if (!this.activeQuestionModel) return null;
      return this.examQuestionsInterval[this.activeQuestionModel.id];
    },
    questionStateEnum() {
      return QuestionStateEnum;
    },
    activePartModel() {
      return this.examDetail?.examParts[this.activePartIndex];
    },
    activeQuestionListModel() {
      if (this.activePartModel) {
        return this.activePartModel.studentsQuestion;
      }
      return null;
    },
    activeQuestionModel() {
      return this.activeQuestionListModel?.[this.activeQuestionIndex];
    },
    previousQuestionModel() {
      //get question from previous part if first question
      if (this.isFirstQuestion && this.hasPrevPart) {
        return this.examDetail?.examParts[this.activePartIndex - 1]
          .studentsQuestion[0];
      }
      return this.activeQuestionListModel?.[this.activeQuestionIndex - 1];
    },
    nextQuestionModel() {
      //get question from next part if last question
      if (this.isLastQuestion && this.hasNextPart) {
        return this.examDetail?.examParts[this.activePartIndex + 1]
          .studentsQuestion[0];
      }
      return this.activeQuestionListModel?.[this.activeQuestionIndex + 1];
    },
    currentPartQuestionsCountModel() {
      return this.activeQuestionListModel?.length;
    },
    isFirstQuestion() {
      return this.activeQuestionIndex === 0;
    },
    isLastQuestion() {
      if (!this.activeQuestionListModel?.length) return false;
      return (
        this.activeQuestionIndex === this.activeQuestionListModel.length - 1
      );
    },
    // canPassQuestion() {
    //   if (this.isLastQuestion && !this.hasNextPart) {
    //     return false;
    //   }
    //   return (
    //     this.activeQuestionModel.questionState ===
    //     this.questionStateEnum.initial
    //   );
    // },
    hasPrevPart() {
      return this.activePartIndex > 0;
    },
    hasNextPart() {
      if (!this.examDetail?.examParts.length) return false;

      return this.examDetail.examParts.length > this.activePartIndex + 1;
    },
    isEndQuestion() {
      return this.isLastQuestion && !this.hasNextPart;
    },
    canSelectNextQuestion() {
      if (!this.activeQuestionListModel || this.isLoadingQuestionDetail)
        return false;
      return (
        this.activeQuestionIndex < this.activeQuestionListModel.length - 1 ||
        this.hasNextPart
      );
    },
    canSelectPrevQuestion() {
      if (this.isLoadingQuestionDetail) return false;
      return this.activeQuestionIndex > 0 || this.hasPrevPart;
    },
    // canShowFeedback() {
    //   return (
    //     this.activeQuestionModel.questionState ===
    //       this.questionStateEnum.correct ||
    //     this.activeQuestionModel.questionState === this.questionStateEnum.wrong
    //   );
    // },
    isCorrectActiveQuestion() {
      if (!this.activeQuestionModel) return false;
      return (
        this.activeQuestionModel.questionState ===
        this.questionStateEnum.correct
      );
    },
    feedbackMsg() {
      return (
        (this.isCorrectActiveQuestion
          ? this.currentQuestionDetail?.feedbackCorrectAnswer
          : this.currentQuestionDetail?.feedbackInCorrectAnswer) ?? ''
      );
    },
    feedbackType() {
      return (
        (this.isCorrectActiveQuestion
          ? this.currentQuestionDetail?.typeFeedbackCorrect
          : this.currentQuestionDetail?.typeFeedbackInCorrect) ?? 0
      );
    },
    feedbackMediaUrl() {
      return (
        (this.isCorrectActiveQuestion
          ? this.currentQuestionDetail?.feedbackCorrectUrl
          : this.currentQuestionDetail?.feedbackInCorrectUrl) ?? ''
      );
    },
    showEndExamButton() {
      return !this.hasNextPart && this.isLastQuestion;
    },
    counterModel: {
      get() {
        return this.partCountersByIndex[this.activePartIndex];
      },
      set(value) {
        this.partCountersByIndex[this.activePartIndex] = value;
      },
    },
    noteModalId() {
      return `request-form-note`;
    },
    complainModalId() {
      return `request-form-complain`;
    },
    notCompleteInfo() {
      if (this.appAuth.loggedIn) {
        const userInfo = this.appAuth.user;
        return !userInfo.phoneNumber;
      }
      return false;
    },

    showCompleteModal() {
      return (
        this.notCompleteInfo &&
        this.userCurrentSub.remainTrainingCountBeforePhoneNumber <= 0
      );
    },
  },
  watch: {
    isPartPassedMaxTime: {
      handler(val) {
        if (val) {
          this.onPartPassedMaxTime();
        }
      },
    },
    activeQuestionIndex: {
      immediate: true,
      handler(newVal, oldVal) {
        if (import.meta.client && this.examDetail && this.activeQuestionModel) {
          const element = checkElementIsOverFlowParent(
            'aqt',
            `qt-${this.activeQuestionModel.id}`
          );
          if (element) {
            element.scrollIntoView();
          }
        }
      },
    },
    activePartIndex: {
      immediate: true,
      handler(newVal, oldVal) {
        if (import.meta.client && this.examDetail && this.activePartModel) {
          const element = checkElementIsOverFlowParent(
            'apt',
            `pt-${this.activePartModel.id}`
          );
          if (element) {
            element.scrollIntoView();
          }
        }
      },
    },
  },
  mounted() {
    this.initPage();
    if (this.showCompleteModal) {
      this.openCompleteInfoModal();
    }
  },
  methods: {
    async initPage() {
      try {
        this.isLoadingPage = true;
        let currentExam = this.$store.state.student.currentExamTrainPageData;
        if (!currentExam) {
          const examDetailRes = await this.$store.dispatch(
            'student/getStudentExamDetail',
            { id: this.appRoute.params.id }
          );
          currentExam = examDetailRes.data;
        }

        const examDetail = mapExamDetailModelToUi(currentExam);
        //if exam state is done redirect to exams page
        if (examDetail.state === StudentExamStateEnum.done) {
          return this.appRouter.replace(RouteHelper.userPanelExam());
        }
        //on page initial if exam is in process set active part and question from api
        let activePartIndex = 0;
        let activeQuestionIndex = 0;

        activePartIndex = examDetail.examParts.findIndex(
          (part) => !!part.id && part.id === examDetail.currentPartId
        );

        //check is active part is category text
        if (activePartIndex < 0) {
          examDetail.examParts.forEach((part, partIndex) => {
            if (part.isCategoryText) {
              if (
                part.children.some(
                  (item) => item.id === examDetail.currentPartId
                )
              ) {
                activePartIndex = partIndex;
              }
            }
          });
        }

        if (activePartIndex >= 0) {
          if (examDetail.examParts[activePartIndex]?.isCategoryText) {
            activeQuestionIndex = examDetail.currentQuestionId
              ? examDetail.examParts[
                  activePartIndex
                ].children[0].studentsQuestion.findIndex(
                  (item) => item.id === examDetail.currentQuestionId
                )
              : 0;
          } else {
            activeQuestionIndex = examDetail.examParts[
              activePartIndex
            ].studentsQuestion.findIndex(
              (question) => question.id === examDetail.currentQuestionId
            );
          }
        } else {
          activePartIndex = 0;
        }

        let questionId: string | null = null;

        if (examDetail.examParts[activePartIndex]?.isCategoryText) {
          questionId =
            examDetail.examParts[activePartIndex].children[0].studentsQuestion[
              activeQuestionIndex
            ].id;
        } else {
          questionId =
            examDetail.examParts[activePartIndex]?.studentsQuestion[
              activeQuestionIndex
            ].id;
        }

        const currentQuestionDetailRes = await this.$store.dispatch(
          'student/getQuestionDetailByExamIdAndQuestionId',
          {
            examId: examDetail.id,
            questionId,
          }
        );
        const currentQuestionDetail = currentQuestionDetailRes.data;

        //get each part counter
        const partCountersByIndex = {};
        examDetail.examParts.forEach((part, index) => {
          partCountersByIndex[index] = part.duration;
        });
        this.partCountersByIndex = partCountersByIndex;
        this.examDetail = examDetail;
        this.activePartIndex = activePartIndex;
        this.activeQuestionIndex = activeQuestionIndex;
        this.currentQuestionDetail = currentQuestionDetail;
        this.questionsDetailRecord = {
          [questionId]: currentQuestionDetail,
        };

        this.startCounter();
        this.initTimeSpan();
        //window.addEventListener('beforeunload', this.windowBeforeUnload);

        this.isLoadingPage = false;
      } catch (e) {
        console.error(e);
        this.appRouter.replace('/404');
      }
    },
    windowBeforeUnload() {
      // const base = this.$axios.defaults.baseURL;
      // let url = `${base}/studentsExam/submit/${this.examDetail.id}`;
      // navigator.sendBeacon(url);
    },
    getCurrentQuestionTimer() {
      if (
        this.examQuestionsInterval &&
        this.activeQuestionModel &&
        this.examQuestionsInterval[this.activeQuestionModel.id]
      ) {
        return this.examQuestionsInterval[this.activeQuestionModel.id].state
          .currentTime;
      }
      return 0;
    },
    async setActivePartIndexAndQuestionIndex(partIndex, questionIndex) {
      this.activeExamQuestionInterval?.pauseTime();
      this.activeExamPartInterval?.pauseTime();
      [this.activePartIndex, this.activeQuestionIndex] = [
        partIndex,
        questionIndex,
      ];
      this.activeExamPartInterval?.startTime();
      this.activeExamQuestionInterval?.startTime();
      await this.getQuestionApi(this.activeQuestionModel!.id);
      //update remain time to set the active part in case user refresh the page
    },
    async setActiveQuestionIndex(index) {
      this.activeExamQuestionInterval?.pauseTime();
      await this.beforeNextQuestionHook();
      this.activeQuestionIndex = index;
      await this.getQuestionApi(this.activeQuestionModel!.id);
      this.activeExamQuestionInterval?.startTime();
    },
    async beforePageUnload() {
      this.loadingPage = true;
      this.stopTimers();
      // if (!this.$isDev) {
      await this.$store.dispatch('student/callStudentExamDone', {
        id: this.examDetail!.id,
      });
      this.$store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', null);
      // }
    },
    startCounter() {
      if (this.counterModel) {
        this.counterModel--;
        this.counterInterval = setInterval(() => {
          this.counterModel--;
        }, 1000);
      }
    },
    endCounter() {
      if (this.counterInterval) {
        clearInterval(this.counterInterval);
        this.counterInterval = null;
      }
    },
    endUpdateRemainTime() {
      if (this.remainTimeInterval) {
        clearInterval(this.remainTimeInterval);
        this.remainTimeInterval = null;
      }
    },
    stopCurrentQuestionTimer() {
      this.activeExamQuestionInterval?.pauseTime();
    },
    // showWarnModalAnsweredBeforeMinTime() {
    //   this.$refs.questionWarnModalRef.showModalWarn(
    //     TRAIN_MODAL_WARN_CASE.beforeMinTime
    //   );
    // },
    async beforeNextQuestionHook() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        //case asked before min time
        if (
          this.currentQuestionDetail!.questionState !==
            QuestionStateEnum.initial &&
          this.currentQuestionPassedSecond <
            this.currentQuestionDetail!.questionMinTime
        ) {
          this.stopCurrentQuestionTimer();
          this.answerUnderMinTimeCount++;

          //check if passed allowed count for under min time answer
          if (
            this.answerUnderMinTimeCount >
            APP_CONFIG.maxAllowedAnswerCountUnderMinimumTime
          ) {
            //@ts-expect-error access prop ref
            this.$refs.warnModal?.showModal();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await this.navigateToUserPanel();
            return resolve(false);
          }

          //@ts-expect-error access prop ref
          this.$refs.questionWarnModalRef?.showModalWarn(
            TRAIN_MODAL_WARN_CASE.beforeMinTime
          );
          const confirm = await firstValueFrom(
            //@ts-expect-error access prop ref
            this.$refs.questionWarnModalRef?.onActionSub
          );
          resolve(!!confirm);
        }
        resolve(true);
      });
    },
    async nextQuestion() {
      if (this.hasNextPart && this.isLastQuestion) {
        this.selectPart(this.activePartIndex + 1);
        return;
      }
      await this.setActiveQuestionIndex(this.activeQuestionIndex + 1);
    },
    async prevQuestion() {
      if (this.hasPrevPart && this.isFirstQuestion) {
        this.selectPart(this.activePartIndex - 1);
        return;
      }
      await this.setActiveQuestionIndex(this.activeQuestionIndex - 1);
    },
    async selectPart(partIndex) {
      const canSelect = await this.canSelectPart(partIndex);
      if (canSelect) {
        this.setActivePartIndexAndQuestionIndex(partIndex, 0);
      }
    },
    onPartPassedMaxTime() {
      if (this.hasNextPart) {
        this.setActivePartIndexAndQuestionIndex(this.activePartIndex + 1, 0);
      }
    },
    async canSelectPart(targetedPartIndex) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        //can select only next part
        if (targetedPartIndex === this.activePartIndex + 1) {
          const hasAnsweredAllQuestion =
            this.activePartModel?.studentsQuestion.every(
              (item) => item.questionState !== QuestionStateEnum.initial
            );
          if (hasAnsweredAllQuestion && !this.currentPartFlaggedQuestionCount) {
            resolve(true);
          } else {
            //@ts-expect-error access prop ref
            this.$refs.nextPartConfirmModal?.showModal();
            const confirm = await firstValueFrom(
              //@ts-expect-error access prop ref
              this.$refs.nextPartConfirmModal?.onActionSub
            );
            resolve(!!confirm);
            return;
          }
        } else {
          resolve(false);
        }
      });
    },
    async selectQuestion(index) {
      await this.setActiveQuestionIndex(index);
    },
    async onFeatureChange(event) {
      this.updateExamPartQuestion(
        this.activePartIndex,
        this.activeQuestionIndex,
        {
          isFeatured: event,
        }
      );
      this.updateQuestionsDetailRecord(this.activeQuestionModel!.id, {
        isFeatured: event,
      });
    },
    async onFlagChange(event) {
      this.updateExamPartQuestion(
        this.activePartIndex,
        this.activeQuestionIndex,
        {
          isFlagged: event,
        }
      );
      this.updateQuestionsDetailRecord(this.activeQuestionModel!.id, {
        isFlagged: event,
      });
    },
    updateQuestionsDetailRecord(
      questionId: string,
      model: Partial<StudentsExamQuestionDataModel>
    ) {
      const currentState = this.questionsDetailRecord[questionId];
      const updatedState = {
        ...currentState,
        ...model,
      };
      this.questionsDetailRecord[questionId] = updatedState;
      this.currentQuestionDetail = updatedState;
    },
    setQuestionsDetailRecord(
      questionId: string,
      model: StudentsExamQuestionDataModel
    ) {
      this.questionsDetailRecord[questionId] = model;
      this.currentQuestionDetail = model;
    },
    updateExamPartQuestion(
      partIndex: number,
      questionIndex: number,
      model: Partial<StudentsExamPartQuestionDataModel>
    ) {
      const detail = deepCloneUtil(this.examDetail!);
      const currentState =
        detail.examParts[partIndex].studentsQuestion[questionIndex];
      detail.examParts[partIndex].studentsQuestion[questionIndex] = {
        ...currentState,
        ...model,
      };

      this.examDetail = detail;
    },
    async onAnswerChange(answerId) {
      this.stopCurrentQuestionTimer();
      this.updateQuestionsDetailRecord(this.activeQuestionModel!.id, {
        answerId,
        questionState: QuestionStateEnum.correct,
      });
      this.updateExamPartQuestion(
        this.activePartIndex,
        this.activeQuestionIndex,
        {
          questionState: QuestionStateEnum.correct,
        }
      );
      await this.callAnswerApi(
        answerId,
        this.activeQuestionModel!.id,
        this.nextQuestionModel?.id ?? null
      );

      // await this.getQuestionApi(this.activeQuestionModel.id);
      // await this.callExamDetail();
    },
    // async callExamDetail() {
    //   try {
    //     const examDetailRes = await this.$store.dispatch(
    //       'student/getStudentExamDetail',
    //       {
    //         id: this.examDetail.id,
    //       }
    //     );
    //     this.examDetail = mapExamDetailModelToUi(examDetailRes.data);
    //   } catch (e) {
    //     console.error(e);
    //     showToastError(this.$bvToast);
    //   }
    // },
    async callAnswerApi(answerId, studentQuestionId, nextStudentQuestionId) {
      try {
        await this.$store.dispatch('student/callStudentExamAnswer', {
          studentQuestionId,
          nextStudentQuestionId,
          answerId,
          timeSpan: this.currentQuestionPassedSecond
            ? this.currentQuestionPassedSecond
            : 1,
          studentExamTimeSpan: this.examInterval.state.currentTime,
          studentExamPartTimeSpan:
            this.activeExamPartInterval?.state.currentTime,
          questionTimeSpan: this.activeExamQuestionInterval?.state.currentTime,
        });
      } catch (e) {
        console.error(e);
        this.showError();
      }
    },
    stopTimers() {
      this.loadingPage = true;
      this.endCounter();
      this.endUpdateRemainTime();
      this.examInterval.pauseTime();
      this.activeExamPartInterval?.pauseTime();
      this.activeExamQuestionInterval?.pauseTime();
      if (this.timeSpanInterval) {
        clearInterval(this.timeSpanInterval);
      }
    },
    async navigateToUserPanel() {
      this.skipRouteLeave = true;
      this.appRouter.replace(RouteHelper.userPanelTraining());
    },
    async endExamAndNavToReview() {
      try {
        this.skipRouteLeave = true;
        await this.appRouter.replace({
          path: RouteHelper.getStudentTrainReviewDetail(this.examDetail!.id),
        });
      } catch (e) {
        console.error(e);
        this.showError();
      }
    },
    async confirmEndExam() {
      //@ts-expect-error access component ref
      this.$refs.confirmEndModalRef?.showModal();
      const confirm = await firstValueFrom(
        //@ts-expect-error access component ref
        this.$refs.confirmEndModalRef?.onActionSub
      );
      if (!confirm) {
        const { href } = this.appRouter.resolve(this.appRoute);
        window.history.replaceState({}, '', href);
      } else {
        this.endExamAndNavToReview();
      }
    },
    async onAddNote(form) {
      try {
        this.noteForm = {
          note: form.text,
          studentsQuestionId: this.activeQuestionModel!.id,
        };
        const res = await this.$store.dispatch(
          'student/callSaveNoteApi',
          this.noteForm
        );
        this.updateExamPartQuestion(
          this.activePartIndex,
          this.activeQuestionIndex,
          {
            note: form.text,
          }
        );
        this.showSuccess();
      } catch (e) {
        console.error(e);
        this.showError();
      }
    },
    async onAddComplain(form) {
      try {
        this.complainForm = {
          text: form.text,
          id: this.currentQuestionDetail!.questionId,
        };
        const res = await this.$store.dispatch(
          'admin/callQuestionComplain',
          this.complainForm
        );
        this.showSuccess();
      } catch (e) {
        console.error(e);
        this.showError();
      }
    },
    async getQuestionApi(questionId) {
      try {
        if (
          !!this.questionsDetailRecord &&
          this.questionsDetailRecord[questionId]
        ) {
          this.setQuestionsDetailRecord(
            questionId,
            this.questionsDetailRecord[questionId]
          );
          return;
        }
        this.isLoadingQuestionDetail = true;
        const questionDetailResponse = await this.$store.dispatch(
          'student/getQuestionDetailByExamIdAndQuestionId',
          {
            examId: this.examDetail!.id,
            questionId,
          }
        );
        this.setQuestionsDetailRecord(questionId, questionDetailResponse.data);
        this.isLoadingQuestionDetail = false;
      } catch (e) {
        console.error(e);
        this.isLoadingQuestionDetail = false;
        this.showError();
      }
    },
    initTimeSpan() {
      this.examDetail?.examParts.forEach((part) => {
        this.examPartsInterval[part.id] = useTimeSpanService(part.duration);
        part.studentsQuestion.forEach((question) => {
          this.examQuestionsInterval[question.id] = useTimeSpanService();
        });
      });

      this.examInterval.startTime();
      this.activeExamPartInterval?.startTime();
      this.activeExamQuestionInterval?.startTime();

      this.timeSpanInterval = setInterval(() => {
        this.currentQuestionPassedSecond = this.getCurrentQuestionTimer();
        this.isPartPassedMaxTime =
          this.activeExamPartInterval?.isPassedMaxTime() ?? false;
      }, 1000);
    },

    openCompleteInfoModal() {
      this.completeInfoModalKey++;
      this.isOpenCompleteInfoModal = true;
    },

    async onCompleteInfo() {
      this.isOpenCompleteInfoModal = false;
    },
  },
};
</script>
<style lang="scss" src="./exams-id.scss"></style>
