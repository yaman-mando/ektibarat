import { surveysEnum } from '@/main/constants/surveys-enum';
import { useSubscriptionsStore } from '~/main/modules/subscriptions/services/useSubscriptionsStore';
import { useStore } from 'vuex';
import { GlobalTypes } from '~/main/constants/global-types';

export const useSurveyNavigation = () => {
  const { data, status } = useAuth();
  const store = useStore();
  const subscriptionsStore = useSubscriptionsStore();

  const checkHasSurveysAndGetSurveys = (currentRoute) => {
    return (
      surveysEnum.find((survey) => {
        const samePath = survey.path === currentRoute.name;
        if (!samePath) return false;

        if (!survey.fullPath) return true;

        const currentPathDecoded = decodeURIComponent(currentRoute.path || '');
        const fullPathDecoded = decodeURIComponent(survey.fullPath);
        const currentFullPathDecoded = decodeURIComponent(
          currentRoute.fullPath || ''
        );

        return (
          fullPathDecoded === currentPathDecoded ||
          fullPathDecoded === currentFullPathDecoded
        );
      }) || false
    );
  };

  const loadSurveysIfNeeded = async () => {
    if (!sessionStorage.getItem('surveys')) {
      await store.dispatch('callSettingForSurveys');
    }
  };

  const getSurveysSettings = () => {
    const raw = sessionStorage.getItem('surveys');
    return raw ? JSON.parse(raw) : null;
  };

  const getFormIdFromArray = async (name, list) => {
    await subscriptionsStore.getCurrentSub(GlobalTypes.kudrat);
    const countField =
      name === 'trainings' ? 'totalTrainingsCount' : 'totalExamsCount';
    const count = subscriptionsStore.state.userCurrentSubVal
      ? subscriptionsStore.state.userCurrentSubVal[countField]
      : 0;
    const match = list.find((sur) => sur.count == count && sur.id);
    return match ? { id: match.id, data: match } : { id: null, data: null };
  };

  const alreadySubmitted = (formId) => {
    const completedIds = JSON.parse(
      localStorage.getItem('completedSurveyIds') || '[]'
    );
    return completedIds.includes(formId);
  };

  const handleSurveyNavigation = async (to) => {
    try {
      store.commit('SET_SURVEYS_DATA', null);
      store.commit('SET_SELECTED_SURVEYS', null);

      await loadSurveysIfNeeded();

      const surveysData = checkHasSurveysAndGetSurveys(to);
      if (!surveysData) return navigateTo({ path: to.path });

      const surveysSetting = getSurveysSettings();
      if (!surveysSetting || !surveysSetting[surveysData.name])
        return navigateTo({ path: to.path });

      const config = surveysSetting[surveysData.name];
      let formId = null;
      let match = null;

      if (Array.isArray(config)) {
        if (
          ['trainings', 'exams'].includes(surveysData.name) &&
          status.value === 'authenticated'
        ) {
          const result = await getFormIdFromArray(surveysData.name, config);
          formId = result.id;
          match = result.data;
        }
      } else {
        match = config;
        formId = config.id;
      }

      if (!formId) return navigateTo({ path: to.path });

      if (status.value !== 'authenticated' && alreadySubmitted(formId)) {
        return navigateTo({ path: to.path });
      }

      await store.dispatch('surveysRequest', formId);
      store.commit('SET_SELECTED_SURVEYS', match);
      return navigateTo({ path: to.path });
    } catch (e) {
      console.log('SURVEYS-MODAL: ', e);
    }
  };

  return {
    handleSurveyNavigation,
  };
};
