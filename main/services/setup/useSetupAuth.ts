import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { reactive } from 'vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';
import { UserPlanSubscribedEnum } from '~/core/auth/constants/user-plan-subscribed.enum';

export const useSetupAuth = () => {
  const auth = useAuth();
  const authStore = useAuthStore();

  const getToken = () => {
    const token = authStore.token;
    return token ? `Bearer ${token}` : '';
  };

  return {
    appAuth: reactive({
      fetchUser: auth.getSession,
      loggedIn: computed(() => authStore.state.isLoggedIn),
      user: computed(
        () => authStore.state.userData as unknown as UserInfoDataModel
      ),
      isSubscribedUser: computed(
        () =>
          authStore.state.userData?.planSubscribed ===
          UserPlanSubscribedEnum.Subscribed
      ),
      notSubscribedUser: computed(
        () =>
          authStore.state.userData?.planSubscribed ===
          UserPlanSubscribedEnum.NotSubscribed
      ),
      strategy: {
        token: {
          get: getToken,
        },
      },
    }),
  };
};
