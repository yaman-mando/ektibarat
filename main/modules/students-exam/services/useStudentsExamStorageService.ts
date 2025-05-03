import { storageKeys } from '~/main/utils/shared-utils';

export type TrainingStorageState = {
  countOfTryRemoveAnswer: number;
  removedAnswerIdList: number[];
  countOfTryHelpAnswer: number;
  questionsState: {
    [key: string]: TrainingStorageQuestionState;
  };
};

export type TrainingStorageQuestionState = {
  isHelpAnswer?: boolean;
  isRemoveAnswerUsed?: boolean;
  showLawsUsed?: boolean;
  isShowLaws?: boolean;
};

export const useStudentsExamStorageService = () => {
  const getDefaultTrainingState = (): TrainingStorageState => {
    return {
      removedAnswerIdList: [],
      countOfTryRemoveAnswer: 0,
      countOfTryHelpAnswer: 0,
      questionsState: {},
    };
  };

  const getTrainingState = (examId: string) => {
    const result = localStorage.getItem(storageKeys.trainingState(examId));
    if (result) {
      return JSON.parse(result);
    }
    return getDefaultTrainingState();
  };

  const setTrainingState = (
    examId: string,
    state: Partial<TrainingStorageState>
  ) => {
    const currentState = getTrainingState(examId) ?? {};
    const newState = { ...currentState, ...state };
    localStorage.setItem(
      storageKeys.trainingState(examId),
      JSON.stringify(newState)
    );
  };

  const setTrainingQuestionState = (
    examId: string,
    questionId: string,
    state: Partial<TrainingStorageQuestionState>
  ) => {
    const trainingState = getTrainingState(examId);
    const currentQuestionState = trainingState.questionsState[questionId]
      ? trainingState.questionsState[questionId]
      : {};
    trainingState.questionsState[questionId] = {
      ...currentQuestionState,
      ...state,
    };
    localStorage.setItem(
      storageKeys.trainingState(examId),
      JSON.stringify(trainingState)
    );
  };

  return {
    getDefaultTrainingState,
    getTrainingState,
    setTrainingQuestionState,
    setTrainingState,
  };
};
