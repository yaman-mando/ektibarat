import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { webHomePathUtil } from '~/main/utils/web-routes.utils';
import {
  isTokenExpiredUtil,
  tokenThresholdSeconds,
} from '~/core/auth/utils/is-token-expired.util';
import { addSeconds } from 'date-fns';

const testModeApplied = false; // test

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // test for force expire in the 10s (only first time)
  // if (!testModeApplied && ekTokenExpire.value) {
  //   ekTokenExpire.value = addSeconds(
  //     new Date(),
  //     tokenThresholdSeconds + 10
  //   ).toISOString();
  //   testModeApplied = true;
  // }

  if (isTokenExpiredUtil(authStore.tokenExpire) && import.meta.server) {
    try {
      const $axios = useNuxtApp().$axios;
      const res = await $axios.post('/identity/refreshToken', {
        refreshToken: authStore.refreshToken,
      });

      authStore.setAuthCookie({
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        tokenExpireDate: res.data.tokenExpireDate,
      });
    } catch (err) {
      authStore.clearAuthCookie();
      return navigateTo(webHomePathUtil(), { replace: true });
    }
  }
});
