import { AuthTokenCookieNameEnum } from '~/core/auth/constants/auth-token-cookie-name.enum';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { webHomePathUtil } from '~/main/utils/web-routes.utils';
import {
  isTokenExpiredUtil,
  tokenThresholdSeconds,
} from '~/core/auth/utils/is-token-expired.util';
import { addSeconds } from 'date-fns';

const testModeApplied = false; // test

export default defineNuxtRouteMiddleware(async (to, from) => {
  const ekTokenExpire = useCookie(AuthTokenCookieNameEnum.tokenExpireDate);
  const ekRefreshToken = useCookie(AuthTokenCookieNameEnum.refreshToken);
  const authStore = useAuthStore();

  // test for force expire in the 10s (only first time)
  // if (!testModeApplied && ekTokenExpire.value) {
  //   ekTokenExpire.value = addSeconds(
  //     new Date(),
  //     tokenThresholdSeconds + 10
  //   ).toISOString();
  //   testModeApplied = true;
  // }

  if (isTokenExpiredUtil(ekTokenExpire.value)) {
    try {
      const $axios = useNuxtApp().$axios;
      const res = await $axios.post('/identity/refreshToken', {
        refreshToken: ekRefreshToken.value,
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
