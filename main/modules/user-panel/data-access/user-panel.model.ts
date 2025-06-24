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

export type  lessonObj ={
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

export type  lessonsModel = {
  id: number;
  title: string;
  totalLessonsCount: number;
  doneLessonsCount: number;
  lessons: lessonObj[];
}
