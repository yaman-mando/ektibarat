import { STATIC_PAGE_TYPE } from '~/main/constants/static-page-type';

export const ImagesFolderName = {
  Users: 'Users',
  Attachments: 'Attachments',
  Subjects: 'library',
  Categories: 'library',
  laws: 'library',
  Exams: 'Exams',
  ExamDetails: 'ExamDetails',
  Blogs: 'Blogs',
  CategoriesBlogs: 'CategoriesBlogs',
  Tags: 'Tags',
  [STATIC_PAGE_TYPE.successPartners]: STATIC_PAGE_TYPE.successPartners,
  [STATIC_PAGE_TYPE.collaboratingTeachers]:
    STATIC_PAGE_TYPE.collaboratingTeachers,
  [STATIC_PAGE_TYPE.topStudents]: STATIC_PAGE_TYPE.topStudents,
  [STATIC_PAGE_TYPE.features]: 'library',
  library: 'library',
  Subscriptions: 'library',
  Messaging: 'Messaging',
};

export const LIBRARY_TYPE_FOLDER_LIST = [
  ImagesFolderName.Categories,
  ImagesFolderName.Subjects,
  ImagesFolderName.Subscriptions,
  ImagesFolderName[STATIC_PAGE_TYPE.features],
];
