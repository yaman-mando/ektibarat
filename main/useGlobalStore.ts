import { defineStore } from 'pinia';
import { GlobalTypes } from '~/main/constants/global-types';
import type {
  AboutUsJsonDataModel,
  ConditionJsonDataModel,
  ContactUsJsonDataModel,
  HomeJsonDataModel,
  KudratJsonDataModel,
  LayoutStaticDataModel,
  LocalesJsonDataModel,
  TahselJsonDataModel,
} from '~/main/modules/shared/models/static-json-files.model';
import { CountryPhoneCodes } from '~/main/constants/country-phone-codes';

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
  kudratJson: KudratJsonDataModel | null;
  tahselJson: TahselJsonDataModel | null;
  aboutUs: AboutUsJsonDataModel | null;
  contactUs: ContactUsJsonDataModel | null;
  locales: LocalesJsonDataModel | null;
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
    kudratJson: null,
    tahselJson: null,
    aboutUs: null,
    contactUs: null,
    locales: null,
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
    const res = (await import('~/main/constants/json/layout.json')).default;
    patchStaticState({ staticData: res });
  };

  const getHomeStatic = async () => {
    const res = (await import('~/main/constants/json/home.json')).default;
    patchStaticState({ homeJson: res });
  };

  const getConditionStatic = async () => {
    const res = (await import('~/main/constants/json/conditions.json')).default;
    patchStaticState({ conditionJson: res });
    return res;
  };

  const getAboutUsStatic = async () => {
    const res = (await import('~/main/constants/json/aboutus.json')).default;
    patchStaticState({ aboutUs: res });
    return res;
  };

  const getContactUsStatic = async () => {
    const res = (await import('~/main/constants/json/contact-us.json')).default;
    patchStaticState({ contactUs: res });
    return res as ContactUsJsonDataModel;
  };

  const getKudratJsonStatic = async () => {
    const res = (await import('~/main/constants/json/kudrat.json')).default;
    patchStaticState({ kudratJson: res });
    return res;
  };

  const getTahselJsonStatic = async () => {
    const res = (await import('~/main/constants/json/tahsel.json')).default;
    patchStaticState({ tahselJson: res });
    return res;
  };

  const getLocalesJsonStatic = async () => {
    const res = (await import('~/main/constants/json/locales.json')).default;
    patchStaticState({ locales: res });
    return res as LocalesJsonDataModel;
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
    getKudratJsonStatic,
    getTahselJsonStatic,
    getUserCountry,
    patchState,
    clearState,
    patchStaticState,
    getLayoutStatic,
    getHomeStatic,
    getConditionStatic,
    getAboutUsStatic,
    getContactUsStatic,
  };
});
