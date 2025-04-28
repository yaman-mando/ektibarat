import type { ServiceTypesEnum } from '~/main/constants/service-types.enum';

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

//ui model
export type UserServicesStateUi = {
  [key in ServiceTypesEnum]: {
    isActive: boolean;
  };
};
