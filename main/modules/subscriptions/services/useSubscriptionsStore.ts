import { reactive, toRefs } from 'vue';
import type {
  CurrentSubscriptionDataModel,
  UserServicesStateUi,
} from '~/main/modules/subscriptions/data-access/subscriptions.model';
import { useSubscriptionsRepo } from '~/main/modules/subscriptions/services/useSubscriptionsRepo';
import type { GlobalTypes } from '~/main/constants/global-types';
import { createPatchState } from '~/main/utils/patch-state.util';

type StateType = {
  lastUserSubUpdate: number;
  userCurrentSubVal: CurrentSubscriptionDataModel | null;
  userServicesState: UserServicesStateUi;
};

//store
export const useSubscriptionsStore = defineStore('subscriptions-store', () => {
  const repo = useSubscriptionsRepo();

  const initialState: StateType = {
    lastUserSubUpdate: 0,
    userCurrentSubVal: null,
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

  const patchState = createPatchState(state);

  const getCurrentSub = async (grade: GlobalTypes) => {
    const res = await repo.getCurrentSubs({
      grade,
    });
    patchState({ userCurrentSubVal: res, lastUserSubUpdate: Date.now() });
    return res;
  };

  const getAll = async (model: { grade: GlobalTypes }) => {
    return await repo.getAll(model);
  };

  return {
    patchState,
    state: toRefs(readonly(state)),
    //actions
    getCurrentSub,
    getAll,
  };
});
