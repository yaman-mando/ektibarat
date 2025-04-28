import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import {
  webAuthSignup,
  webUserPanelSubscriptions,
  webUserPanelTraining,
  webUserPanelTrainingWithGlobalType,
} from '~/main/utils/web-routes.utils';
import type { GlobalTypes } from '~/main/constants/global-types';

export const useRedirectService = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const trainingRedirectWithGlobalType = (globalType: GlobalTypes) => {
    if (authStore.isLoggedIn.value) {
      router.push(webUserPanelTrainingWithGlobalType(globalType));
    } else {
      router.push(webAuthSignup());
    }
  };

  const studentRedirect = () => {
    if (authStore.isLoggedIn) {
      if (authStore.userData.value?.subscriptionDate) {
        router.push(webUserPanelTraining());
      } else {
        router.push(webUserPanelSubscriptions());
      }
    } else {
      router.push(webAuthSignup());
    }
  };

  return {
    trainingRedirectWithGlobalType,
    studentRedirect,
  };
};
