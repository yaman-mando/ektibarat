const isMobile = ref(false);

//store
export const useDeviceService = () => {
  const setIsMobileDevice = (val: boolean) => {
    isMobile.value = val;
  };
  const isMobileDevice = computed(() => isMobile.value);
  const isDesktopDevice = computed(() => !isMobile.value);

  return {
    isMobileDevice,
    isDesktopDevice,
    setIsMobileDevice,
  };
};
