//students exam detail by id
export type StudentsExamDataModel = {
  id: string;
  title: string;
  createdDate: string;
  studentId: number;
  startTime: any;
  endTime: any;
  currentQuestionId: any;
  currentPartId: any;
  degree: number;
  remainTime: number;
  duration: number;
  state: number;
  subjectId: number;
  subjectName: string;
  deviceId: string;
  isManual: true;
  examParts: StudentsExamPartDataModel[];
  totalPoints: number;
};

export type StudentsExamPartDataModel = {
  id: number;
  examDetailId: number;
  title: string;
  duration: number;
  studentsQuestion: StudentsExamPartQuestionDataModel[];
  categoryDescription: string;
  isCategoryText: boolean;
  pointsSettings: StudentsExamPartSettingsDataModel[];
  children: StudentsExamPartDataModel[];
};
export type StudentsExamPartQuestionDataModel = {
  id: string;
  questionState: number;
  isFeatured: boolean;
  isFlagged: boolean;
  articleUi?: string | null;
  note?: string | null;
};
export type StudentsExamPartSettingsDataModel = {
  questionLevel: number;
  period: number;
  pointsCount: number;
};

//submit exam params
export type StudentsExamSubmitParamsModel = {
  id: string;
  wantProceed?: boolean;
};

//analyze
export type StudentsExamAnalyzeDataModel = {
  isAllowed?: boolean;
  categoryId?: number;
};

//custom from tags
export type StudentsExamCustomFromTagsDTODataModel = {
  studentExamId: string;
};

//remove answer
export type StudentsExamRemoveAnswerDTODataModel = {
  studentQuestionId: string;
};

//student exam list item
export type StudentsExamListItemDataModel = {
  studentExamId: string;
  studentName: string;
  title: string;
  createdDate: string;
  timeSpan: number;
  pointsCount: number;
  questionsCount: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  sessionId: string | null;
  customerId: string | null;
  partsNames: string[];
};

export type StudentsExamListItemPresenterModel =
  StudentsExamListItemDataModel & {
    mainLabelInfo: {
      mainText: string;
      tooltipText: string | null;
    };
  };
