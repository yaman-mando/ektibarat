import { reactive, toRefs } from 'vue';
import { GlobalTypes } from '~/shared/constants/global-types';

type StateType = {
  globalType: GlobalTypes;
  globalTypeUser: GlobalTypes;
};
const initialState: StateType = {
  globalType: GlobalTypes.kudrat,
  globalTypeUser: GlobalTypes.kudrat,
};
const state = reactive({ ...initialState });

//store
export const useGlobalStore = () => {
  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
  };
  const clearState = () => {
    Object.assign(state, { ...initialState });
  };
  return {
    ...toRefs(state),
    patchState,
    clearState,
  };
};
