<template>
  <div class="train-review-detail-page">
    <div class="w-container">
      <div class="tp-wrapper">
        <span class="p-title">نتيجة الاختبار</span>
        <template v-if="isLoading">
          <div class="w-full my-3 flex items-center justify-center">
            <app-spinner />
          </div>
        </template>
        <template v-else>
          <template v-if="detail">
            <train-review-status
              class="tp-ii"
              :typeName="detail.subjectName"
              :categoryName="'جميع الأقسام'"
              :questionCount="detail.questionsCount"
              :timeCount="detail.timeTaken"
              :wrongAnswerCount="detail.wrongAnswersCount"
              :correctAnswerCount="detail.correctAnswersCount"
              :passedAnswerCount="detail.passedAnswersCount"
              :pointCount="detail.pointsCount"
            />
            <div class="tg-wrapper">
              <template
                v-for="(question, index) in detail.questions"
                :key="`asc-${index}`"
              >
                <app-exam-part-question-part
                  class="ex-cd"
                  :isTrain="true"
                  :counterValue="null"
                  :questionNumber="index + 1"
                  :question="question"
                  :examId="detail.id"
                  :hasComplainAction="true"
                  :studentTimeTaken="question.studentTimeTaken"
                  :allStudentsTimeTaken="question.allStudentsTimeTaken"
                >
                  <template #default>
                    <app-answer-select
                      :selectedValue="question.answerId"
                      :correctAnswerIdsList="question.correctAnswerId"
                      :answers="question.answers"
                      :fetchingApi="$store.state.student.fetching.answer"
                      :questionState="question.questionState"
                      :isDisabled="true"
                      :showTakfeelat="true"
                    />
                  </template>
                </app-exam-part-question-part>
                <train-review-correct-answer
                  :text="question.feedbackInCorrectAnswer"
                />
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useSetupAuth } from '~/main/services/setup/useSetupAuth';
import { useSetupRoute } from '~/main/services/setup/useSetupRoute';
import type { TrainReviewDetailModel } from '~/main/modules/students-exam/data-access/models/train-review-detail.model';
import TrainReviewStatus from '~/components/web/student/train-review-status/train-review-status.vue';
import TrainReviewCorrectAnswer from '~/components/web/student/train-review-correct-answer/train-review-correct-answer.vue';

export default {
  components: { TrainReviewCorrectAnswer, TrainReviewStatus },
  setup() {
    //meta
    definePageMeta({
      layout: 'exam-layout',
    });
    useHead({
      htmlAttrs: {
        dir: 'rtl',
        class: 'app-light no-menu zoom-wrapper',
      },
    });

    return {
      ...useSetupAuth(),
      ...useSetupRoute(),
    };
  },
  data() {
    return {
      isLoading: false,
      detail: null as TrainReviewDetailModel | null,
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        this.isLoading = true;
        this.detail = await this.$store.dispatch('student/getTrainReviewById', {
          id: this.appRoute.params.id,
        });
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        throw e;
      }
    },
  },
};
</script>
<style
  lang="scss"
  scoped
  src="../../training-review-detail-shared.scss"
></style>
<style lang="scss" src="./training-review-id.scss"></style>
