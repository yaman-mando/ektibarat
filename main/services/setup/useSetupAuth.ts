import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import { reactive } from 'vue';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';

export const useSetupAuth = () => {
  const authStore = useAuthStore();

  return {
    $auth: reactive({
      loggedIn: authStore.isLoggedIn,
      user: authStore.userData as unknown as UserInfoDataModel,
    }),
  };
};
