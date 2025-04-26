import { useAuthRepo } from '~/core/auth/data-access/services/useAuthRepo';
import type {
  AuthLoginOtpDTODataModel,
  AuthLoginProviderDTODataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import { webUserPanelTraining } from '#shared/utils/web-routes.utils';

export type SignInActionDataUiModel = {
  id: number;
  email: string | null;
  token: string;
  refreshToken: string | null;
  showWelcomeModal: boolean;
};
const signInActioData = ref<SignInActionDataUiModel | null>(null);

//store
export const useAuthStore = () => {
  const repo = useAuthRepo();
  const authState = useAuthState();
  const redirectUrlCookie = useCookie('redirectUrl');
  const isLoggedIn = computed(() => authState.status.value === 'authenticated');
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
    return webUserPanelTraining();
  };

  const notifySignInAction = (data: SignInActionDataUiModel) => {
    signInActioData.value = {
      id: data.id,
      email: data.email,
      token: data.token,
      refreshToken: data.refreshToken,
      showWelcomeModal: false,
    };
    //reset after trigger
    signInActioData.value = null;
  };

  return {
    signInActioData: readonly(signInActioData),
    notifySignInAction,
    setAuthCookie,
    loginGoogle,
    redirectUrlAfterLogin,
    isLoggedIn,
    userData,
    loginApple,
    loginOTP,
  };
};
