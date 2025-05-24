const storageKeys = Object.freeze({
  tourState: (userId) => `tourState_${userId}`,
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
}
