import { useAuthRepo } from '~/core/auth/data-access/services/useAuthRepo';
import type {
  AuthLoginOtpDTODataModel,
  AuthLoginProviderDTODataModel,
  AuthRefreshTokenDataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import { useGlobalStore } from '~/main/useGlobalStore';
import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { AuthTokenCookieNameEnum } from '~/core/auth/constants/auth-token-cookie-name.enum';
import { IS_PRODUCTION_APP } from '~/main/utils/shared-utils';
import {
  isTokenExpiredUtil,
  tokenThresholdSeconds,
} from '~/core/auth/utils/is-token-expired.util';
import { addSeconds } from 'date-fns';

//store
export const useAuthStore = defineStore('auth-store', () => {
  const runtimeConfig = useRuntimeConfig();

  const ekToken = useCookie(AuthTokenCookieNameEnum.token); //this age for this will be set in nuxt config
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

  const repo = useAuthRepo();
  const auth = useAuth();
  const authState = useAuthState();
  const isLoggedIn = computed(() => authState.status.value === 'authenticated');
  const isLoadingProfile = computed(() => authState.loading.value);
  const userData = computed(
    () => authState.data.value as UserInfoDataModel | null
  );

  const state = reactive({
    isLoggedIn,
    userData,
    isLoadingProfile,
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
    //test
    // ekTokenExpire.value = addSeconds(
    //   new Date(),
    //   tokenThresholdSeconds + 15
    // ).toISOString();
    //end test
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

  let isLoadingRefresh = false;
  const tokenRefreshInterceptorHandler = async () => {
    if (!ekToken.value || !ekRefreshToken.value) return;

    if (!isTokenExpiredUtil(ekTokenExpire.value) || isLoadingRefresh) return;

    try {
      isLoadingRefresh = true;
      const data = await $fetch<AuthRefreshTokenDataModel>(
        `${runtimeConfig.public.apiUrl}/identity/refreshToken`,
        {
          method: 'POST',
          body: {
            refreshToken: ekRefreshToken.value,
          },
        }
      );
      if (data) {
        setAuthCookie({
          token: data.token,
          refreshToken: data.refreshToken,
          tokenExpireDate: data.tokenExpireDate,
        });
      }
    } catch (e) {
      console.error(JSON.stringify(e));
      clearAuthCookie();
      throw e;
    } finally {
      isLoadingRefresh = false;
    }
  };

  return {
    state: toRefs(readonly(state)),
    getToken: () => ekToken.value,
    //actions
    tokenRefreshInterceptorHandler,
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
