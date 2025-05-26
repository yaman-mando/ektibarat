import { getUuid } from '~/main/utils/shared-utils';

export const useApexChartService = () => {
  const state = reactive({
    apexLibLoading: true,
    apexComponent: null,
    isAliveApexView: true,
  });

  const initApexChart = async () => {
    try {
      if (import.meta.client) {
        state.apexLibLoading = true;
        const res = await import(
          /* webpackChunkName: "vue-apex"*/ 'vue-apexcharts'
        );
        state.apexComponent = res.default;
        state.apexLibLoading = false;
      }
    } catch (e) {
      console.error(e);
    } finally {
      state.apexLibLoading = false;
    }
  };

  return {
    state,
    initApexChart,
    apexChartTooltipId: getUuid(),
    apexChartWrapperId: getUuid(),
  };
};
