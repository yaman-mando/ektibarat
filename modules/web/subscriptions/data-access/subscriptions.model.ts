export type CurrentSubscriptionDataModel = {
  id: number;
  color: string;
  title: string;
  freeType: number;
  endDate: string;
  lastUpdateDate: string;
  remainExamsCount: number;
  remainTrainingCount: number;
  subjectId: number;
  subscriptionsServices: {
    serviceId: number;
    serviceName: string;
    serviceDisplayName: string;
  }[];
};
