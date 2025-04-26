import { reactive, toRefs } from 'vue';
import { GlobalTypes } from '~/shared/constants/global-types';
import type {
  ConditionJsonDataModel,
  HomeJsonDataModel,
  LayoutStaticDataModel,
} from '~/dev-types-helper';

type StateType = {
  globalType: GlobalTypes;
  globalTypeUser: GlobalTypes | null;
  isSchool: boolean;
  defaultActiveExam: number;
  showBlockModal: boolean;
};

const initialState: StateType = {
  globalType: GlobalTypes.kudrat,
  globalTypeUser: null,
  isSchool: false,
  defaultActiveExam: 1,
  showBlockModal: false,
};
const state = reactive({ ...initialState });

type StaticStateType = {
  staticData: LayoutStaticDataModel | null;
  homeJson: HomeJsonDataModel | null;
  conditionJson: ConditionJsonDataModel | null;
};
const staticState = reactive<StaticStateType>({
  conditionJson: null,
  staticData: null,
  homeJson: null,
});
//store
export const useGlobalStore = () => {
  const globalTypeUserCookie = useCookie('global_type_user');

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
    globalTypeUserCookie.value = state.globalTypeUser as unknown as string;
  };
  const clearState = () => {
    Object.assign(state, {
      ...initialState,
    });
    globalTypeUserCookie.value = state.globalTypeUser as unknown as string;
  };

  //set cookie on init
  patchState({
    globalTypeUser: globalTypeUserCookie.value as unknown as GlobalTypes,
  });

  const patchStaticState = (newState: Partial<StaticStateType>) => {
    Object.assign(staticState, newState);
  };

  const getLayoutStatic = async () => {
    const res = (await import('@/shared/constants/json/layout.json')).default;
    patchStaticState({
      staticData: res,
    });
  };

  const getHomeStatic = async () => {
    const res = (await import('@/shared/constants/json/home.json')).default;
    patchStaticState({
      homeJson: res,
    });
  };

  const getConditionStatic = async () => {
    const res = (await import('@/shared/constants/json/conditions.json'))
      .default;
    patchStaticState({
      conditionJson: res,
    });
    return res;
  };

  return {
    state: toRefs(readonly(state)),
    staticState: toRefs(readonly(staticState)),
    patchState,
    clearState,
    getLayoutStatic,
    getHomeStatic,
    getConditionStatic,
  };
};
