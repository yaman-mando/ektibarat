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

  const getTrainingRedirectWithGlobalTypeUrl = (globalType: GlobalTypes) => {
    return authStore.isLoggedIn.value
      ? webUserPanelTrainingWithGlobalType(globalType)
      : webAuthSignup();
  };
  const trainingRedirectWithGlobalType = (globalType: GlobalTypes) => {
    router.push(getTrainingRedirectWithGlobalTypeUrl(globalType));
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
    getTrainingRedirectWithGlobalTypeUrl,
    trainingRedirectWithGlobalType,
    studentRedirect,
    getStudentRedirectUrl,
  };
};
