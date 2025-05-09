import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import {
  webAuthSignup,
  webUserPanelSubscriptions,
  webUserPanelTraining,
  webUserPanelTrainingWithQuery,
} from '~/main/utils/web-routes.utils';
import type { GlobalTypes } from '~/main/constants/global-types';

export const useRedirectService = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const getTrainingRedirectWithGlobalTypeUrl = (globalType: GlobalTypes) => {
    return authStore.state.isLoggedIn
      ? webUserPanelTrainingWithQuery({ globalType })
      : webAuthSignup();
  };
  const trainingRedirectWithGlobalType = (globalType: GlobalTypes) => {
    router.push(getTrainingRedirectWithGlobalTypeUrl(globalType));
  };

  const getStudentRedirectUrl = () => {
    if (authStore.state.isLoggedIn) {
      if (authStore.state.userData?.subscriptionDate) {
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
