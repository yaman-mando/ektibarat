export type lessonsCategoriesDataModel = {
  id: number;
  subjectId: number;
  title: string;
  shortDescription: string;
  parentId: number | null;
  categoryId: number;
  iconUrl: string;
  order: number;
  totalLessonsCount: number;
  doneLessonsCount: number;
  children: lessonsCategoriesDataModel[];
}

export type lessonObj = {
  id: number;
  title: string;
  iconUrl: string;
  order: number;
  examId: number | null;
  attachmentIds: any[];
  videoLink: string;
  type: number;
  periodTime: number;
  isWatched: boolean;
  isFree:boolean
};

export type lessonsModel = {
  id: number;
  title: string;
  totalLessonsCount: number;
  doneLessonsCount: number;
  lessons: lessonObj[];
};

export type videoContent = {
  id: number
  title: string
  from: number
  to: number
};

export type lessonDetailsModel = {
  id: number
  groupLawId: number
  lessonsCategoriesId: number
  lessonCategoryTitle: string
  title: string
  shortDescription: string
  description: string
  iconUrl: string
  order: number
  examId: number | null
  attachmentIds: number[]
  videoLink: string
  type: number
  periodTime: number
  videoContents: videoContent[]
}

export type similarVidObj = {
  iconUrl: string,
  id: number,
  periodTime: number,
  title: string,
  order: number,
  videoLink: string,
  isWatched: boolean,
  isFree: boolean,
  isActive: boolean
}

export type similarVidModel = similarVidObj[]


export type categoryInfoForStep = {
  categoryId: number | null;
  questionsCount: number | null | any;
  stepId: number | null;
}

export type stepCategoryInfo = {
  categoryId: number | null;
  categoryName: string | null;
  numberQuestion: number;
  numberQuestionComplete: number;
  time: number;
  isWrong: boolean;
}

export type step = {
  id: number;
  title: string;
  status: number;
  image_path: string | null;
  categoryInfo: stepCategoryInfo | null;
  text_before?: string;
  text_after?: string;
  color_1: string;
  color_2: string;
  type: number
}

export type stage = {
  phase_name: string;
  phase_id: number;
  total_steps: number;
  completed_steps: number;
  total_time_remaining: number;
  color_1: string;
  color_2: string;
  steps: step[];
}

export type studentStages = {
  active_step_id: number;
  active_phase_id: number;
  show_modal_need_help: boolean;
  stages: stage[];
}


export type categoriesListForModal = {
  name: string,
  children: { id: number, label: string, disabled: boolean }[]
}[]


export type categoryAnalysisList = {
  allStudentsTimeTakenRate: number;
  categoryId: number;
  categoryName: string | null;
  categoryType: string | null;
  correctAnswersCount: number;
  examDefaultId: number | null;
  hasLawAnalyze: boolean;
  hasNoMasteredSkills: boolean;
  isEnabled: boolean;
  parentId: number;
  questionsCount: number;
  rate: number;
  sort: number;
  studentTimeTakenRate: number;
  totalTime: number;
  wrongAnswersCount: number;
}[]

export type chartDataList = {
  count: number;
  date: string | null
}[]

export type idLabelList = {
  id: number,
  label: string
}[]


export type studentSchoolDashbord = {
  studentId: number;
  studentName: string;
  teacherId: number;
  teacherName: string;
  questionsCount: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  trainingPeriod: number;
  levelRate: number;
  predictedMark: number;
  requiredGrade: number;
  planAdherence: number;
}

export type schoolDashboardData = {
  data: studentSchoolDashbord[];
  levelRateAvg: number;
  planAdherenceAvg: number;
  predictedMarksAvg: number;
  studentsCount: number;
}

export type analyzeStudentCategory = {
  categoryId: number;
  categoryName: string;
  parentId: number | null;
  questionsCount: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  studentTimeTakenRate: number;
  allStudentsTimeTakenRate: number;
  totalTime: number;
  sort: number;
  rate: number;
  isEnabled: boolean;
  hasLawAnalyze: boolean;
}

