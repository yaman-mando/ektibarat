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
  remainTrainingCountPerDay: number;
  subjectId: number;
  trainingLawWatchingCount: number;
  remainTrainingCountBeforePhoneNumber: number;
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

//subscription item
type SubscriptionsItemServiceDataModel = {
  serviceId: number;
  serviceName: string;
  serviceDisplayName: string;
  subscriptionId: number;
  serviceValue: string;
  isHasValue: boolean;
};
type SubscriptionsItemFeatureDataModel = {
  id: number;
  title: string;
  description: string | null;
  isExist: boolean;
};

export type SubscriptionsItemDataModel = {
  id: number;
  createdDate: string;
  title: string;
  description: string;
  pictureUrl: string;
  grades: number[];
  period: number;
  isRecommended: boolean;
  oldPrice: number;
  currentPrice: number;
  freeType: number;
  sort: number;
  isDailyPeriod: boolean;
  color: string | null;
  discountReason: string | null;
  status: boolean;
  features: SubscriptionsItemFeatureDataModel[];
  subscriptionsServices: SubscriptionsItemServiceDataModel[];
};
