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

  const getStudentRedirectUrl = () => {
    if (authStore.isLoggedIn.value) {
      if (authStore.userData.value?.subscriptionDate) {
        return webUserPanelTraining();
      } else {
        return webUserPanelSubscriptions();
      }
    } else {
      return webAuthSignup();
    }
  };
  const studentRedirect = () => {
    router.push(getStudentRedirectUrl());
  };

  return {
    trainingRedirectWithGlobalType,
    studentRedirect,
    getStudentRedirectUrl,
  };
};
