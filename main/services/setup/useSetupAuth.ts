import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { reactive } from 'vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';

export const useSetupAuth = () => {
  const auth = useAuth();
  const authStore = useAuthStore();


  const getToken = () => {
    const token = authStore.state.token; 
    return token ? `Bearer ${token}` : '';
  };

  return {
    appAuth: reactive({
      fetchUser: auth.getSession,
      loggedIn: computed(() => authStore.state.isLoggedIn),
      user: computed(
        () => authStore.state.userData as unknown as UserInfoDataModel
      ),
      strategy: {
        token: {
          get: getToken,
        },
      },
    }),
  };
};
