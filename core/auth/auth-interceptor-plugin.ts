import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  globalThis.$fetch = $fetch.create({
    onRequest({ options, request }) {
      const req = request as string | null;
      const token = authStore.token;
      const refreshToken = authStore.refreshToken;
      if (token && !req?.includes('/refreshToken')) {
        // console.log(token);
        // console.log(refreshToken);
        options.headers.set('Authorization', `Bearer ${token}`);
      }
    },
  });
});
