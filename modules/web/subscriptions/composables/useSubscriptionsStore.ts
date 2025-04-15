import { reactive, toRefs } from 'vue';
import type { CurrentSubscriptionDataModel } from '~/modules/web/subscriptions/data-access/subscriptions.model';
import { useSubscriptionsRepo } from '~/modules/web/subscriptions/composables/useSubscriptionsRepo';
import { useGlobalStore } from '#shared/useGlobalStore';

type StateType = {
  lastUserSubUpdate: number;
  userCurrentSub: CurrentSubscriptionDataModel | null;
};
const initialState: StateType = {
  lastUserSubUpdate: 0,
  userCurrentSub: null,
};
const state = reactive({ ...initialState });

//store
export const useSubscriptionsStore = () => {
  const repo = useSubscriptionsRepo();
  const globalStore = useGlobalStore();

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
  };
  const clearState = () => {
    Object.assign(state, { ...initialState });
  };

  const getCurrentSub = async () => {
    const res = await repo.getCurrentSubs({
      grade: globalStore.globalTypeUser.value,
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
