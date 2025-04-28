import { useAuthRepo } from '~/core/auth/data-access/services/useAuthRepo';
import type {
  AuthLoginOtpDTODataModel,
  AuthLoginProviderDTODataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import {
  webGeneralSelectionPathUtil,
  webUserPanelTraining,
} from '~/main/utils/web-routes.utils';
import { useGlobalStore } from '~/main/useGlobalStore';

//store
export const useAuthStore = () => {
  const globalStore = useGlobalStore();
  const repo = useAuthRepo();
  const authState = useAuthState();
  const redirectUrlCookie = useCookie('redirectUrl');
  const isLoggedIn = computed(() => authState.status.value === 'authenticated');
  const isLoadingProfile = computed(() => authState.loading.value);
  const userData = computed(
    () => authState.data.value as UserInfoDataModel | null
  );

  const loginGoogle = (model: AuthLoginProviderDTODataModel) => {
    return repo.loginGoogle(model);
  };

  const loginApple = (model: AuthLoginProviderDTODataModel) => {
    return repo.loginApple(model);
  };

  const loginOTP = (model: AuthLoginOtpDTODataModel) => {
    return repo.loginOTP(model);
  };

  const setAuthCookie = (model: { token: string; refreshToken: string }) => {
    authState.rawToken.value = model.token;
    authState.rawRefreshToken.value = model.refreshToken;
  };

  const redirectUrlAfterLogin = () => {
    const url = redirectUrlCookie.value;
    if (url) {
      redirectUrlCookie.value = null;
      return url;
    }
    return globalStore.state.globalTypeUser
      ? webUserPanelTraining()
      : webGeneralSelectionPathUtil();
  };

  return {
    setAuthCookie,
    loginGoogle,
    redirectUrlAfterLogin,
    isLoggedIn,
    userData,
    loginApple,
    loginOTP,
    isLoadingProfile,
  };
};
