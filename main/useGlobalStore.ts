import { defineStore } from 'pinia';
import { GlobalTypes } from '~/main/constants/global-types';
import type {
  AboutUsJsonDataModel,
  ConditionJsonDataModel,
  ContactUsJsonDataModel,
  File1JsonDataModel,
  HomeJsonDataModel,
  KudratJsonDataModel,
  LayoutStaticDataModel,
  LocalesJsonDataModel,
  PartnerShipConditionsJsonDataModel,
  PartnerShipJsonDataModel,
  PricesJsonDataModel,
  StaticJsonDataModel,
  TahselJsonDataModel,
  TrainingJsonDataModel,
} from '~/main/modules/shared/models/static-json-files.model';
import { CountryPhoneCodes } from '~/main/constants/country-phone-codes';
import { createPatchState } from '~/main/utils/patch-state.util';

type StateType = {
  globalTypeValue: GlobalTypes;
  globalTypeUserValue: GlobalTypes | null;
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
  static: StaticJsonDataModel | null;
  partnerShipConditionsJson: PartnerShipConditionsJsonDataModel | null;
  partnerShipJson: PartnerShipJsonDataModel | null;
  prices: PricesJsonDataModel | null;
  trainingJson: TrainingJsonDataModel | null;
  file1Json: File1JsonDataModel | null;
};

export const useGlobalStore = defineStore('global', () => {
  const globalTypeUserCookie = useCookie<GlobalTypes | null>(
    'global_type_user',
    {
      default:()=>GlobalTypes.kudrat,
      maxAge: undefined, //clear on close tab
    }
  );
  const userCountryCodeCookie = useCookie('user_country_code');
  const userCountryTimestampCookie = useCookie<number>(
    'user_country_timestamp'
  );

  const state = reactive<StateType>({
    globalTypeValue: GlobalTypes.kudrat,
    globalTypeUserValue: globalTypeUserCookie.value,
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
    static: null,
    partnerShipConditionsJson: null,
    partnerShipJson: null,
    prices: null,
    trainingJson: null,
    file1Json: null,
  });

  const patchStateUtil = createPatchState(state);

  const patchState = (newState: Partial<StateType>) => {
    patchStateUtil({ ...state, ...newState });
    globalTypeUserCookie.value = state.globalTypeUserValue
      ? Number(state.globalTypeUserValue)
      : null;
  };

  const clearState = () => {
    patchStateUtil({
      ...state,
      globalTypeValue: GlobalTypes.kudrat,
      globalTypeUserValue: null,
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
    return res as LayoutStaticDataModel;
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

  const getStaticJsonStatic = async () => {
    const res = (await import('~/main/constants/json/static.json')).default;
    patchStaticState({ static: res });
    return res as StaticJsonDataModel;
  };

  const getPartnerShipConditionsJsonStatic = async () => {
    const res = (
      await import('~/main/constants/json/partnership-conditions.json')
    ).default;
    patchStaticState({ partnerShipConditionsJson: res });
    return res as PartnerShipConditionsJsonDataModel;
  };

  const getPartnerShipJsonStatic = async () => {
    const res = (await import('~/main/constants/json/partnerships.json'))
      .default;
    patchStaticState({ partnerShipJson: res });
    return res as PartnerShipJsonDataModel;
  };

  const getPricesJsonStatic = async () => {
    const res = (await import('~/main/constants/json/prices.json')).default;
    patchStaticState({ prices: res });
    return res as PricesJsonDataModel;
  };

  const getTrainingJsonStatic = async () => {
    const res = (await import('~/main/constants/json/trainings.json')).default;
    patchStaticState({ trainingJson: res });
    return res as TrainingJsonDataModel;
  };

  const getFile1JsonStatic = async () => {
    const res = (await import('~/main/constants/json/file1.json')).default;
    patchStaticState({ file1Json: res });
    return res as File1JsonDataModel;
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
    getLocalesJsonStatic,
    getStaticJsonStatic,
    getPartnerShipConditionsJsonStatic,
    getPartnerShipJsonStatic,
    getPricesJsonStatic,
    getTrainingJsonStatic,
    getFile1JsonStatic,
  };
});
