import { useGlobalStore } from '~/main/useGlobalStore';
import { ErrorsRecord } from '~/main/constants/errors.enum';
import {
  webAuthPathUtil,
  webErrorPathUtil,
} from '~/main/utils/web-routes.utils';

export default defineNuxtPlugin(() => {
  const globalStore = useGlobalStore();
  const toastMessage = useToastMessage();
  globalThis.$fetch = $fetch.create({
    async onResponseError({ response }) {
      console.error(response);
      switch (response.status) {
        case 401: {
          await navigateTo(webAuthPathUtil(), { replace: true });
          break;
        }
        case 403: {
          await navigateTo(webErrorPathUtil(), { replace: true });
          break;
        }
        case 400: {
          const errorType = response?._data?.errorType;
          if (errorType === 6) {
            globalStore.patchState({ showBlockModal: true });
          } else {
            toastMessage.showError({
              summary: ErrorsRecord[errorType],
              life: 5000,
            });
          }
          return;
        }
        default: {
          toastMessage.showError();
        }
      }
    },
  });
});
