import { number } from "yup";

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
  id: number,
  periodTime: number,
  title: string,
  order: number,
  videoLink: string,
  isWatched: boolean
}

export type similarVidModel = similarVidObj[]


export type stepCategoryInfo = {
  categoryId: number | null;
  categoryName: string | null;
  numberQuestion: number;
  numberQuestionComplte: number;
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
}

export type stage= {
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
  children:{id:number,label:string,disabled:boolean}[]
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
  count:number;
  date:string | null
}[]
