import { defineStore } from 'pinia';
import { GlobalTypes } from '~/shared/constants/global-types';
import type {
  ConditionJsonDataModel,
  HomeJsonDataModel,
  LayoutStaticDataModel,
} from '~/dev-types-helper';
import { CountryPhoneCodes } from '#shared/constants/country-phone-list';

type StateType = {
  globalType: GlobalTypes;
  globalTypeUser: GlobalTypes | null;
  isSchool: boolean;
  defaultActiveExam: number;
  showBlockModal: boolean;
  countryCode: string | null;
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
  const userCountryCodeCookie = useCookie('user_country_code');
  const userCountryTimestampCookie = useCookie<number>(
    'user_country_timestamp'
  );

  const state = reactive<StateType>({
    globalType: GlobalTypes.kudrat,
    globalTypeUser: globalTypeUserCookie.value ?? null,
    isSchool: false,
    defaultActiveExam: 1,
    showBlockModal: false,
    countryCode: userCountryCodeCookie.value ?? null,
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

  const getUserCountry = async () => {
    const CACHE_DURATION = 60 * 60 * 1000;

    const storedCode = userCountryCodeCookie.value;
    const lastUpdate = userCountryTimestampCookie.value;

    if (storedCode && lastUpdate && Date.now() - lastUpdate < CACHE_DURATION) {
      return storedCode;
    }

    try {
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      const data = (await response.json()) as {
        country_code: keyof typeof CountryPhoneCodes;
      };

      userCountryCodeCookie.value =
        CountryPhoneCodes[data.country_code] ?? CountryPhoneCodes.SA;
      userCountryTimestampCookie.value = Date.now();

      patchState({
        countryCode: userCountryCodeCookie.value,
      });
    } catch (error) {
      console.error('Error fetching country code:', error);
      patchState({
        countryCode: storedCode ?? CountryPhoneCodes.SA,
      });
    }
  };

  return {
    state,
    staticState,
    //actions,
    getUserCountry,
    patchState,
    clearState,
    patchStaticState,
    getLayoutStatic,
    getHomeStatic,
    getConditionStatic,
  };
});