export type analyzeStudentCategoryForTable = {
  categoryId: number;
  categoryName: string;
  parentId: number | null;
  questionsCount: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  studentTimeTakenRate: number;
  allStudentsTimeTakenRate: number;
  totalTime: number;
  sort: number;
  rate: number;
  isEnabled: boolean;
  hasLawAnalyze: boolean;
  children: analyzeStudentCategory[]
}[]

export type studentAnalyzeResponse = {
  studentRate: number;
  levelRate: number;
  requiredGrade: number;
  analayzeStudentCategories: analyzeStudentCategory[];
}

export type mainCategoryRate = {
  categoryId: number | null;
  categoryName: string;
  rate: number;
}

export type studentAnalyzeChartResponse = {
  mainCategoriesRates: mainCategoryRate[];
  totalQuestionsCount: number;
  wrongCount: number;
  correctCount: number;
  totalPeriod: number;
  chartData: chartDataList;
}

export type recommendation = {
  title: string;
  advices: string[];
}

export type recommendationsResponse = {
  recommendations: recommendation[];
}


export type timeStats = {
  percentage: number;
  timeRequired: number;
  timeDone: number;
}

export type trainingPlanSummaryResponse = {
  examDate: string;
  startTraining: string;
  lastMonth: timeStats;
  lastWeek: timeStats;
  timeDone: number;
  timeRequired: number;
  totalPercentage: number;
  percentageDone: number | any;
  percentageRequired: number | any;
  recommendations: recommendation;
}

export type studentAnalyzeForTeacherResponse = {
  studentId: string | number;
  userName: string;
  pictureUrl: string;
  fullName: string;
  phoneNumber: string;
  analyzes: {
    studentRate: number;
    levelRate: number;
    requiredGrade: number;
    analayzeStudentCategories: analyzeStudentCategory[];
  }[]
}


export type blog = {
  link: string;
  title: string;
  description: string;
  source_url: string
}

export type blogsListResponse = blog[]


export type trainingAnalyzeCategorySimple = {
  categoryId: number;
  parentId: number | null;
  categoryName: string;
  questionsCount: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  rate: number;
  totalTime: number;
  sort: number;
}

export type trainingAnalyzeSimpleResponse = {
  subjectId: number;
  subjectName: string;
  studentRate: number;
  trainingAnalyzeCategories: trainingAnalyzeCategorySimple[];
}

export type trainingPlanInfoSimpleResponse = {
  totalPercentage: number;
  percentageRequired: number | any;
  percentageDone: number | any;
  timeRequired: number | any;
  timeDone: number;
}

export type slide = {
  createdDate: string,
  goLinkUrl: string,
  id: number,
  imagePath: string,
  imagePathMobile: string,
  isExternalLink: boolean,
  order: number,
  tag: number
}

export type slidersResponse = slide[]



export type TPstudentStatistics = {
  totalQuestionsCount: number;
  correctQuestionsCount: number;
  wrongQuestionsCount: number;
  subscriptionName: string;
  levelRate: number;
  planAdherence: number;
  rate: number;
  showRate: boolean;
  trainingPeriod: number;
}

export type TPstudent = {
  id: number;
  studentId: number;
  fullName: string;
  phoneNumber: string;
  statistics: TPstudentStatistics;
  state: number;
}

export type TPstudentDataResponse = {
  code: string;
  discount: number;
  studentsCount: number;
  levelRateAvg: number;
  predictedMarksAvg: number;
  planAdherenceAvg: number;
  studentsList: TPstudent[];
}

export type financialDetail= {
  createdDate: string;
  studentName: string;
  subscriptionName: string;
  studentPaidAmount: number;
  teacherAmount: number;
}

export type teachersFinancialResponse= {
  subscriptionsCount: number;
  code: string | null;
  details: financialDetail[];
}