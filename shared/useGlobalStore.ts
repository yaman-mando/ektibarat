import { reactive, toRefs } from 'vue';
import { GlobalTypes } from '~/shared/constants/global-types';

type StateType = {
  globalType: GlobalTypes;
  globalTypeUser: GlobalTypes;
  isSchool: boolean;
  defaultActiveExam: number;
};
const initialState: StateType = {
  globalType: GlobalTypes.kudrat,
  globalTypeUser: GlobalTypes.kudrat,
  isSchool: false,
  defaultActiveExam: 1,
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
    state: {
      ...toRefs(state),
    },
    patchState,
    clearState,
  };
};
