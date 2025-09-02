const storageKeys = Object.freeze({
  tourState: (userId) => `tourState_${userId}`,
  trainingTotalQuestionCount: 'trainingTotalQuestionCount',
  trainingCompletedQuestionCount: 'trainingCompletedQuestionCount',
  trainingFilters: 'trainingFilters',
});

type TourSateModel = {
  learningPanel: {
    isShown: boolean;
  };
  trainingPanel: {
    isShown: boolean;
  };
  analyticsPanel: {
    isShown: boolean;
  };
};

/**@type {TourSateModel}*/
const defaultTourState = {
  learningPanel: {
    isShown: false,
  },
  trainingPanel: {
    isShown: false,
  },
  analyticsPanel: {
    isShown: false,
  },
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppLocalStorage {
  /**
   * @param userId {number}
   * @param tourState {Partial<TourSateModel>}
   * */
  static setIntroState(userId, tourState) {
    const currentState = this.getTourState(userId);
    localStorage.setItem(
      storageKeys.tourState(userId),
      JSON.stringify({ ...currentState, ...tourState })
    );
  }

  /**
   * @param userId {number}
   * @return {TourSateModel}
   * */
  static getTourState(userId) {
    const result = localStorage.getItem(storageKeys.tourState(userId));
    if (result) {
      return { ...defaultTourState, ...JSON.parse(result) };
    } else {
      return defaultTourState;
    }
  }

  //total count
  static getTrainingTotalQuestionCount(): number | null {
    const result = localStorage.getItem(storageKeys.trainingTotalQuestionCount);
    if (result) {
      return JSON.parse(result);
    } else {
      return null;
    }
  }

  static setTrainingTotalQuestionCount(count: number) {
    localStorage.setItem(
      storageKeys.trainingTotalQuestionCount,
      JSON.stringify(count)
    );
  }

  static removeTrainingTotalQuestionCount() {
    localStorage.removeItem(storageKeys.trainingTotalQuestionCount);
  }

  //completed
  static getTrainingCompletedQuestionCount(): number | null {
    const result = localStorage.getItem(
      storageKeys.trainingCompletedQuestionCount
    );
    if (result) {
      return JSON.parse(result);
    } else {
      return null;
    }
  }

  static setTrainingCompletedQuestionCount(count: number) {
    localStorage.setItem(
      storageKeys.trainingCompletedQuestionCount,
      JSON.stringify(count)
    );
  }

  static removeTrainingCompletedQuestionCount() {
    localStorage.removeItem(storageKeys.trainingCompletedQuestionCount);
  }

  //training filters
  static getTrainingFilters(): any | null {
    const result = localStorage.getItem(storageKeys.trainingFilters);
    if (result) {
      return JSON.parse(result);
    } else {
      return null;
    }
  }

  static setTrainingFilters(filters: any) {
    localStorage.setItem(storageKeys.trainingFilters, JSON.stringify(filters));
  }

  static removeTrainingFilters() {
    localStorage.removeItem(storageKeys.trainingFilters);
  }
}
