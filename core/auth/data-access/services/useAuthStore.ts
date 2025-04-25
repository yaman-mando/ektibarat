import { useAuthRepo } from '~/core/auth/data-access/services/useAuthRepo';
import type {
  AuthLoginGoogleDataModel,
  AuthLoginGoogleDTODataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import { webUserPanelTraining } from '#shared/utils/web-routes.utils';

const googleSignInData = ref<AuthLoginGoogleDataModel | null>(null);

//store
export const useAuthStore = () => {
  const repo = useAuthRepo();
  const authState = useAuthState();
  const redirectUrlCookie = useCookie('redirectUrl');
  const isLoggedIn = computed(() => authState.status.value === 'authenticated');
  const userData = computed(
    () => authState.data.value as UserInfoDataModel | null
  );

  const loginGoogle = (model: AuthLoginGoogleDTODataModel) => {
    return repo.loginGoogle(model);
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

  const notifyGoogleSignIn = (data: AuthLoginGoogleDataModel) => {
    googleSignInData.value = data;
    //reset after trigger
    googleSignInData.value = null;
  };

  return {
    googleSignInData: readonly(googleSignInData),
    notifyGoogleSignIn,
    setAuthCookie,
    loginGoogle,
    redirectUrlAfterLogin,
    isLoggedIn,
    userData,
  };
};
