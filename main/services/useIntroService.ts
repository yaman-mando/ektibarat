import { reactive } from 'vue';
import { useGlobalStore } from '~/main/useGlobalStore';
import type { TrainingJsonDataModel } from '~/main/modules/shared/models/static-json-files.model';
import type { IntroJs } from 'intro.js/src/intro';

const parseValue = (val) => {
  return JSON.parse(val);
};

export const useIntroService = () => {
  //compo
  const globalStore = useGlobalStore();

  //state
  const state = reactive({
    isLoadingTourStaticData: false,
    tourStaticData: null as TrainingJsonDataModel | null,
    introInstanceState: {
      lib: null as IntroJs | null,
      isLoading: false,
    },
  });

  //hook
  onMounted(async () => {
    if (import.meta.client) {
      getTourStaticData();
      try {
        state.introInstanceState.isLoading = true;
        const module = await import(/* webpackChunkName: "intro"*/ 'intro.js');
        state.introInstanceState.lib = module.default();
        state.introInstanceState.isLoading = false;
      } catch (e) {
        console.error(e);
      } finally {
        state.introInstanceState.isLoading = false;
      }
    }
  });

  //method
  async function getTourStaticData() {
    try {
      state.isLoadingTourStaticData = true;
      state.tourStaticData = await globalStore.getTrainingJsonStatic();
      state.isLoadingTourStaticData = false;
    } catch (e) {
      throw e;
    } finally {
      state.isLoadingTourStaticData = false;
    }
  }

  //computed
  const tourConfig = computed(() => {
    if (!state.tourStaticData) return null;
    return parseValue(state.tourStaticData.tourConfig);
  });

  const learningPanelTour = computed(() => {
    if (!state.tourStaticData) return null;
    return parseValue(state.tourStaticData.learningPanelTour);
  });

  const trainingPanelTour = computed(() => {
    if (!state.tourStaticData) return null;
    return parseValue(state.tourStaticData.trainingPanelTour);
  });

  const analyticsPanelTour = computed(() => {
    if (!state.tourStaticData) return null;
    return parseValue(state.tourStaticData.analyticsPanelTour);
  });

  const isIntroLibReady = computed(() => {
    return (
      !state.introInstanceState.isLoading &&
      !state.isLoadingTourStaticData &&
      state.introInstanceState.lib &&
      state.tourStaticData
    );
  });

  return reactive({
    get tourConfig() {
      return tourConfig.value;
    },
    get learningPanelTour() {
      return learningPanelTour.value;
    },
    get trainingPanelTour() {
      return trainingPanelTour.value;
    },
    get analyticsPanelTour() {
      return analyticsPanelTour.value;
    },
    get isIntroLibReady() {
      return isIntroLibReady.value;
    },
    get introInstanceState() {
      return state.introInstanceState;
    },
  });
};
