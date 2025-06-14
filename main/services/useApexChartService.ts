import { getUuid } from '~/main/utils/shared-utils';

export const useApexChartService = () => {
  const apexComponent = shallowRef<null | any>(null);
  const state = reactive({
    apexLibLoading: true,
    isAliveApexView: true,
  });

  const initApexChart = async () => {
    try {
      if (import.meta.client) {
        state.apexLibLoading = true;
        const res = await import('vue3-apexcharts');
        apexComponent.value = res.default;
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
    apexComponent,
    initApexChart,
    apexChartTooltipId: getUuid(),
    apexChartWrapperId: getUuid(),
  };
};
