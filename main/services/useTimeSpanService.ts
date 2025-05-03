import { ref } from 'vue';

export function useTimeSpanService(maxTimeVal = Infinity) {
  const maxTime = ref(maxTimeVal);
  const currentTime = ref(0);
  const timeInterval = ref<ReturnType<typeof setInterval> | null>(null);

  function isPassedMaxTime() {
    return currentTime.value > maxTime.value;
  }

  function startTime() {
    if (!timeInterval.value) {
      timeInterval.value = setInterval(() => {
        currentTime.value++;
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
    maxTime,
    currentTime,
    isPassedMaxTime,
    startTime,
    pauseTime,
  };
}
