//TODO-z
export type CategoriesListForSubjectFilterDataModel = {
  subjects: number[];
  shownForBlog: boolean;
};

export type CategoriesListForSubjectItemDataModel = {
  id: number;
  subjectId: number | null;
  subjectName: string | null;
  parentId: number | null;
  defaultExamId: number | null;
  label: string | null;
  grades: number;
  questionsCount: number | null;
  isText: boolean;
  defaultQuestionsCount: number;
  categoryType: number;
  defaultDuration: number;
  wordPressUrl: string | null;
  children: CategoriesListForSubjectItemDataModel[];
};
