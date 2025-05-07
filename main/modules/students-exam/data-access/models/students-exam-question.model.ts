export type StudentsExamQuestionParamsDataModel = {
  examId: string;
  questionId: string;
};

//detail
export type StudentsExamQuestionDataModel = {
  id: string;
  answerId: number;
  questionId: number;
  title: string;
  shortDescription: string;
  description: string;
  contentUrl: string;
  questionTime: number;
  questionsType: number[];
  feedbackCorrectAnswer: string;
  feedbackInCorrectAnswer: string;
  typeFeedbackCorrect: number;
  typeFeedbackInCorrect: number;
  feedbackCorrectUrl: string;
  feedbackInCorrectUrl: string;
  questionDegree: number;
  note: string;
  questionState: number;
  categoryIsText: boolean;
  categoryDescription: string;
  answers: StudentsExamQuestionAnswerDataModel[];
  categories: StudentsExamQuestionCategoryDataModel[];
  categoriesGroupsWithLaws: StudentsExamQuestionCategoryDataModel[];
  questionMaxTime: number;
  questionMinTime: number;
  isChecked?: boolean;
  categoryTitle?: string;
  isFlagged: boolean;
  isFeatured: boolean;
  isBelongToLaw: boolean;
  correctAnswerId: number[];
  _correctAnswerId: string | null;
  grade: null;
  categoryId: number;
  questionGuid: string;
  answerType: number;
  tagsIds: number[];
};

export interface StudentsExamQuestionAnswerDataModel {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  contentUrl: string;
  answerType: number;
  answerDegree: number;
  isTakfeelat: boolean;
}

interface StudentsExamQuestionCategoryDataModel {
  id: string;
  title: string;
  questionsCount: number;
}
