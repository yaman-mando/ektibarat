import type {
  StudentsExamQuestionAnswerDataModel,
  StudentsExamQuestionDataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam-question.model';

export type TrainReviewDetailModel = {
  id: string;
  subjectName: string;
  questionsCount: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  passedAnswersCount: number;
  pointsCount: number;
  timeTaken: number;
  questions: TrainReviewQuestionDetailModel[];
};

export type TrainReviewQuestionDetailModel = StudentsExamQuestionDataModel & {
  id: string;
  questionId: number;
  answerId: number;
  correctAnswerId: number[];
  title: string;
  shortDescription: string;
  description: string;
  contentUrl: string;
  questionsType: number[];
  feedbackCorrectAnswer: string;
  feedbackInCorrectAnswer: string;
  typeFeedbackCorrect: number;
  typeFeedbackInCorrect: number;
  feedbackCorrectUrl: string;
  feedbackInCorrectUrl: string;
  questionState: number;
  allStudentsTimeTaken: number;
  studentTimeTaken: number;
  answers: TrainReviewAnswerDetailModel[];
};

export type TrainReviewAnswerDetailModel =
  StudentsExamQuestionAnswerDataModel & {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    contentUrl: string;
    answerType: number;
  };
