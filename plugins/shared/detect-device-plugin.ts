import { useDeviceStore } from '#shared/useDeviceStore';

export default defineNuxtPlugin((nuxtApp) => {
  const deviceStore = useDeviceStore();
  let isMobileDevice = false;
  if (import.meta.server) {
    const ua = nuxtApp.ssrContext?.event?.req?.headers['user-agent'] || '';
    isMobileDevice = /mobile|android|iphone|ipad|phone/i.test(ua);
  }

  if (import.meta.client) {
    const ua = navigator.userAgent;
    isMobileDevice = /mobile|android|iphone|ipad|phone/i.test(ua);
  }

  deviceStore.patchState({
    isMobileDevice,
  });
});
