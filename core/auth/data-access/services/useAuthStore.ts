import { useAuthRepo } from '~/core/auth/data-access/services/useAuthRepo';
import type {
  AuthLoginGoogleDTODataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import { webUserPanelTraining } from '#shared/utils/web-routes.utils';

//store
export const useAuthStore = () => {
  const repo = useAuthRepo();
  const authState = useAuthState();
  const redirectUrlCookie = useCookie('redirectUrl');
  const isLoggedIn = computed(() => authState.status.value === 'authenticated');
  const userData = computed(
    () => authState.data.value as UserInfoDataModel | null
  );

  const loginGoogle = async (model: AuthLoginGoogleDTODataModel) => {
    return await repo.loginGoogle(model);
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
    return webUserPanelTraining();
  };

  return {
    setAuthCookie,
    loginGoogle,
    redirectUrlAfterLogin,
    isLoggedIn,
    userData,
  };
};
