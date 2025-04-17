import { reactive, toRefs } from 'vue';
import type {
  CurrentSubscriptionDataModel,
  UserServicesStateUi,
} from '#shared/modules/subscriptions/data-access/subscriptions.model';
import { useSubscriptionsRepo } from '#shared/modules/subscriptions/composables/useSubscriptionsRepo';
import { useGlobalStore } from '#shared/useGlobalStore';
import type { GlobalTypes } from '#shared/constants/global-types';

type StateType = {
  lastUserSubUpdate: number;
  userCurrentSub: CurrentSubscriptionDataModel | null;
  userServicesState: UserServicesStateUi;
};

const initialState: StateType = {
  lastUserSubUpdate: 0,
  userCurrentSub: null,
  userServicesState: {
    TRAININGBYCATEGORY: { isActive: false },
    TAKFELATUSAGE: { isActive: false },
    SHOWSOLVESOLUATION: { isActive: false },
    ROWNQUESTIONPRACTICE: { isActive: false },
    LEVELQUESTIONPRACTICE: { isActive: false },
    HELPINPRACTICE: { isActive: false },
    FULLEXAM: { isActive: false },
    FAVORITEUSAGE: { isActive: false },
    EXAMBYCATEGORY: { isActive: false },
    BANKUSAGE: { isActive: false },
    ANALAZENUMBERCATEGORY: { isActive: false },
    ANALAZEDEGRE: { isActive: false },
  },
};
const state = reactive({ ...initialState });

//store
export const useSubscriptionsStore = () => {
  const repo = useSubscriptionsRepo();

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
  };
  const clearState = () => {
    Object.assign(state, { ...initialState });
  };

  const getCurrentSub = async (grade: GlobalTypes) => {
    const res = await repo.getCurrentSubs({
      grade,
    });
    patchState({ userCurrentSub: res });
    return res;
  };

  return {
    ...toRefs(state),
    patchState,
    clearState,
    getCurrentSub,
  };
};
