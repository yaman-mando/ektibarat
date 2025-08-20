import { useAuthRepo } from '~/core/auth/data-access/services/useAuthRepo';
import type {
  AuthLoginOtpDTODataModel,
  AuthLoginProviderDTODataModel,
  UserInfoDataModel,
} from '~/core/auth/data-access/models/auth.model';
import {
  webGeneralSelectionPathUtil,
  webUserPanelTraining,
  webUserPanelTrainingWithQuery,
  webUserSteps,
  webUserTrainWithUs,
} from '~/main/utils/web-routes.utils';
import { useGlobalStore } from '~/main/useGlobalStore';
import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { UserRoles } from '~/core/auth/constants/user-roles';
import { adminRootPathUtil } from '~/main/utils/admin-routes.utils';
import SubscribesPanel from '~/components/web/shared/user-panel/subscribes-panel/subscribes-panel.vue';
import { UserPlanSubscribedEnum } from '../../constants/user-plan-subscribed.enum';

//store
export const useAuthStore = defineStore('auth-store', () => {
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
    token
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

    if (state.userData?.role == UserRoles.admin) {
      return adminRootPathUtil();
    }

    if(state.userData?.planSubscribed === UserPlanSubscribedEnum.Subscribed){
      return webUserSteps()
    }

    return webUserTrainWithUs()

    // return globalStore.state.globalTypeUserValue
    //   ? webUserPanelTraining()
    //   : webGeneralSelectionPathUtil();
  };


  return {
    state: toRefs(readonly(state)),
    //actions
    setAuthCookie,
    loginGoogle,
    redirectUrlAfterLogin,
    loginApple,
    loginOTP,
    loginLocal: auth.signIn,
    fetchUser: auth.getSession,
    logout: auth.signOut,
  };
});
