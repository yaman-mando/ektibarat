export type TrainingPlanInfoDataModel = {
  id: number;
  startDate: string;
  examDate: string;
  neededDegree: number;
  requiredHours: number;
};

//detail
export type TrainingPlanDetailDataModel = {
  totalPercentage: number;
  percentageRequired: number;
  percentageDone: number;
  timeRequired: number;
  timeDone: number;
  startTraining: string;
  examDate: string;
  lastWeek: {
    percentage: number;
    timeRequired: number;
    timeDone: number;
  };
  lastMonth: {
    percentage: number;
    timeRequired: number;
    timeDone: number;
  };
  recommendations: TrainingPlanRecommendationsDetailDataModel;
};

export type TrainingPlanRecommendationsDetailDataModel = {
  title: string;
  advices: string[];
};
