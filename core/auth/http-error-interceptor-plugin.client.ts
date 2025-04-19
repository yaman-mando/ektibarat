import { useGlobalStore } from '#shared/useGlobalStore';
import { ErrorsRecord } from '#shared/constants/errors.enum';

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const globalStore = useGlobalStore();
  const toastMessage = useToastMessage();

  globalThis.$fetch = $fetch.create({
    async onResponseError({ response }) {
      console.error(response);
      switch (response.status) {
        case 401: {
          await router.push('/login');
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
          break;
        }
        default: {
          toastMessage.showError();
        }
      }
    },
  });
});
