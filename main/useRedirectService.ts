import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import {
  webAuthSignup,
  webUserPanelSubscriptions,
  webUserPanelTraining,
  webUserPanelTrainingWithQuery,
  webUserSteps,
  webUserTrainWithUs,
} from '~/main/utils/web-routes.utils';
import type { GlobalTypes } from '~/main/constants/global-types';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { adminRootPathUtil } from '~/main/utils/admin-routes.utils';
import { UserPlanSubscribedEnum } from '~/core/auth/constants/user-plan-subscribed.enum';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';

export const useRedirectService = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const redirectUrlCookie = useCookie('redirectUrl');

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

  const redirectUrlAfterLogin = (userDate: UserInfoDataModel | null) => {
    const url = redirectUrlCookie.value;
    if (url) {
      redirectUrlCookie.value = null;
      return url;
    }

    if (userDate?.role == UserRoles.admin) {
      return adminRootPathUtil();
    }

    if (userDate?.planSubscribed === UserPlanSubscribedEnum.Subscribed) {
      return webUserSteps();
    }

    return webUserTrainWithUs();

    // return globalStore.state.globalTypeUserValue
    //   ? webUserPanelTraining()
    //   : webGeneralSelectionPathUtil();
  };

  return {
    getTrainingRedirectWithGlobalTypeUrl,
    trainingRedirectWithGlobalType,
    studentRedirect,
    getStudentRedirectUrl,
    redirectUrlAfterLogin,
  };
};
