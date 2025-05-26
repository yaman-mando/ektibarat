import { onBeforeUnmount, ref } from 'vue';

export function useIsAliveRx() {
  const isAliveRx = ref(true);

  onBeforeUnmount(() => {
    isAliveRx.value = false;
  });

  return {
    isAliveRx,
  };
}
