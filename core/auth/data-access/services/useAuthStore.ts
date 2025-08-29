import { useAuthRepo } from '~/core/auth/data-access/services/useAuthRepo';
import type {
  AuthLoginOtpDTODataModel,
  AuthLoginProviderDTODataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import { useGlobalStore } from '~/main/useGlobalStore';
import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { AuthTokenCookieNameEnum } from '~/core/auth/constants/auth-token-cookie-name.enum';
import { IS_PRODUCTION_APP } from '~/main/utils/shared-utils';
import { addSeconds } from 'date-fns';

//store
export const useAuthStore = defineStore('auth-store', () => {
  const ekToken = useCookie(AuthTokenCookieNameEnum.token);
  const ekRefreshToken = useCookie(AuthTokenCookieNameEnum.refreshToken, {
    maxAge: 60 * 60 * 24 * 30 * 6, // 6 months
    httpOnly: false,
    sameSite: 'lax',
    secure: IS_PRODUCTION_APP,
  });
  const ekTokenExpire = useCookie(AuthTokenCookieNameEnum.tokenExpireDate, {
    maxAge: 60 * 60 * 24 * 30 * 6, // 6 months, same as refresh token
    httpOnly: false,
    secure: IS_PRODUCTION_APP,
    sameSite: 'lax',
  });

  const globalStore = useGlobalStore();
  const repo = useAuthRepo();
  const auth = useAuth();
  const authState = useAuthState();
  const redirectUrlCookie = useCookie('redirectUrl');
  const isLoggedIn = computed(() => authState.status.value === 'authenticated');
  const isLoadingProfile = computed(() => authState.loading.value);
  const userData = computed(
    () => authState.data.value as UserInfoDataModel | null
  );
  const token = computed(() => authState.rawToken.value);

  const state = reactive({
    isLoggedIn,
    userData,
    isLoadingProfile,
    token,
  });

  const loginGoogle = (model: AuthLoginProviderDTODataModel) => {
    return repo.loginGoogle(model);
  };

  const loginApple = (model: AuthLoginProviderDTODataModel) => {
    return repo.loginApple(model);
  };

  const loginOTP = (model: AuthLoginOtpDTODataModel) => {
    return repo.loginOTP(model);
  };

  const setAuthCookie = (model: {
    token: string;
    refreshToken: string;
    tokenExpireDate: string;
  }) => {
    //update cookie
    ekToken.value = model.token;
    ekRefreshToken.value = model.refreshToken;
    ekTokenExpire.value = model.tokenExpireDate;
    //update state
    authState.rawToken.value = model.token;
    authState.rawRefreshToken.value = model.refreshToken;
  };

  const clearAuthCookie = () => {
    ekToken.value = null;
    ekRefreshToken.value = null;
    ekTokenExpire.value = null;
    //update state
    authState.rawToken.value = null;
    authState.rawRefreshToken.value = null;
  };

  const logout = async () => {
    await auth.signOut({ redirect: false });
    clearAuthCookie();
  };

  return {
    state: toRefs(readonly(state)),
    //actions
    setAuthCookie,
    clearAuthCookie,
    loginGoogle,
    loginApple,
    loginOTP,
    loginLocal: auth.signIn,
    fetchUser: auth.getSession,
    logout,
  };
});
