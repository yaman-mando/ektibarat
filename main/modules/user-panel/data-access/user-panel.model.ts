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