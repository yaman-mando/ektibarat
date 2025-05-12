import { useGlobalStore } from '~/main/useGlobalStore';

export const useSetupStaticLocales = () => {
  const globalStore = useGlobalStore();

  onMounted(async () => {
    await globalStore.getLocalesJsonStatic();
  });

  return {
    staticLocales: computed(() => globalStore.staticState.locales),
  };
};
