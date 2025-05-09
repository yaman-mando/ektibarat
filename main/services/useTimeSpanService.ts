import { reactive, ref } from 'vue';

export function useTimeSpanService(maxTimeVal = Infinity) {
  const state = reactive({
    maxTime: maxTimeVal,
    currentTime: 0,
  });
  const timeInterval = ref<ReturnType<typeof setInterval> | null>(null);

  function isPassedMaxTime() {
    return state.currentTime > state.maxTime;
  }

  function startTime() {
    if (!timeInterval.value) {
      timeInterval.value = setInterval(() => {
        state.currentTime++;
      }, 1000);
    }
  }

  function pauseTime() {
    if (timeInterval.value) {
      clearInterval(timeInterval.value);
    }
    timeInterval.value = null;
  }

  return {
    state,
    isPassedMaxTime,
    startTime,
    pauseTime,
  };
}
