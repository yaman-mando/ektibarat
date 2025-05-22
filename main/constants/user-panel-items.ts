export const UserPanelItems = {
  profile: 1,
  exams: 2,
  analytics: 3,
  trainings: 4,
  subscriptionList: 5,
  learningPanel: 6,
  chat: 7,
  reviews: 8,
  'passed-training': 'passed-training',
  teachers: 9,
  teacherPanel: 10,
  studentTraining: 11,
} as const;

export const UserPanelItemsRecord = Object.entries(UserPanelItems).reduce(
  (acc, [key, value]) => {
    acc[value as string | number] = key;
    return acc;
  },
  {} as Record<string | number, string>
);
