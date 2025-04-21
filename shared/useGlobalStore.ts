import { reactive, toRefs } from 'vue';
import { GlobalTypes } from '~/shared/constants/global-types';
import type {
  HomeJsonDataModel,
  LayoutStaticDataModel,
} from '~/dev-types-helper';

type StateType = {
  globalType: GlobalTypes;
  globalTypeUser: GlobalTypes | null;
  isSchool: boolean;
  defaultActiveExam: number;
  showBlockModal: boolean;
  staticData: LayoutStaticDataModel | null;
  homeJson: HomeJsonDataModel | null;
};
const initialState: StateType = {
  globalType: GlobalTypes.kudrat,
  globalTypeUser: null,
  isSchool: false,
  defaultActiveExam: 1,
  showBlockModal: false,
  staticData: null,
  homeJson: null,
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

  const getLayoutStatic = async () => {
    const res = (await import('@/shared/constants/json/layout.json')).default;
    patchState({
      staticData: res,
    });
  };

  const getHomeStatic = async () => {
    const res = (await import('@/shared/constants/json/home.json')).default;
    patchState({
      homeJson: res,
    });
  };

  return {
    state: toRefs(readonly(state)),
    patchState,
    clearState,
    getLayoutStatic,
    getHomeStatic,
  };
};
