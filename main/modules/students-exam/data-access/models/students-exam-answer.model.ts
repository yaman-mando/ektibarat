//answer DTO
import type { AnswerStateTypeEnum } from '~/main/modules/students-exam/data-access/constats/answer-state-type.enum';

export type StudentsExamAnswerDTODataModel = {
  studentQuestionId: string | null;
  nextStudentQuestionId: string | null;
  answerId: string | null;
  answerType: AnswerStateTypeEnum;
  studentExamTimeSpan: number;
  studentExamPartTimeSpan: number;
  questionTimeSpan: number;
};
//response
export type StudentsExamAnswerDataModel = {
  questionState: number;
  totalPoints: number;
  plusPoints: number;
  correctAnswerId: string | null;
};
