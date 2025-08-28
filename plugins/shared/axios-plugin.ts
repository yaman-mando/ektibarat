import axios, { type AxiosError } from 'axios';
import {
  webAuthPathUtil,
  webErrorPathUtil,
} from '~/main/utils/web-routes.utils';
import { ErrorsRecord } from '~/main/constants/errors.enum';
import { useGlobalStore } from '~/main/useGlobalStore';

export default defineNuxtPlugin(() => {
  const authState = useAuthState();
  const config = useRuntimeConfig();
  const globalStore = useGlobalStore();
  const toastMessage = useToastMessage();

  const $axios = axios.create({
    baseURL: config.public.apiUrl,
  });

  $axios.interceptors.request.use(
    (config) => {
      const token = authState.token.value;
      if (token) {
        // console.log(authState.rawToken.value);
        // console.log(authState.rawRefreshToken.value);
        config.headers.Authorization = token;
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
