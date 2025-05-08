import { useGlobalStore } from '~/main/useGlobalStore';

export const useSetupStaticLocales = () => {
  const globalStore = useGlobalStore();

  onMounted(async () => {
    await globalStore.getLocalesJsonStatic();
  });

  return {
    staticLocales: globalStore.staticState.locales,
  };
};
