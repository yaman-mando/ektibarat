import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  try {
    await authStore.tokenRefreshInterceptorHandler();
  } catch (err) {
    return navigateTo(webErrorPathUtil(), { replace: true });
  }
});
