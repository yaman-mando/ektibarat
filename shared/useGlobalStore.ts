import { reactive, toRefs } from 'vue';
import { GlobalTypes } from '~/shared/constants/global-types';

type StateType = {
  globalType: GlobalTypes;
  globalTypeUser: GlobalTypes | null;
  isSchool: boolean;
  defaultActiveExam: number;
};
const initialState: StateType = {
  globalType: GlobalTypes.kudrat,
  globalTypeUser: null,
  isSchool: false,
  defaultActiveExam: 1,
};
const state = reactive({ ...initialState });

//store
export const useGlobalStore = () => {
  const globalTypeUserCookie = useCookie('global_type_user');

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
    globalTypeUserCookie.value = state.globalTypeUser as unknown as string;
  };
  const clearState = () => {
    Object.assign(state, { ...initialState });
    globalTypeUserCookie.value = state.globalTypeUser as unknown as string;
  };

  //set cookie on init
  patchState({
    globalTypeUser: globalTypeUserCookie.value as unknown as GlobalTypes,
  });

  return {
    state: {
      ...toRefs(state),
    },
    patchState,
    clearState,
  };
};
