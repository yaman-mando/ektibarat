<template>
  <div
    v-if="questionData"
    class="web-content-page exam-question-page"
  >
    <div class="w-container">
      <app-exam-part-article
        v-if="questionData.categoryIsText"
        :title="questionData.categoryTitle"
        :text="questionData.categoryDescription"
      />
      <div
        class="m-content"
        :class="{ isText: questionData.categoryIsText }"
      >
        <div class="w-full aa-q !text-inherit !no-underline">
          <app-exam-part-question-part
            ref="examPartQuestion"
            class="ex-cd"
            :isTrain="false"
            :counterValue="null"
            :hideCounter="true"
            :mainTitle="questionData.categoryTitle"
            :question="questionData"
            :isSeo="true"
            :withBg="true"
          >
            <template #default>
              <app-answer-select
                :correctAnswerIdsList="[]"
                :selectedValue="questionData.answerId"
                :correctAnswerId="correctAnswerIdModel"
                :answers="questionData.answers"
                :fetchingApi="$store.state.student.fetching.answer"
                :questionState="questionData.questionState"
                :withBg="true"
                :isSeo="true"
                :showTakfeelat="true"
              />
            </template>
          </app-exam-part-question-part>
        </div>
        <question-info :grade="Number(questionData.grade)" />
        <div
          v-show="similarQuestions && similarQuestions.length > 0"
          class="w-similar-questions"
        >
          <span class="__rw_1">
            أسئلة مشابهة في
            {{ questionData.categoryTitle }}
          </span>
          <div class="__rw_2">
            <app-button
              :isLoading="prevIsLoading"
              :isDisabled="currentIndexQuestion == 0 || nextIsLoading"
              variant="outline"
              label="السابق"
              iconStartClass="fa fa-chevron-right"
              @click="toPrevQuestion"
            />

            <app-button
              :isLoading="nextIsLoading"
              :isDisabled="prevIsLoading"
              label="التالي"
              iconEndClass="fa fa-chevron-left"
              @click="toNextAction"
            />
          </div>
        </div>
      </div>
    </div>
    <client-only>
      <web-login-register-modal ref="login_register_modal_seo_ref" />
    </client-only>
  </div>
</template>
<script lang="ts">
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { pictureTypes } from '~/main/constants/picture-types';
import { questionTypes } from '~/main/modules/questions/data-access/constats/question-types';
import { convertToMathmlCode } from '~/main/shared/math-jax/useMathJaxClientService';
import { appEvents } from '~/main/shared/events/app.events';
import { takeWhile } from 'rxjs';
import { deepCloneUtil } from '~/main/utils/lodash.utils';
import {
  getStoredCatArray,
  setStoredCatArray,
  sleepUtil,
} from '~/main/utils/shared-utils';
import { RouteHelper } from '~/main/utils/route-helper';
import { ErrorsRecord } from '~/main/constants/errors.enum';
import { GlobalTypes } from '~/main/constants/global-types';
import { useIsAliveRx } from '~/main/shared/rx/useIsAliveRx';
import type { WebLoginRegisterModal } from '#components';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';

export class TrainingForm {
  subjectId: number | string;
  willDo: boolean = false;
  withoutStudentEvaluate: boolean = false;
  randomLevel: boolean = false;
  isOpen: boolean = false;
  tagsIds: number[] = [];
  takfeelTagsIds: number[] = [];
  onlyWrongQuestions: boolean = false;
  onlyFlaggedQuestions: boolean = false;
  randomQuestionsSettings: any[] = [];

  constructor(subjectId: number | string) {
    this.subjectId = subjectId;
  }
}

