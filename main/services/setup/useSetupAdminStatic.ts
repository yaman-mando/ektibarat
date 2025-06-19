import { useGlobalStore } from '~/main/useGlobalStore';

export const useSetupAdminStatic = () => {
  const globalStore = useGlobalStore();

  onMounted(async () => {
    await globalStore.getStaticJsonStatic();
  });

  return {
    StaticJson: computed(() => globalStore.staticState.static!),
  };
};
