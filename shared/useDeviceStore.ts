import { reactive, toRefs } from 'vue';

type StateType = {
  isMobileDevice: boolean;
};
const initialState: StateType = {
  isMobileDevice: false,
};
const state = reactive({ ...initialState });

//store
export const useDeviceStore = () => {
  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
  };

  return {
    state: {
      ...toRefs(state),
    },
    patchState,
  };
};
