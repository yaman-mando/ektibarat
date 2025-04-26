import { defineStore } from 'pinia';
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

type StaticStateType = {
  staticData: LayoutStaticDataModel | null;
  homeJson: HomeJsonDataModel | null;
  conditionJson: ConditionJsonDataModel | null;
};

export const useGlobalStore = defineStore('global', () => {
  const globalTypeUserCookie = useCookie<GlobalTypes | null>(
    'global_type_user',
    {
      maxAge: undefined, //clear on close tab
    }
  );

  const state = reactive<StateType>({
    globalType: GlobalTypes.kudrat,
    globalTypeUser: globalTypeUserCookie.value ?? null,
    isSchool: false,
    defaultActiveExam: 1,
    showBlockModal: false,
  });

  const staticState = reactive<StaticStateType>({
    staticData: null,
    homeJson: null,
    conditionJson: null,
  });

  const patchState = (newState: Partial<StateType>) => {
    Object.assign(state, newState);
    globalTypeUserCookie.value = state.globalTypeUser
      ? Number(state.globalTypeUser)
      : null;
  };

  const clearState = () => {
    Object.assign(state, {
      globalType: GlobalTypes.kudrat,
      globalTypeUser: null,
      isSchool: false,
      defaultActiveExam: 1,
      showBlockModal: false,
    });
    globalTypeUserCookie.value = null;
  };

  const patchStaticState = (newState: Partial<StaticStateType>) => {
    Object.assign(staticState, newState);
  };

  const getLayoutStatic = async () => {
    const res = (await import('@/shared/constants/json/layout.json')).default;
    patchStaticState({ staticData: res });
  };

  const getHomeStatic = async () => {
    const res = (await import('@/shared/constants/json/home.json')).default;
    patchStaticState({ homeJson: res });
  };

  const getConditionStatic = async () => {
    const res = (await import('@/shared/constants/json/conditions.json'))
      .default;
    patchStaticState({ conditionJson: res });
    return res;
  };

  return {
    state,
    staticState,
    //actions,
    patchState,
    clearState,
    patchStaticState,
    getLayoutStatic,
    getHomeStatic,
    getConditionStatic,
  };
});
