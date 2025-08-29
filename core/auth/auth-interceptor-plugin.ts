import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { isTokenExpiredUtil } from '~/core/auth/utils/is-token-expired.util';
import type { AuthRefreshTokenDataModel } from '~/core/auth/data-access/models/auth.model';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  globalThis.$fetch = $fetch.create({
    async onRequest({ options, request }) {
      const reqUrl = request as string | null;
      const token = authStore.token;
      const refreshToken = authStore.refreshToken;

      //handle refresh
      await authStore.tokenRefreshInterceptorHandler();

      //set token in the header
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
      }
    },
  });
});