export const trainingSource = {
  modal: 1,
  help: 2,
  next: 3,
};
export default {
  setup() {
    const { isAliveRx } = useIsAliveRx();
    const loginRegisterModalSeoRef = useTemplateRef<
      InstanceType<typeof WebLoginRegisterModal>
    >('login_register_modal_seo_ref');
    const runtimeConfig = useRuntimeConfig();
    const globalStore = useGlobalStore();
    const subscriptionsStore = useSubscriptionsStore();
    const userCurrentSub = computed(
      () => subscriptionsStore.state.userCurrentSubVal
    );
    return {
      ...useToastMessage(),
      ...useSetupRoute(),
      ...useSetupAuth(),
      isAliveRx,
      loginRegisterModalSeoRef,
      runtimeConfig,
      globalStore,
      userCurrentSub,
    };
  },
  data() {
    return {
      renderQuestionInfo: false,
      answers: null,
      scrollEl: null as Element | null,
      currentIndexQuestion: 0,
      nextIsLoading: false,
      prevIsLoading: false,
      defaultTimerVal: 5,
      timeLeft: 5,
      timer: null as any,
    };
  },

  computed: {
    questionData() {
      return this.$store.state.examQuestion;
    },
    isTahseleQuestion() {
      return this.questionData.grade == GlobalTypes.tahsele;
    },
    correctAnswerIdModel() {
      return this.questionData?.answers?.find((k) => k.isCorrect)?.id ?? 0;
    },
    similarQuestions() {
      return this.$store.state.similarQuestions;
    },
    isPhotoQuestion() {
      return this.questionTypeRe === this.questionTypeEnum.photo;
    },
    isVideoQuestion() {
      return this.questionTypeRe === this.questionTypeEnum.video;
    },
    isAudioQuestion() {
      return this.questionTypeRe === this.questionTypeEnum.audio;
    },
    pictureTypesEnum() {
      return pictureTypes;
    },
    questionTypeEnum() {
      return questionTypes;
    },
    isMediaQuestionModel() {
      return (
        this.isPhotoQuestion || this.isVideoQuestion || this.isAudioQuestion
      );
    },
    questionTypeModel() {
      return this.questionTypeRe;
    },
    questionTypeRe() {
      if (this.questionData?.questionsType?.length > 1) {
        const _index = this.questionData?.questionsType.findIndex((r) => r > 0);
        if (_index != -1) {
          return this.questionData?.questionsType[_index];
        } else return 0;
      } else {
        return this.questionData?.questionsType?.[0] ?? 0;
      }
    },

    questionDescriptionModel() {
      return this.questionData?.shortDescription;
    },

    questionTitleModel() {
      try {
        let title = this.questionData.title;
        let compareContent: string | null = null;
        if (import.meta.client) {
          if (!title)
            return {
              title: null,
              compareContent: null,
            };

          if (this.hasCompareContent) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.questionData.title;
            const removableChild = Array.from(
              tempDiv.getElementsByClassName('csssDiv')
            );
            const cDiv = document.createElement('div');
            removableChild.forEach((item) => {
              cDiv.innerHTML += convertToMathmlCode(item.innerHTML);
              item.remove();
            });
            title = tempDiv.innerHTML;
            compareContent = cDiv.innerHTML;
          }

          return {
            title,
            compareContent,
          };
        } else {
          return {
            title,
            compareContent,
          };
        }
      } catch (e) {
        console.log('compareContent:' + e);
        return null;
      }
    },

    hasCompareContent() {
      return this.questionData?.title.includes('csssDiv');
    },

    isLoggedIn() {
      return this.appAuth.loggedIn;
    },

    addModalToShow() {
      return this.$store.state.showSeoAdModalStart;
    },
  },

  watch: {
    addModalToShow: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.startSeoAdCountdown();
        }
      },
    },
  },

  async mounted() {
    const id = !this.appRoute.params.id
      ? this.appRoute.params.title
      : this.appRoute.params.id;
    this.$store.dispatch('getSimilarQuestion', id);
    appEvents.toTraining$
      .pipe(takeWhile(() => this.isAliveRx))
      .subscribe(() => {
        this.toTraining(trainingSource.help);
      });
    if (!this.isLoggedIn) {
      this.checkUserMovement();
    }
    this.saveArrToStorage();
    if (this.similarQuestions?.length > 0 && this.questionData) {
      const _sim = deepCloneUtil(this.similarQuestions);
      _sim.unshift(this.questionData.questionGuid);
      this.$store.commit('SET_SIMILAR_QUESTIONS', _sim);
    }

    this.checkForChangeGLTypeToTahsele();
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    async checkUserMovement() {
      try {
        const lastCount = localStorage.getItem('_eco');
        let count = 1;
        if (lastCount) {
          count = Number(lastCount) + 1;
        }
        localStorage.setItem('_eco', String(count));
        await sleepUtil(300);
        if (count > 3) {
          if (this.loginRegisterModalSeoRef) {
            this.loginRegisterModalSeoRef?._showModal();
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    saveArrToStorage() {
      try {
        if (!getStoredCatArray(this.isTahseleQuestion)) {
          const arr = [this.questionData.categoryId];
          setStoredCatArray(arr, this.isTahseleQuestion);
        }
      } catch (e) {
        console.log(e);
      }
    },

    toNextAction() {
      if (this.currentIndexQuestion >= this.similarQuestions.length - 1) {
        this.redirectAction();
      } else {
        this.toNextQuestion();
      }
    },

    async redirectAction() {
      if (this.appAuth.loggedIn) {
        this.nextIsLoading = true;
        this.toTraining(trainingSource.next);
      } else {
        this.loginRegisterModalSeoRef?._showModal();
      }
    },

    async toNextQuestion() {
      try {
        this.nextIsLoading = true;
        this.currentIndexQuestion += 1;
        const id = this.similarQuestions[this.currentIndexQuestion];
        await this.$store.dispatch('getExamQuestion', id);
      } catch (e) {
        console.error('Error fetching next question:', e);
      } finally {
        this.nextIsLoading = false;
      }
    },

    async toPrevQuestion() {
      try {
        this.prevIsLoading = true;
        this.currentIndexQuestion -= 1;
        const id = this.similarQuestions[this.currentIndexQuestion];
        await this.$store.dispatch('getExamQuestion', id);
        this.prevIsLoading = false;
      } catch (e) {
        this.prevIsLoading = false;
        console.log('toPrevQuestion: ' + e);
      }
    },

    stopTrainingLoading(source) {
      if (source === trainingSource.help) {
        //TODO-z
        // this.$refs['examPartQuestion']?.$refs?[
        //   'answerHelpModalRef'
        // ]?.stopLoading();
      } else if (source === trainingSource.next) {
        this.nextIsLoading = false;
      }
    },

    async checkAndRequestTahsiliAnalyze() {
      const userId = this.appAuth.user.id;
      try {
        await this.$store.dispatch('callTahsiliAnalyze');
        localStorage.setItem(`initTahsiliIsReqAnalyzed_${userId}`, 'yes');
        return true;
      } catch (error) {
        console.log('Error during Tahsili analyze request:', error);
        return false;
      }
    },

    async toTraining(source = trainingSource.modal) {
      try {
        if (this.isTahseleQuestion) {
          const isAnalyzed =
            localStorage.getItem(
              `initTahsiliIsReqAnalyzed_${this.appAuth.user.id}`
            ) === 'yes';
          if (!isAnalyzed) {
            if (!(await this.checkAndRequestTahsiliAnalyze())) {
              await sleepUtil(5000);
              this.stopTrainingLoading(source);
              this.showError();
              return;
            }
          }
        }

        // await this.$store.dispatch('getUserCurrentSub');
        if (!this.userCurrentSub) return;

        if (
          this.userCurrentSub.remainTrainingCount <= 0 ||
          this.userCurrentSub.remainTrainingCountPerDay <= 0
        ) {
          this.appRouter.push({ path: RouteHelper.userPanelTraining() });
          return;
        }
        // Create a training form instance and add random question settings
        const form = new TrainingForm(
          this.runtimeConfig.public.defaultSubjectId
        );
        form.randomQuestionsSettings.push({
          categoryId: this.questionData.categoryId,
          questionLevel: 0,
          questionsCount: 24,
        });
        form.subjectId = this.isTahseleQuestion
          ? this.runtimeConfig.public.defaultSubjectIdTahsele
          : this.runtimeConfig.public.defaultSubjectId;

        // Send a request to the API to generate a custom exam
        this.$axios
          .post('studentsExam/customFromTags', form)
          .then(({ data: res }) => {
            // Store the retrieved exam data in Vuex
            this.$store.commit('student/SET_CURRENT_EXAM_TRAIN_PAGE_DATA', res);

            // Stop loading animation in the modal
            this.stopTrainingLoading(source);
            // Redirect to the training page
            this.toTrainingPage(res.id);
          })
          .catch((error) => {
            // Stop loading animation in case of an error
            this.stopTrainingLoading(source);

            // Handle specific error responses
            if (error.response?.status == 400) {
              if (error.response.data.errorType == 6) {
                // Show block modal if the error type is 6
                this.globalStore.patchState({ showBlockModal: true });
              } else {
                // Display an error toast with the corresponding error message
                this.showError({
                  summary: ErrorsRecord[error.response.data.errorType],
                  life: 5000,
                });
              }
            } else {
              // Display a generic error message for unexpected errors
              this.showError();
            }
          });
      } catch (e) {
        // Stop loading animation if an unexpected error occurs
        this.stopTrainingLoading(source);
        // Show an error toast message for general failures
        this.showError({
          life: 2500,
          summary: 'عذراً حدث خطأ في إنشاء امتحانكم ... يرجى إعادة المحاولة',
        });

        // Log the error to the console for debugging purposes
        console.log(e);
      }
    },

    toTrainingPage(id) {
      try {
        this.appRouter.push({
          path: `/student/training/${id}`,
        });
      } catch (e) {
        console.log(e);
      }
    },

    startSeoAdCountdown() {
      try {
        if (this.timer) clearInterval(this.timer); // إيقاف العداد القديم
        this.timeLeft = deepCloneUtil(this.defaultTimerVal); // إعادة ضبط العداد

        this.timer = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            clearInterval(this.timer);
            this.$store.commit('SET_SEO_AD_MODAL_TEMP_START', false);
          }
        }, 1000);
      } catch (e) {
        console.log(e);
      }
    },

    checkForChangeGLTypeToTahsele() {
      try {
        if (this.isLoggedIn && this.isTahseleQuestion) {
          this.globalStore.patchState({
            globalTypeUserValue: GlobalTypes.tahsele,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped src="./exam-questions-id.scss"></style>
