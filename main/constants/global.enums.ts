export const STATIC_PAGE_TYPE = {
  successPartners: 'successPartners',
  topStudents: 'topStudents',
  collaboratingTeachers: 'collaboratingTeachers',
  features: 'features',
};

export const pictureTypes = {
  Users: 1,
  Attachments: 2,
  Subjects: 3,
  Categories: 4,
  Exams: 5,
  ExamDetails: 6,
  Blogs: 7,
  CategoriesBlogs: 8,
  Tags: 9,
  questions: 10,
  answers: 11,
  employees: 12,
  [STATIC_PAGE_TYPE.features]: 13,
  [STATIC_PAGE_TYPE.successPartners]: 14,
  [STATIC_PAGE_TYPE.collaboratingTeachers]: 15,
  [STATIC_PAGE_TYPE.topStudents]: 16,
  Subscriptions: 17,
  jsonFiles: 19,
  messaging: 22,
};

export const settingKeys = {
  isSchool: 'isSchool',
};

export const IMAGE_ACCEPT_ENUM = {
  any: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'],
  svg: ['image/svg+xml'],
  png: ['image/png'],
};

export const IMAGE_ACCEPT_TYPE = {
  library: [...IMAGE_ACCEPT_ENUM.svg, ...IMAGE_ACCEPT_ENUM.png],
  default: IMAGE_ACCEPT_ENUM.any,
};

export const LIBRARY_TYPE_LIST = [
  pictureTypes[STATIC_PAGE_TYPE.features],
  pictureTypes.Categories,
  pictureTypes.Subjects,
  pictureTypes.Subscriptions,
  pictureTypes.messaging,
];


export const pictureTypesEnum = {
  1: "Users",
  2: "Attachments",
  3: "Library",
  4: "Library",
  5: "Exams",
  6: "ExamDetails",
  7: "Blogs",
  8: "CategoriesBlogs",
  9: "Tags",
  10: "Questions",
  11: "Answers",
  12: "Employees",
  13: "Library",
  14: "SuccessPartners",
  15: "CollaboratingTeachers",
  16: "TopStudents",
  17: "Library",
  19: "StaticContent",
  22: "Messaging"
};