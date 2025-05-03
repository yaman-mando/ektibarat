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

type StudentsExamPartDataModel = {
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
};
export type StudentsExamPartSettingsDataModel = {
  questionLevel: number;
  period: number;
  pointsCount: number;
};
