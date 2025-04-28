import { useDeviceService } from '~/main/useDeviceService';

export default defineNuxtPlugin((nuxtApp) => {
  const deviceService = useDeviceService();
  let isMobileDevice = false;
  if (import.meta.server) {
    const ua = nuxtApp.ssrContext?.event?.req?.headers['user-agent'] || '';
    isMobileDevice = /mobile|android|iphone|ipad|phone/i.test(ua);
  }

  if (import.meta.client) {
    const ua = navigator.userAgent;
    isMobileDevice = /mobile|android|iphone|ipad|phone/i.test(ua);
  }

  deviceService.setIsMobileDevice(isMobileDevice);
});
