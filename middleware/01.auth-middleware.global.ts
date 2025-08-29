import { AuthTokenCookieNameEnum } from '~/core/auth/constants/auth-token-cookie-name.enum';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { webHomePathUtil } from '~/main/utils/web-routes.utils';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const ekTokenExpire = useCookie(AuthTokenCookieNameEnum.tokenExpireDate);
  const ekRefreshToken = useCookie(AuthTokenCookieNameEnum.refreshToken);
  const authStore = useAuthStore();

  if (
    ekTokenExpire.value &&
    new Date(ekTokenExpire.value) <= new Date() &&
    import.meta.server
  ) {
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
