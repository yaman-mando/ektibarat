import axios, { type AxiosError } from 'axios';
import {
  webAuthPathUtil,
  webErrorPathUtil,
} from '~/main/utils/web-routes.utils';
import { ErrorsRecord } from '~/main/constants/errors.enum';
import { useGlobalStore } from '~/main/useGlobalStore';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const globalStore = useGlobalStore();
  const toastMessage = useToastMessage();

  const $axios = axios.create({
    baseURL: config.public.apiUrl,
  });

  $axios.interceptors.request.use(
    async (config) => {
      //handle refresh
      if (import.meta.client) {
        await authStore.tokenRefreshInterceptorHandler();
      }

      //set token in the headers
      if (authStore.getToken()) {
        config.headers.Authorization = `Bearer ${authStore.getToken()}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  $axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.error(error);
      if (error.response) {
        const response = error as AxiosError<{ errorType?: number }>;
        switch (response.response?.status) {
          case 401: {
            await navigateTo(webAuthPathUtil(), { replace: true });
            break;
          }
          case 403: {
            await navigateTo(webErrorPathUtil(), { replace: true });
            break;
          }
          case 400: {
            const errorType = response?.response?.data?.errorType;
            if (errorType === 6) {
              globalStore.patchState({ showBlockModal: true });
            } else {
              toastMessage.showError({
                summary: ErrorsRecord[errorType!],
                life: 5000,
              });
            }
            return;
          }
          default: {
            toastMessage.showError();
          }
        }
      }
    }
  );

  return {
    provide: {
      axios: $axios,
    },
  };
});
