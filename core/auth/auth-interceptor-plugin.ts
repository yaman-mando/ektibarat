import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  globalThis.$fetch = $fetch.create({
    async onRequest({ options, request }) {
      // const reqUrl = request as string | null;

      //handle refresh
      if (import.meta.client) {
        await authStore.tokenRefreshInterceptorHandler();
      }

      //set token in the header
      if (authStore.getToken()) {
        options.headers.set('Authorization', `Bearer ${authStore.getToken()}`);
      }
    },
  });
});
