export type ComplaintsDTODataModel = {
  fullName: string;
  email: string;
  phone: string;
  title: string;
  type: 0;
  text: string;
  studentQuestionId?: string;
  studentExamId?: string;
  sessionId: string | null;
};
